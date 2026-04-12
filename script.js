// ============================================
// WIRETAP WASTE: SCROLLYTELLING
// ============================================

// ============================================
// DATA
// ============================================

const wiretapData = {
    2022: {
        orders: 2414,
        avgCost: 180847,
        totalSpending: 315698503,
        installed: 1749,
        intercepts: 2359,
        incriminating: 305,
        federal: 1341,
        state: 1073,
        persons: 48
    },
    2023: {
        orders: 2398,
        avgCost: 203490,
        totalSpending: 360381480,
        installed: 1772,
        intercepts: 2520,
        incriminating: 317,
        federal: 1340,
        state: 1058,
        persons: 53
    },
    2024: {
        orders: 2297,
        avgCost: 234272,
        totalSpending: 405056288,
        installed: 1729,
        intercepts: 2448,
        incriminating: 277,
        federal: 1290,
        state: 1007,
        persons: 48
    }
};

const stateData2024 = [
    { state: 'California', orders: 366, costPerOrder: 245000, effectiveness: 10.2 },
    { state: 'New York', orders: 138, costPerOrder: 260000, effectiveness: 9.8 },
    { state: 'Nevada', orders: 93, costPerOrder: 210000, effectiveness: 14.5 },
    { state: 'Florida', orders: 80, costPerOrder: 230000, effectiveness: 11.2 },
    { state: 'Colorado', orders: 77, costPerOrder: 195000, effectiveness: 13.8 },
    { state: 'New Jersey', orders: 51, costPerOrder: 255000, effectiveness: 9.5 },
    { state: 'North Carolina', orders: 39, costPerOrder: 215000, effectiveness: 12.0 },
    { state: 'Pennsylvania', orders: 33, costPerOrder: 240000, effectiveness: 10.5 }
];

// Waste categories for cosmograph
const wasteCategories = [
    { name: 'Personal calls', share: 0.350, dollars: 90307300, color: '#ff4444' },
    { name: 'Business/financial', share: 0.220, dollars: 56764588, color: '#ff6633' },
    { name: 'Encrypted/unreadable', share: 0.180, dollars: 46443754, color: '#ff8844' },
    { name: 'Incomplete/tech fail', share: 0.110, dollars: 28382294, color: '#ffaa00' },
    { name: 'Foreign lang (untrans)', share: 0.080, dollars: 20641668, color: '#ffcc22' },
    { name: 'Duplicate coverage', share: 0.060, dollars: 15481253, color: '#dd3333' }
];

// Hierarchical waste (Sunburst)
const hierarchicalWaste = {
    federal: {
        total: 145000000,
        share: 0.562,
        categories: wasteCategories.map(c => ({
            ...c,
            dollars: Math.round(c.dollars * 0.562)
        }))
    },
    state: {
        total: 113000000,
        share: 0.438,
        categories: wasteCategories.map(c => ({
            ...c,
            dollars: Math.round(c.dollars * 0.438)
        }))
    }
};

// State waste computed
const stateWaste = stateData2024.map(s => ({
    ...s,
    abbrev: {
        'California': 'CA',
        'New York': 'NY',
        'Nevada': 'NV',
        'Florida': 'FL',
        'Colorado': 'CO',
        'New Jersey': 'NJ',
        'North Carolina': 'NC',
        'Pennsylvania': 'PA'
    }[s.state],
    wasteAmount: Math.round(s.orders * s.costPerOrder * (1 - s.effectiveness / 100))
}));

// ============================================
// SVG UTILITIES
// ============================================

const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    }
    return el;
}

function svgText(content, attrs = {}) {
    const el = svgEl('text', attrs);
    el.textContent = content;
    return el;
}

function drawSvgBackground(svg, width, height) {
    svg.appendChild(svgEl('rect', { width, height, fill: '#050a14' }));
}

function drawGridLines(svg, marginLeft, marginTop, chartWidth, chartHeight, hCount = 5) {
    for (let i = 0; i <= hCount; i++) {
        const y = marginTop + (i / hCount) * chartHeight;
        svg.appendChild(svgEl('line', {
            x1: marginLeft,
            y1: y,
            x2: marginLeft + chartWidth,
            y2: y,
            stroke: 'rgba(0,255,65,0.08)',
            'stroke-width': '1'
        }));
    }
}

