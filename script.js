// ============================================
// SOPHISTICATED MAGAZINE-STYLE VISUALS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    drawAllVisuals();
    animateOnScroll();
});

function drawAllVisuals() {
    drawContrastVisual();
    drawDivergenceVisual();
    drawWasteVisual();
    drawAccelerationVisual();
    drawAlternativesVisual();
    drawGeographyVisual();
    drawReckoningVisual();
}

// ============================================
// VISUAL 1: CONTRAST
// ============================================

function drawContrastVisual() {
    const svg = document.getElementById('contrast-visual');
    if (!svg) return;

    const width = 1200;
    const height = 600;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const centerX = width / 2;
    const centerY = height / 2;

    // Left side: costs up
    drawLargeArrow(svg, ns, centerX - 200, centerY, '↑', '#ff6b6b', true);
    const costLabel = document.createElementNS(ns, 'text');
    costLabel.setAttribute('x', centerX - 200);
    costLabel.setAttribute('y', centerY + 100);
    costLabel.setAttribute('text-anchor', 'middle');
    costLabel.setAttribute('font-size', '24');
    costLabel.setAttribute('font-weight', '800');
    costLabel.setAttribute('fill', '#ff6b6b');
    costLabel.textContent = '+29.5%';
    svg.appendChild(costLabel);

    const costDesc = document.createElementNS(ns, 'text');
    costDesc.setAttribute('x', centerX - 200);
    costDesc.setAttribute('y', centerY + 140);
    costDesc.setAttribute('text-anchor', 'middle');
    costDesc.setAttribute('font-size', '16');
    costDesc.setAttribute('fill', '#666');
    costDesc.textContent = 'Costs';
    svg.appendChild(costDesc);

    // Right side: effectiveness down
    drawLargeArrow(svg, ns, centerX + 200, centerY, '↓', '#50c878', false);
    const effectLabel = document.createElementNS(ns, 'text');
    effectLabel.setAttribute('x', centerX + 200);
    effectLabel.setAttribute('y', centerY + 100);
    effectLabel.setAttribute('text-anchor', 'middle');
    effectLabel.setAttribute('font-size', '24');
    effectLabel.setAttribute('font-weight', '800');
    effectLabel.setAttribute('fill', '#50c878');
    effectLabel.textContent = '-12.4%';
    svg.appendChild(effectLabel);

    const effectDesc = document.createElementNS(ns, 'text');
    effectDesc.setAttribute('x', centerX + 200);
    effectDesc.setAttribute('y', centerY + 140);
    effectDesc.setAttribute('text-anchor', 'middle');
    effectDesc.setAttribute('font-size', '16');
    effectDesc.setAttribute('fill', '#666');
    effectDesc.textContent = 'Effectiveness';
    svg.appendChild(effectDesc);

    // Center VS
    const vs = document.createElementNS(ns, 'text');
    vs.setAttribute('x', centerX);
    vs.setAttribute('y', centerY + 20);
    vs.setAttribute('text-anchor', 'middle');
    vs.setAttribute('font-size', '32');
    vs.setAttribute('font-weight', '800');
    vs.setAttribute('fill', '#999');
    vs.textContent = 'VS';
    svg.appendChild(vs);

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', centerX);
    title.setAttribute('y', 50);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'The Central Problem: 2022-2024';
    svg.appendChild(title);
}

function drawLargeArrow(svg, ns, x, y, arrow, color, up) {
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', up ? '120' : '120');
    text.setAttribute('font-weight', '800');
    text.setAttribute('fill', color);
    text.setAttribute('opacity', '0.3');
    text.textContent = arrow;
    svg.appendChild(text);
}

// ============================================
// VISUAL 2: DIVERGENCE
// ============================================

