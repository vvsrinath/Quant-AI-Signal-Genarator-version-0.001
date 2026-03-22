import sys
import os

# Ensure backend imports work if executed from inside backend dir
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import List, Dict, Any

from auth_engine import get_current_user, Token, create_access_token, verify_password, get_password_hash, fake_users_db
from data_engine import fetch_klines
from feature_engine import apply_features
from signal_engine import generate_signals, multi_timeframe_confirmation
from risk_engine import calculate_risk
from backtest_engine import run_backtest

app = FastAPI(title="Quantum Signal Backend API v1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginData(BaseModel):
    username: str
    password: str

# Endpoints
@app.post("/login", response_model=Token)
async def login(data: LoginData):
    user = fake_users_db.get(data.username)
    if not user or not verify_password(data.password, user['hashed_password']):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    acc_token = create_access_token(data={"sub": user['username']})
    return {"access_token": acc_token, "token_type": "bearer"}

@app.post("/register")
async def register(data: LoginData):
    if data.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    fake_users_db[data.username] = {
        "username": data.username,
        "hashed_password": get_password_hash(data.password)
    }
    return {"message": "User created successfully"}

@app.get("/signals")
async def get_signals(symbol: str = "BTCUSDT", timeframe: str = "1m"): # current_user = Depends(get_current_user)
    try:
        # 1. Fetch
        df_1m = fetch_klines(symbol, '1m')
        df_5m = fetch_klines(symbol, '5m')
        df_15m = fetch_klines(symbol, '15m')
        
        # 2. Features
        df_1m = apply_features(df_1m)
        df_5m = apply_features(df_5m)
        df_15m = apply_features(df_15m)
        
        # 3. Signals
        df_1m = generate_signals(df_1m)
        df_5m = generate_signals(df_5m)
        df_15m = generate_signals(df_15m)
        
        # 4. Multi-Timeframe Confirmation
        sig_1m = df_1m['Signal'].tolist()
        sig_5m = df_5m['Signal'].tolist()
        sig_15m = df_15m['Signal'].tolist()
        
        confirmation = multi_timeframe_confirmation(sig_1m, sig_5m, sig_15m)
        
        last_row = df_1m.iloc[-1]
        
        # 5. Risk
        risk_params = calculate_risk(
            entry_price=last_row['close'],
            atr=last_row['ATR14'] if not pd.isna(last_row['ATR14']) else 0.0,
            signal_type=last_row['Signal']
        )
        
        def safe_float(val):
            return float(val) if not pd.isna(val) else 0.0

        return {
            "symbol": symbol,
            "timeframe": timeframe,
            "current_price": safe_float(last_row['close']),
            "base_signal": last_row['Signal'],
            "confidence": safe_float(last_row['Confidence'] * 100), # convert to %
            "mtf_confirmation": confirmation,
            "risk_management": risk_params,
            "features": {
                "EMA9": safe_float(last_row.get('EMA9', 0)),
                "EMA21": safe_float(last_row.get('EMA21', 0)),
                "VWAP": safe_float(last_row.get('VWAP', 0)),
                "RSI14": safe_float(last_row.get('RSI14', 0)),
                "VolumeSpike": safe_float(last_row.get('VolumeSpike', 0)),
                "Momentum": safe_float(last_row.get('Momentum', 0)),
                "OrderFlowImbalance": safe_float(last_row.get('OrderFlowImbalance', 0))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BacktestRequest(BaseModel):
    symbol: str
    timeframe: str
    target_date: str
    initial_balance: float
    risk_per_trade: float

@app.post("/backtest")
async def backtest_endpoint(req: BacktestRequest):
    df = fetch_klines(req.symbol, req.timeframe, limit=1000)
    df = apply_features(df)
    df = generate_signals(df)
    results = run_backtest(df, req.initial_balance, req.risk_per_trade)
    return results

@app.get("/symbols")
async def get_symbols():
    return ["BTCUSDT", "ETHUSDT"]

@app.get("/timeframes")
async def get_timeframes():
    return ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"]
    
@app.get("/performance")
async def get_performance():
    return {
        "status": "healthy",
        "latency_ms": 42
    }
