import axios from 'axios';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:8000';

export const getSignalsFromBackend = async (symbol: string, timeframe: string) => {
  try {
    const response = await axios.get(`${API_URL}/signals`, {
      params: { symbol, timeframe }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching signal from backend", error);
    return null;
  }
};

export const runBacktestOnBackend = async (symbol: string, timeframe: string, initial_balance: number, risk_per_trade: number) => {
  try {
    const response = await axios.post(`${API_URL}/backtest`, {
      symbol, timeframe, target_date: '2023-01-01', initial_balance, risk_per_trade
    });
    return response.data;
  } catch (error) {
    console.error("Error running backtest on backend", error);
    return null;
  }
};

export const getMarketSymbols = async () => {
  try {
    const response = await axios.get(`${API_URL}/symbols`);
    return response.data;
  } catch (error) {
    return ['BTCUSDT', 'ETHUSDT'];
  }
}

export const getMarketTimeframes = async () => {
    try {
      const response = await axios.get(`${API_URL}/timeframes`);
      return response.data;
    } catch (error) {
      return ['1m', '5m', '15m'];
    }
}