function drawDivergenceVisual() {
    const svg = document.getElementById('divergence-visual');
    if (!svg) return;

    const width = 1400;
    const height = 700;
    const margin = { top: 60, right: 100, bottom: 80, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    // Background with gradient
    const defs = document.createElementNS(ns, 'defs');
    const grad = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', 'bgGrad');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('y2', '100%');
    const stop1 = document.createElementNS(ns, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#f8f9fa');
    const stop2 = document.createElementNS(ns, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#fff');
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', 'url(#bgGrad)');
    svg.appendChild(bg);

    // Data
    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];
    const incrimination = [12.9, 12.6, 11.3];

    // Scales
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScale1 = (val) => margin.top + chartHeight - (val / 250000) * chartHeight;
    const yScale2 = (val) => margin.top + chartHeight - (val / 15) * chartHeight;

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
        line.setAttribute('stroke-dasharray', '4,4');
        svg.appendChild(line);
    }

    // Draw lines
    drawSmoothLine(svg, ns, years, costs, xScale, yScale1, '#ff6b6b', 3);
    drawSmoothLine(svg, ns, years, incrimination, xScale, yScale2, '#50c878', 3);

    // Draw circles
    for (let i = 0; i < costs.length; i++) {
        const circle1 = document.createElementNS(ns, 'circle');
        circle1.setAttribute('cx', xScale(i));
        circle1.setAttribute('cy', yScale1(costs[i]));
        circle1.setAttribute('r', '8');
        circle1.setAttribute('fill', '#ff6b6b');
        circle1.setAttribute('opacity', '0.8');
        svg.appendChild(circle1);

        const circle2 = document.createElementNS(ns, 'circle');
        circle2.setAttribute('cx', xScale(i));
        circle2.setAttribute('cy', yScale2(incrimination[i]));
        circle2.setAttribute('r', '8');
        circle2.setAttribute('fill', '#50c878');
        circle2.setAttribute('opacity', '0.8');
        svg.appendChild(circle2);
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

    // Labels
    for (let i = 0; i < years.length; i++) {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', margin.top + chartHeight + 40);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#666');
        label.textContent = years[i];
        svg.appendChild(label);

        // Cost value
        const costVal = document.createElementNS(ns, 'text');
        costVal.setAttribute('x', xScale(i));
        costVal.setAttribute('y', yScale1(costs[i]) - 20);
        costVal.setAttribute('text-anchor', 'middle');
        costVal.setAttribute('font-size', '14');
        costVal.setAttribute('font-weight', '700');
        costVal.setAttribute('fill', '#ff6b6b');
        costVal.textContent = `$${(costs[i] / 1000).toFixed(0)}K`;
        svg.appendChild(costVal);

        // Incrimination value
        const incVal = document.createElementNS(ns, 'text');
        incVal.setAttribute('x', xScale(i) + 40);
        incVal.setAttribute('y', yScale2(incrimination[i]) + 20);
        incVal.setAttribute('text-anchor', 'middle');
        incVal.setAttribute('font-size', '14');
        incVal.setAttribute('font-weight', '700');
        incVal.setAttribute('fill', '#50c878');
        incVal.textContent = `${incrimination[i]}%`;
        svg.appendChild(incVal);
    }

    // Legend
    const legend1 = document.createElementNS(ns, 'circle');
    legend1.setAttribute('cx', width - 300);
    legend1.setAttribute('cy', 60);
    legend1.setAttribute('r', '6');
    legend1.setAttribute('fill', '#ff6b6b');
    svg.appendChild(legend1);

    const legendText1 = document.createElementNS(ns, 'text');
    legendText1.setAttribute('x', width - 280);
    legendText1.setAttribute('y', 67);
    legendText1.setAttribute('font-size', '14');
    legendText1.setAttribute('fill', '#666');
    legendText1.textContent = 'Average Cost (rising)';
    svg.appendChild(legendText1);

    const legend2 = document.createElementNS(ns, 'circle');
    legend2.setAttribute('cx', width - 300);
    legend2.setAttribute('cy', 100);
    legend2.setAttribute('r', '6');
    legend2.setAttribute('fill', '#50c878');
    svg.appendChild(legend2);

    const legendText2 = document.createElementNS(ns, 'text');
    legendText2.setAttribute('x', width - 280);
    legendText2.setAttribute('y', 107);
    legendText2.setAttribute('font-size', '14');
    legendText2.setAttribute('fill', '#666');
    legendText2.textContent = 'Incrimination Rate (falling)';
    svg.appendChild(legendText2);
}

function drawSmoothLine(svg, ns, years, data, xScale, yScale, color, width) {
    let pathData = `M ${xScale(0)} ${yScale(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        pathData += ` L ${xScale(i)} ${yScale(data[i])}`;
    }

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', width);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('opacity', '0.7');
    svg.appendChild(path);
}

// ============================================
// VISUAL 3: WASTE RATIO
// ============================================

function drawWasteVisual() {
    const svg = document.getElementById('waste-visual');
    if (!svg) return;

    const width = 1000;
    const height = 400;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const effectiveWidth = (width - 80) * 0.113;
    const wasteWidth = (width - 80) * 0.887;

    // Effective
    const effectiveRect = document.createElementNS(ns, 'rect');
    effectiveRect.setAttribute('x', 40);
    effectiveRect.setAttribute('y', 100);
    effectiveRect.setAttribute('width', effectiveWidth);
    effectiveRect.setAttribute('height', 120);
    effectiveRect.setAttribute('fill', '#50c878');
    effectiveRect.setAttribute('opacity', '0.9');
    effectiveRect.setAttribute('rx', '4');
    svg.appendChild(effectiveRect);

    // Waste
    const wasteRect = document.createElementNS(ns, 'rect');
    wasteRect.setAttribute('x', 40 + effectiveWidth);
    wasteRect.setAttribute('y', 100);
    wasteRect.setAttribute('width', wasteWidth);
    wasteRect.setAttribute('height', 120);
    wasteRect.setAttribute('fill', '#ff6b6b');
    wasteRect.setAttribute('opacity', '0.9');
    wasteRect.setAttribute('rx', '4');
    svg.appendChild(wasteRect);

    // Effective label
    const effLabel = document.createElementNS(ns, 'text');
    effLabel.setAttribute('x', 40 + effectiveWidth / 2);
    effLabel.setAttribute('y', 165);
    effLabel.setAttribute('text-anchor', 'middle');
    effLabel.setAttribute('font-size', '18');
    effLabel.setAttribute('font-weight', '800');
    effLabel.setAttribute('fill', '#fff');
    effLabel.textContent = '11.3%';
    svg.appendChild(effLabel);

    // Waste label
    const wasteLabel = document.createElementNS(ns, 'text');
    wasteLabel.setAttribute('x', 40 + effectiveWidth + wasteWidth / 2);
    wasteLabel.setAttribute('y', 165);
    wasteLabel.setAttribute('text-anchor', 'middle');
    wasteLabel.setAttribute('font-size', '18');
    wasteLabel.setAttribute('font-weight', '800');
    wasteLabel.setAttribute('fill', '#fff');
    wasteLabel.textContent = '88.7%';
    svg.appendChild(wasteLabel);

    // Bottom labels
    const effDesc = document.createElementNS(ns, 'text');
    effDesc.setAttribute('x', 40);
    effDesc.setAttribute('y', 280);
    effDesc.setAttribute('font-size', '13');
    effDesc.setAttribute('fill', '#50c878');
    effDesc.setAttribute('font-weight', '700');
    effDesc.textContent = '277 incriminating intercepts';
    svg.appendChild(effDesc);

    const wasteDesc = document.createElementNS(ns, 'text');
    wasteDesc.setAttribute('x', 40);
    wasteDesc.setAttribute('y', 310);
    wasteDesc.setAttribute('font-size', '13');
    wasteDesc.setAttribute('fill', '#ff6b6b');
    wasteDesc.setAttribute('font-weight', '700');
    wasteDesc.textContent = '2,171 non-incriminating intercepts';
    svg.appendChild(wasteDesc);

    const moneyEff = document.createElementNS(ns, 'text');
    moneyEff.setAttribute('x', 40);
    moneyEff.setAttribute('y', 345);
    moneyEff.setAttribute('font-size', '12');
    moneyEff.setAttribute('fill', '#666');
    moneyEff.textContent = '$147 million spent on evidence';
    svg.appendChild(moneyEff);

    const moneyWaste = document.createElementNS(ns, 'text');
    moneyWaste.setAttribute('x', 40);
    moneyWaste.setAttribute('y', 370);
    moneyWaste.setAttribute('font-size', '12');
    moneyWaste.setAttribute('fill', '#666');
    moneyWaste.textContent = '$258 million spent on innocent conversations';
    svg.appendChild(moneyWaste);
}

// ============================================
// VISUAL 4: ACCELERATION
// ============================================

function drawAccelerationVisual() {
    const svg = document.getElementById('acceleration-visual');
    if (!svg) return;

    const width = 1400;
    const height = 600;
    const margin = { top: 80, right: 100, bottom: 100, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    // Dark background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', var(--primary));
    svg.appendChild(bg);

    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];

    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 250000) * chartHeight;

    // Grid
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (i / 5) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(255,255,255,0.1)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Fill under curve
    let fillPath = `M ${xScale(0)} ${yScale(costs[0])}`;
    for (let i = 1; i < costs.length; i++) {
        fillPath += ` L ${xScale(i)} ${yScale(costs[i])}`;
    }
    fillPath += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;

    const fill = document.createElementNS(ns, 'path');
    fill.setAttribute('d', fillPath);
    fill.setAttribute('fill', '#ff6b6b');
    fill.setAttribute('opacity', '0.15');
    svg.appendChild(fill);

    // Draw line
    let pathData = `M ${xScale(0)} ${yScale(costs[0])}`;
    for (let i = 1; i < costs.length; i++) {
        pathData += ` L ${xScale(i)} ${yScale(costs[i])}`;
    }

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#ff6b6b');
    path.setAttribute('stroke-width', '5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);

    // Draw points with annotations
    for (let i = 0; i < costs.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScale(costs[i]));
        circle.setAttribute('r', '10');
        circle.setAttribute('fill', '#ff6b6b');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Year label
        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', xScale(i));
        yearLabel.setAttribute('y', margin.top + chartHeight + 50);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '18');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#fff');
        yearLabel.textContent = years[i];
        svg.appendChild(yearLabel);

        // Cost value
        const costLabel = document.createElementNS(ns, 'text');
        costLabel.setAttribute('x', xScale(i));
        costLabel.setAttribute('y', yScale(costs[i]) - 30);
        costLabel.setAttribute('text-anchor', 'middle');
        costLabel.setAttribute('font-size', '16');
        costLabel.setAttribute('font-weight', '800');
        costLabel.setAttribute('fill', '#ffb3b3');
        costLabel.textContent = `$${(costs[i] / 1000).toFixed(0)}K`;
        svg.appendChild(costLabel);

        // Change indicator
        if (i > 0) {
            const change = ((costs[i] - costs[i-1]) / costs[i-1]) * 100;
            const changeLabel = document.createElementNS(ns, 'text');
            changeLabel.setAttribute('x', xScale(i) + 50);
            changeLabel.setAttribute('y', (yScale(costs[i]) + yScale(costs[i-1])) / 2);
            changeLabel.setAttribute('font-size', '13');
            changeLabel.setAttribute('font-weight', '700');
            changeLabel.setAttribute('fill', '#ff9999');
            changeLabel.textContent = `+${change.toFixed(1)}%`;
            svg.appendChild(changeLabel);
        }
    }

    // Axes
    const yAxis = document.createElementNS(ns, 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', '#fff');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);

    const xAxis = document.createElementNS(ns, 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', '#fff');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 40);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#fff');
    title.textContent = 'The Cost Acceleration';
    svg.appendChild(title);
}

// ============================================
// VISUAL 5: ALTERNATIVES
// ============================================

function drawAlternativesVisual() {
    const svg = document.getElementById('alternatives-visual');
    if (!svg) return;

    const width = 1000;
    const height = 700;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    const items = [
        { label: '13,500 Police Officers', value: 13500, color: '#4a90e2' },
        { label: '40,500 Drug Treatment Programs', value: 40500, color: '#ff6b6b' },
        { label: '81,000 School Safety Officers', value: 81000, color: '#50c878' },
        { label: '202,500 Youth Intervention Positions', value: 202500, color: '#ffa500' }
    ];

    const maxValue = 202500;
    const barHeight = 50;
    const spacing = 150;
    let currentY = 80;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const barWidth = (item.value / maxValue) * 700;

        // Bar
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', 150);
        rect.setAttribute('y', currentY);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', item.color);
        rect.setAttribute('opacity', '0.8');
        rect.setAttribute('rx', '6');
        svg.appendChild(rect);

        // Number
        const numLabel = document.createElementNS(ns, 'text');
        numLabel.setAttribute('x', 140);
        numLabel.setAttribute('y', currentY + barHeight / 2 + 8);
        numLabel.setAttribute('text-anchor', 'end');
        numLabel.setAttribute('font-size', '16');
        numLabel.setAttribute('font-weight', '800');
        numLabel.setAttribute('fill', '#222');
        numLabel.textContent = item.value.toLocaleString();
        svg.appendChild(numLabel);

        // Label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', 160 + barWidth);
        label.setAttribute('y', currentY + barHeight / 2 + 8);
        label.setAttribute('font-size', '13');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#666');
        label.textContent = item.label;
        svg.appendChild(label);

        currentY += spacing;
    }
}

// ============================================
// VISUAL 6: GEOGRAPHY
// ============================================

function drawGeographyVisual() {
    const svg = document.getElementById('geography-visual');
    if (!svg) return;

    const width = 1000;
    const height = 500;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#f8f9fa');
    svg.appendChild(bg);

    // California
    drawStateBar(svg, ns, 50, 100, 'California', 366, '#ff6b6b', 0.35);

    // New York
    drawStateBar(svg, ns, 50, 180, 'New York', 138, '#ffa500', 0.15);

    // Nevada
    drawStateBar(svg, ns, 50, 260, 'Nevada', 93, '#4a90e2', 0.10);

    // Florida
    drawStateBar(svg, ns, 50, 340, 'Florida', 80, '#50c878', 0.08);

    // All Others
    drawStateBar(svg, ns, 50, 420, 'All Other States', 330, '#bbb', 0.32);
}

function drawStateBar(svg, ns, x, y, name, value, color, width) {
    const barWidth = width * 800;
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x + 200);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', 50);
    rect.setAttribute('fill', color);
    rect.setAttribute('opacity', '0.8');
    rect.setAttribute('rx', '4');
    svg.appendChild(rect);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', x + 180);
    label.setAttribute('y', y + 32);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('font-size', '13');
    label.setAttribute('font-weight', '700');
    label.setAttribute('fill', '#222');
    label.textContent = name;
    svg.appendChild(label);

    const number = document.createElementNS(ns, 'text');
    number.setAttribute('x', x + 210 + barWidth);
    number.setAttribute('y', y + 32);
    number.setAttribute('font-size', '13');
    number.setAttribute('font-weight', '700');
    number.setAttribute('fill', '#666');
    number.textContent = value + ' orders';
    svg.appendChild(number);
}

// ============================================
// VISUAL 7: RECKONING
// ============================================

function drawReckoningVisual() {
    const svg = document.getElementById('reckoning-visual');
    if (!svg) return;

    const width = 1400;
    const height = 600;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Dark background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', var(--primary));
    svg.appendChild(bg);

    const centerX = width / 2;
    const centerY = height / 2;

    // Three negative trends
    const metrics = [
        { label: 'Costs', value: '+29.5%', x: centerX - 300, color: '#ff6b6b' },
        { label: 'Effectiveness', value: '-12.4%', x: centerX, color: '#50c878' },
        { label: 'Cost per Result', value: '+41.4%', x: centerX + 300, color: '#ffa500' }
    ];

    for (const metric of metrics) {
        // Background box
        const box = document.createElementNS(ns, 'rect');
        box.setAttribute('x', metric.x - 100);
        box.setAttribute('y', centerY - 100);
        box.setAttribute('width', '200');
        box.setAttribute('height', '200');
        box.setAttribute('fill', 'rgba(255,255,255,0.05)');
        box.setAttribute('stroke', metric.color);
        box.setAttribute('stroke-width', '2');
        box.setAttribute('rx', '8');
        svg.appendChild(box);

        // Metric label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', metric.x);
        label.setAttribute('y', centerY - 50);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#fff');
        label.textContent = metric.label;
        svg.appendChild(label);

        // Value
        const value = document.createElementNS(ns, 'text');
        value.setAttribute('x', metric.x);
        value.setAttribute('y', centerY + 30);
        value.setAttribute('text-anchor', 'middle');
        value.setAttribute('font-size', '32');
        value.setAttribute('font-weight', '800');
        value.setAttribute('fill', metric.color);
        value.textContent = metric.value;
        svg.appendChild(value);

        // Arrow down
        const arrow = document.createElementNS(ns, 'text');
        arrow.setAttribute('x', metric.x);
        arrow.setAttribute('y', centerY + 80);
        arrow.setAttribute('text-anchor', 'middle');
        arrow.setAttribute('font-size', '40');
        arrow.setAttribute('fill', metric.color);
        arrow.setAttribute('opacity', '0.5');
        arrow.textContent = '↓';
        svg.appendChild(arrow);
    }

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', centerX);
    title.setAttribute('y', 50);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '22');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#fff');
    title.textContent = 'All Metrics Moving the Same Direction';
    svg.appendChild(title);
}

// ============================================
// ANIMATIONS
// ============================================

function animateOnScroll() {
    const elements = document.querySelectorAll('.narrative-section, .visual-section, h2, .stat-reveal, .timeline-item, .question-item, .big-question');

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
        element.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(element);
    });
}

window.addEventListener('load', animateOnScroll);
