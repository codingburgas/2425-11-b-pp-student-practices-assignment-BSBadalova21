import pandas as pd
import matplotlib.pyplot as plt
import random

# --- Custom Linear Regression ---
class LinearRegressionCustom:
    def __init__(self, lr=0.001, epochs=100):
        self.w = [random.random() for _ in range(6)]  # 6 features
        self.b = random.random()
        self.lr = lr
        self.epochs = epochs
        self.losses = []

    def predict(self, x):
        return sum([self.w[i] * x[i] for i in range(6)]) + self.b

    def fit(self, X, y):
        n = len(X)
        for epoch in range(self.epochs):
            dw = [0.0 for _ in range(6)]
            db = 0.0
            for i in range(n):
                y_pred = self.predict(X[i])
                error = y_pred - y[i]
                for j in range(6):
                    dw[j] += error * X[i][j]
                db += error
            for j in range(6):
                dw[j] = (2 / n) * dw[j]
            db = (2 / n) * db
            for j in range(6):
                self.w[j] -= self.lr * dw[j]
            self.b -= self.lr * db
            if epoch % 10 == 0 or epoch == self.epochs - 1:
                loss = self.loss(X, y)
                self.losses.append(loss)
                print(f"Epoch {epoch+1}/{self.epochs}, loss: {loss:.4f}")

    def loss(self, X, y):
        n = len(X)
        total_loss = 0
        for i in range(n):
            y_pred = self.predict(X[i])
            total_loss += (y_pred - y[i]) ** 2
        return total_loss / n

    def visualize(self, X, y):
        # Визуализира само по първата характеристика (length)
        plt.scatter([x[0] for x in X], y, label='Данни')
        x_sorted = sorted(X, key=lambda x: x[0])
        y_pred = [self.predict(x) for x in x_sorted]
        plt.plot([x[0] for x in x_sorted], y_pred, color="red", label='Линеен модел')
        plt.xlabel("length")
        plt.ylabel("time")
        plt.legend()
        plt.tight_layout()
        plt.show()

# --- Зареждане на данните ---
df = pd.read_csv('nail_time.csv')
X = df[["length", "colors", "decorations", "technique", "service_type", "complexity"]].values.tolist()
y = df["time"].values.tolist()

# --- Обучение с custom LinearRegression ---
custom_model = LinearRegressionCustom(lr=0.0001, epochs=100)
custom_model.fit(X, y)
custom_model.visualize(X, y) 