export interface Trade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

export interface OrderBook {
  bids: [number, number][];
  asks: [number, number][];
}

export interface Signal {
  type: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  entry: number;
  sl: number;
  tp: number;
  timestamp: number;
  symbol: string;
}

export interface TickerData {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
}

export interface AppState {
  symbol: string;
  setSymbol: (symbol: string) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  status: 'DISCONNECTED' | 'CONNECTING' | 'LIVE';
  setStatus: (status: 'DISCONNECTED' | 'CONNECTING' | 'LIVE') => void;
  latency: number;
  setLatency: (ms: number) => void;

  currentPrice: number;
  setCurrentPrice: (price: number) => void;
  kalmanPrice: number;
  setKalmanPrice: (price: number) => void;
  vwap: number;
  setVwap: (vwap: number) => void;
  ema20: number;
  ema50: number;
  setEMAs: (ema20: number, ema50: number) => void;
  
  recentTrades: Trade[];
  addTrade: (trade: Trade) => void;
  addTrades: (trades: Trade[]) => void;
  
  klines: Kline[];
  updateKline: (kline: Kline) => void;
  setKlines: (klines: Kline[]) => void;

  orderBook: OrderBook;
  setOrderBook: (ob: OrderBook) => void;

  // Signal & Risk
  currentSignal: Signal | null;
  setCurrentSignal: (signal: Signal) => void;
  signalLog: Signal[];
  addSignalToLog: (signal: Signal) => void;
  
  volatility: number;
  setVolatility: (v: number) => void;
  orderFlowBias: number; // -100 to 100
  setOrderFlowBias: (bias: number) => void;
  regime: 'Trending' | 'Mean Reverting';
  setRegime: (regime: 'Trending' | 'Mean Reverting') => void;
  
  overallTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  setOverallTrend: (trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL') => void;
  
  gannLevels: { support: number[]; resistance: number[] };
  setGannLevels: (levels: { support: number[]; resistance: number[] }) => void;
  
  dailyLevels: { pivot: number; r1: number; s1: number; r2: number; s2: number } | null;
  setDailyLevels: (levels: { pivot: number; r1: number; s1: number; r2: number; s2: number } | null) => void;
  
  signalRunning: boolean;
  toggleSignalRunning: () => void;

  // Screener
  screenerData: TickerData[];
  setScreenerData: (data: TickerData[]) => void;
}