function describeAnnularArc(cx, cy, r1, r2, startDeg, endDeg) {
    const rad = deg => deg * Math.PI / 180;
    const x1 = cx + r1 * Math.cos(rad(startDeg));
    const y1 = cy + r1 * Math.sin(rad(startDeg));
    const x2 = cx + r2 * Math.cos(rad(startDeg));
    const y2 = cy + r2 * Math.sin(rad(startDeg));
    const x3 = cx + r2 * Math.cos(rad(endDeg));
    const y3 = cy + r2 * Math.sin(rad(endDeg));
    const x4 = cx + r1 * Math.cos(rad(endDeg));
    const y4 = cy + r1 * Math.sin(rad(endDeg));
    const large = (endDeg - startDeg > 180) ? 1 : 0;
    return [
        `M ${x1} ${y1}`,
        `L ${x2} ${y2}`,
        `A ${r2} ${r2} 0 ${large} 1 ${x3} ${y3}`,
        `L ${x4} ${y4}`,
        `A ${r1} ${r1} 0 ${large} 0 ${x1} ${y1}`,
        'Z'
    ].join(' ');
}

// ============================================
// SCROLL ENGINE (IntersectionObserver)
// ============================================

const drawn = new Set();

function initScrollObserver() {
    const options = { threshold: 0.15 };

    const chartMap = {
        'viz-divergence': () => drawDivergenceChart(),
        'viz-composition': () => drawCompositionChart(),
        'viz-cosmograph': () => drawCosmograph(),
        'viz-radial': () => drawRadialScatter(),
        'viz-sunburst': () => drawSunburst()
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');

                // Trigger chart draw
                if (chartMap[el.id] && !drawn.has(el.id)) {
                    drawn.add(el.id);
                    setTimeout(chartMap[el.id], 200);
                }

                // Trigger decrypt-text reveals
                const decryptTexts = el.querySelectorAll('.decrypt-text');
                decryptTexts.forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), 200 + i * 150);
                });
            }
        });
    }, options);

    document.querySelectorAll('.section-block').forEach(el => observer.observe(el));
}

// ============================================
// VIZ 1: DIVERGENCE CHART (DUAL-AXIS)
// ============================================

