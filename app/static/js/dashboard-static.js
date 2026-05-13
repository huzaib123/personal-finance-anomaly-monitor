/* Static Dashboard JS — data pre-embedded for GitHub Pages */

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

const COLORS = { indigo:'#818cf8', violet:'#a78bfa', purple:'#c084fc', cyan:'#22d3ee', emerald:'#34d399', rose:'#fb7185', amber:'#fbbf24', blue:'#60a5fa', pink:'#f472b6', orange:'#fb923c' };
const CATEGORY_COLORS = [COLORS.indigo, COLORS.violet, COLORS.cyan, COLORS.emerald, COLORS.rose, COLORS.amber, COLORS.blue, COLORS.pink, COLORS.orange, COLORS.purple];

// ── Embedded Data ──
const DATA = {
    burnRate: {
        months: ["2015-01","2015-02","2015-03","2015-04","2015-05","2015-06","2015-07","2015-08","2015-09","2015-10","2015-11","2015-12","2016-01","2016-02","2016-03","2016-04","2016-05","2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12"],
        amounts: [4417.28,2402.46,3283.41,288.13,155.74,68.36,2263.65,723.43,738.78,1696.08,1022.08,989.33,14506.93,1023.21,4491.49,3868.83,2292.96,2736.04,2528.43,2472.79,1883.24,2581.60,2251.22,863.00,11792.21,4631.05,6737.40,1898.93,1669.46,8026.38,1616.99,2470.78,1840.32,3044.59,899.27,1320.57,13789.57,6018.69,7327.03,1631.35,2070.10,1443.53,1205.18,4719.09,1178.07,5068.53,1780.82,1693.37,13348.73,10769.52,5078.91,9819.33,7816.56,12220.20,2431.48,4915.32,2012.54,3996.60,3191.13,1513.89,14471.67,17614.64,18153.25,3341.99,4995.75,85466.43,2683.15,3264.83,7068.51,7471.85,8148.39,5296.53,19540.95,6057.94,2352.63,7326.01,3765.21,5056.53,3733.23,4716.81,3761.36,3688.31,4835.67,5089.32,10479.27,2366.98,4535.72,6024.21,3333.75,3111.63,1847.18,177.85,256.18,198.77,324.62,85.84]
    },
    categories: {
        categories: ["Investment","Account transfer","Mortgage","Bills","Cash","Savings","Services","Amazon","Travel","Home Improvement"],
        amounts: [128614.88,84000.00,56392.70,43269.55,27661.98,26682.96,23916.31,21271.45,19164.29,18369.52]
    },
    anomalies: {
        dates: ["2020-06-03","2020-02-03","2020-01-07","2017-06-29","2019-02-25","2019-05-28","2020-03-13","2019-04-04","2019-06-20","2020-03-19","2018-08-21","2019-04-29","2021-01-06","2018-03-09","2022-04-01","2019-03-06","2019-06-13","2018-10-05","2020-03-08","2016-01-11"],
        amounts: [84281.17,11362.12,6488.37,5969.25,5523.23,5145.74,5141.99,5007.04,4080.33,4008.89,3539.15,3155.48,3020.26,3014.57,2984.06,2624.62,2600.00,2539.47,2323.16,2345.77],
        total: 83
    },
    forecast: {
        months: ["Next Month","Month +2","Month +3"],
        amounts: [7460.36,7504.39,7548.42]
    },
    metrics: { avg_burn_rate: 5325, total_anomalies: 83, next_month_forecast: 7460 }
};

function createGradient(ctx, c1, c2) { const g=ctx.createLinearGradient(0,0,0,ctx.canvas.height); g.addColorStop(0,c1); g.addColorStop(1,c2); return g; }

function animateValue(el, end, prefix='', suffix='', duration=1100) {
    const st=performance.now();
    const isInt=Number.isInteger(end);
    (function update(t){
        const p=Math.min((t-st)/duration,1), e=1-Math.pow(1-p,4), v=end*e;
        el.textContent=prefix+(isInt?Math.round(v).toLocaleString():v.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}))+suffix;
        if(p<1) requestAnimationFrame(update);
    })(st);
}

const scaleOpts = (money=true) => ({
    y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.03)',drawBorder:false},ticks:{callback:v=>money?'£'+v.toLocaleString():v,font:{family:"'JetBrains Mono',monospace",size:11},padding:8},border:{display:false}},
    x:{grid:{display:false},ticks:{font:{size:10},maxTicksLimit:16,padding:4},border:{display:false}}
});

