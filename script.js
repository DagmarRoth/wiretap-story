// ============================================
// COMPLEX DATA VISUALIZATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    drawAllVisualizations();
    setupTableInteractions();
    animateOnScroll();
});

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

const stateData = {
    'California': { 2022: 350, 2023: 360, 2024: 366 },
    'New York': { 2022: 120, 2023: 140, 2024: 138 },
    'Nevada': { 2022: 85, 2023: 90, 2024: 93 },
    'Florida': { 2022: 75, 2023: 78, 2024: 80 },
    'Colorado': { 2022: 70, 2023: 74, 2024: 77 },
    'New Jersey': { 2022: 45, 2023: 48, 2024: 51 },
    'North Carolina': { 2022: 35, 2023: 37, 2024: 39 },
    'Pennsylvania': { 2022: 30, 2023: 32, 2024: 33 },
    'Illinois': { 2022: 22, 2023: 24, 2024: 26 },
    'Maryland': { 2022: 20, 2023: 22, 2024: 24 },
    'Other States': { 2022: 562, 2023: 555, 2024: 550 }
};

// ============================================
// VIZ 1: COMPREHENSIVE DASHBOARD
// ============================================

function drawComprehensiveDashboard() {
    const svg = document.getElementById('comprehensive-dashboard');
    if (!svg) return;

    const width = 1600;
    const height = 900;
    const margin = { top: 60, right: 80, bottom: 100, left: 100 };
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const years = [2022, 2023, 2024];
    const metrics = [
        { name: 'Orders', values: [2414, 2398, 2297], color: '#ff6b6b', max: 2500 },
        { name: 'Avg Cost', values: [180847, 203490, 234272], color: '#ff6b6b', max: 250000, label: '$' },
        { name: 'Annual Spending', values: [315.7, 360.4, 405.1], color: '#ff6b6b', max: 450, label: '$' },
        { name: 'Incrimination %', values: [12.9, 12.6, 11.3], color: '#50c878', max: 15 },
        { name: 'Cost/Result', values: [1.03, 1.14, 1.46], color: '#ff6b6b', max: 1.6, label: '$M' },
        { name: 'Installations', values: [1749, 1772, 1729], color: '#4a90e2', max: 1800 }
    ];

    const columnWidth = chartWidth / (years.length * metrics.length + years.length);
    const barWidth = columnWidth * 0.8;

    // Grid
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (i / 5) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e8e8e8');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4,4');
        svg.appendChild(line);
    }

    // Draw bars
    let currentX = margin.left + columnWidth / 2;

    for (let y = 0; y < years.length; y++) {
        // Year label background
        const yearBg = document.createElementNS(ns, 'rect');
        yearBg.setAttribute('x', currentX - columnWidth * (metrics.length + 0.5));
        yearBg.setAttribute('y', margin.top + chartHeight + 20);
        yearBg.setAttribute('width', columnWidth * (metrics.length + 1));
        yearBg.setAttribute('height', 40);
        yearBg.setAttribute('fill', ['#e8f4f8', '#f8e8e8', '#e8f8f4'][y]);
        yearBg.setAttribute('opacity', '0.3');
        svg.appendChild(yearBg);

        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', currentX + columnWidth * metrics.length / 2);
        yearLabel.setAttribute('y', margin.top + chartHeight + 50);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '16');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#333');
        yearLabel.textContent = years[y];
        svg.appendChild(yearLabel);

        // Metrics for this year
        for (let m = 0; m < metrics.length; m++) {
            const metric = metrics[m];
            const val = metric.values[y];
            const barHeight = (val / metric.max) * chartHeight;
            const x = currentX + m * columnWidth;
            const y_pos = margin.top + chartHeight - barHeight;

            // Bar
            const rect = document.createElementNS(ns, 'rect');
            rect.setAttribute('x', x - barWidth / 2);
            rect.setAttribute('y', y_pos);
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', barHeight);
            rect.setAttribute('fill', metric.color);
            rect.setAttribute('opacity', '0.6 + y * 0.15');
            rect.setAttribute('rx', '3');
            svg.appendChild(rect);

            // Value label
            const valueLabel = document.createElementNS(ns, 'text');
            valueLabel.setAttribute('x', x);
            valueLabel.setAttribute('y', y_pos - 8);
            valueLabel.setAttribute('text-anchor', 'middle');
            valueLabel.setAttribute('font-size', '11');
            valueLabel.setAttribute('font-weight', '700');
            valueLabel.setAttribute('fill', metric.color);

            if (metric.label === '$M') {
                valueLabel.textContent = '$' + val.toFixed(1) + 'M';
            } else if (metric.label === '$') {
                if (val > 1000) valueLabel.textContent = '$' + (val / 1000).toFixed(0) + 'K';
                else valueLabel.textContent = val.toFixed(1);
            } else {
                valueLabel.textContent = val.toFixed(m === 3 ? 1 : 0);
            }
            svg.appendChild(valueLabel);

            // Metric name (only on first year)
            if (y === 0) {
                const metricLabel = document.createElementNS(ns, 'text');
                metricLabel.setAttribute('x', x);
                metricLabel.setAttribute('y', margin.top - 20);
                metricLabel.setAttribute('text-anchor', 'middle');
                metricLabel.setAttribute('font-size', '12');
                metricLabel.setAttribute('font-weight', '700');
                metricLabel.setAttribute('fill', '#666');
                metricLabel.textContent = metric.name;
                svg.appendChild(metricLabel);
            }
        }

        currentX += columnWidth * (metrics.length + 1);
    }

    // Legend
    const legendY = height - 40;
    const legendItems = [
        { label: 'Rising Costs', color: '#ff6b6b' },
        { label: 'Declining Effectiveness', color: '#50c878' },
        { label: 'Other', color: '#4a90e2' }
    ];

    let legendX = margin.left;
    for (const item of legendItems) {
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', legendX);
        dot.setAttribute('cy', legendY);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', item.color);
        svg.appendChild(dot);

        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', legendX + 15);
        label.setAttribute('y', legendY + 5);
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#666');
        label.textContent = item.label;
        svg.appendChild(label);

        legendX += 200;
    }
}

