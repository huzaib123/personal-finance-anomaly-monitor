# Personal Finance Anomaly Monitor

A machine learning system for detecting anomalous spending patterns and forecasting burn rates across 7 years of personal bank transaction data.

## Overview

This project applies unsupervised machine learning to personal finance data to surface unusual transactions automatically and predict future monthly spending. It is built as a standalone analytics dashboard with no third-party finance APIs or subscriptions required.

**Dataset:** 6,567 transactions spanning January 2015 to December 2022
**Average Monthly Burn Rate:** £5,324
**Anomalies Flagged:** 83 transaction days
**Notable Outlier:** £84,281 spike on 2020-06-03

---

## How It Works

**1. ETL Pipeline**
Raw transaction data is extracted from Excel, cleaned, and aggregated into monthly burn rate figures using Pandas.

**2. Anomaly Detection — Isolation Forest**
An Isolation Forest model (scikit-learn) is trained on daily transaction amounts. It isolates anomalies by randomly partitioning the feature space; points that require fewer partitions to isolate are flagged as anomalous. No labels are required.

**3. Burn Rate Forecasting — Linear Regression**
Monthly spending totals are modelled with a Linear Regression fit. The model extrapolates the trend to produce 3-month forward projections.

**4. Dashboard**
Results are serialised and embedded directly into the frontend as static JSON, enabling deployment to GitHub Pages without a running server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.9 |
| Data Processing | Pandas, NumPy, OpenPyXL |
| Machine Learning | Scikit-learn (Isolation Forest, Linear Regression) |
| Backend | Flask |
| Frontend | HTML, CSS, JavaScript |
| Visualisation | Chart.js |
| Deployment | GitHub Pages (static), Render (API) |

---

## Project Structure

```
personal-finance-anomaly-monitor/
├── app/
│   ├── app.py               Flask API server
│   ├── static/
│   │   ├── css/style.css    Dashboard stylesheet
│   │   └── js/
│   │       ├── dashboard.js         Live API mode
│   │       └── dashboard-static.js  Static / GitHub Pages mode
│   └── templates/
├── data/                    Source transaction data (not committed)
├── outputs/                 Processed results
├── index.html               Entry point (static deployment)
├── requirements.txt
└── render.yaml
```

---

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python -m flask --app app/app.py run

# Open in browser
open http://localhost:5000
```

For the static version (no server required), open `index.html` directly in a browser.

---

## Results

| Metric | Value |
|---|---|
| Months analysed | 96 |
| Total transactions | 6,567 |
| Average monthly spend | £5,324 |
| Anomalies detected | 83 days |
| Largest anomaly | £84,281 (June 2020) |
| Next month forecast | £7,460 |

---

## License

MIT
