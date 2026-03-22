import pandas as pd

def calculate_confidence(row, is_buy):
    confidence = 0
    # trend (EMA9 vs EMA21)
    if is_buy and row['EMA9'] > row['EMA21']: confidence += 0.30
    elif not is_buy and row['EMA9'] < row['EMA21']: confidence += 0.30
    
    # orderflow
    if is_buy and row['OrderFlowImbalance'] > 0: confidence += 0.25
    elif not is_buy and row['OrderFlowImbalance'] < 0: confidence += 0.25
    
    # vwap
    if is_buy and row['close'] > row['VWAP']: confidence += 0.20
    elif not is_buy and row['close'] < row['VWAP']: confidence += 0.20
    
    # volume spike
    if row['VolumeSpike'] > 1.2: confidence += 0.15
    
    # volatility / momentum
    if is_buy and row['Momentum'] > 0: confidence += 0.10
    elif not is_buy and row['Momentum'] < 0: confidence += 0.10
    
    return min(confidence, 0.99)

def generate_signals(df: pd.DataFrame) -> pd.DataFrame:
    signals = []
    confidences = []
    
    for idx, row in df.iterrows():
        signal = 'NEUTRAL'
        conf = 0.0
        
        buy_cond = (
            row['close'] > row['VWAP'] and
            row['EMA9'] > row['EMA21'] and
            row['RSI14'] > 55 and
            row['VolumeSpike'] > 1.5 and
            row['Momentum'] > 0
        )
        
        sell_cond = (
            row['close'] < row['VWAP'] and
            row['EMA9'] < row['EMA21'] and
            row['RSI14'] < 45 and
            row['VolumeSpike'] > 1.5 and
            row['Momentum'] < 0
        )
        
        if buy_cond:
            conf = calculate_confidence(row, True)
            if conf > 0.65:
                signal = 'BUY'
        elif sell_cond:
            conf = calculate_confidence(row, False)
            if conf > 0.65:
                signal = 'SELL'
                
        signals.append(signal)
        confidences.append(conf)
        
    df['Signal'] = signals
    df['Confidence'] = confidences
    return df

def multi_timeframe_confirmation(signals_1m, signals_5m, signals_15m):
    # Returns True if all agree on the current tick
    if not signals_1m or not signals_5m or not signals_15m:
        return 'NEUTRAL'
    ls_1m = signals_1m[-1]
    ls_5m = signals_5m[-1]
    ls_15m = signals_15m[-1]
    
    if ls_1m == 'BUY' and ls_5m == 'BUY' and ls_15m == 'BUY':
        return 'STRONG_BUY'
    elif ls_1m == 'SELL' and ls_5m == 'SELL' and ls_15m == 'SELL':
        return 'STRONG_SELL'
    return 'MIXED'