window.addEventListener('DOMContentLoaded', () => {
    // Metrics
    animateValue(document.getElementById('avgBurnRate'), DATA.metrics.avg_burn_rate, '£');
    animateValue(document.getElementById('totalAnomalies'), DATA.metrics.total_anomalies);
    animateValue(document.getElementById('nextMonthForecast'), DATA.metrics.next_month_forecast, '£');

    // Burn Rate
    const ctx1=document.getElementById('burnRateChart').getContext('2d');
    new Chart(ctx1,{type:'line',data:{labels:DATA.burnRate.months,datasets:[{label:'Monthly Burn Rate (£)',data:DATA.burnRate.amounts,borderColor:COLORS.indigo,backgroundColor:createGradient(ctx1,'rgba(129,140,248,0.22)','rgba(129,140,248,0.01)'),tension:0.4,fill:true,pointBackgroundColor:'#06060b',pointBorderColor:COLORS.indigo}]},options:{responsive:true,maintainAspectRatio:true,interaction:{intersect:false,mode:'index'},plugins:{legend:{display:true,position:'top',align:'end'}},scales:scaleOpts()}});

    // Categories
    const ctx2=document.getElementById('categoriesChart').getContext('2d');
    const barG=CATEGORY_COLORS.map(c=>{const g=ctx2.createLinearGradient(0,0,0,ctx2.canvas.height);g.addColorStop(0,c+'ee');g.addColorStop(1,c+'44');return g;});
    new Chart(ctx2,{type:'bar',data:{labels:DATA.categories.categories,datasets:[{label:'Spending (£)',data:DATA.categories.amounts,backgroundColor:barG,borderColor:CATEGORY_COLORS.map(c=>c+'cc'),borderWidth:1,borderSkipped:false,borderRadius:{topLeft:10,topRight:10},hoverBackgroundColor:CATEGORY_COLORS}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{...scaleOpts(),x:{grid:{display:false},ticks:{font:{size:10},maxRotation:45,minRotation:30},border:{display:false}}}}});

    // Anomalies
    const ctx3=document.getElementById('anomaliesChart').getContext('2d');
    new Chart(ctx3,{type:'scatter',data:{datasets:[{label:'Anomaly Days (£)',data:DATA.anomalies.dates.map((d,i)=>({x:d,y:DATA.anomalies.amounts[i]})),backgroundColor:COLORS.rose+'bb',borderColor:COLORS.rose,borderWidth:2,pointRadius:6,pointHoverRadius:10,pointStyle:'triangle'}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:true,position:'top',align:'end'}},scales:{...scaleOpts(),x:{type:'category',grid:{display:false},ticks:{font:{size:10},maxRotation:45,minRotation:30,maxTicksLimit:12},border:{display:false}}}}});

    // Forecast
    const ctx4=document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx4,{type:'line',data:{labels:DATA.forecast.months,datasets:[{label:'Forecasted Burn Rate (£)',data:DATA.forecast.amounts,borderColor:COLORS.emerald,backgroundColor:createGradient(ctx4,'rgba(52,211,153,0.18)','rgba(52,211,153,0.01)'),borderDash:[8,4],tension:0.4,fill:true,pointBackgroundColor:'#06060b',pointBorderColor:COLORS.emerald,pointStyle:'rectRounded',pointRadius:5}]},options:{responsive:true,maintainAspectRatio:true,interaction:{intersect:false,mode:'index'},plugins:{legend:{display:true,position:'top',align:'end'}},scales:scaleOpts()}});

    // Scroll animations
    const obs=new IntersectionObserver(e=>e.forEach((en,i)=>{if(en.isIntersecting){setTimeout(()=>en.target.classList.add('visible'),i*120);obs.unobserve(en.target);}}),{threshold:0.08});
    document.querySelectorAll('.chart-card').forEach(c=>{c.style.opacity='0';c.style.transform='translateY(40px)';c.style.transition='opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1)';obs.observe(c);});
    const s=document.createElement('style');s.textContent='.chart-card.visible{opacity:1!important;transform:translateY(0)!important;}';document.head.appendChild(s);

    // Parallax orbs
    window.addEventListener('mousemove',e=>{const x=(e.clientX/window.innerWidth-0.5)*2,y=(e.clientY/window.innerHeight-0.5)*2;document.querySelectorAll('.orb').forEach((o,i)=>{o.style.transform=`translate(${x*(i+1)*8}px,${y*(i+1)*8}px)`;});});
});
