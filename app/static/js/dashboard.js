/* ============================================================
   PERSONAL FINANCE ANOMALY MONITOR — Dashboard JS
   Premium dark-theme Chart.js configuration
   ============================================================ */

// ── Chart.js Global Defaults ──
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.04)';
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6, 6, 11, 0.95)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 12;
Chart.defaults.plugins.tooltip.padding = 14;
Chart.defaults.plugins.tooltip.titleFont = { weight: 700, size: 13 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 6;
Chart.defaults.animation = { duration: 1400, easing: 'easeOutQuart' };
Chart.defaults.elements.point.radius = 3.5;
Chart.defaults.elements.point.hoverRadius = 7;
Chart.defaults.elements.point.borderWidth = 2;
Chart.defaults.elements.line.borderWidth = 2.5;
Chart.defaults.elements.bar.borderRadius = 10;

// ── Colour palette ──
const COLORS = {
    indigo: '#818cf8',
    violet: '#a78bfa',
    purple: '#c084fc',
    cyan: '#22d3ee',
    emerald: '#34d399',
    rose: '#fb7185',
    amber: '#fbbf24',
    blue: '#60a5fa',
    pink: '#f472b6',
    orange: '#fb923c',
};

const CATEGORY_COLORS = [
    COLORS.indigo, COLORS.violet, COLORS.cyan, COLORS.emerald,
    COLORS.rose, COLORS.amber, COLORS.blue, COLORS.pink,
    COLORS.orange, COLORS.purple,
];

// ── Utility: gradient factory ──
function createGradient(ctx, colorStart, colorEnd, vertical = true) {
    const gradient = vertical
        ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
        : ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// ── Utility: animate counter ──
function animateValue(element, end, prefix = '', suffix = '', duration = 1100) {
    const start = 0;
    const startTime = performance.now();
    const isInt = Number.isInteger(end);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quartic for smoother feel
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * eased;

        element.textContent = prefix + (isInt
            ? Math.round(current).toLocaleString()
            : current.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ── Fetch & Display Hero Metrics ──
async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics');
        const data = await response.json();

        animateValue(document.getElementById('avgBurnRate'), data.avg_burn_rate, '£');
        animateValue(document.getElementById('totalAnomalies'), data.total_anomalies);
        animateValue(document.getElementById('nextMonthForecast'), data.next_month_forecast, '£');
    } catch (error) {
        console.error('Error loading metrics:', error);
        document.getElementById('avgBurnRate').textContent = '—';
        document.getElementById('totalAnomalies').textContent = '—';
        document.getElementById('nextMonthForecast').textContent = '—';
    }
}

// ── Burn Rate Chart ──
async function loadBurnRateChart() {
    try {
        const response = await fetch('/api/burn-rate');
        const data = await response.json();

        const ctx = document.getElementById('burnRateChart').getContext('2d');
        const grad = createGradient(ctx, 'rgba(129, 140, 248, 0.22)', 'rgba(129, 140, 248, 0.01)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Monthly Burn Rate (£)',
                    data: data.amounts,
                    borderColor: COLORS.indigo,
                    backgroundColor: grad,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#06060b',
                    pointBorderColor: COLORS.indigo,
                    pointHoverBackgroundColor: COLORS.indigo,
                    pointHoverBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: true, position: 'top', align: 'end' },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2})}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: {
                            callback: v => '£' + v.toLocaleString(),
                            font: { family: "'JetBrains Mono', monospace", size: 11 },
                            padding: 8
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxTicksLimit: 16, padding: 4 },
                        border: { display: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading burn rate chart:', error);
    }
}

// ── Categories Chart ──
async function loadCategoriesChart() {
    try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        const ctx = document.getElementById('categoriesChart').getContext('2d');

        // Create individual gradients for each bar
        const barGradients = CATEGORY_COLORS.map(c => {
            const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            g.addColorStop(0, c + 'ee');
            g.addColorStop(1, c + '44');
            return g;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.categories,
                datasets: [{
                    label: 'Spending by Category (£)',
                    data: data.amounts,
                    backgroundColor: barGradients,
                    borderColor: CATEGORY_COLORS.map(c => c + 'cc'),
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: { topLeft: 10, topRight: 10 },
                    hoverBackgroundColor: CATEGORY_COLORS,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2})}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: {
                            callback: v => '£' + v.toLocaleString(),
                            font: { family: "'JetBrains Mono', monospace", size: 11 },
                            padding: 8
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 30, padding: 4 },
                        border: { display: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading categories chart:', error);
    }
}

// ── Anomalies Chart ──
async function loadAnomaliesChart() {
    try {
        const response = await fetch('/api/anomalies');
        const data = await response.json();

        const ctx = document.getElementById('anomaliesChart').getContext('2d');

        // Create glow effect for anomaly points
        const glowPlugin = {
            id: 'anomalyGlow',
            beforeDatasetsDraw(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.shadowColor = COLORS.rose;
                ctx.shadowBlur = 12;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            },
            afterDatasetsDraw(chart) {
                chart.ctx.restore();
            }
        };

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Anomaly Days (£)',
                    data: data.dates.map((date, i) => ({ x: date, y: data.amounts[i] })),
                    backgroundColor: COLORS.rose + 'bb',
                    borderColor: COLORS.rose,
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: COLORS.rose,
                    pointHoverBorderColor: '#fff',
                    pointStyle: 'triangle',
                }]
            },
            plugins: [glowPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true, position: 'top', align: 'end' },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString()} on ${ctx.parsed.x}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: {
                            callback: v => '£' + v.toLocaleString(),
                            font: { family: "'JetBrains Mono', monospace", size: 11 },
                            padding: 8
                        },
                        border: { display: false }
                    },
                    x: {
                        type: 'category',
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 30, maxTicksLimit: 20, padding: 4 },
                        border: { display: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading anomalies chart:', error);
    }
}

// ── Forecast Chart ──
async function loadForecastChart() {
    try {
        const response = await fetch('/api/forecast');
        const data = await response.json();

        const ctx = document.getElementById('forecastChart').getContext('2d');
        const grad = createGradient(ctx, 'rgba(52, 211, 153, 0.18)', 'rgba(52, 211, 153, 0.01)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Forecasted Burn Rate (£)',
                    data: data.forecasted_amounts,
                    borderColor: COLORS.emerald,
                    backgroundColor: grad,
                    borderDash: [8, 4],
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#06060b',
                    pointBorderColor: COLORS.emerald,
                    pointHoverBackgroundColor: COLORS.emerald,
                    pointHoverBorderColor: '#fff',
                    pointStyle: 'rectRounded',
                    pointRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: true, position: 'top', align: 'end' },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2})}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: {
                            callback: v => '£' + v.toLocaleString(),
                            font: { family: "'JetBrains Mono', monospace", size: 11 },
                            padding: 8
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 }, padding: 4 },
                        border: { display: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading forecast chart:', error);
    }
}

// ── Intersection Observer for scroll animations ──
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation based on index
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.chart-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(card);
    });
}

// Visible class
const style = document.createElement('style');
style.textContent = '.chart-card.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// ── Parallax effect on orbs ──
function setupParallax() {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        document.querySelectorAll('.orb').forEach((orb, i) => {
            const speed = (i + 1) * 8;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// ── Boot ──
window.addEventListener('DOMContentLoaded', () => {
    loadMetrics();
    loadBurnRateChart();
    loadCategoriesChart();
    loadAnomaliesChart();
    loadForecastChart();
    setupScrollAnimations();
    setupParallax();
});