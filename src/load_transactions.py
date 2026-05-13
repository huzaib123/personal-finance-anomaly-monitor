import pandas as pd
from sklearn.ensemble import IsolationForest

file_path = "/Users/huzaibwadoo/Desktop/personal-finance-anomaly-monitor/data/laramee26openBankTransactionData.xlsx"

df = pd.read_excel(file_path)
print(df.head())
print(df.columns)

# Keep only the columns we need
df_clean = df[['Transaction Date', 'Debit Amount', 'Credit Amount', 'Balance', 'Category']].copy()

# Check the cleaned data
print("\nCleaned data:")
print(df_clean.head())
print(df_clean.info())

# Convert date to datetime
df_clean['Transaction Date'] = pd.to_datetime(df_clean['Transaction Date'], format='%d/%m/%Y')

# Create a single 'Amount' column (negative for debit, positive for credit)
df_clean['Amount'] = df_clean['Credit Amount'].fillna(0) - df_clean['Debit Amount'].fillna(0)

# Check the result
print("\nWith unified Amount column:")
print(df_clean[['Transaction Date', 'Amount', 'Balance', 'Category']].head(10))

# Add a 'Month' column for grouping
df_clean['Month'] = df_clean['Transaction Date'].dt.to_period('M')

# Calculate total spending per month (only negative amounts = expenses)
monthly_spend = df_clean[df_clean['Amount'] < 0].groupby('Month')['Amount'].sum().abs()

print("\nMonthly spending (burn rate):")
print(monthly_spend.head(10))
print(f"\nAverage monthly burn rate: £{monthly_spend.mean():.2f}")

# Calculate total spending by category
category_spend = df_clean[df_clean['Amount'] < 0].groupby('Category')['Amount'].sum().abs().sort_values(ascending=False)

print("\nTop 10 spending categories:")
print(category_spend.head(10))

# Aggregate to daily spending totals
daily_spending = df_clean[df_clean['Amount'] < 0].groupby('Transaction Date')['Amount'].sum().abs()

# Convert to DataFrame for easier manipulation
daily_df = daily_spending.reset_index()
daily_df.columns = ['Date', 'Daily_Spend']

print("\nDaily spending data:")
print(daily_df.head(10))
print(f"\nTotal days with transactions: {len(daily_df)}")

# Prepare data for Isolation Forest (needs 2D array)
X = daily_df[['Daily_Spend']].values

# Train Isolation Forest
model = IsolationForest(contamination=0.05, random_state=42)
daily_df['Anomaly'] = model.fit_predict(X)
daily_df['Anomaly_Score'] = model.score_samples(X)

# -1 = anomaly, 1 = normal
daily_df['Is_Anomaly'] = daily_df['Anomaly'] == -1

print("\nAnomaly detection results:")
print(f"Total anomalies detected: {daily_df['Is_Anomaly'].sum()}")
print("\nTop 10 anomaly days (most unusual spending):")
print(daily_df.sort_values('Anomaly_Score').head(10)[['Date', 'Daily_Spend', 'Is_Anomaly']])
from sklearn.linear_model import LinearRegression
import numpy as np

# Prepare monthly data for forecasting
monthly_spend_df = monthly_spend.reset_index()
monthly_spend_df.columns = ['Month', 'Spend']
monthly_spend_df['Month_Num'] = range(len(monthly_spend_df))

# Train a simple linear regression model
X_train = monthly_spend_df[['Month_Num']].values
y_train = monthly_spend_df['Spend'].values

forecast_model = LinearRegression()
forecast_model.fit(X_train, y_train)

# Predict next 3 months
next_months = np.array([[len(monthly_spend_df)], 
                        [len(monthly_spend_df) + 1], 
                        [len(monthly_spend_df) + 2]])
predictions = forecast_model.predict(next_months)

print("\n" + "="*50)
print("BURN RATE FORECAST (Next 3 Months)")
print("="*50)
print(f"Next month (Month 1): £{predictions[0]:.2f}")
print(f"Month 2: £{predictions[1]:.2f}")
print(f"Month 3: £{predictions[2]:.2f}")
print(f"\nCurrent average: £{monthly_spend.mean():.2f}")
# Create an outputs folder if it doesn't exist
import os
output_dir = '../outputs'
os.makedirs(output_dir, exist_ok=True)

# Save anomaly results
anomaly_results = daily_df[daily_df['Is_Anomaly'] == True][['Date', 'Daily_Spend', 'Anomaly_Score']].sort_values('Anomaly_Score')
anomaly_results.to_csv(f'{output_dir}/anomaly_days.csv', index=False)

# Save monthly burn rate
monthly_spend_df.to_csv(f'{output_dir}/monthly_burn_rate.csv', index=False)

# Save category breakdown
category_spend.to_csv(f'{output_dir}/category_spending.csv')

# Save forecast results
forecast_df = pd.DataFrame({
    'Month': ['Next Month', 'Month +2', 'Month +3'],
    'Predicted_Spend': predictions
})
forecast_df.to_csv(f'{output_dir}/forecast_next_3_months.csv', index=False)

print("\n" + "="*50)
print("FILES SAVED SUCCESSFULLY")
print("="*50)
print(f"✓ anomaly_days.csv ({len(anomaly_results)} anomalies)")
print(f"✓ monthly_burn_rate.csv ({len(monthly_spend_df)} months)")
print(f"✓ category_spending.csv")
print(f"✓ forecast_next_3_months.csv")
print(f"\nAll files saved to: {output_dir}/")