// ============================================
// SCROLLYTELLING FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scrollytelling
    initScrollytelling();

    // Draw trend chart
    drawTrendChart();
});

// ============================================
// SCROLLYTELLING
// ============================================

function initScrollytelling() {
    const scrollSections = document.querySelectorAll('.scroll-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all sections
                scrollSections.forEach(section => {
                    section.classList.remove('active');
                });
                // Add active to current section
                entry.target.classList.add('active');

                // Update chart based on section
                const sectionIndex = entry.target.dataset.section;
                updateChart(parseInt(sectionIndex));
            }
        });
    }, {
        threshold: 0.5
    });

    scrollSections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// TREND CHART
// ============================================

function drawTrendChart() {
    const canvas = document.getElementById('trend-chart');
    if (!canvas) return;

    // Data
    const years = [2022, 2023, 2024];
    const orders = [2414, 2398, 2297];
    const costs = [180847, 203490, 234272];

    // Dimensions
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Scale functions
    const xScale = (i) => {
        return margin.left + (i / (years.length - 1)) * chartWidth;
    };

    const yScaleOrders = (val) => {
        const max = 2500;
        return margin.top + (1 - (val / max)) * chartHeight;
    };

    const yScaleCosts = (val) => {
        const max = 250000;
        return margin.top + (1 - (val / max)) * chartHeight;
    };

    // Clear SVG
    canvas.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';

    // Background
    const bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', 'white');
    canvas.appendChild(bg);

    // Draw grid
    drawGrid(canvas, ns, margin, chartWidth, chartHeight, years.length);

    // Draw axes
    drawAxes(canvas, ns, margin, chartWidth, chartHeight);

    // Draw line for orders
    const pathOrders = document.createElementNS(ns, 'path');
    let pathDataOrders = `M ${xScale(0)} ${yScaleOrders(orders[0])}`;
    for (let i = 1; i < orders.length; i++) {
        pathDataOrders += ` L ${xScale(i)} ${yScaleOrders(orders[i])}`;
    }
    pathOrders.setAttribute('d', pathDataOrders);
    pathOrders.setAttribute('stroke', '#50c878');
    pathOrders.setAttribute('stroke-width', '3');
    pathOrders.setAttribute('fill', 'none');
    canvas.appendChild(pathOrders);

    // Draw line for costs
    const pathCosts = document.createElementNS(ns, 'path');
    let pathDataCosts = `M ${xScale(0)} ${yScaleCosts(costs[0])}`;
    for (let i = 1; i < costs.length; i++) {
        pathDataCosts += ` L ${xScale(i)} ${yScaleCosts(costs[i])}`;
    }
    pathCosts.setAttribute('d', pathDataCosts);
    pathCosts.setAttribute('stroke', '#ff6b6b');
    pathCosts.setAttribute('stroke-width', '3');
    pathCosts.setAttribute('fill', 'none');
    canvas.appendChild(pathCosts);

    // Draw circles for orders
    for (let i = 0; i < orders.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScaleOrders(orders[i]));
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#50c878');
        canvas.appendChild(circle);
    }

    // Draw circles for costs
    for (let i = 0; i < costs.length; i++) {
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', xScale(i));
        circle.setAttribute('cy', yScaleCosts(costs[i]));
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#ff6b6b');
        canvas.appendChild(circle);
    }

    // Add labels
    addChartLabels(canvas, ns, margin, width, height, xScale, yScaleOrders, yScaleCosts, orders, costs, years);
}

function drawGrid(canvas, ns, margin, chartWidth, chartHeight, numYears) {
    // Vertical grid lines
    for (let i = 0; i < numYears; i++) {
        const x = margin.left + (i / (numYears - 1)) * chartWidth;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', margin.top);
        line.setAttribute('x2', x);
        line.setAttribute('y2', margin.top + chartHeight);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        canvas.appendChild(line);
    }

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = margin.top + (i / 4) * chartHeight;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        canvas.appendChild(line);
    }
}

function drawAxes(canvas, ns, margin, chartWidth, chartHeight) {
    // X-axis
    const xAxis = document.createElementNS(ns, 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    canvas.appendChild(xAxis);

    // Y-axis
    const yAxis = document.createElementNS(ns, 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    canvas.appendChild(yAxis);
}

function addChartLabels(canvas, ns, margin, width, height, xScale, yScaleOrders, yScaleCosts, orders, costs, years) {
    // Title
    const title = document.createElementNS(ns, 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 25);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#222');
    title.textContent = 'Orders (Green) vs Average Cost (Red): 2022-2024';
    canvas.appendChild(title);

    // X-axis labels
    years.forEach((year, i) => {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', xScale(i));
        label.setAttribute('y', margin.top + 480);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('fill', '#666');
        label.textContent = year;
        canvas.appendChild(label);
    });

    // Y-axis label (left)
    const yLabel1 = document.createElementNS(ns, 'text');
    yLabel1.setAttribute('x', 20);
    yLabel1.setAttribute('y', margin.top + 50);
    yLabel1.setAttribute('font-size', '12');
    yLabel1.setAttribute('fill', '#50c878');
    yLabel1.setAttribute('font-weight', 'bold');
    yLabel1.textContent = 'Orders (↓ declining)';
    canvas.appendChild(yLabel1);

    // Y-axis label (right)
    const yLabel2 = document.createElementNS(ns, 'text');
    yLabel2.setAttribute('x', width - 120);
    yLabel2.setAttribute('y', margin.top + 50);
    yLabel2.setAttribute('font-size', '12');
    yLabel2.setAttribute('fill', '#ff6b6b');
    yLabel2.setAttribute('font-weight', 'bold');
    yLabel2.textContent = 'Avg Cost (↑ increasing)';
    canvas.appendChild(yLabel2);
}

function updateChart(sectionIndex) {
    // This could highlight different parts of the chart
    // based on which scrolly section is active
    // For now, it's a placeholder for future enhancements
    const chart = document.getElementById('trend-chart');

    // Update opacity of chart elements based on section
    const circles = chart.querySelectorAll('circle');
    circles.forEach((circle, i) => {
        circle.style.opacity = '1';
    });

    // Highlight circles up to current section
    if (sectionIndex < 3) {
        circles.forEach((circle, i) => {
            const yearIndex = Math.floor(i / 2);
            circle.style.opacity = yearIndex <= sectionIndex ? '1' : '0.3';
        });
    }
}

// ============================================
// UTILITY: SMOOTH SCROLL INITIALIZATION
// ============================================

// Initialize any scroll-to-top links
const scrollToTopLinks = document.querySelectorAll('a[href^="#"]');
scrollToTopLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ============================================

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.chapter, .stat-item, .question-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Call after DOM is ready
window.addEventListener('load', animateOnScroll);
