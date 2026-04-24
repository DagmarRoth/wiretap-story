/* ================================================================
   WIRETAP WASTE — Story Engine
   ================================================================ */

'use strict';

// ----------------------------------------------------------------
// UTILITIES
// ----------------------------------------------------------------
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t)    { return 1 - Math.pow(1 - t, 3); }

function animateValue(el, from, to, duration, decimals, suffix, prefix) {
    const start = performance.now();
    suffix = suffix || '';
    prefix = prefix || '';
    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const v = lerp(from, to, easeOut(p));
        el.textContent = prefix + (decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ----------------------------------------------------------------
// PROGRESS BAR
// ----------------------------------------------------------------
function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    function onScroll() {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        bar.style.width = Math.min(100, pct * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ----------------------------------------------------------------
// CUSTOM CURSOR
// ----------------------------------------------------------------
function initCursor() {
    const dot      = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    // Instant dot
    document.addEventListener('mousemove', e => {
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';
    });

    // Smooth follower
    (function rafLoop() {
        fx = lerp(fx, mx, 0.11);
        fy = lerp(fy, my, 0.11);
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        requestAnimationFrame(rafLoop);
    })();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(2.2)';
            follower.style.width = follower.style.height = '42px';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(1)';
            follower.style.width = follower.style.height = '26px';
        });
    });
}

// ----------------------------------------------------------------
// DATA STREAM (hero background)
// ----------------------------------------------------------------
function initDataStream() {
    const el = document.getElementById('dataStream');
    if (!el) return;
    const chars = '0123456789ABCDEF$#@![]|<>';
    const words = ['INTERCEPT', 'WIRETAP', 'CLASSIFIED', 'AUTHORIZED', 'FEDERAL',
                   'ENCRYPTED', 'SIGNAL', 'COURT_ORDER', 'SURVEILLANCE'];
    let s = '';
    for (let i = 0; i < 4000; i++) {
        if (Math.random() < 0.004) {
            s += words[Math.floor(Math.random() * words.length)] + ' ';
        } else {
            s += chars[Math.floor(Math.random() * chars.length)];
        }
        if (i % 90 === 0) s += '\n';
    }
    el.textContent = s;
}

// ----------------------------------------------------------------
// HERO COUNTER ($258,000,000)
// ----------------------------------------------------------------
function initHeroCounter() {
    const el = document.getElementById('heroCounter');
    if (!el) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateValue(el, 0, 258000000, 2600, 0);
            io.disconnect();
        }
    }, { threshold: 0.5 });
    io.observe(el);
}

// ----------------------------------------------------------------
// COUNT-UP ELEMENTS (88.7%)
// ----------------------------------------------------------------
function initCountUps() {
    document.querySelectorAll('.count-up').forEach(el => {
        const target   = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0');
        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateValue(el, 0, target, 1600, decimals);
                io.disconnect();
            }
        }, { threshold: 0.5 });
        io.observe(el);
    });
}

// ----------------------------------------------------------------
// SCROLL REVEAL
// ----------------------------------------------------------------
function initReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('in-view');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.act-header, .pull-quote, .verdict-inner, .vs-card').forEach(el => {
        el.classList.add('reveal');
        io.observe(el);
    });
}

