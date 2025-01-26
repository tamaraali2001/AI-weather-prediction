import os
import pandas as pd

def load_weather_data():
    file_path = os.path.join(os.path.dirname(__file__), 'future_weather_predictions.csv')
    return pd.read_csv(file_path)
