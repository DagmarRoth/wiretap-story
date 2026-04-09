// ============================================
// WIRETAP STORY: 5 FOCUSED VISUALIZATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    drawAllVisualizations();
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

// ============================================
// VIZ 1: DIVERGENCE CHART (DUAL-AXIS)
// ============================================

function drawDivergenceChart() {
    const svg = document.getElementById('divergence-chart');
    if (!svg) return;

    const width = 1400;
    const height = 650;
    const margin = { top: 60, right: 120, bottom: 80, left: 120 };
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

    // Data
    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];
    const effectiveness = [12.9, 12.6, 11.3];

    // Scales
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScaleCost = (val) => margin.top + chartHeight - ((val - 170000) / 70000) * chartHeight;
    const yScaleEff = (val) => margin.top + chartHeight - (val / 15) * chartHeight;

    // Grid lines
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (i / 5) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e8e8e8');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Cost line (red, left axis)
    let costPath = `M ${xScale(0)} ${yScaleCost(costs[0])}`;
    for (let i = 1; i < years.length; i++) {
        costPath += ` L ${xScale(i)} ${yScaleCost(costs[i])}`;
    }

    const costLine = document.createElementNS(ns, 'path');
    costLine.setAttribute('d', costPath);
    costLine.setAttribute('stroke', '#ff6b6b');
    costLine.setAttribute('stroke-width', '4');
    costLine.setAttribute('fill', 'none');
    costLine.setAttribute('stroke-linecap', 'round');
    costLine.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(costLine);

    // Effectiveness line (green, right axis)
    let effPath = `M ${xScale(0)} ${yScaleEff(effectiveness[0])}`;
    for (let i = 1; i < years.length; i++) {
        effPath += ` L ${xScale(i)} ${yScaleEff(effectiveness[i])}`;
    }

    const effLine = document.createElementNS(ns, 'path');
    effLine.setAttribute('d', effPath);
    effLine.setAttribute('stroke', '#50c878');
    effLine.setAttribute('stroke-width', '4');
    effLine.setAttribute('fill', 'none');
    effLine.setAttribute('stroke-linecap', 'round');
    effLine.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(effLine);

    // Cost points
    for (let i = 0; i < years.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScaleCost(costs[i]));
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#ff6b6b');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', yScaleCost(costs[i]) - 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#ff6b6b');
        label.textContent = '$' + (costs[i] / 1000).toFixed(0) + 'K';
        svg.appendChild(label);
    }

    // Effectiveness points
    for (let i = 0; i < years.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScaleEff(effectiveness[i]));
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#50c878');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', yScaleEff(effectiveness[i]) + 25);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#50c878');
        label.textContent = effectiveness[i].toFixed(1) + '%';
        svg.appendChild(label);
    }

    // Year labels
    for (let i = 0; i < years.length; i++) {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', margin.top + chartHeight + 50);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#333');
        label.textContent = years[i];
        svg.appendChild(label);
    }

    // Left axis label (Cost)
    const leftAxisLabel = document.createElementNS(ns, 'text');
    leftAxisLabel.setAttribute('x', 30);
    leftAxisLabel.setAttribute('y', margin.top - 10);
    leftAxisLabel.setAttribute('font-size', '12');
    leftAxisLabel.setAttribute('font-weight', '700');
    leftAxisLabel.setAttribute('fill', '#ff6b6b');
    leftAxisLabel.textContent = 'Cost per Order';
    svg.appendChild(leftAxisLabel);

    // Right axis label (Effectiveness)
    const rightAxisLabel = document.createElementNS(ns, 'text');
    rightAxisLabel.setAttribute('x', width - 80);
    rightAxisLabel.setAttribute('y', margin.top - 10);
    rightAxisLabel.setAttribute('font-size', '12');
    rightAxisLabel.setAttribute('font-weight', '700');
    rightAxisLabel.setAttribute('fill', '#50c878');
    rightAxisLabel.textContent = 'Incrimination Rate %';
    svg.appendChild(rightAxisLabel);
}

// ============================================
// VIZ 2: COMPOSITION CHART (STACKED AREA)
// ============================================