function drawDivergenceChart() {
    const svg = document.getElementById('divergence-chart');
    if (!svg) return;

    const width = 1400;
    const height = 520;
    const margin = { top: 60, right: 120, bottom: 80, left: 120 };

    svg.innerHTML = '';

    // Background
    const bg = svgEl('rect', { width, height, fill: '#050a14' });
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Data
    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];
    const effectiveness = [12.9, 12.6, 11.3];

    // Scales
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScaleCost = (val) => margin.top + chartHeight - ((val - 170000) / 70000) * chartHeight;
    const yScaleEff = (val) => margin.top + chartHeight - (val / 15) * chartHeight;

    // Grid lines
    drawGridLines(svg, margin.left, margin.top, chartWidth, chartHeight, 5);

    // Cost line (red)
    let costPath = `M ${xScale(0)} ${yScaleCost(costs[0])}`;
    for (let i = 1; i < years.length; i++) {
        costPath += ` L ${xScale(i)} ${yScaleCost(costs[i])}`;
    }

    const costLine = svgEl('path', {
        d: costPath,
        stroke: '#ff4444',
        'stroke-width': '4',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
    });
    svg.appendChild(costLine);

    // Effectiveness line (green)
    let effPath = `M ${xScale(0)} ${yScaleEff(effectiveness[0])}`;
    for (let i = 1; i < years.length; i++) {
        effPath += ` L ${xScale(i)} ${yScaleEff(effectiveness[i])}`;
    }

    const effLine = svgEl('path', {
        d: effPath,
        stroke: '#00ff41',
        'stroke-width': '4',
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
    });
    svg.appendChild(effLine);

    // Cost points
    for (let i = 0; i < years.length; i++) {
        const circle = svgEl('circle', {
            cx: xScale(i),
            cy: yScaleCost(costs[i]),
            r: '6',
            fill: '#ff4444',
            stroke: '#050a14',
            'stroke-width': '2'
        });
        svg.appendChild(circle);

        const label = svgText('$' + (costs[i] / 1000).toFixed(0) + 'K', {
            x: xScale(i),
            y: yScaleCost(costs[i]) - 20,
            'text-anchor': 'middle',
            'font-size': '12',
            'font-weight': '700',
            fill: '#ff4444'
        });
        svg.appendChild(label);
    }

    // Effectiveness points
    for (let i = 0; i < years.length; i++) {
        const circle = svgEl('circle', {
            cx: xScale(i),
            cy: yScaleEff(effectiveness[i]),
            r: '6',
            fill: '#00ff41',
            stroke: '#050a14',
            'stroke-width': '2'
        });
        svg.appendChild(circle);

        const label = svgText(effectiveness[i].toFixed(1) + '%', {
            x: xScale(i),
            y: yScaleEff(effectiveness[i]) + 25,
            'text-anchor': 'middle',
            'font-size': '12',
            'font-weight': '700',
            fill: '#00ff41'
        });
        svg.appendChild(label);
    }

    // Year labels
    for (let i = 0; i < years.length; i++) {
        const label = svgText(years[i], {
            x: xScale(i),
            y: margin.top + chartHeight + 50,
            'text-anchor': 'middle',
            'font-size': '14',
            'font-weight': '700',
            fill: '#4a7a55'
        });
        svg.appendChild(label);
    }

    // Axis labels
    const leftAxisLabel = svgText('Cost per Order', {
        x: '30',
        y: margin.top - 10,
        'font-size': '12',
        'font-weight': '700',
        fill: '#ff4444'
    });
    svg.appendChild(leftAxisLabel);

    const rightAxisLabel = svgText('Incrimination Rate %', {
        x: width - 80,
        y: margin.top - 10,
        'font-size': '12',
        'font-weight': '700',
        fill: '#00ff41'
    });
    svg.appendChild(rightAxisLabel);
}

// ============================================
// VIZ 2: COMPOSITION CHART (STACKED AREA)
// ============================================

