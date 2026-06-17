/* ============================================================
   PERSONAL FINANCE ANOMALY MONITOR — Dashboard JS
   ============================================================ */

// ── Chart.js Global Defaults ──
Chart.defaults.color = '#666666';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";
Chart.defaults.font.weight = 400;
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 18;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 17, 17, 0.97)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleFont = { weight: 600, size: 12 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 11, weight: 400 };
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 5;
Chart.defaults.animation = { duration: 1200, easing: 'easeOutQuart' };
Chart.defaults.elements.point.radius = 3;
Chart.defaults.elements.point.hoverRadius = 6;
Chart.defaults.elements.point.borderWidth = 2;
Chart.defaults.elements.line.borderWidth = 2;
Chart.defaults.elements.bar.borderRadius = 6;

// ── Colour palette ──
const COLORS = {
    blue:    '#6b9fff',
    red:     '#ff6b6b',
    green:   '#4ecb71',
    amber:   '#f0b429',
    grey:    '#888888',
    light:   '#cccccc',
};

const CATEGORY_COLORS = [
    '#6b9fff', '#8f9fff', '#a78bfa', '#c084fc',
    '#e879f9', '#f472b6', '#fb7185', '#fb923c',
    '#f0b429', '#4ecb71',
];

// ── Scale config ──
const scaleConfig = (money = true) => ({
    y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
            callback: v => money ? '£' + v.toLocaleString() : v,
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            padding: 8,
            color: '#555555',
        },
        border: { display: false }
    },
    x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, maxTicksLimit: 14, padding: 4, color: '#555555' },
        border: { display: false }
    }
});

// ── Utility: gradient factory ──
function createGradient(ctx, colorStart, colorEnd) {
    const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    g.addColorStop(0, colorStart);
    g.addColorStop(1, colorEnd);
    return g;
}

// ── Utility: animate counter ──
function animateValue(element, end, prefix = '', suffix = '', duration = 1000) {
    const startTime = performance.now();
    const isInt = Number.isInteger(end);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = end * eased;

        element.textContent = prefix + (isInt
            ? Math.round(current).toLocaleString()
            : current.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })) + suffix;

        if (progress < 1) requestAnimationFrame(update);
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
        const grad = createGradient(ctx, 'rgba(107,159,255,0.15)', 'rgba(107,159,255,0.01)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Monthly Burn Rate (£)',
                    data: data.amounts,
                    borderColor: COLORS.blue,
                    backgroundColor: grad,
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#111111',
                    pointBorderColor: COLORS.blue,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: true, position: 'top', align: 'end', labels: { color: '#666666' } },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        }
                    }
                },
                scales: scaleConfig()
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
        const barColors = CATEGORY_COLORS.map(c => c + 'cc');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.categories,
                datasets: [{
                    label: 'Spending by Category (£)',
                    data: data.amounts,
                    backgroundColor: barColors,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderSkipped: false,
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
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        }
                    }
                },
                scales: {
                    ...scaleConfig(),
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 }, maxRotation: 40, minRotation: 30, padding: 4, color: '#555555' },
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

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Anomaly Days (£)',
                    data: data.dates.map((date, i) => ({ x: date, y: data.amounts[i] })),
                    backgroundColor: COLORS.red + '99',
                    borderColor: COLORS.red,
                    borderWidth: 1.5,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointStyle: 'circle',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true, position: 'top', align: 'end', labels: { color: '#666666' } },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString()} on ${ctx.parsed.x}`
                        }
                    }
                },
                scales: {
                    ...scaleConfig(),
                    x: {
                        type: 'category',
                        grid: { display: false },
                        ticks: { font: { size: 11 }, maxRotation: 40, minRotation: 30, maxTicksLimit: 10, color: '#555555' },
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
        const grad = createGradient(ctx, 'rgba(78,203,113,0.12)', 'rgba(78,203,113,0.01)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: 'Forecasted Burn Rate (£)',
                    data: data.forecasted_amounts,
                    borderColor: COLORS.green,
                    backgroundColor: grad,
                    borderDash: [6, 4],
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#111111',
                    pointBorderColor: COLORS.green,
                    pointRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: true, position: 'top', align: 'end', labels: { color: '#666666' } },
                    tooltip: {
                        callbacks: {
                            label: ctx => `  £${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        }
                    }
                },
                scales: scaleConfig()
            }
        });
    } catch (error) {
        console.error('Error loading forecast chart:', error);
    }
}

// ── Boot ──
window.addEventListener('DOMContentLoaded', () => {
    loadMetrics();
    loadBurnRateChart();
    loadCategoriesChart();
    loadAnomaliesChart();
    loadForecastChart();
});