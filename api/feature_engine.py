import pandas as pd
import pandas_ta as ta

def apply_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply EMA9, EMA21, VWAP, RSI14, ATR14, VolumeSpike, Momentum to df
    """
    # Base indicators via pandas-ta
    df['EMA9'] = ta.ema(df['close'], length=9)
    df['EMA21'] = ta.ema(df['close'], length=21)
    
    # Simple VWAP (for actual VWAP we usually need cumulative day, but standard approximation over window)
    df['VWAP'] = ta.vwap(high=df['high'], low=df['low'], close=df['close'], volume=df['volume'])
    if df['VWAP'].isna().all():
        df['VWAP'] = ta.sma(df['close'], length=20) # Fallback if VWAP fails

    df['RSI14'] = ta.rsi(df['close'], length=14)
    
    atr = ta.atr(df['high'], df['low'], df['close'], length=14)
    df['ATR14'] = atr
    
    # VolumeSpike
    vol_sma = ta.sma(df['volume'], length=20)
    df['VolumeSpike'] = df['volume'] / vol_sma
    
    # Momentum (Rate of Change)
    df['Momentum'] = ta.roc(df['close'], length=5)
    
    # OrderFlowImbalance mock (Using volume direction as proxy since we only have klines here for history)
    # 1 if strong up volume, -1 if strong down volume
    df['OrderFlowImbalance'] = ((df['close'] - df['open']) / (df['high'] - df['low'])) * df['volume']
    
    return df
