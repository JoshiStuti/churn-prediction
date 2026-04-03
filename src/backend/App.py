from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#  Load model and scaler
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

#  Use model's feature names
feature_columns = pickle.load(open("features.pkl", "rb"))

#  Your CSV URL (PUT YOUR LINK HERE)
CSV_URL = "https://huggingface.co/spaces/Wenny/Telco-Customer-Churn/resolve/main/WA_Fn-UseC_-Telco-Customer-Churn.csv"



# =========================
# ✅ HOME ROUTE
# =========================
@app.route('/')
def home():
    return "API is running"


# =========================
# ✅ PREDICT (Page1)
# =========================
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Convert input into required format
    input_data = {
        'tenure': float(data.get('tenure', 0)),
        'MonthlyCharges': float(data.get('MonthlyCharges', 0)),
        'TotalCharges': float(data.get('TotalCharges', 0)),

        'InternetService_Fiber optic': 1 if data.get('InternetService') == 'Fiber optic' else 0,
        'InternetService_DSL': 1 if data.get('InternetService') == 'DSL' else 0,

        'PaymentMethod_Electronic check': 1 if data.get('PaymentMethod') == 'Electronic check' else 0,
        'PaymentMethod_Credit card (automatic)': 1 if data.get('PaymentMethod') == 'Credit card (automatic)' else 0,

        'Contract_One year': 1 if data.get('Contract') == 'One year' else 0,
        'Contract_Two year': 1 if data.get('Contract') == 'Two year' else 0,

        'PaperlessBilling_Yes': 1 if data.get('PaperlessBilling') == 'Yes' else 0
    }

    input_df = pd.DataFrame([input_data])

    # 🔥 Match training features
    input_df = input_df.reindex(columns=feature_columns, fill_value=0)

    input_scaled = scaler.transform(input_df)
    prediction = model.predict(input_scaled)[0]

    result = "Churn" if prediction == 1 else "Stay"
    return jsonify({"prediction": result})


# =========================
# ✅ CUSTOMER DASHBOARD
# =========================
@app.route('/customer/<customer_id>', methods=['GET'])
def customer(customer_id):
    try:
        # Load dataset from URL
        df = pd.read_csv(CSV_URL)

        # Clean IDs
        df['customerID'] = df['customerID'].astype(str).str.strip()
        customer_id = customer_id.strip()

        # Find customer
        customer_row = df[df['customerID'] == customer_id]

        if customer_row.empty:
            return jsonify({"error": "Customer ID not found"}), 404

        cust_data = customer_row.iloc[0].to_dict()

        # 🔥 Create model input (same as training)
        cust_input = {
            'tenure': float(cust_data['tenure']),
            'MonthlyCharges': float(cust_data['MonthlyCharges']),
            'TotalCharges': float(cust_data['TotalCharges']),

            'InternetService_Fiber optic': 1 if cust_data['InternetService'] == 'Fiber optic' else 0,
            'InternetService_DSL': 1 if cust_data['InternetService'] == 'DSL' else 0,

            'PaymentMethod_Electronic check': 1 if cust_data['PaymentMethod'] == 'Electronic check' else 0,
            'PaymentMethod_Credit card (automatic)': 1 if cust_data['PaymentMethod'] == 'Credit card (automatic)' else 0,

            'Contract_One year': 1 if cust_data['Contract'] == 'One year' else 0,
            'Contract_Two year': 1 if cust_data['Contract'] == 'Two year' else 0,

            'PaperlessBilling_Yes': 1 if cust_data['PaperlessBilling'] == 'Yes' else 0
        }

        input_df = pd.DataFrame([cust_input])

        # 🔥 VERY IMPORTANT (fixes all feature errors)
        input_df = input_df.reindex(columns=feature_columns, fill_value=0)

        input_scaled = scaler.transform(input_df)
        pred = model.predict(input_scaled)[0]

        prediction = "Churn" if pred == 1 else "Stay"

        return jsonify({
            "customer": cust_data,
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# 🚀 RUN SERVER
# =========================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)