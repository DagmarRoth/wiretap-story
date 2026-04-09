// ============================================
// SOPHISTICATED SVG CHART RENDERING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    drawDivergenceChart();
    drawCostBreakdown();
    drawCostTrajectory();
    drawEfficiencyCharts();
    drawWasteRatio();
    drawScaleComparison();
    drawTrendAnalysis();

    // Initialize scrollytelling
    initScrollytelling();

    // Add fade-in animations
    animateOnScroll();
});

// ============================================
// CHART 1: DIVERGENCE (Dual-Axis)
// ============================================

function drawDivergenceChart() {
    const svg = document.getElementById('divergence-chart');
    if (!svg) return;

    const width = 1000;
    const height = 600;
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ns = 'http://www.w3.org/2000/svg';

    // Data
    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];
    const incrimination = [12.9, 12.6, 11.3];
    const costPerIncrim = [1034453, 1137029, 1462010];

    // Clear SVG
    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    // Draw grid
    drawChartGrid(svg, ns, margin, chartWidth, chartHeight, 5);

    // Scale functions
    const xScale = (i) => margin.left + (i / (years.length - 1)) * chartWidth;
    const yScale1 = (val) => margin.top + chartHeight - (val / 250000) * chartHeight;
    const yScale2 = (val) => margin.top + chartHeight - (val / 15) * chartHeight;
    const yScale3 = (val) => margin.top + chartHeight - (val / 1500000) * chartHeight;

    // Draw axes
    drawDualAxes(svg, ns, margin, chartWidth, chartHeight);

    // Draw lines
    drawLine(svg, ns, years, costs, xScale, yScale1, '#ff6b6b', 'cost-line');
    drawLine(svg, ns, years, incrimination, xScale, yScale2, '#50c878', 'incrim-line');
    drawLine(svg, ns, years, costPerIncrim.map(x => x / 1000), xScale, y => yScale3(y * 1000), '#ffa500', 'cost-incrim-line');

    // Draw points
    drawPoints(svg, ns, years, costs, xScale, yScale1, '#ff6b6b');
    drawPoints(svg, ns, years, incrimination, xScale, yScale2, '#50c878');
    drawPoints(svg, ns, years, costPerIncrim.map(x => x / 1000), xScale, y => yScale3(y * 1000), '#ffa500');

    // Add labels
    addDivergenceLabels(svg, ns, width, margin, years);

    // Add value labels on points
    for (let i = 0; i < years.length; i++) {
        // Cost labels
        addValueLabel(svg, ns, xScale(i), yScale1(costs[i]) - 15, `$${(costs[i] / 1000).toFixed(0)}K`, '#ff6b6b');

        // Incrimination labels
        addValueLabel(svg, ns, xScale(i), yScale2(incrimination[i]) + 25, `${incrimination[i]}%`, '#50c878');
    }
}

