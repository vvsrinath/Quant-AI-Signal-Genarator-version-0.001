import pandas as pd
import requests

def fetch_klines(symbol: str, interval: str, limit: int = 200) -> pd.DataFrame:
    """
    Fetch raw OHLCV klines from Binance and return a pandas DataFrame.
    """
    url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit={limit}"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch {symbol} {interval}: {response.text}")
    
    data = response.json()
    
    df = pd.DataFrame(data, columns=[
        'time', 'open', 'high', 'low', 'close', 'volume',
        'close_time', 'qav', 'num_trades', 'taker_base_vol', 'taker_quote_vol', 'ignore'
    ])
    
    df['time'] = pd.to_datetime(df['time'], unit='ms')
    df.set_index('time', inplace=True)
    
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = df[col].astype(float)
        
    return df