// ============================================
// VIZ 2: COST-EFFECTIVENESS MATRIX
// ============================================

function drawCostEffectivenessMatrix() {
    const svg = document.getElementById('cost-effectiveness-matrix');
    if (!svg) return;

    const width = 1400;
    const height = 700;
    const margin = { top: 60, right: 100, bottom: 100, left: 120 };
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Axes
    const xScale = (val) => margin.left + (val / 450) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 15) * chartHeight;

    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = margin.top + (i / 4) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e8e8e8');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        const x = margin.left + (i / 4) * chartWidth;
        const vline = document.createElementNS(ns, 'line');
        vline.setAttribute('x1', x);
        vline.setAttribute('y1', margin.top);
        vline.setAttribute('x2', x);
        vline.setAttribute('y2', margin.top + chartHeight);
        vline.setAttribute('stroke', '#e8e8e8');
        vline.setAttribute('stroke-width', '1');
        svg.appendChild(vline);
    }

    // Plot years as bubbles
    const years = [2022, 2023, 2024];
    const colors = ['#4a90e2', '#ffa500', '#ff6b6b'];

    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const spending = wiretapData[year].totalSpending / 1000000; // Millions
        const effectiveness = (wiretapData[year].incriminating / wiretapData[year].intercepts) * 100;
        const orders = wiretapData[year].orders;

        const x = xScale(spending);
        const y = yScale(effectiveness);
        const r = Math.sqrt(orders) / 2; // Bubble size = orders

        // Bubble
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', colors[i]);
        circle.setAttribute('opacity', '0.6');
        circle.setAttribute('stroke', colors[i]);
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Year label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#fff');
        label.textContent = year;
        svg.appendChild(label);

        // Annotations
        const annoText = document.createElementNS(ns, 'text');
        annoText.setAttribute('x', x);
        annoText.setAttribute('y', y - r - 30);
        annoText.setAttribute('text-anchor', 'middle');
        annoText.setAttribute('font-size', '12');
        annoText.setAttribute('font-weight', '700');
        annoText.setAttribute('fill', colors[i]);
        annoText.textContent = `$${spending.toFixed(0)}M spending`;
        svg.appendChild(annoText);
    }

    // Axes labels
    const xAxisLabel = document.createElementNS(ns, 'text');
    xAxisLabel.setAttribute('x', width / 2);
    xAxisLabel.setAttribute('y', height - 30);
    xAxisLabel.setAttribute('text-anchor', 'middle');
    xAxisLabel.setAttribute('font-size', '14');
    xAxisLabel.setAttribute('font-weight', '700');
    xAxisLabel.setAttribute('fill', '#333');
    xAxisLabel.textContent = 'Annual Spending ($ Millions) →';
    svg.appendChild(xAxisLabel);

    const yAxisLabel = document.createElementNS(ns, 'text');
    yAxisLabel.setAttribute('x', 20);
    yAxisLabel.setAttribute('y', margin.top);
    yAxisLabel.setAttribute('font-size', '14');
    yAxisLabel.setAttribute('font-weight', '700');
    yAxisLabel.setAttribute('fill', '#333');
    yAxisLabel.setAttribute('transform', `rotate(-90, 20, ${margin.top})`);
    yAxisLabel.textContent = 'Effectiveness (%) →';
    svg.appendChild(yAxisLabel);

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 35);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'The Paradox: Spending More, Getting Less';
    svg.appendChild(title);
}