function drawCompositionChart() {
    const svg = document.getElementById('composition-chart');
    if (!svg) return;

    const width = 1400;
    const height = 480;
    const margin = { top: 60, right: 100, bottom: 80, left: 120 };

    svg.innerHTML = '';

    const bg = svgEl('rect', { width, height, fill: '#050a14' });
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const years = [2022, 2023, 2024];
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 450) * chartHeight;

    // Calculate values
    const effectiveValues = [];
    const wasteValues = [];

    for (const year of years) {
        const data = wiretapData[year];
        const total = data.totalSpending / 1000000;
        const effective = (data.incriminating / data.intercepts) * total;
        const waste = total - effective;

        effectiveValues.push(effective);
        wasteValues.push(waste);
    }

    // Green area (evidence-producing)
    let greenPath = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        greenPath += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }
    greenPath += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

    const greenArea = svgEl('path', {
        d: greenPath,
        fill: 'rgba(0,255,65,0.3)'
    });
    svg.appendChild(greenArea);

    // Red area (waste)
    let redPath = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 0; i < years.length; i++) {
        redPath += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }
    redPath += ` L ${xScale(2)} ${yScale(effectiveValues[2])} L ${xScale(0)} ${yScale(effectiveValues[0])} Z`;

    const redArea = svgEl('path', {
        d: redPath,
        fill: 'rgba(255,68,68,0.3)'
    });
    svg.appendChild(redArea);

    // Green line
    let greenLine = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        greenLine += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }

    const greenStroke = svgEl('path', {
        d: greenLine,
        stroke: '#00ff41',
        'stroke-width': '3',
        fill: 'none'
    });
    svg.appendChild(greenStroke);

    // Red line
    let redLine = `M ${xScale(0)} ${yScale(effectiveValues[0] + wasteValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        redLine += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }

    const redStroke = svgEl('path', {
        d: redLine,
        stroke: '#ff4444',
        'stroke-width': '3',
        fill: 'none'
    });
    svg.appendChild(redStroke);

    // Labels
    for (let i = 0; i < years.length; i++) {
        const greenLabel = svgText('$' + effectiveValues[i].toFixed(0) + 'M', {
            x: xScale(i),
            y: yScale(effectiveValues[i] / 2) + 5,
            'text-anchor': 'middle',
            'font-size': '12',
            'font-weight': '700',
            fill: '#fff'
        });
        svg.appendChild(greenLabel);

        const redLabel = svgText('$' + wasteValues[i].toFixed(0) + 'M', {
            x: xScale(i),
            y: yScale(effectiveValues[i] + wasteValues[i] / 2) + 5,
            'text-anchor': 'middle',
            'font-size': '12',
            'font-weight': '700',
            fill: '#fff'
        });
        svg.appendChild(redLabel);

        const yearLabel = svgText(years[i], {
            x: xScale(i),
            y: margin.top + chartHeight + 35,
            'text-anchor': 'middle',
            'font-size': '14',
            'font-weight': '700',
            fill: '#4a7a55'
        });
        svg.appendChild(yearLabel);
    }

    // Axes
    const yAxis = svgEl('line', {
        x1: margin.left,
        y1: margin.top,
        x2: margin.left,
        y2: margin.top + chartHeight,
        stroke: 'rgba(0,255,65,0.3)',
        'stroke-width': '2'
    });
    svg.appendChild(yAxis);

    const xAxis = svgEl('line', {
        x1: margin.left,
        y1: margin.top + chartHeight,
        x2: margin.left + chartWidth,
        y2: margin.top + chartHeight,
        stroke: 'rgba(0,255,65,0.3)',
        'stroke-width': '2'
    });
    svg.appendChild(xAxis);

    // Legend
    const greenDot = svgEl('circle', {
        cx: margin.left,
        cy: height - 30,
        r: '5',
        fill: '#00ff41'
    });
    svg.appendChild(greenDot);

    const greenText = svgText('Evidence-producing', {
        x: margin.left + 15,
        y: height - 25,
        'font-size': '12',
        fill: '#4a7a55'
    });
    svg.appendChild(greenText);

    const redDot = svgEl('circle', {
        cx: margin.left + 280,
        cy: height - 30,
        r: '5',
        fill: '#ff4444'
    });
    svg.appendChild(redDot);

    const redText = svgText('Waste (non-incriminating)', {
        x: margin.left + 295,
        y: height - 25,
        'font-size': '12',
        fill: '#4a7a55'
    });
    svg.appendChild(redText);
}

// ============================================
// VIZ 3: COSMOGRAPH (FORCE-DIRECTED)
// ============================================

function drawCosmograph() {
    const svg = document.getElementById('cosmograph');
    if (!svg) return;

    const W = 1400, H = 600;
    const cx = 700, cy = 300;
    svg.innerHTML = '';
    drawSvgBackground(svg, W, H);

    // Initialize bubbles
    const bubbles = wasteCategories.map((cat, i) => {
        const angle = (i / wasteCategories.length) * Math.PI * 2;
        const initR = 180;
        return {
            ...cat,
            x: cx + initR * Math.cos(angle),
            y: cy + initR * Math.sin(angle),
            vx: 0,
            vy: 0,
            r: 25 + Math.sqrt(cat.share) * 210,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.4 + Math.random() * 0.5,
            floatOffsetX: (Math.random() - 0.5) * 8,
            floatOffsetY: (Math.random() - 0.5) * 8
        };
    });

    // Force simulation: pre-run 150 ticks
    for (let t = 0; t < 150; t++) {
        simulateCosmographTick(bubbles, W, H);
    }

    // Render bubbles
    const bubbleElements = bubbles.map(b => {
        const g = svgEl('g');

        const circle = svgEl('circle', {
            cx: b.x,
            cy: b.y,
            r: b.r,
            fill: b.color,
            opacity: '0.85',
            stroke: b.color,
            'stroke-width': '2'
        });
        g.appendChild(circle);

        // Label inside (if r >= 55)
        if (b.r >= 55) {
            const fontSize = Math.max(11, b.r * 0.16);
            const label = svgText(b.name, {
                x: b.x,
                y: b.y - 8,
                'text-anchor': 'middle',
                'font-size': fontSize,
                fill: '#050a14',
                'font-weight': '700'
            });
            g.appendChild(label);

            const pctLabel = svgText((b.share * 100).toFixed(0) + '%', {
                x: b.x,
                y: b.y + 12,
                'text-anchor': 'middle',
                'font-size': Math.max(12, b.r * 0.2),
                fill: '#050a14',
                'font-weight': '700'
            });
            g.appendChild(pctLabel);
        }

        // Dollar label outside
        const ang = Math.atan2(b.y - cy, b.x - cx);
        const labelX = b.x + (b.r + 20) * Math.cos(ang);
        const labelY = b.y + (b.r + 20) * Math.sin(ang);
        const dollarLabel = svgText('$' + (b.dollars / 1000000).toFixed(1) + 'M', {
            x: labelX,
            y: labelY,
            'text-anchor': 'middle',
            'font-size': '12',
            fill: b.color,
            'font-weight': '700'
        });
        g.appendChild(dollarLabel);

        svg.appendChild(g);
        return { g, circle, b };
    });

    // Float animation
    function floatAnimate() {
        const t = performance.now() / 1000;
        bubbleElements.forEach(({ circle, b }) => {
            const dx = b.floatOffsetX * Math.sin(t * b.floatSpeed + b.floatPhase);
            const dy = b.floatOffsetY * Math.cos(t * b.floatSpeed * 1.2 + b.floatPhase + 1);
            circle.setAttribute('cx', b.x + dx);
            circle.setAttribute('cy', b.y + dy);
        });
        requestAnimationFrame(floatAnimate);
    }
    floatAnimate();
}

function simulateCosmographTick(bubbles, W, H) {
    const cx = 700, cy = 300;

    for (let i = 0; i < bubbles.length; i++) {
        // Gravity toward center
        bubbles[i].vx += (cx - bubbles[i].x) * 0.006;
        bubbles[i].vy += (cy - bubbles[i].y) * 0.006;

        // Repulsion from other bubbles
        for (let j = i + 1; j < bubbles.length; j++) {
            const dx = bubbles[j].x - bubbles[i].x;
            const dy = bubbles[j].y - bubbles[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
            const minDist = bubbles[i].r + bubbles[j].r + 14;

            if (dist < minDist) {
                const f = (minDist - dist) / dist * 0.45;
                const fx = dx * f;
                const fy = dy * f;
                bubbles[i].vx -= fx;
                bubbles[i].vy -= fy;
                bubbles[j].vx += fx;
                bubbles[j].vy += fy;
            }
        }

        // Apply velocity with friction
        bubbles[i].x += bubbles[i].vx;
        bubbles[i].y += bubbles[i].vy;
        bubbles[i].vx *= 0.82;
        bubbles[i].vy *= 0.82;

        // Boundary clamping
        const margin = bubbles[i].r + 8;
        bubbles[i].x = Math.max(margin, Math.min(W - margin, bubbles[i].x));
        bubbles[i].y = Math.max(margin, Math.min(H - margin, bubbles[i].y));
    }
}

// ============================================
// VIZ 4: RADIAL SCATTER
// ============================================

function drawRadialScatter() {
    const svg = document.getElementById('radial-chart');
    if (!svg) return;

    const W = 1000, H = 1000;
    const cx = 500, cy = 500;
    svg.innerHTML = '';
    drawSvgBackground(svg, W, H);

    const maxWaste = Math.max(...stateWaste.map(s => s.wasteAmount));
    const minR = 80, maxR = 400;
    const maxOrders = Math.max(...stateWaste.map(s => s.orders));

    // Reference rings
    [100, 200, 300, 400].forEach((r, i) => {
        svg.appendChild(svgEl('circle', {
            cx, cy, r,
            fill: 'none',
            stroke: 'rgba(0,255,65,0.08)',
            'stroke-width': '1',
            'stroke-dasharray': '4 6'
        }));

        const labelVal = (maxWaste * (r - minR) / (maxR - minR) / 1000000).toFixed(0);
        svg.appendChild(svgText('$' + labelVal + 'M', {
            x: cx + r + 8,
            y: cy + 4,
            'font-size': '10',
            fill: '#4a7a55'
        }));
    });

    // Center dot
    svg.appendChild(svgEl('circle', { cx, cy, r: 4, fill: 'rgba(0,255,65,0.4)' }));

    const colors = ['#ff4444', '#ff6633', '#ff8844', '#ffaa00', '#ffcc22', '#dd3333', '#ff5522', '#ffbb33'];

    // Plot states
    stateWaste.forEach((state, idx) => {
        const angleDeg = idx * 45 - 90;
        const angleRad = angleDeg * Math.PI / 180;
        const radius = minR + (state.wasteAmount / maxWaste) * (maxR - minR);
        const bx = cx + radius * Math.cos(angleRad);
        const by = cy + radius * Math.sin(angleRad);
        const bubbleR = 12 + (state.orders / maxOrders) * 30;

        // Spoke line
        svg.appendChild(svgEl('line', {
            x1: cx,
            y1: cy,
            x2: bx,
            y2: by,
            stroke: 'rgba(0,255,65,0.15)',
            'stroke-width': '1',
            'stroke-dasharray': '3 5'
        }));

        // Bubble
        svg.appendChild(svgEl('circle', {
            cx: bx,
            cy: by,
            r: bubbleR,
            fill: colors[idx % colors.length],
            opacity: '0.85',
            stroke: colors[idx % colors.length],
            'stroke-width': '2'
        }));

        // State abbreviation
        svg.appendChild(svgText(state.abbrev, {
            x: bx,
            y: by + 4,
            'text-anchor': 'middle',
            'font-size': '11',
            fill: '#050a14',
            'font-weight': '700'
        }));

        // Waste amount label
        const labelR = radius + bubbleR + 18;
        const lx = cx + labelR * Math.cos(angleRad);
        const ly = cy + labelR * Math.sin(angleRad);
        svg.appendChild(svgText('$' + (state.wasteAmount / 1000000).toFixed(1) + 'M', {
            x: lx,
            y: ly,
            'text-anchor': 'middle',
            'font-size': '10',
            fill: colors[idx % colors.length],
            'font-weight': '700'
        }));
    });
}

// ============================================
// VIZ 5: SUNBURST
// ============================================

function drawSunburst() {
    const svg = document.getElementById('sunburst');
    if (!svg) return;

    const W = 1000, H = 700;
    const cx = 500, cy = 370;
    svg.innerHTML = '';
    drawSvgBackground(svg, W, H);

    const r1 = 120, r2 = 200, r3 = 215, r4 = 340;

    // Inner ring angles
    const fedStartDeg = 270;
    const fedSweep = 360 * 0.562; // 202.3°
    const fedEndDeg = fedStartDeg + fedSweep;
    const stateStartDeg = fedEndDeg % 360;
    const stateSweep = 360 * 0.438; // 157.7°

    // Inner Federal arc
    svg.appendChild(svgEl('path', {
        d: describeAnnularArc(cx, cy, r1, r2, fedStartDeg, fedEndDeg),
        fill: 'rgba(0,170,255,0.5)',
        stroke: '#050a14',
        'stroke-width': '2'
    }));

    // Inner State arc
    svg.appendChild(svgEl('path', {
        d: describeAnnularArc(cx, cy, r1, r2, stateStartDeg, stateStartDeg + stateSweep),
        fill: 'rgba(255,170,0,0.5)',
        stroke: '#050a14',
        'stroke-width': '2'
    }));

    // Inner ring labels
    const labelR = (r1 + r2) / 2;
    const fedMidDeg = fedStartDeg + fedSweep / 2;
    const stateMidDeg = stateStartDeg + stateSweep / 2;

    [
        { label: 'FEDERAL', subLabel: '$145M', mid: fedMidDeg, color: '#00aaff' },
        { label: 'STATE', subLabel: '$113M', mid: stateMidDeg, color: '#ffaa00' }
    ].forEach(({ label, subLabel, mid, color }) => {
        const rad = mid * Math.PI / 180;
        const lx = cx + labelR * Math.cos(rad);
        const ly = cy + labelR * Math.sin(rad);
        svg.appendChild(svgText(label, {
            x: lx,
            y: ly - 6,
            'text-anchor': 'middle',
            'font-size': '13',
            fill: color,
            'font-weight': '700'
        }));
        svg.appendChild(svgText(subLabel, {
            x: lx,
            y: ly + 10,
            'text-anchor': 'middle',
            'font-size': '11',
            fill: color
        }));
    });

    // Outer arcs
    const outerSectors = [
        { data: hierarchicalWaste.federal, startDeg: fedStartDeg, sweepDeg: fedSweep, alphaBase: 0.85 },
        { data: hierarchicalWaste.state, startDeg: stateStartDeg, sweepDeg: stateSweep, alphaBase: 0.6 }
    ];

    outerSectors.forEach(sector => {
        let currentDeg = sector.startDeg;
        sector.data.categories.forEach((cat, i) => {
            const catSweep = sector.sweepDeg * cat.share;
            const endDeg = currentDeg + catSweep;

            svg.appendChild(svgEl('path', {
                d: describeAnnularArc(cx, cy, r3, r4, currentDeg, endDeg),
                fill: cat.color,
                opacity: sector.alphaBase,
                stroke: '#050a14',
                'stroke-width': '1.5'
            }));

            // Leader line + label (only if arc > 10°)
            if (catSweep > 10) {
                const midDeg = currentDeg + catSweep / 2;
                const midRad = midDeg * Math.PI / 180;
                const lineStartX = cx + r4 * Math.cos(midRad);
                const lineStartY = cy + r4 * Math.sin(midRad);
                const lineEndX = cx + (r4 + 28) * Math.cos(midRad);
                const lineEndY = cy + (r4 + 28) * Math.sin(midRad);

                svg.appendChild(svgEl('line', {
                    x1: lineStartX,
                    y1: lineStartY,
                    x2: lineEndX,
                    y2: lineEndY,
                    stroke: cat.color,
                    'stroke-width': '1',
                    opacity: '0.7'
                }));

                const isRight = Math.cos(midRad) > 0;
                svg.appendChild(svgText('$' + (cat.dollars / 1000000).toFixed(0) + 'M', {
                    x: lineEndX + (isRight ? 4 : -4),
                    y: lineEndY + 4,
                    'text-anchor': isRight ? 'start' : 'end',
                    'font-size': '9',
                    fill: cat.color
                }));
            }

            currentDeg = endDeg;
        });
    });

    // Center label
    svg.appendChild(svgText('$258M', {
        x: cx,
        y: cy - 10,
        'text-anchor': 'middle',
        'font-size': '20',
        fill: '#ff4444',
        'font-weight': '700',
        filter: 'drop-shadow(0 0 6px #ff4444)'
    }));
    svg.appendChild(svgText('TOTAL WASTE', {
        x: cx,
        y: cy + 10,
        'text-anchor': 'middle',
        'font-size': '10',
        fill: '#4a7a55'
    }));
}

// ============================================
// BOOTSTRAP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Hero is always visible
    document.querySelector('.hero').classList.add('visible');

    // Initialize scroll observer
    initScrollObserver();
});

window.addEventListener('resize', () => {
    if (drawn.has('viz-divergence')) {
        drawDivergenceChart();
    }
    if (drawn.has('viz-composition')) {
        drawCompositionChart();
    }
    if (drawn.has('viz-cosmograph')) {
        drawCosmograph();
    }
    if (drawn.has('viz-radial')) {
        drawRadialScatter();
    }
    if (drawn.has('viz-sunburst')) {
        drawSunburst();
    }
});