function drawDualAxes(svg, ns, margin, chartWidth, chartHeight) {
    // Left Y-axis
    const yAxis1 = document.createElementNS(ns, 'line');
    yAxis1.setAttribute('x1', margin.left);
    yAxis1.setAttribute('y1', margin.top);
    yAxis1.setAttribute('x2', margin.left);
    yAxis1.setAttribute('y2', margin.top + chartHeight);
    yAxis1.setAttribute('stroke', '#ff6b6b');
    yAxis1.setAttribute('stroke-width', '2.5');
    svg.appendChild(yAxis1);

    // Right Y-axis
    const yAxis2 = document.createElementNS(ns, 'line');
    yAxis2.setAttribute('x1', margin.left + chartWidth);
    yAxis2.setAttribute('y1', margin.top);
    yAxis2.setAttribute('x2', margin.left + chartWidth);
    yAxis2.setAttribute('y2', margin.top + chartHeight);
    yAxis2.setAttribute('stroke', '#50c878');
    yAxis2.setAttribute('stroke-width', '2.5');
    svg.appendChild(yAxis2);

    // X-axis
    const xAxis = document.createElementNS(ns, 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
}

function drawLine(svg, ns, years, data, xScale, yScale, color, className) {
    let pathData = `M ${xScale(0)} ${yScale(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        pathData += ` L ${xScale(i)} ${yScale(data[i])}`;
    }

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '3.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.classList.add(className);
    svg.appendChild(path);
}

function drawPoints(svg, ns, years, data, xScale, yScale, color) {
    for (let i = 0; i < data.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScale(data[i]));
        circle.setAttribute('r', '7');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
    }
}

function drawChartGrid(svg, ns, margin, chartWidth, chartHeight, lines) {
    // Vertical grid
    for (let i = 0; i < 3; i++) {
        const x = margin.left + (i / 2) * chartWidth;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', margin.top);
        line.setAttribute('x2', x);
        line.setAttribute('y2', margin.top + chartHeight);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Horizontal grid
    for (let i = 0; i <= 4; i++) {
        const y = margin.top + (i / 4) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }
}

function addValueLabel(svg, ns, x, y, text, color) {
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '13');
    label.setAttribute('font-weight', '700');
    label.setAttribute('fill', color);
    label.textContent = text;
    svg.appendChild(label);
}

function addDivergenceLabels(svg, ns, width, margin, years) {
    const ns_text = 'http://www.w3.org/2000/svg';

    // Title
    const title = document.createElementNS(ns_text, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 35);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'The Divergence: Costs Up, Effectiveness Down';
    svg.appendChild(title);

    // Y-axis labels
    const yLabel1 = document.createElementNS(ns_text, 'text');
    yLabel1.setAttribute('x', 15);
    yLabel1.setAttribute('y', margin.top + 20);
    yLabel1.setAttribute('font-size', '12');
    yLabel1.setAttribute('font-weight', '700');
    yLabel1.setAttribute('fill', '#ff6b6b');
    yLabel1.textContent = 'Avg Cost';
    svg.appendChild(yLabel1);

    const yLabel2 = document.createElementNS(ns_text, 'text');
    yLabel2.setAttribute('x', width - 90);
    yLabel2.setAttribute('y', margin.top + 20);
    yLabel2.setAttribute('font-size', '12');
    yLabel2.setAttribute('font-weight', '700');
    yLabel2.setAttribute('fill', '#50c878');
    yLabel2.textContent = 'Incrimination %';
    svg.appendChild(yLabel2);

    // X-axis labels
    const xStart = margin.left;
    const xEnd = width - margin.right;
    const xSpacing = (xEnd - xStart) / 2;

    for (let i = 0; i < years.length; i++) {
        const x = xStart + (i / 2) * xSpacing;
        const label = document.createElementNS(ns_text, 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', width - 40);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('fill', '#666');
        label.setAttribute('font-weight', '600');
        label.textContent = years[i];
        svg.appendChild(label);
    }
}

// ============================================
// CHART 2: COST BREAKDOWN (Scrollytelling)
// ============================================

function drawCostBreakdown() {
    const svg = document.getElementById('cost-breakdown');
    if (!svg) return;

    const width = 800;
    const height = 700;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Total cost
    const totalCost = 405056288;
    const effectiveCost = 147056288; // 36.3%
    const wasteCost = 258000000;     // 63.7%

    // Draw pie-like visualization with segments
    drawCostSegments(svg, ns, width, height, totalCost, effectiveCost, wasteCost);
}

function drawCostSegments(svg, ns, width, height, total, effective, waste) {
    const centerX = width / 2;
    const centerY = height / 3;
    const radius = 120;

    // Effective segment (green)
    const effectiveAngle = (effective / total) * 360;
    drawSegment(svg, ns, centerX, centerY, radius, 0, effectiveAngle, '#50c878', 0.8);

    // Waste segment (red)
    drawSegment(svg, ns, centerX, centerY, radius, effectiveAngle, 360, '#ff6b6b', 0.8);

    // Draw labels below
    const labelY = centerY + radius + 60;

    // Effective label
    const effectiveLabel = document.createElementNS(ns, 'text');
    effectiveLabel.setAttribute('x', centerX - 120);
    effectiveLabel.setAttribute('y', labelY);
    effectiveLabel.setAttribute('text-anchor', 'middle');
    effectiveLabel.setAttribute('font-size', '14');
    effectiveLabel.setAttribute('font-weight', '700');
    effectiveLabel.setAttribute('fill', '#50c878');
    effectiveLabel.textContent = '36.3% = $147M';
    svg.appendChild(effectiveLabel);

    const effectiveDesc = document.createElementNS(ns, 'text');
    effectiveDesc.setAttribute('x', centerX - 120);
    effectiveDesc.setAttribute('y', labelY + 25);
    effectiveDesc.setAttribute('text-anchor', 'middle');
    effectiveDesc.setAttribute('font-size', '11');
    effectiveDesc.setAttribute('fill', '#666');
    effectiveDesc.textContent = 'Evidence-producing';
    svg.appendChild(effectiveDesc);

    // Waste label
    const wasteLabel = document.createElementNS(ns, 'text');
    wasteLabel.setAttribute('x', centerX + 120);
    wasteLabel.setAttribute('y', labelY);
    wasteLabel.setAttribute('text-anchor', 'middle');
    wasteLabel.setAttribute('font-size', '14');
    wasteLabel.setAttribute('font-weight', '700');
    wasteLabel.setAttribute('fill', '#ff6b6b');
    wasteLabel.textContent = '63.7% = $258M';
    svg.appendChild(wasteLabel);

    const wasteDesc = document.createElementNS(ns, 'text');
    wasteDesc.setAttribute('x', centerX + 120);
    wasteDesc.setAttribute('y', labelY + 25);
    wasteDesc.setAttribute('text-anchor', 'middle');
    wasteDesc.setAttribute('font-size', '11');
    wasteDesc.setAttribute('fill', '#666');
    wasteDesc.textContent = 'Non-incriminating';
    svg.appendChild(wasteDesc);

    // Total label
    const totalLabel = document.createElementNS(ns, 'text');
    totalLabel.setAttribute('x', centerX);
    totalLabel.setAttribute('y', height - 100);
    totalLabel.setAttribute('text-anchor', 'middle');
    totalLabel.setAttribute('font-size', '18');
    totalLabel.setAttribute('font-weight', '800');
    totalLabel.setAttribute('fill', '#1a1a2e');
    totalLabel.textContent = 'Total: $405M';
    svg.appendChild(totalLabel);
}

function drawSegment(svg, ns, centerX, centerY, radius, startAngle, endAngle, color, opacity) {
    const start = (startAngle - 90) * Math.PI / 180;
    const end = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);

    const largeArc = (endAngle - startAngle > 180) ? 1 : 0;

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', color);
    path.setAttribute('opacity', opacity);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
}

// ============================================
// CHART 3: COST TRAJECTORY
// ============================================

function drawCostTrajectory() {
    const svg = document.getElementById('cost-trajectory');
    if (!svg) return;

    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 60, bottom: 80, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    // Data
    const years = [2022, 2023, 2024];
    const costs = [180847, 203490, 234272];

    // Scales
    const xScale = (i) => margin.left + (i / 2) * chartWidth;
    const yScale = (val) => margin.top + chartHeight - (val / 250000) * chartHeight;

    // Draw grid
    for (let i = 0; i <= 4; i++) {
        const y = margin.top + (i / 4) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Draw axes
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

    // Draw line
    let pathData = `M ${xScale(0)} ${yScale(costs[0])}`;
    for (let i = 1; i < costs.length; i++) {
        pathData += ` L ${xScale(i)} ${yScale(costs[i])}`;
    }

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#ff6b6b');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);

    // Fill under curve
    pathData += ` L ${xScale(2)} ${margin.top + chartHeight} L ${xScale(0)} ${margin.top + chartHeight} Z`;
    const fill = document.createElementNS(ns, 'path');
    fill.setAttribute('d', pathData);
    fill.setAttribute('fill', '#ff6b6b');
    fill.setAttribute('opacity', '0.1');
    svg.appendChild(fill);

    // Draw points
    for (let i = 0; i < costs.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScale(costs[i]));
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', '#ff6b6b');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Value label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', yScale(costs[i]) - 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '700');
        label.setAttribute('fill', '#ff6b6b');
        label.textContent = `$${(costs[i] / 1000).toFixed(0)}K`;
        svg.appendChild(label);

        // Year label
        const yearLabel = document.createElementNS(ns, 'text');
        yearLabel.setAttribute('x', xScale(i));
        yearLabel.setAttribute('y', margin.top + chartHeight + 35);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('font-size', '14');
        yearLabel.setAttribute('font-weight', '700');
        yearLabel.setAttribute('fill', '#666');
        yearLabel.textContent = years[i];
        svg.appendChild(yearLabel);
    }

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'Average Cost Per Wiretap Order';
    svg.appendChild(title);
}

// ============================================
// CHART 4: EFFICIENCY METRICS
// ============================================

function drawEfficiencyCharts() {
    drawEfficiencyChart1();
    drawEfficiencyChart2();
    drawEfficiencyChart3();
}

function drawEfficiencyChart1() {
    const svg = document.getElementById('efficiency-1');
    if (!svg) return;

    const width = 300;
    const height = 250;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const data = [133740, 143008, 165372];
    const years = ['2022', '2023', '2024'];

    drawVerticalBarChart(svg, ns, width, height, data, years, '#ff6b6b', 'Cost per Intercept');
}

function drawEfficiencyChart2() {
    const svg = document.getElementById('efficiency-2');
    if (!svg) return;

    const width = 300;
    const height = 250;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const data = [305, 317, 277];
    const years = ['2022', '2023', '2024'];

    drawVerticalBarChart(svg, ns, width, height, data, years, '#50c878', 'Incriminating Intercepts');
}

function drawEfficiencyChart3() {
    const svg = document.getElementById('efficiency-3');
    if (!svg) return;

    const width = 300;
    const height = 250;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    const data = [1034453, 1137029, 1462010];
    const years = ['2022', '2023', '2024'];

    drawVerticalBarChart(svg, ns, width, height, data, years, '#ff6b6b', 'Cost per Result');
}

function drawVerticalBarChart(svg, ns, width, height, data, years, color, title) {
    const margin = { top: 20, right: 15, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#f8f9fa');
    bg.setAttribute('rx', '8');
    svg.appendChild(bg);

    const max = Math.max(...data);
    const barWidth = chartWidth / (data.length * 1.5);

    for (let i = 0; i < data.length; i++) {
        const x = margin.left + (i * chartWidth) / data.length + (chartWidth / (data.length * 2)) - barWidth / 2;
        const barHeight = (data[i] / max) * chartHeight;
        const y = margin.top + chartHeight - barHeight;

        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', color);
        rect.setAttribute('opacity', '0.8');
        rect.setAttribute('rx', '4');
        svg.appendChild(rect);

        // Year label
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', x + barWidth / 2);
        label.setAttribute('y', height - 10);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#666');
        label.textContent = years[i];
        svg.appendChild(label);
    }

    // Y-axis line
    const yAxis = document.createElementNS(ns, 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', '#ddd');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
}

// ============================================
// CHART 5: WASTE RATIO
// ============================================

function drawWasteRatio() {
    const svg = document.getElementById('waste-ratio');
    if (!svg) return;

    const width = 900;
    const height = 350;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    // Effective (11.3%)
    const effectiveWidth = (width - 40) * 0.113;
    const effectiveRect = document.createElementNS(ns, 'rect');
    effectiveRect.setAttribute('x', 20);
    effectiveRect.setAttribute('y', 50);
    effectiveRect.setAttribute('width', effectiveWidth);
    effectiveRect.setAttribute('height', 150);
    effectiveRect.setAttribute('fill', '#50c878');
    effectiveRect.setAttribute('rx', '4');
    svg.appendChild(effectiveRect);

    // Waste (88.7%)
    const wasteWidth = (width - 40) * 0.887;
    const wasteRect = document.createElementNS(ns, 'rect');
    wasteRect.setAttribute('x', 20 + effectiveWidth);
    wasteRect.setAttribute('y', 50);
    wasteRect.setAttribute('width', wasteWidth);
    wasteRect.setAttribute('height', 150);
    wasteRect.setAttribute('fill', '#ff6b6b');
    wasteRect.setAttribute('rx', '4');
    svg.appendChild(wasteRect);

    // Labels
    const effectiveLabel = document.createElementNS(ns, 'text');
    effectiveLabel.setAttribute('x', 20 + effectiveWidth / 2);
    effectiveLabel.setAttribute('y', 140);
    effectiveLabel.setAttribute('text-anchor', 'middle');
    effectiveLabel.setAttribute('font-size', '16');
    effectiveLabel.setAttribute('font-weight', '700');
    effectiveLabel.setAttribute('fill', '#fff');
    effectiveLabel.textContent = '11.3%';
    svg.appendChild(effectiveLabel);

    const wasteLabel = document.createElementNS(ns, 'text');
    wasteLabel.setAttribute('x', 20 + effectiveWidth + wasteWidth / 2);
    wasteLabel.setAttribute('y', 140);
    wasteLabel.setAttribute('text-anchor', 'middle');
    wasteLabel.setAttribute('font-size', '16');
    wasteLabel.setAttribute('font-weight', '700');
    wasteLabel.setAttribute('fill', '#fff');
    wasteLabel.textContent = '88.7%';
    svg.appendChild(wasteLabel);

    // Legend
    const legend1 = document.createElementNS(ns, 'text');
    legend1.setAttribute('x', 20);
    legend1.setAttribute('y', 250);
    legend1.setAttribute('font-size', '14');
    legend1.setAttribute('font-weight', '700');
    legend1.setAttribute('fill', '#50c878');
    legend1.textContent = '277 incriminating intercepts';
    svg.appendChild(legend1);

    const legend2 = document.createElementNS(ns, 'text');
    legend2.setAttribute('x', 20);
    legend2.setAttribute('y', 280);
    legend2.setAttribute('font-size', '14');
    legend2.setAttribute('font-weight', '700');
    legend2.setAttribute('fill', '#ff6b6b');
    legend2.textContent = '2,171 non-incriminating intercepts';
    svg.appendChild(legend2);

    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', 20);
    title.setAttribute('y', 30);
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'Of 2,448 Total Intercepts in 2024';
    svg.appendChild(title);

    const subtitle = document.createElementNS(ns, 'text');
    subtitle.setAttribute('x', 20);
    subtitle.setAttribute('y', 320);
    subtitle.setAttribute('font-size', '12');
    subtitle.setAttribute('fill', '#666');
    subtitle.textContent = 'Total: 2,448 intercepts | Effective: $147.0M | Wasted: $258.1M';
    svg.appendChild(subtitle);
}

// ============================================
// CHART 6: SCALE COMPARISON
// ============================================

function drawScaleComparison() {
    const svg = document.getElementById('scale-comparison');
    if (!svg) return;

    const width = 1000;
    const height = 600;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 40);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = '$405 Million Could Fund Instead:';
    svg.appendChild(title);

    // Data
    const items = [
        { label: '13,500 Police Officers', value: 13500, color: '#4a90e2' },
        { label: '40,500 Drug Treatment Programs', value: 40500, color: '#ff6b6b' },
        { label: '81,000 School Safety Officers', value: 81000, color: '#50c878' },
        { label: '202,500 Youth Intervention Positions', value: 202500, color: '#ffa500' }
    ];

    const maxValue = items[items.length - 1].value;
    const barHeight = 40;
    const spacing = 100;
    let currentY = 100;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const barWidth = (item.value / maxValue) * (width - 300);

        // Bar
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', 150);
        rect.setAttribute('y', currentY);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', item.color);
        rect.setAttribute('opacity', '0.8');
        rect.setAttribute('rx', '4');
        svg.appendChild(rect);

        // Number label
        const numLabel = document.createElementNS(ns, 'text');
        numLabel.setAttribute('x', 140);
        numLabel.setAttribute('y', currentY + barHeight / 2 + 5);
        numLabel.setAttribute('text-anchor', 'end');
        numLabel.setAttribute('font-size', '13');
        numLabel.setAttribute('font-weight', '700');
        numLabel.setAttribute('fill', '#222');
        numLabel.textContent = item.value.toLocaleString();
        svg.appendChild(numLabel);

        // Text label
        const textLabel = document.createElementNS(ns, 'text');
        textLabel.setAttribute('x', 160 + barWidth);
        textLabel.setAttribute('y', currentY + barHeight / 2 + 5);
        textLabel.setAttribute('font-size', '12');
        textLabel.setAttribute('font-weight', '600');
        textLabel.setAttribute('fill', '#666');
        textLabel.textContent = item.label;
        svg.appendChild(textLabel);

        currentY += spacing;
    }
}

// ============================================
// CHART 7: TREND ANALYSIS
// ============================================

function drawTrendAnalysis() {
    const svg = document.getElementById('trend-analysis');
    if (!svg) return;

    const width = 1000;
    const height = 500;
    const ns = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', '#fff');
    svg.appendChild(bg);

    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 35);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', '700');
    title.setAttribute('fill', '#222');
    title.textContent = 'All Key Metrics Trending Downward (2022-2024)';
    svg.appendChild(title);

    // Data points
    const metrics = [
        { name: 'Avg Cost/Order', values: [180847, 203490, 234272], color: '#ff6b6b', y: 100 },
        { name: 'Incrimination Rate', values: [12.9, 12.6, 11.3], color: '#50c878', y: 200, scale: 100 },
        { name: 'Cost/Incriminating', values: [1034453, 1137029, 1462010], color: '#ffa500', y: 300, scale: 100000 }
    ];

    const years = ['2022', '2023', '2024'];
    const spacing = (width - 200) / 2;

    for (const metric of metrics) {
        // Draw downward arrows
        for (let i = 0; i < metric.values.length; i++) {
            const x = 100 + i * spacing;

            // Downward trend indicator
            if (i > 0) {
                const arrow = document.createElementNS(ns, 'text');
                arrow.setAttribute('x', x + 20);
                arrow.setAttribute('y', metric.y - 10);
                arrow.setAttribute('font-size', '20');
                arrow.setAttribute('fill', '#ff6b6b');
                arrow.textContent = '↓';
                svg.appendChild(arrow);
            }

            // Circle
            const circle = document.createElementNS(ns, 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', metric.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', metric.color);
            svg.appendChild(circle);

            // Value label
            const label = document.createElementNS(ns, 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', metric.y + 25);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '12');
            label.setAttribute('font-weight', '700');
            label.setAttribute('fill', '#222');

            let displayValue;
            if (metric.scale === 100) {
                displayValue = metric.values[i].toFixed(1) + '%';
            } else if (metric.scale === 100000) {
                displayValue = '$' + (metric.values[i] / 1000000).toFixed(1) + 'M';
            } else {
                displayValue = '$' + (metric.values[i] / 1000).toFixed(0) + 'K';
            }

            label.textContent = displayValue;
            svg.appendChild(label);

            // Year label
            const yearLabel = document.createElementNS(ns, 'text');
            yearLabel.setAttribute('x', x);
            yearLabel.setAttribute('y', metric.y + 50);
            yearLabel.setAttribute('text-anchor', 'middle');
            yearLabel.setAttribute('font-size', '11');
            yearLabel.setAttribute('fill', '#999');
            yearLabel.textContent = years[i];
            svg.appendChild(yearLabel);
        }

        // Metric name
        const nameLabel = document.createElementNS(ns, 'text');
        nameLabel.setAttribute('x', 30);
        nameLabel.setAttribute('y', metric.y + 5);
        nameLabel.setAttribute('font-size', '12');
        nameLabel.setAttribute('font-weight', '700');
        nameLabel.setAttribute('fill', metric.color);
        nameLabel.textContent = metric.name;
        svg.appendChild(nameLabel);

        // Line connecting points
        const line1X = 100;
        const line2X = 100 + spacing;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', line1X);
        line.setAttribute('y1', metric.y);
        line.setAttribute('x2', line2X);
        line.setAttribute('y2', metric.y);
        line.setAttribute('stroke', metric.color);
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('opacity', '0.3');
        line.setAttribute('stroke-dasharray', '3,3');
        svg.appendChild(line);
    }
}

// ============================================
// SCROLLYTELLING
// ============================================

function initScrollytelling() {
    const scrollSections = document.querySelectorAll('.scroll-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollSections.forEach(section => {
                    section.classList.remove('active');
                });
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.6 });

    scrollSections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// ANIMATIONS
// ============================================

function animateOnScroll() {
    const elements = document.querySelectorAll('.chapter, .stat-item, .question-card, .insight-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

window.addEventListener('load', animateOnScroll);
