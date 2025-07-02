from flask import Blueprint, request, jsonify
import pandas as pd
from app import model

predict_bp = Blueprint('predict', __name__, url_prefix='/api')

@predict_bp.route('/predict-time', methods=['POST'])
def predict_time():
    data = request.json
    features = ['length', 'colors', 'decorations', 'technique', 'service_type', 'complexity']
    sample = pd.DataFrame([{f: data.get(f, 0) for f in features}])
    predicted_time = model.predict(sample)[0]
    return jsonify({'predicted_time': round(float(predicted_time), 2)}) 