def calculate_risk(entry_price: float, atr: float, signal_type: str):
    if signal_type == 'BUY':
        stop_loss = entry_price - (atr * 1.2)
        take_profit = entry_price + (atr * 2.0)
    elif signal_type == 'SELL':
        stop_loss = entry_price + (atr * 1.2)
        take_profit = entry_price - (atr * 2.0)
    else:
        stop_loss = 0
        take_profit = 0
        
    return {
        "stop_loss": round(stop_loss, 2),
        "take_profit": round(take_profit, 2),
        "risk_reward": "1:2"
    }
