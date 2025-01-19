from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

model = LogisticRegression()
model = joblib.load("./model.joblib")
columns = [
    "age",
    "anaemia",
    "creatinine_phosphokinase",
    "diabetes",
    "ejection_fraction",
    "high_blood_pressure",
    "platelets",
    "serum_creatinine",
    "serum_sodium",
    "sex",
    "smoking",
    "time",
]

CORS(app)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()  # استقبال البيانات بصيغة JSON
        data_array = pd.DataFrame([data], columns=columns)  # تحويل إلى DataFrame
        prediction = model.predict(data_array)  # التنبؤ باستخدام DataFrame
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
