import { useDashboardStore } from '../store/useDashboardStore';
import type { Signal } from '../types';

// Simple 1D Kalman Filter implementation
class KalmanFilter {
  R: number; // process noise
  Q: number; // measurement noise
  A: number; // state vector
  B: number; // control vector
  C: number; // measurement vector
  x: number; // estimated signal
  cov: number; // covariance

  constructor(R = 0.01, Q = 0.1, A = 1, B = 0, C = 1) {
    this.R = R;
    this.Q = Q;
    this.A = A;
    this.B = B;
    this.C = C;
    this.x = 0;
    this.cov = NaN;
  }

  filter(measurement: number) {
    if (isNaN(this.x) || isNaN(this.cov)) {
      this.x = (1 / this.C) * measurement;
      this.cov = (1 / this.C) * this.Q * (1 / this.C);
    } else {
      const predX = (this.A * this.x) + (this.B * 0);
      const predCov = ((this.A * this.cov) * this.A) + this.R;
      const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q));
      this.x = predX + K * (measurement - (this.C * predX));
      this.cov = predCov - (K * this.C * predCov);
    }
    return this.x;
  }
}

const priceKalman = new KalmanFilter(0.001, 0.1);

let lastSignalTime = 0;
const SIGNAL_COOLDOWN = 15000; // 15 sec for demo purposes

export const processTick = () => {
  const store = useDashboardStore.getState();
  const { currentPrice, recentTrades, orderBook, klines } = store;

  if (currentPrice === 0 || recentTrades.length < 10 || klines.length === 0) return;

  // 1. Update Kalman Price
  const kalmanPrice = priceKalman.filter(currentPrice);
  store.setKalmanPrice(kalmanPrice);

  // 2. EMA & VWAP Calculation
  const closes = klines.map(k => k.close);
  const getEMA = (data: number[], period: number) => {
    const k = 2 / (period + 1);
    return data.reduce((acc, val) => val * k + acc * (1 - k), data[0]);
  };
  const ema20 = getEMA(closes.slice(-20), 20);
  const ema50 = getEMA(closes.slice(-50), 50);
  store.setEMAs(ema20, ema50);

  const currentKline = klines[klines.length - 1];
  const typicalPrice = (currentKline.high + currentKline.low + currentKline.close) / 3;
  const vwap = typicalPrice; 
  store.setVwap(vwap);
  const vwapDev = ((currentPrice - vwap) / vwap) * 100;

  // 3. Gann Square of 9 Support/Resistance
  const root = Math.sqrt(currentPrice);
  const gannRes = [Math.pow(root + 0.125, 2), Math.pow(root + 0.25, 2)];
  const gannSup = [Math.pow(root - 0.125, 2), Math.pow(root - 0.25, 2)];
  store.setGannLevels({ support: gannSup, resistance: gannRes });

  // 4. Overall Trend (MTA-style estimation)
  // Bias based on EMA stack + Kalman relative position
  let trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
  if (ema20 > ema50 && currentPrice > ema20) trend = 'BULLISH';
  else if (ema20 < ema50 && currentPrice < ema20) trend = 'BEARISH';
  store.setOverallTrend(trend);

  // 3. Order flow imbalance from depth
  let bidVol = 0;
  let askVol = 0;
  orderBook.bids.forEach(b => bidVol += b[1]);
  orderBook.asks.forEach(a => askVol += a[1]);
  const totalVol = bidVol + askVol;
  const orderFlowBias = totalVol > 0 ? ((bidVol - askVol) / totalVol) * 100 : 0;
  store.setOrderFlowBias(orderFlowBias);

  // 4. Volatility Forecast (EWMA / GARCH-style)
  const alpha = 0.94; // Standard EWMA factor
  const prevVolatility = store.volatility || (currentPrice * 0.001);
  const currentReturn = recentTrades.length > 1 ? (currentPrice - recentTrades[1].price) / recentTrades[1].price : 0;
  // EWMA Variance formula: Var_t = (1-alpha) * r^2 + alpha * Var_t-1
  const newVolatility = Math.sqrt((1 - alpha) * Math.pow(currentReturn, 2) + alpha * Math.pow(prevVolatility, 2));
  store.setVolatility(newVolatility);

  // Determine Regime based on volatility threshold
  store.setRegime(newVolatility > currentPrice * 0.0001 ? 'Trending' : 'Mean Reverting');

  // Logic: Weighted Ensemble Signal (Simulating GBDT / ML Probability)
  const timeSinceLastSignal = Date.now() - lastSignalTime;
  if (timeSinceLastSignal < SIGNAL_COOLDOWN) return;

  // Features normalization and scoring
  const f_orderFlow = Math.max(-1, Math.min(1, orderFlowBias / 50)); // Normalize bias
  const f_vwapDist = Math.max(-1, Math.min(1, vwapDev / 0.5)); // Normalize dev
  const f_kalmanSide = currentPrice > kalmanPrice ? 1 : -1;
  const f_momentum = closes.length > 2 ? (closes[closes.length-1] - closes[closes.length-3]) / closes[closes.length-3] : 0;

  // Weighted Score (Ensemble approach)
  // Weights: OrderFlow (0.4), VWAP (0.2), Kalman (0.2), Momentum (0.2)
  const compositeScore = (f_orderFlow * 0.4) + (f_vwapDist * 0.2) + (f_kalmanSide * 0.2) + (Math.sign(f_momentum) * 0.2);

  let signalType: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let confidence = Math.abs(compositeScore) * 100;

  if (compositeScore > 0.45) {
    signalType = 'BUY';
  } else if (compositeScore < -0.45) {
    signalType = 'SELL';
  }

  if (signalType !== 'NEUTRAL' && confidence >= 60) {
    // Risk Management (Dynamic Position Sizing based on Volatility forecast)
    const slDist = newVolatility * 3 || currentPrice * 0.003;
    const isBuy = signalType === 'BUY';
    const sl = isBuy ? currentPrice - slDist : currentPrice + slDist;
    const tp = isBuy ? currentPrice + (slDist * 2) : currentPrice - (slDist * 2);

    const newSignal: Signal = {
      type: signalType,
      confidence: parseFloat(confidence.toFixed(1)),
      entry: currentPrice,
      sl: parseFloat(sl.toFixed(2)),
      tp: parseFloat(tp.toFixed(2)),
      timestamp: Date.now(),
      symbol: store.symbol
    };

    store.setCurrentSignal(newSignal);
    store.addSignalToLog(newSignal);
    lastSignalTime = Date.now();
  }
};