// ============================================
// VIZ 3: SANKEY DIAGRAM
// ============================================

function drawSankeyDiagram() {
    const svg = document.getElementById('sankey-diagram');
    if (!svg) return;

    const width = 1400;
    const height = 700;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const margin = 80;

    // Simplified Sankey flow for each year
    const years = [2022, 2023, 2024];
    const spacing = (width - 2 * margin) / (years.length - 1);

    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const data = wiretapData[year];
        const x = margin + i * spacing;

        const totalSpending = data.totalSpending / 1000000;
        const effectiveSpending = (data.incriminating / data.intercepts) * totalSpending;
        const wasteSpending = totalSpending - effectiveSpending;

        // Effective (green) flow
        const effectiveHeight = (effectiveSpending / totalSpending) * 400;
        const effectiveRect = document.createElementNS(ns, 'rect');
        effectiveRect.setAttribute('x', x - 40);
        effectiveRect.setAttribute('y', 150);
        effectiveRect.setAttribute('width', '80');
        effectiveRect.setAttribute('height', effectiveHeight);
        effectiveRect.setAttribute('fill', '#50c878');
        effectiveRect.setAttribute('opacity', '0.7');
        svg.appendChild(effectiveRect);

        // Waste (red) flow
        const wasteRect = document.createElementNS(ns, 'rect');
        wasteRect.setAttribute('x', x - 40);
        wasteRect.setAttribute('y', 150 + effectiveHeight);
        wasteRect.setAttribute('width', '80');
        wasteRect.setAttribute('height', 400 - effectiveHeight);
        wasteRect.setAttribute('fill', '#ff6b6b');
        wasteRect.setAttribute('opacity', '0.7');
        svg.appendChild(wasteRect);

        // Labels
        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', x);
        yearLabel.setAttribute('y', 130);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '16');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#333');
        yearLabel.textContent = year;
        svg.appendChild(yearLabel);

        const totalLabel = document.createElementNS(ns, 'text');
        totalLabel.setAttribute('x', x);
        totalLabel.setAttribute('y', 580);
        totalLabel.setAttribute('text-anchor', 'middle');
        totalLabel.setAttribute('font-size', '12');
        totalLabel.setAttribute('font-weight', '700');
        totalLabel.setAttribute('fill', '#666');
        totalLabel.textContent = `$${totalSpending.toFixed(0)}M`;
        svg.appendChild(totalLabel);

        const effLabel = document.createElementNS(ns, 'text');
        effLabel.setAttribute('x', x + 70);
        effLabel.setAttribute('y', 150 + effectiveHeight / 2 + 5);
        effLabel.setAttribute('font-size', '11');
        effLabel.setAttribute('font-weight', '700');
        effLabel.setAttribute('fill', '#fff');
        effLabel.textContent = `${((effectiveSpending / totalSpending) * 100).toFixed(1)}%`;
        svg.appendChild(effLabel);

        const wasteLabel = document.createElementNS(ns, 'text');
        wasteLabel.setAttribute('x', x + 70);
        wasteLabel.setAttribute('y', 150 + effectiveHeight + (400 - effectiveHeight) / 2 + 5);
        wasteLabel.setAttribute('font-size', '11');
        wasteLabel.setAttribute('font-weight', '700');
        wasteLabel.setAttribute('fill', '#fff');
        wasteLabel.textContent = `${((wasteSpending / totalSpending) * 100).toFixed(1)}%`;
        svg.appendChild(wasteLabel);
    }

    // Legend
    const greenDot = document.createElementNS(ns, 'circle');
    greenDot.setAttribute('cx', margin);
    greenDot.setAttribute('cy', height - 40);
    greenDot.setAttribute('r', '5');
    greenDot.setAttribute('fill', '#50c878');
    svg.appendChild(greenDot);

    const greenText = document.createElementNS(ns, 'text');
    greenText.setAttribute('x', margin + 15);
    greenText.setAttribute('y', height - 35);
    greenText.setAttribute('font-size', '12');
    greenText.setAttribute('fill', '#666');
    greenText.textContent = 'Evidence-producing (green)';
    svg.appendChild(greenText);

    const redDot = document.createElementNS(ns, 'circle');
    redDot.setAttribute('cx', margin + 300);
    redDot.setAttribute('cy', height - 40);
    redDot.setAttribute('r', '5');
    redDot.setAttribute('fill', '#ff6b6b');
    svg.appendChild(redDot);

    const redText = document.createElementNS(ns, 'text');
    redText.setAttribute('x', margin + 315);
    redText.setAttribute('y', height - 35);
    redText.setAttribute('font-size', '12');
    redText.setAttribute('fill', '#666');
    redText.textContent = 'Non-incriminating (red)';
    svg.appendChild(redText);
}