function drawCompositionChart() {
    const svg = document.getElementById('composition-chart');
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

    // Green area (evidence-producing)
    let greenPath = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        greenPath += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }
    greenPath += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

    const greenArea = document.createElementNS(ns, 'path');
    greenArea.setAttribute('d', greenPath);
    greenArea.setAttribute('fill', '#50c878');
    greenArea.setAttribute('opacity', '0.5');
    svg.appendChild(greenArea);

    // Red area (waste)
    let redPath = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 0; i < years.length; i++) {
        redPath += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }
    redPath += ` L ${xScale(2)} ${yScale(effectiveValues[2])} L ${xScale(0)} ${yScale(effectiveValues[0])} Z`;

    const redArea = document.createElementNS(ns, 'path');
    redArea.setAttribute('d', redPath);
    redArea.setAttribute('fill', '#ff6b6b');
    redArea.setAttribute('opacity', '0.5');
    svg.appendChild(redArea);

    // Lines
    let greenLine = `M ${xScale(0)} ${yScale(effectiveValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        greenLine += ` L ${xScale(i)} ${yScale(effectiveValues[i])}`;
    }

    const greenStroke = document.createElementNS(ns, 'path');
    greenStroke.setAttribute('d', greenLine);
    greenStroke.setAttribute('stroke', '#50c878');
    greenStroke.setAttribute('stroke-width', '3');
    greenStroke.setAttribute('fill', 'none');
    svg.appendChild(greenStroke);

    let redLine = `M ${xScale(0)} ${yScale(effectiveValues[0] + wasteValues[0])}`;
    for (let i = 1; i < years.length; i++) {
        redLine += ` L ${xScale(i)} ${yScale(effectiveValues[i] + wasteValues[i])}`;
    }

    const redStroke = document.createElementNS(ns, 'path');
    redStroke.setAttribute('d', redLine);
    redStroke.setAttribute('stroke', '#ff6b6b');
    redStroke.setAttribute('stroke-width', '3');
    redStroke.setAttribute('fill', 'none');
    svg.appendChild(redStroke);

    // Labels on the chart
    for (let i = 0; i < years.length; i++) {
        // Green label
        const greenLabel = document.createElementNS(ns, 'text');
        greenLabel.setAttribute('x', xScale(i));
        greenLabel.setAttribute('y', yScale(effectiveValues[i] / 2) + 5);
        greenLabel.setAttribute('text-anchor', 'middle');
        greenLabel.setAttribute('font-size', '12');
        greenLabel.setAttribute('font-weight', '700');
        greenLabel.setAttribute('fill', '#fff');
        greenLabel.textContent = '$' + effectiveValues[i].toFixed(0) + 'M';
        svg.appendChild(greenLabel);

        // Red label
        const redLabel = document.createElementNS(ns, 'text');
        redLabel.setAttribute('x', xScale(i));
        redLabel.setAttribute('y', yScale(effectiveValues[i] + wasteValues[i] / 2) + 5);
        redLabel.setAttribute('text-anchor', 'middle');
        redLabel.setAttribute('font-size', '12');
        redLabel.setAttribute('font-weight', '700');
        redLabel.setAttribute('fill', '#fff');
        redLabel.textContent = '$' + wasteValues[i].toFixed(0) + 'M';
        svg.appendChild(redLabel);

        // Year label
        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', xScale(i));
        yearLabel.setAttribute('y', margin.top + chartHeight + 35);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '14');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#333');
        yearLabel.textContent = years[i];
        svg.appendChild(yearLabel);
    }

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

    // Legend
    const greenDot = document.createElementNS(ns, 'circle');
    greenDot.setAttribute('cx', margin.left);
    greenDot.setAttribute('cy', height - 30);
    greenDot.setAttribute('r', '5');
    greenDot.setAttribute('fill', '#50c878');
    svg.appendChild(greenDot);

    const greenText = document.createElementNS(ns, 'text');
    greenText.setAttribute('x', margin.left + 15);
    greenText.setAttribute('y', height - 25);
    greenText.setAttribute('font-size', '12');
    greenText.setAttribute('fill', '#666');
    greenText.textContent = 'Evidence-producing';
    svg.appendChild(greenText);

    const redDot = document.createElementNS(ns, 'circle');
    redDot.setAttribute('cx', margin.left + 280);
    redDot.setAttribute('cy', height - 30);
    redDot.setAttribute('r', '5');
    redDot.setAttribute('fill', '#ff6b6b');
    svg.appendChild(redDot);

    const redText = document.createElementNS(ns, 'text');
    redText.setAttribute('x', margin.left + 295);
    redText.setAttribute('y', height - 25);
    redText.setAttribute('font-size', '12');
    redText.setAttribute('fill', '#666');
    redText.textContent = 'Waste (non-incriminating)';
    svg.appendChild(redText);
}

// ============================================
// VIZ 3: BUBBLE CHART (COST VS EFFECTIVENESS)
// ============================================

function drawBubbleChart() {
    const svg = document.getElementById('bubble-chart');
    if (!svg) return;

    const width = 1400;
    const height = 650;
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

    // Data
    const years = [2022, 2023, 2024];
    const colors = ['#4a90e2', '#ffa500', '#ff6b6b'];

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

    // Scales
    const xScale = (val) => margin.left + (val / 250000) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 15) * chartHeight;

    // Plot years
    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const avgCost = wiretapData[year].avgCost;
        const effectiveness = (wiretapData[year].incriminating / wiretapData[year].intercepts) * 100;
        const orders = wiretapData[year].orders;

        const x = xScale(avgCost);
        const y = yScale(effectiveness);
        const r = Math.sqrt(orders) / 1.8;

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

        // Year label inside bubble
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '18');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#fff');
        label.textContent = year;
        svg.appendChild(label);

        // Orders annotation
        const ordersLabel = document.createElementNS(ns, 'text');
        ordersLabel.setAttribute('x', x);
        ordersLabel.setAttribute('y', y - r - 15);
        ordersLabel.setAttribute('text-anchor', 'middle');
        ordersLabel.setAttribute('font-size', '11');
        ordersLabel.setAttribute('fill', colors[i]);
        ordersLabel.setAttribute('font-weight', '700');
        ordersLabel.textContent = orders + ' orders';
        svg.appendChild(ordersLabel);
    }

    // Axes labels
    const xAxisLabel = document.createElementNS(ns, 'text');
    xAxisLabel.setAttribute('x', width / 2);
    xAxisLabel.setAttribute('y', height - 30);
    xAxisLabel.setAttribute('text-anchor', 'middle');
    xAxisLabel.setAttribute('font-size', '12');
    xAxisLabel.setAttribute('font-weight', '700');
    xAxisLabel.setAttribute('fill', '#666');
    xAxisLabel.textContent = 'Average Cost per Order →';
    svg.appendChild(xAxisLabel);

    const yAxisLabel = document.createElementNS(ns, 'text');
    yAxisLabel.setAttribute('x', 25);
    yAxisLabel.setAttribute('y', margin.top);
    yAxisLabel.setAttribute('font-size', '12');
    yAxisLabel.setAttribute('font-weight', '700');
    yAxisLabel.setAttribute('fill', '#666');
    yAxisLabel.setAttribute('transform', `rotate(-90, 25, ${margin.top})`);
    yAxisLabel.textContent = 'Incrimination Rate (%) →';
    svg.appendChild(yAxisLabel);

    // Quadrant description
    const desc = document.createElementNS(ns, 'text');
    desc.setAttribute('x', margin.left + chartWidth - 50);
    desc.setAttribute('y', margin.top + 30);
    desc.setAttribute('text-anchor', 'middle');
    desc.setAttribute('font-size', '11');
    desc.setAttribute('fill', '#999');
    desc.setAttribute('font-style', 'italic');
    desc.textContent = 'Movement toward';
    svg.appendChild(desc);

    const desc2 = document.createElementNS(ns, 'text');
    desc2.setAttribute('x', margin.left + chartWidth - 50);
    desc2.setAttribute('y', margin.top + 45);
    desc2.setAttribute('text-anchor', 'middle');
    desc2.setAttribute('font-size', '11');
    desc2.setAttribute('fill', '#999');
    desc2.setAttribute('font-style', 'italic');
    desc2.textContent = 'expensive & ineffective';
    svg.appendChild(desc2);
}

// ============================================
// VIZ 4: STATE BUBBLE CHART
// ============================================

function drawStateBubbleChart() {
    const svg = document.getElementById('state-bubble-chart');
    if (!svg) return;

    const width = 1400;
    const height = 650;
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

    // Scales
    const xScale = (val) => margin.left + (val / 270000) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 16) * chartHeight;

    // Plot states
    const colors = ['#ff6b6b', '#ffa500', '#50c878', '#4a90e2', '#9b59b6', '#1abc9c', '#e74c3c', '#3498db'];

    for (let i = 0; i < stateData2024.length; i++) {
        const state = stateData2024[i];
        const x = xScale(state.costPerOrder);
        const y = yScale(state.effectiveness);
        const r = Math.sqrt(state.orders) * 1.2;

        // Bubble
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', colors[i % colors.length]);
        circle.setAttribute('opacity', '0.6');
        circle.setAttribute('stroke', colors[i % colors.length]);
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // State label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#fff');
        label.textContent = state.state.substring(0, 2);
        svg.appendChild(label);

        // Orders label (small)
        const ordersLabel = document.createElementNS(ns, 'text');
        ordersLabel.setAttribute('x', x);
        ordersLabel.setAttribute('y', y - r - 10);
        ordersLabel.setAttribute('text-anchor', 'middle');
        ordersLabel.setAttribute('font-size', '9');
        ordersLabel.setAttribute('fill', colors[i % colors.length]);
        ordersLabel.textContent = state.orders;
        svg.appendChild(ordersLabel);
    }

    // Axes labels
    const xAxisLabel = document.createElementNS(ns, 'text');
    xAxisLabel.setAttribute('x', width / 2);
    xAxisLabel.setAttribute('y', height - 30);
    xAxisLabel.setAttribute('text-anchor', 'middle');
    xAxisLabel.setAttribute('font-size', '12');
    xAxisLabel.setAttribute('font-weight', '700');
    xAxisLabel.setAttribute('fill', '#666');
    xAxisLabel.textContent = 'Average Cost per Order →';
    svg.appendChild(xAxisLabel);

    const yAxisLabel = document.createElementNS(ns, 'text');
    yAxisLabel.setAttribute('x', 25);
    yAxisLabel.setAttribute('y', margin.top);
    yAxisLabel.setAttribute('font-size', '12');
    yAxisLabel.setAttribute('font-weight', '700');
    yAxisLabel.setAttribute('fill', '#666');
    yAxisLabel.setAttribute('transform', `rotate(-90, 25, ${margin.top})`);
    yAxisLabel.textContent = 'Effectiveness Rate (%) →';
    svg.appendChild(yAxisLabel);

    // Legend (top states)
    let legendX = margin.left;
    const topStates = ['California', 'New York', 'Nevada'];
    for (let i = 0; i < Math.min(3, stateData2024.length); i++) {
        if (stateData2024[i].state === topStates[0] || stateData2024[i].state === topStates[1] || stateData2024[i].state === topStates[2]) {
            const dot = document.createElementNS(ns, 'circle');
            dot.setAttribute('cx', legendX);
            dot.setAttribute('cy', height - 30);
            dot.setAttribute('r', '4');
            dot.setAttribute('fill', colors[i % colors.length]);
            svg.appendChild(dot);

            const text = document.createElementNS(ns, 'text');
            text.setAttribute('x', legendX + 12);
            text.setAttribute('y', height - 26);
            text.setAttribute('font-size', '11');
            text.setAttribute('fill', '#666');
            text.textContent = stateData2024[i].state;
            svg.appendChild(text);

            legendX += 180;
        }
    }
}

// ============================================
// VIZ 5: FEDERAL VS STATE STACKED AREA
// ============================================

function drawFedStateChart() {
    const svg = document.getElementById('fed-state-chart');
    if (!svg) return;

    const width = 1400;
    const height = 550;
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

    // Federal and state orders
    const federal = [1341, 1340, 1290];
    const state = [1073, 1058, 1007];

    const yScaleMax = 2500;
    const yScale = (val) => margin.top + chartHeight - (val / yScaleMax) * chartHeight;

    // Federal area (blue)
    let fedPath = `M ${xScale(0)} ${yScale(federal[0])}`;
    for (let i = 1; i < years.length; i++) {
        fedPath += ` L ${xScale(i)} ${yScale(federal[i])}`;
    }
    fedPath += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

    const fedArea = document.createElementNS(ns, 'path');
    fedArea.setAttribute('d', fedPath);
    fedArea.setAttribute('fill', '#4a90e2');
    fedArea.setAttribute('opacity', '0.6');
    svg.appendChild(fedArea);

    // State area (orange)
    let statePath = `M ${xScale(0)} ${yScale(federal[0])}`;
    for (let i = 0; i < years.length; i++) {
        statePath += ` L ${xScale(i)} ${yScale(federal[i] + state[i])}`;
    }
    statePath += ` L ${xScale(2)} ${yScale(federal[2])} L ${xScale(0)} ${yScale(federal[0])} Z`;

    const stateArea = document.createElementNS(ns, 'path');
    stateArea.setAttribute('d', statePath);
    stateArea.setAttribute('fill', '#ffa500');
    stateArea.setAttribute('opacity', '0.6');
    svg.appendChild(stateArea);

    // Lines
    let fedLine = `M ${xScale(0)} ${yScale(federal[0])}`;
    for (let i = 1; i < years.length; i++) {
        fedLine += ` L ${xScale(i)} ${yScale(federal[i])}`;
    }

    const fedStroke = document.createElementNS(ns, 'path');
    fedStroke.setAttribute('d', fedLine);
    fedStroke.setAttribute('stroke', '#4a90e2');
    fedStroke.setAttribute('stroke-width', '3');
    fedStroke.setAttribute('fill', 'none');
    svg.appendChild(fedStroke);

    let stateLine = `M ${xScale(0)} ${yScale(federal[0] + state[0])}`;
    for (let i = 1; i < years.length; i++) {
        stateLine += ` L ${xScale(i)} ${yScale(federal[i] + state[i])}`;
    }

    const stateStroke = document.createElementNS(ns, 'path');
    stateStroke.setAttribute('d', stateLine);
    stateStroke.setAttribute('stroke', '#ffa500');
    stateStroke.setAttribute('stroke-width', '3');
    stateStroke.setAttribute('fill', 'none');
    svg.appendChild(stateStroke);

    // Labels
    for (let i = 0; i < years.length; i++) {
        // Federal label
        const fedLabel = document.createElementNS(ns, 'text');
        fedLabel.setAttribute('x', xScale(i));
        fedLabel.setAttribute('y', yScale(federal[i] / 2) + 5);
        fedLabel.setAttribute('text-anchor', 'middle');
        fedLabel.setAttribute('font-size', '12');
        fedLabel.setAttribute('font-weight', '700');
        fedLabel.setAttribute('fill', '#fff');
        fedLabel.textContent = federal[i];
        svg.appendChild(fedLabel);

        // State label
        const stateLabel = document.createElementNS(ns, 'text');
        stateLabel.setAttribute('x', xScale(i));
        stateLabel.setAttribute('y', yScale(federal[i] + state[i] / 2) + 5);
        stateLabel.setAttribute('text-anchor', 'middle');
        stateLabel.setAttribute('font-size', '12');
        stateLabel.setAttribute('font-weight', '700');
        stateLabel.setAttribute('fill', '#fff');
        stateLabel.textContent = state[i];
        svg.appendChild(stateLabel);

        // Year label
        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', xScale(i));
        yearLabel.setAttribute('y', margin.top + chartHeight + 35);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '14');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#333');
        yearLabel.textContent = years[i];
        svg.appendChild(yearLabel);
    }

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

    // Legend
    const blueDot = document.createElementNS(ns, 'circle');
    blueDot.setAttribute('cx', margin.left);
    blueDot.setAttribute('cy', height - 30);
    blueDot.setAttribute('r', '5');
    blueDot.setAttribute('fill', '#4a90e2');
    svg.appendChild(blueDot);

    const blueText = document.createElementNS(ns, 'text');
    blueText.setAttribute('x', margin.left + 15);
    blueText.setAttribute('y', height - 25);
    blueText.setAttribute('font-size', '12');
    blueText.setAttribute('fill', '#666');
    blueText.textContent = 'Federal (56%)';
    svg.appendChild(blueText);

    const orangeDot = document.createElementNS(ns, 'circle');
    orangeDot.setAttribute('cx', margin.left + 220);
    orangeDot.setAttribute('cy', height - 30);
    orangeDot.setAttribute('r', '5');
    orangeDot.setAttribute('fill', '#ffa500');
    svg.appendChild(orangeDot);

    const orangeText = document.createElementNS(ns, 'text');
    orangeText.setAttribute('x', margin.left + 235);
    orangeText.setAttribute('y', height - 25);
    orangeText.setAttribute('font-size', '12');
    orangeText.setAttribute('fill', '#666');
    orangeText.textContent = 'State/Local (44%)';
    svg.appendChild(orangeText);
}

// ============================================
// MAIN FUNCTION
// ============================================

function drawAllVisualizations() {
    drawDivergenceChart();
    drawCompositionChart();
    drawBubbleChart();
    drawStateBubbleChart();
    drawFedStateChart();
}

// ============================================
// ANIMATION ON SCROLL
// ============================================

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
