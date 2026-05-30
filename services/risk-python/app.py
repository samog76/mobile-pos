from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="risk-python")

class RiskRequest(BaseModel):
    amount: float
    velocity_score: float = 0

@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'risk-python'}

@app.post('/risk/evaluate')
def evaluate(payload: RiskRequest):
    score = min(1.0, (payload.amount / 10000) + payload.velocity_score)
    decision = 'review' if score > 0.7 else 'approve'
    return {'score': score, 'decision': decision}