// ============================================
// VIZ 4: STATE HEATMAP
// ============================================

function drawStateHeatmap() {
    const svg = document.getElementById('state-heatmap');
    if (!svg) return;

    const width = 1400;
    const height = 1200;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const cellHeight = 30;
    const cellWidth = 200;
    const margin = { left: 200, top: 50 };

    const states = Object.keys(stateData).sort();
    const years = [2022, 2023, 2024];

    // Year headers
    for (let i = 0; i < years.length; i++) {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', margin.left + cellWidth * (i + 0.5));
        label.setAttribute('y', margin.top - 10);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#333');
        label.textContent = years[i];
        svg.appendChild(label);
    }

    // State rows
    for (let s = 0; s < states.length; s++) {
        const state = states[s];
        const rowY = margin.top + s * cellHeight;

        // State name
        const stateLabel = document.createElementNS(ns, 'text');
        stateLabel.setAttribute('x', margin.left - 10);
        stateLabel.setAttribute('y', rowY + cellHeight - 8);
        stateLabel.setAttribute('text-anchor', 'end');
        stateLabel.setAttribute('font-size', '12');
        stateLabel.setAttribute('font-weight', '600');
        stateLabel.setAttribute('fill', '#333');
        stateLabel.textContent = state;
        svg.appendChild(stateLabel);

        // Year cells
        const maxValue = 370; // California 2024
        for (let i = 0; i < years.length; i++) {
            const year = years[i];
            const value = stateData[state][year];
            const intensity = value / maxValue;
            const color = `rgb(${255 - intensity * 200}, ${107 + intensity * 100}, ${107})`;

            const rect = document.createElementNS(ns, 'rect');
            rect.setAttribute('x', margin.left + i * cellWidth);
            rect.setAttribute('y', rowY);
            rect.setAttribute('width', cellWidth - 2);
            rect.setAttribute('height', cellHeight - 2);
            rect.setAttribute('fill', color);
            rect.setAttribute('opacity', '0.7 + ' + intensity * 0.3);
            svg.appendChild(rect);

            // Value
            const valueText = document.createElementNS(ns, 'text');
            valueText.setAttribute('x', margin.left + i * cellWidth + cellWidth / 2 - 2);
            valueText.setAttribute('y', rowY + cellHeight - 10);
            valueText.setAttribute('text-anchor', 'middle');
            valueText.setAttribute('font-size', '11');
            valueText.setAttribute('font-weight', '700');
            valueText.setAttribute('fill', intensity > 0.5 ? '#fff' : '#333');
            valueText.textContent = value;
            svg.appendChild(valueText);
        }
    }
}

