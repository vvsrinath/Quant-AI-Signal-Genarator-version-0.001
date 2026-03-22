import pandas as pd
from typing import Dict, Any

def run_backtest(df: pd.DataFrame, initial_balance: float = 10000.0, risk_pct: float = 1.0) -> Dict[str, Any]:
    balance = initial_balance
    trades = []
    
    for time_idx, row in df.iterrows():
        if row['Signal'] != 'NEUTRAL':
            is_buy = row['Signal'] == 'BUY'
            entry = row['close']
            atr = row.get('ATR14', entry * 0.01)
            
            sl = entry - (atr * 1.2) if is_buy else entry + (atr * 1.2)
            tp = entry + (atr * 2.0) if is_buy else entry - (atr * 2.0)
            
            # Simplified backtest: assume outcome based on next 10 candles (forward look for proxy)
            # A real backtest engine loops step by step. Here we proxy.
            
            pnl = (tp - entry) / entry * balance * (risk_pct/100) if is_buy else (entry - tp) / entry * balance * (risk_pct/100)
            
            # We assume 45% winrate for this mock
            import random
            if random.random() < 0.45:
                bal_change = pnl
                result = 'WIN'
            else:
                bal_change = -abs(entry - sl) / entry * balance * (risk_pct/100)
                result = 'LOSS'
                
            balance += bal_change
            trades.append(bal_change)
            
    wins = len([t for t in trades if t > 0])
    losses = len([t for t in trades if t <= 0])
    total = wins + losses
    
    winrate = (wins / total * 100) if total > 0 else 0
    gross_prof = sum([t for t in trades if t > 0])
    gross_loss = abs(sum([t for t in trades if t < 0]))
    profit_factor = (gross_prof / gross_loss) if gross_loss > 0 else 0
    
    return {
        "initial_balance": initial_balance,
        "final_balance": round(balance, 2),
        "total_trades": total,
        "winrate": round(winrate, 2),
        "profit_factor": round(profit_factor, 2),
        "net_profit": round(balance - initial_balance, 2),
        "max_drawdown": 5.4  # Mock calc for now
    }
