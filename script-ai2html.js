// ============================================
// WIRETAP WASTE — SCROLLY AI2HTML
// Scrollama interactions + IntersectionObserver fade-in
// ============================================

// Global state
const scroller = scrollama();
const drawn = new Set();

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initScrollObserver();
    initScrollama();
    initStepObserver();
    revealDecryptText();
    injectSunburstStyling();
});

// ============================================
// STEP OBSERVER: Trigger chart updates
// ============================================

function initStepObserver() {
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target;
                const stepNum = step.getAttribute('data-step');
                const section = step.closest('[id^="scrolly-"]');
                if (section && stepNum) {
                    const chartName = section.id.replace('scrolly-', '');
                    console.log(`Step observer triggered: ${chartName}, step ${stepNum}`);
                    handleChartStep(chartName, parseInt(stepNum));
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all step elements
    document.querySelectorAll('.step[data-step]').forEach(step => {
        stepObserver.observe(step);
    });
}

// ============================================
// INTERSECTION OBSERVER: Fade-in on scroll
// ============================================

function initScrollObserver() {
    const options = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);

    // Observe all section blocks
    document.querySelectorAll('.section-block').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SCROLLAMA: Step-based chart interactions
// ============================================

function initScrollama() {
    // Setup for divergence chart
    scroller
        .setup({
            step: '#scrolly-divergence .step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            handleChartStep('divergence', response.index + 1);
        })
        .onStepExit(response => {
            // Optional: fade out step
        });

    // Setup for radial chart
    scroller
        .setup({
            step: '#scrolly-radial .step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            handleChartStep('radial', response.index + 1);
        });

    // Setup for sunburst chart
    scroller
        .setup({
            step: '#scrolly-sunburst .step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            handleChartStep('sunburst', response.index + 1);
        });

    // Handle resize
    window.addEventListener('resize', () => {
        scroller.resize();
    });
}

// ============================================
// CHART INTERACTIONS
// ============================================

function handleChartStep(chartName, step) {
    console.log(`%c Chart: ${chartName}, Step: ${step}`, 'color: #00ff41; font-weight: bold');

    switch(chartName) {
        case 'radial':
            updateRadialChart(step);
            break;
        case 'sunburst':
            updateSunburstChart(step);
            break;
    }

    // Highlight step text
    const stepEl = document.querySelector(
        `#scrolly-${chartName} .step[data-step="${step}"]`
    );
    if (stepEl) {
        document.querySelectorAll(`#scrolly-${chartName} .step`).forEach(el => {
            el.style.opacity = '0.4';
        });
        stepEl.style.opacity = '1';
    }
}

function updateRadialChart(step) {
    // Update radial chart based on step
    // Step 1: Highlight geographic concentration
    // Step 2: Highlight California dominance
    // Step 3: Highlight federal/state redundancy
    const imgs = document.querySelectorAll('[id^="g-Radial-"][id$="-img"]');
    imgs.forEach(img => {
        img.style.opacity = '1';
        img.style.filter = step === 2 ? 'brightness(1.1)' : 'brightness(1)';
    });
}

function updateSunburstChart(step) {
    // Update sunburst chart based on step
    // Step 1: Highlight personal calls
    // Step 2: Highlight technical failures
    // Step 3: Highlight remaining categories
    const imgs = document.querySelectorAll('[id^="g-Sunburst-"][id$="-img"]');
    imgs.forEach(img => {
        img.style.opacity = '1';
        img.style.filter = step === 1 ? 'saturate(1.2)' : 'saturate(1)';
    });
}

// ============================================
// DECRYPT TEXT REVEAL
// ============================================

function revealDecryptText() {
    const decryptTexts = document.querySelectorAll('.decrypt-text');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    decryptTexts.forEach(el => {
        revealObserver.observe(el);
    });
}

// ============================================
// UTILITY: Lazy load ai2html images
// ============================================

function lazyLoadImages() {
    const images = document.querySelectorAll('.g-aiImg');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// CHART DATA (for reference/future enhancements)
// ============================================

const chartData = {
    divergence: {
        years: [2022, 2023, 2024],
        costPerOrder: [180.847, 203.490, 234.272],
        incriminationRate: [12.9, 12.6, 11.3]
    },
    composition: {
        evidenceProduced: 45.8,
        documentedWaste: 258,
        noEvidence: 101.2,
        total: 405
    },
    sunburst: {
        inner: [
            { name: 'Evidence Produced', value: 45.8, percent: 11.3 },
            { name: 'Documented Waste', value: 258, percent: 63.7 },
            { name: 'No Evidence Found', value: 101.2, percent: 25.0 }
        ],
        wasteBreakdown: [
            { category: 'Personal calls', percent: 35, amount: 90.3 },
            { category: 'Business/financial', percent: 22, amount: 56.8 },
            { category: 'Encrypted/unreadable', percent: 18, amount: 46.4 },
            { category: 'Incomplete/tech fail', percent: 11, amount: 28.4 },
            { category: 'Foreign lang', percent: 8, amount: 20.6 },
            { category: 'Duplicate coverage', percent: 6, amount: 15.5 }
        ]
    }
};

// ============================================
// SUNBURST STYLING: Inject dark background
// ============================================

function injectSunburstStyling() {
    const iframes = document.querySelectorAll('#scrolly-sunburst iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const style = iframeDoc.createElement('style');
                style.textContent = `
                    body, html { background: #050a14 !important; }
                    #g-Sunburst-box { background: #050a14 !important; }
                    .g-aiImg { background: #050a14 !important; }
                `;
                iframeDoc.head.appendChild(style);
            } catch (e) {
                console.log('Could not inject Sunburst styling (cross-origin or timing issue)');
            }
        });
    });
}

// Log initialization
console.log('Wiretap Waste — Scrolly AI2HTML');
console.log('Scrollama + IntersectionObserver initialized');
console.log('Chart data loaded:', chartData);