// ============================================
// VIZ 5: STACKED AREA
// ============================================

function drawStackedArea() {
    const svg = document.getElementById('stacked-area');
    if (!svg) return;

    const width = 1400;
    const height = 600;
    const margin = { top: 60, right: 100, bottom: 80, left: 120 };
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const years = [2022, 2023, 2024];
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 450) * chartHeight;

    // Get stacked values
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

    // Draw stacked area
    let pathData = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        pathData += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }

    // Close area for effective
    pathData += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

    const effectiveArea = document.createElementNS(ns, 'path');
    effectiveArea.setAttribute('d', pathData);
    effectiveArea.setAttribute('fill', '#50c878');
    effectiveArea.setAttribute('opacity', '0.4');
    svg.appendChild(effectiveArea);

    // Waste area
    let wastePath = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 0; i < years.length; i++) {
        wastePath += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }

    wastePath += ` L ${xScale(2)} ${yScale(effectiveValues[2])} L ${xScale(0)} ${yScale(effectiveValues[0])} Z`;

    const wasteArea = document.createElementNS(ns, 'path');
    wasteArea.setAttribute('d', wastePath);
    wasteArea.setAttribute('fill', '#ff6b6b');
    wasteArea.setAttribute('opacity', '0.4');
    svg.appendChild(wasteArea);

    // Lines
    let effectiveLine = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        effectiveLine += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }

    const effLine = document.createElementNS(ns, 'path');
    effLine.setAttribute('d', effectiveLine);
    effLine.setAttribute('stroke', '#50c878');
    effLine.setAttribute('stroke-width', '3');
    effLine.setAttribute('fill', 'none');
    svg.appendChild(effLine);

    let wasteLine = `M ${xScale(0)} ${yScale(effectiveValues[0] + wasteValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        wasteLine += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }

    const wastl = document.createElementNS(ns, 'path');
    wastl.setAttribute('d', wasteLine);
    wastl.setAttribute('stroke', '#ff6b6b');
    wastl.setAttribute('stroke-width', '3');
    wastl.setAttribute('fill', 'none');
    svg.appendChild(wastl);

    // Axes
    const yAxis = document.createElementNS(ns, 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);

    const xAxis = document.createElementNS(ns, 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);

    // Labels
    for (let i = 0; i < years.length; i++) {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', margin.top + chartHeight + 35);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#666');
        label.textContent = years[i];
        svg.appendChild(label);
    }
}

// ============================================
// VIZ 6: PROJECTION CHART
// ============================================

function drawProjectionChart() {
    const svg = document.getElementById('projection-chart');
    if (!svg) return;

    const width = 1400;
    const height = 700;
    const margin = { top: 60, right: 100, bottom: 80, left: 100 };
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const actualYears = [2022, 2023, 2024];
    const projectedYears = [2025, 2026, 2027];

    // Project cost trend (accelerating)
    const actualCosts = [180847, 203490, 234272];
    const rate1 = (203490 - 180847) / 180847;
    const rate2 = (234272 - 203490) / 203490;
    const avgRate = (rate1 + rate2) / 2;

    const projectedCosts = [];
    let lastCost = actualCosts[2];
    for (let i = 0; i < 3; i++) {
        const newRate = avgRate * (1 + i * 0.02); // Accelerating
        lastCost = lastCost * (1 + newRate);
        projectedCosts.push(lastCost);
    }

    const allYears = [...actualYears, ...projectedYears];
    const allCosts = [...actualCosts, ...projectedCosts];

    const xScale = (year) => {
        const index = allYears.indexOf(year);
        return margin.left + (index / (allYears.length - 1)) * chartWidth;
    };

    const yScale = (val) => margin.top + chartHeight - (val / 300000) * chartHeight;

    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = margin.top + (i / 4) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e8e8e8');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Actual data line
    let actualPath = `M ${xScale(2022)} ${yScale(actualCosts[0])}`;
    for (let i = 1; i < actualCosts.length; i++) {
        actualPath += ` L ${xScale(actualYears[i])} ${yScale(actualCosts[i])}`;
    }

    const actualLine = document.createElementNS(ns, 'path');
    actualLine.setAttribute('d', actualPath);
    actualLine.setAttribute('stroke', '#ff6b6b');
    actualLine.setAttribute('stroke-width', '3');
    actualLine.setAttribute('fill', 'none');
    svg.appendChild(actualLine);

    // Projected line (dashed)
    let projectedPath = `M ${xScale(2024)} ${yScale(actualCosts[2])}`;
    for (let i = 0; i < projectedCosts.length; i++) {
        projectedPath += ` L ${xScale(projectedYears[i])} ${yScale(projectedCosts[i])}`;
    }

    const projectedLine = document.createElementNS(ns, 'path');
    projectedLine.setAttribute('d', projectedPath);
    projectedLine.setAttribute('stroke', '#ff6b6b');
    projectedLine.setAttribute('stroke-width', '3');
    projectedLine.setAttribute('stroke-dasharray', '8,4');
    projectedLine.setAttribute('fill', 'none');
    projectedLine.setAttribute('opacity', '0.6');
    svg.appendChild(projectedLine);

    // Points
    for (let i = 0; i < allYears.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(allYears[i]));
        circle.setAttribute('cy', yScale(allCosts[i]));
        circle.setAttribute('r', i < 3 ? '6' : '5');
        circle.setAttribute('fill', i < 3 ? '#ff6b6b' : 'rgba(255, 107, 107, 0.4)');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Year labels
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(allYears[i]));
        label.setAttribute('y', margin.top + chartHeight + 35);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', i < 3 ? '700' : '600');
        label.setAttribute('fill', i < 3 ? '#333' : '#999');
        label.textContent = allYears[i];
        svg.appendChild(label);
    }

    // Dividing line
    const divider = document.createElementNS(ns, 'line');
    divider.setAttribute('x1', xScale(2024.5));
    divider.setAttribute('y1', margin.top);
    divider.setAttribute('x2', xScale(2024.5));
    divider.setAttribute('y2', margin.top + chartHeight);
    divider.setAttribute('stroke', '#ccc');
    divider.setAttribute('stroke-width', '1');
    divider.setAttribute('stroke-dasharray', '4,4');
    divider.setAttribute('opacity', '0.5');
    svg.appendChild(divider);

    // Legend
    const solidDot = document.createElementNS(ns, 'circle');
    solidDot.setAttribute('cx', margin.left);
    solidDot.setAttribute('cy', height - 40);
    solidDot.setAttribute('r', '5');
    solidDot.setAttribute('fill', '#ff6b6b');
    svg.appendChild(solidDot);

    const solidText = document.createElementNS(ns, 'text');
    solidText.setAttribute('x', margin.left + 15);
    solidText.setAttribute('y', height - 35);
    solidText.setAttribute('font-size', '12');
    solidText.setAttribute('fill', '#666');
    solidText.textContent = 'Actual (2022-2024)';
    svg.appendChild(solidText);

    const dashedLine = document.createElementNS(ns, 'line');
    dashedLine.setAttribute('x1', margin.left + 200);
    dashedLine.setAttribute('y1', height - 40);
    dashedLine.setAttribute('x2', margin.left + 230);
    dashedLine.setAttribute('y2', height - 40);
    dashedLine.setAttribute('stroke', '#ff6b6b');
    dashedLine.setAttribute('stroke-width', '2');
    dashedLine.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(dashedLine);

    const dashedText = document.createElementNS(ns, 'text');
    dashedText.setAttribute('x', margin.left + 240);
    dashedText.setAttribute('y', height - 35);
    dashedText.setAttribute('font-size', '12');
    dashedText.setAttribute('fill', '#666');
    dashedText.textContent = 'Projected (2025-2027)';
    svg.appendChild(dashedText);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function drawAllVisualizations() {
    drawComprehensiveDashboard();
    drawCostEffectivenessMatrix();
    drawSankeyDiagram();
    drawStateHeatmap();
    drawStackedArea();
    drawProjectionChart();
}

function setupTableInteractions() {
    const buttons = document.querySelectorAll('[data-sort]');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function sortTable(columnIndex) {
    // Placeholder for table sorting
    console.log('Sort column:', columnIndex);
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.narrative-section, .visual-section, h2, .big-question');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

window.addEventListener('load', animateOnScroll);
