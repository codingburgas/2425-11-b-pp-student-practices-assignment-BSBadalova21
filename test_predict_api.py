import unittest
import json
from app import app

class PredictTimeAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.endpoint = '/api/predict-time'
        self.sample_data = {
            "length": 30,
            "colors": 2,
            "decorations": 1,
            "technique": 1,
            "service_type": 1,
            "complexity": 3
        }

    def test_predict_time_success(self):
        response = self.app.post(
            self.endpoint,
            data=json.dumps(self.sample_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('predicted_time', data)
        self.assertIsInstance(data['predicted_time'], float)

    def test_predict_time_missing_field(self):
        incomplete_data = self.sample_data.copy()
        del incomplete_data['length']
        response = self.app.post(
            self.endpoint,
            data=json.dumps(incomplete_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('predicted_time', data)

if __name__ == '__main__':
    unittest.main() 