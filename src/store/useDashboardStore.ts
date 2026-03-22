import { create } from 'zustand';
import type { AppState } from '../types';

export const useDashboardStore = create<AppState>((set) => ({
  symbol: 'BTCUSDT',
  setSymbol: (symbol) => set({ symbol }),
  timeframe: '1m',
  setTimeframe: (timeframe) => set({ timeframe }),
  status: 'DISCONNECTED',
  setStatus: (status) => set({ status }),
  latency: 0,
  setLatency: (latency) => set({ latency }),

  currentPrice: 0,
  setCurrentPrice: (currentPrice) => set({ currentPrice }),
  kalmanPrice: 0,
  setKalmanPrice: (kalmanPrice) => set({ kalmanPrice }),
  vwap: 0,
  setVwap: (vwap) => set({ vwap }),
  ema20: 0,
  ema50: 0,
  setEMAs: (ema20, ema50) => set({ ema20, ema50 }),

  recentTrades: [],
  addTrade: (trade) => set((state) => {
    const newTrades = [trade, ...state.recentTrades].slice(0, 50);
    return { recentTrades: newTrades };
  }),
  addTrades: (trades) => set((state) => {
    // trades are in chronological order, so reverse to get newest first
    const newTrades = [...trades.slice().reverse(), ...state.recentTrades].slice(0, 50);
    return { recentTrades: newTrades };
  }),

  klines: [],
  updateKline: (kline) => set((state) => {
    const existingIndex = state.klines.findIndex(k => k.openTime === kline.openTime);
    const newKlines = [...state.klines];
    if (existingIndex >= 0) {
      newKlines[existingIndex] = kline;
    } else {
      newKlines.push(kline);
      if (newKlines.length > 100) newKlines.shift();
    }
    return { klines: newKlines };
  }),
  setKlines: (klines) => set({ klines }),

  orderBook: { bids: [], asks: [] },
  setOrderBook: (orderBook) => set({ orderBook }),

  currentSignal: null,
  setCurrentSignal: (currentSignal) => set({ currentSignal }),
  signalLog: [],
  addSignalToLog: (signal) => set((state) => ({ signalLog: [signal, ...state.signalLog].slice(0, 50) })),

  volatility: 0,
  setVolatility: (volatility) => set({ volatility }),
  orderFlowBias: 0,
  setOrderFlowBias: (orderFlowBias) => set({ orderFlowBias }),
  regime: 'Mean Reverting',
  setRegime: (regime) => set({ regime }),

  overallTrend: 'NEUTRAL',
  setOverallTrend: (overallTrend) => set({ overallTrend }),
  
  gannLevels: { support: [], resistance: [] },
  setGannLevels: (gannLevels) => set({ gannLevels }),

  dailyLevels: null,
  setDailyLevels: (dailyLevels) => set({ dailyLevels }),

  signalRunning: true,
  toggleSignalRunning: () => set((state) => ({ signalRunning: !state.signalRunning })),

  screenerData: [],
  setScreenerData: (screenerData) => set({ screenerData }),
}));
