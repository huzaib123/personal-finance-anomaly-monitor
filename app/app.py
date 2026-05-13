from flask import Flask, render_template, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Path to outputs folder
OUTPUTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'outputs')

@app.route('/')
def dashboard():
    """Render the main dashboard"""
    return render_template('dashboard.html')

@app.route('/api/burn-rate')
def get_burn_rate():
    """API endpoint: Monthly burn rate data"""
    df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'monthly_burn_rate.csv'))
    months = df.iloc[:, 0].tolist()      # first column
    amounts = df.iloc[:, 1].tolist()     # second column
    return jsonify({
        'months': months,
        'amounts': amounts
    })

@app.route('/api/categories')
def get_categories():
    """API endpoint: Category spending data"""
    df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'category_spending.csv'))
    top_10 = df.head(10)
    return jsonify({
        'categories': top_10['Category'].tolist(),
        'amounts': top_10['Amount'].tolist()
    })

@app.route('/api/anomalies')
def get_anomalies():
    """API endpoint: Anomaly detection data"""
    df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'anomaly_days.csv'))
    return jsonify({
        'dates': df['Date'].tolist(),
        'amounts': df['Daily_Spend'].tolist(),
        'total_anomalies': len(df)
    })

@app.route('/api/forecast')
def get_forecast():
    """API endpoint: 3-month forecast"""
    df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'forecast_next_3_months.csv'))
    months = df.iloc[:, 0].tolist()          # first column
    values = df.iloc[:, 1].tolist()          # second column
    return jsonify({
        'months': months,
        'forecasted_amounts': values
    })

@app.route('/api/metrics')
def get_metrics():
    """API endpoint: Key metrics for hero section"""
    burn_df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'monthly_burn_rate.csv'))
    avg_burn_rate = burn_df.iloc[:, 1].mean()        # second column
    
    anomaly_df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'anomaly_days.csv'))
    total_anomalies = len(anomaly_df)
    
    forecast_df = pd.read_csv(os.path.join(OUTPUTS_DIR, 'forecast_next_3_months.csv'))
    next_month_forecast = forecast_df.iloc[0, 1]     # first row, second column
    
    return jsonify({
        'avg_burn_rate': round(avg_burn_rate, 2),
        'total_anomalies': total_anomalies,
        'next_month_forecast': round(next_month_forecast, 2)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)