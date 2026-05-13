# Personal Finance Anomaly & Burn Rate Monitor

A Python-based financial analytics tool that analyzes 7 years of bank transaction data to automatically detect unusual spending patterns using machine learning and forecast future burn rates.

## 🎯 Problem Solved

Prevents bad financial decisions by:
- **Detecting anomalies** early (e.g., the £84K spike flagged on 2020-06-03)
- **Tracking burn rate trends** across 96 months
- **Forecasting future spending** to alert users before budget issues arise

## 🚀 Key Features

1. **ETL Pipeline** – Cleans and processes 6,567 transactions from Excel
2. **Burn Rate Analytics** – Calculates monthly spending (avg £5,324/month)
3. **Category Breakdown** – Identifies top spending categories (Investment, Mortgage, Bills)
4. **ML-Powered Anomaly Detection** – Uses Isolation Forest to flag 83 unusual spending days
5. **Forecasting** – Predicts next 3 months' spending using linear regression

## 📊 Tech Stack

- **Language:** Python 3.9
- **Libraries:** `pandas`, `scikit-learn`, `numpy`, `openpyxl`
- **ML Algorithm:** Isolation Forest (anomaly detection), Linear Regression (forecasting)

## 📁 Project Structure
