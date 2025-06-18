import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

# Зареди модела
model = joblib.load('nail_model.pkl')

# Примерен нов запис
sample = pd.DataFrame({
    'length': [30],
    'colors': [2],
    'decorations': [1],
    'technique': [1],
    'service_type': [1],
    'complexity': [3]
})

predicted_time = model.predict(sample)
print(f"Прогнозирано време: {predicted_time[0]:.2f} минути") 