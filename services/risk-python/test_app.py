from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health():
    assert client.get('/health').status_code == 200

def test_risk_evaluate():
    response = client.post('/risk/evaluate', json={'amount': 1000, 'velocity_score': 0.1})
    assert response.status_code == 200
    assert response.json()['decision'] in ['approve', 'review']