// ----------------------------------------------------------------
// DIVERGENCE CHART (inline SVG)
// ----------------------------------------------------------------
function buildDivergenceChart() {
    const svg = document.getElementById('divergenceSVG');
    if (!svg) return;

    const data = {
        years:   [2022, 2023, 2024],
        cost:    [180847, 204516, 234272],
        rate:    [12.9, 11.8, 11.3]
    };

    const W = 540, H = 280;
    const pad = { top: 28, right: 58, bottom: 38, left: 66 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;

    const ns = 'http://www.w3.org/2000/svg';
    function el(tag, attrs) {
        const e = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        return e;
    }

    // Scales
    const xOf  = i => pad.left + (i / (data.years.length - 1)) * innerW;
    const costMin = 160000, costMax = 250000;
    const rateMin = 10.5,   rateMax = 13.5;
    const yCost = v => pad.top + (1 - (v - costMin) / (costMax - costMin)) * innerH;
    const yRate = v => pad.top + (1 - (v - rateMin) / (rateMax - rateMin)) * innerH;

    // Grid lines
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
        const y = pad.top + t * innerH;
        svg.appendChild(el('line', { x1: pad.left, x2: W - pad.right, y1: y, y2: y,
            stroke: 'rgba(220,232,255,0.06)', 'stroke-width': 1 }));
    });

    // Year x-axis labels
    data.years.forEach((yr, i) => {
        const t = el('text', { x: xOf(i), y: H - 6, 'text-anchor': 'middle',
            fill: 'rgba(220,232,255,0.4)', 'font-size': '11' });
        t.textContent = yr;
        svg.appendChild(t);
    });

    // Left axis (cost) — red
    [costMin, (costMin + costMax) / 2, costMax].forEach(v => {
        const t = el('text', { x: pad.left - 8, y: yCost(v) + 4, 'text-anchor': 'end',
            fill: 'rgba(255,26,94,0.6)', 'font-size': '10' });
        t.textContent = '$' + Math.round(v / 1000) + 'K';
        svg.appendChild(t);
    });

    // Right axis (rate) — green
    [rateMin, (rateMin + rateMax) / 2, rateMax].forEach(v => {
        const t = el('text', { x: W - pad.right + 8, y: yRate(v) + 4, 'text-anchor': 'start',
            fill: 'rgba(0,255,136,0.6)', 'font-size': '10' });
        t.textContent = v.toFixed(1) + '%';
        svg.appendChild(t);
    });

    // Divergence fill area
    const costPts = data.cost.map((v, i) => `${xOf(i)},${yCost(v)}`).join(' L');
    const ratePts = [...data.rate].reverse().map((v, i) => `${xOf(data.rate.length - 1 - i)},${yRate(v)}`).join(' L');
    const fillPath = el('path', {
        d: `M${costPts} L${ratePts} Z`,
        fill: 'rgba(255,26,94,0.04)', stroke: 'none',
        id: 'divFill', opacity: '0'
    });
    fillPath.style.transition = 'opacity 1s ease 0.3s';
    svg.appendChild(fillPath);

    // Cost line (red)
    const costD = data.cost.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yCost(v)}`).join(' ');
    const costLine = el('path', {
        d: costD, fill: 'none', stroke: '#ff1a5e', 'stroke-width': '2.5',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', id: 'costPath'
    });
    costLine.style.cssText = 'filter:drop-shadow(0 0 6px rgba(255,26,94,0.7)); stroke-dasharray:600; stroke-dashoffset:600; transition:stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)';
    svg.appendChild(costLine);

    // Rate line (green)
    const rateD = data.rate.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yRate(v)}`).join(' ');
    const rateLine = el('path', {
        d: rateD, fill: 'none', stroke: '#00ff88', 'stroke-width': '2.5',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', id: 'ratePath'
    });
    rateLine.style.cssText = 'filter:drop-shadow(0 0 6px rgba(0,255,136,0.7)); stroke-dasharray:600; stroke-dashoffset:600; transition:stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.15s';
    svg.appendChild(rateLine);

    // Data points
    const pointGroups = { cost: [], rate: [] };
    data.cost.forEach((v, i) => {
        const g = document.createElementNS(ns, 'g');
        g.style.cssText = 'opacity:0; transition:opacity 0.4s ease';
        g.id = 'cp' + i;
        const c = el('circle', { cx: xOf(i), cy: yCost(v), r: '5', fill: '#ff1a5e' });
        c.style.filter = 'drop-shadow(0 0 7px rgba(255,26,94,0.9))';
        const lbl = el('text', { x: xOf(i), y: yCost(v) - 11, 'text-anchor': 'middle',
            fill: '#ff1a5e', 'font-size': '10' });
        lbl.textContent = '$' + Math.round(v / 1000) + 'K';
        g.appendChild(c); g.appendChild(lbl); svg.appendChild(g);
        pointGroups.cost.push(g);
    });
    data.rate.forEach((v, i) => {
        const g = document.createElementNS(ns, 'g');
        g.style.cssText = 'opacity:0; transition:opacity 0.4s ease 0.15s';
        g.id = 'rp' + i;
        const c = el('circle', { cx: xOf(i), cy: yRate(v), r: '5', fill: '#00ff88' });
        c.style.filter = 'drop-shadow(0 0 7px rgba(0,255,136,0.9))';
        const lbl = el('text', { x: xOf(i), y: yRate(v) - 11, 'text-anchor': 'middle',
            fill: '#00ff88', 'font-size': '10' });
        lbl.textContent = v + '%';
        g.appendChild(c); g.appendChild(lbl); svg.appendChild(g);
        pointGroups.rate.push(g);
    });

    window._divPoints = pointGroups;
}

function revealDivergenceStep(step) {
    const costPath = document.getElementById('costPath');
    const ratePath = document.getElementById('ratePath');
    const fill     = document.getElementById('divFill');
    const pts      = window._divPoints;
    if (!costPath || !pts) return;

    if (step >= 0) {
        costPath.style.strokeDashoffset = '0';
        ratePath.style.strokeDashoffset = '0';
    }
    for (let i = 0; i <= step; i++) {
        if (pts.cost[i]) pts.cost[i].style.opacity = '1';
        if (pts.rate[i]) pts.rate[i].style.opacity = '1';
    }
    if (step >= 2 && fill) fill.style.opacity = '1';
}

