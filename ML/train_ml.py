import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer

# Зареждане на данните
df = pd.read_csv('nail_time.csv')

# Входни и изходни променливи
X = df[["length", "colors", "decorations", "technique", "service_type", "complexity"]]
y = df["time"]  # Забележи главна буква!

# Разделяне на train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Преобразуване и модел
preprocessor = ColumnTransformer([
    ("scale", StandardScaler(), ["length", "colors", "decorations", "technique", "service_type", "complexity"])
])

model = Pipeline([
    ("preprocessing", preprocessor),
    ("regressor", LinearRegression())
])

# Обучение
model.fit(X_train, y_train)

# Записване на модела
import joblib
joblib.dump(model, "nail_model.pkl")

print("Моделът е обучен и запазен като nail_model.pkl") 