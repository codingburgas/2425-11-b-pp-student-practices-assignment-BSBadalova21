import pandas as pd
import joblib
from sklearn.metrics import mean_squared_error

# Зареждане на данни и модела
df = pd.read_csv("nail_time.csv")
model = joblib.load("nail_model.pkl")

# Данни
X = df[["length", "colors", "decorations", "technique", "service_type", "complexity"]]
y = df["time"]

# Прогноза и оценка
y_pred = model.predict(X)
mse = mean_squared_error(y, y_pred)

print(f"Средна квадратична грешка: {mse:.2f}") 