// ----------------------------------------------------------------
// STATE BARS (Act III)
// ----------------------------------------------------------------
const STATE_DATA = [
    { abbr: 'CA', name: 'California',   val: 80.4, pct: 0.311 },
    { abbr: 'NY', name: 'New York',     val: 42.1, pct: 0.163 },
    { abbr: 'TX', name: 'Texas',        val: 31.7, pct: 0.123 },
    { abbr: 'FL', name: 'Florida',      val: 22.4, pct: 0.087 },
    { abbr: 'NJ', name: 'New Jersey',   val: 15.8, pct: 0.061 },
    { abbr: 'IL', name: 'Illinois',     val: 13.2, pct: 0.051 },
];

function buildStateBars() {
    const wrap = document.getElementById('stateBarsWrap');
    if (!wrap) return;
    STATE_DATA.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'state-bar-row';
        row.innerHTML = `
            <span class="state-abbr">${s.abbr}</span>
            <span class="state-name-full">${s.name}</span>
            <div class="state-track">
                <div class="state-fill${i === 0 ? ' highlight' : ''}" id="sb${i}" style="width:0%"></div>
            </div>
            <span class="state-val">$${s.val}M</span>`;
        wrap.appendChild(row);
    });
}

function revealGeoStep(step) {
    if (step === 0) {
        STATE_DATA.forEach((s, i) => {
            setTimeout(() => {
                const fill = document.getElementById('sb' + i);
                if (fill) fill.style.width = (s.pct * 100) + '%';
            }, i * 110);
        });
    }
    if (step === 1) {
        const ca = document.getElementById('sb0');
        if (ca) ca.style.boxShadow = '0 0 22px rgba(255,26,94,0.75)';
    }
}

// ----------------------------------------------------------------
// WASTE DONUT (Act IV)
// ----------------------------------------------------------------
const WASTE_DATA = [
    { label: 'Personal Calls',      val: '$90.3M', pct: 0.35, color: '#ff1a5e' },
    { label: 'Encrypted / Unread',  val: '$46.4M', pct: 0.18, color: '#ff6a00' },
    { label: 'Business Calls',      val: '$38.7M', pct: 0.15, color: '#ff9d00' },
    { label: 'Language Barriers',   val: '$46.4M', pct: 0.18, color: '#c400ff' },
    { label: 'Duplicate Coverage',  val: '$15.5M', pct: 0.06, color: '#ffd740' },
    { label: 'Technical Failures',  val: '$20.7M', pct: 0.08, color: '#6600ff' },
];

function buildDonut() {
    const svgEl = document.getElementById('donutSVG');
    const legendEl = document.getElementById('wasteLegend');
    if (!svgEl || !legendEl) return;

    const ns   = 'http://www.w3.org/2000/svg';
    const cx   = 140, cy = 140, r = 110, inner = 70;
    let angle  = -Math.PI / 2;

    WASTE_DATA.forEach((seg, i) => {
        const sweep = seg.pct * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle + sweep);
        const y2 = cy + r * Math.sin(angle + sweep);
        const ix1 = cx + inner * Math.cos(angle);
        const iy1 = cy + inner * Math.sin(angle);
        const ix2 = cx + inner * Math.cos(angle + sweep);
        const iy2 = cy + inner * Math.sin(angle + sweep);
        const large = sweep > Math.PI ? 1 : 0;

        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d',
            `M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${large},0 ${ix1},${iy1} Z`);
        path.setAttribute('fill', seg.color);
        path.setAttribute('id', 'dseg' + i);
        path.style.cssText = `opacity:0.18; transition:opacity 0.5s ease, filter 0.5s ease; filter:drop-shadow(0 0 0px ${seg.color})`;
        svgEl.appendChild(path);

        // Legend item
        const item = document.createElement('div');
        item.className = 'waste-legend-item';
        item.id = 'wleg' + i;
        item.innerHTML = `
            <span class="waste-swatch" style="background:${seg.color}"></span>
            <span>${seg.label}</span>
            <span class="waste-legend-val">${seg.val}</span>`;
        legendEl.appendChild(item);

        angle += sweep;
    });

    window._wasteSegs = WASTE_DATA.length;
}

function revealAnatomyStep(step) {
    if (step === 0) {
        WASTE_DATA.forEach((_, i) => {
            const seg  = document.getElementById('dseg' + i);
            const legi = document.getElementById('wleg' + i);
            if (seg)  { seg.style.opacity  = '1'; seg.style.filter = `drop-shadow(0 0 8px ${WASTE_DATA[i].color})`; }
            if (legi) setTimeout(() => legi.classList.add('lit'), i * 120);
        });
    }
    // Spotlight individual segments
    const spotlights = { 1: 0, 2: 1, 3: 4 }; // step → seg index
    if (spotlights[step] !== undefined) {
        const si = spotlights[step];
        WASTE_DATA.forEach((seg, i) => {
            const el = document.getElementById('dseg' + i);
            if (!el) return;
            el.style.opacity = (i === si) ? '1' : '0.25';
            el.style.filter  = (i === si) ? `drop-shadow(0 0 14px ${seg.color})` : 'none';
        });
        document.getElementById('donutCenterVal').textContent = WASTE_DATA[si].val;
    }
    if (step === 0) document.getElementById('donutCenterVal').textContent = '$258M';
}

// ----------------------------------------------------------------
// INTERCEPT STAGE (Act I)
// ----------------------------------------------------------------
function revealInterceptStep(step) {
    const tapMarker  = document.getElementById('tapMarker');
    const wireSig    = document.getElementById('wireSignal');
    const phoneA     = document.getElementById('phoneA');
    const phoneB     = document.getElementById('phoneB');
    const monitor    = document.getElementById('monitorReadout');
    const statVal    = document.getElementById('stageStatVal');
    const statLabel  = document.getElementById('stageStatLabel');
    const particles  = document.querySelectorAll('.signal-particles span');

    switch (step) {
        case 0:
            if (tapMarker) tapMarker.setAttribute('opacity', '0');
            if (wireSig)   wireSig.classList.remove('tapped');
            if (phoneA)    phoneA.classList.remove('tapped');
            if (phoneB)    phoneB.classList.remove('tapped');
            if (monitor)   monitor.classList.remove('visible');
            if (statVal)   { statVal.textContent = '4,740'; statVal.classList.remove('red'); }
            if (statLabel) statLabel.textContent = 'wiretap orders in 2024';
            particles.forEach(p => p.style.background = 'var(--green)');
            break;

        case 1:
            if (tapMarker) {
                tapMarker.setAttribute('opacity', '0');
                requestAnimationFrame(() => {
                    tapMarker.style.transition = 'opacity 0.5s ease';
                    tapMarker.setAttribute('opacity', '1');
                });
            }
            if (wireSig)  wireSig.classList.add('tapped');
            if (phoneA)   phoneA.classList.add('tapped');
            if (phoneB)   phoneB.classList.add('tapped');
            if (monitor)  {
                monitor.classList.add('visible');
                setTimeout(() => {
                    document.querySelectorAll('.monitor-line').forEach(l => l.classList.add('lit'));
                }, 200);
            }
            particles.forEach(p => {
                p.style.background = 'var(--red)';
                p.style.boxShadow  = '0 0 6px var(--red)';
            });
            break;

        case 2:
            if (statVal)   { statVal.textContent = '4,740'; statVal.classList.remove('red'); }
            if (statLabel) statLabel.textContent = 'wiretap orders in 2024';
            break;

        case 3:
            if (statVal)   { statVal.textContent = '$405M'; statVal.classList.add('red'); }
            if (statLabel) statLabel.textContent = 'total surveillance spend — 2024';
            break;
    }
}

// ----------------------------------------------------------------
// SCROLLAMA
// ----------------------------------------------------------------
function initScrollama() {
    if (typeof scrollama === 'undefined') {
        console.warn('Scrollama not loaded — retrying in 500ms');
        setTimeout(initScrollama, 500);
        return;
    }

    const scroller = scrollama();
    scroller.setup({
        step:   '.step',
        offset: 0.55,
        debug:  false
    })
    .onStepEnter(({ element }) => {
        // Deactivate all, activate this
        document.querySelectorAll('.step-inner').forEach(s => s.classList.remove('active'));
        const inner = element.querySelector('.step-inner');
        if (inner) inner.classList.add('active');

        const step  = parseInt(element.dataset.step, 10);
        const scene = element.dataset.scene;
        const chart = element.dataset.chart;

        if (scene === 'intercept') revealInterceptStep(step);
        if (chart === 'divergence') revealDivergenceStep(step);
        if (chart === 'geo')        revealGeoStep(step);
        if (chart === 'anatomy')    revealAnatomyStep(step);
    })
    .onStepExit(({ element }) => {
        element.querySelector('.step-inner')?.classList.remove('active');
    });

    window.addEventListener('resize', scroller.resize);
}

// ----------------------------------------------------------------
// BOOT
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initCursor();
    initDataStream();
    initHeroCounter();
    initCountUps();
    buildDivergenceChart();
    buildStateBars();
    buildDonut();
    initReveal();
    initScrollama();

    // Cursor visibility on page leave/enter
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    document.addEventListener('mouseleave', () => {
        if (cursor)   cursor.style.opacity   = '0';
        if (follower) follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (cursor)   cursor.style.opacity   = '1';
        if (follower) follower.style.opacity = '0.45';
    });
});
