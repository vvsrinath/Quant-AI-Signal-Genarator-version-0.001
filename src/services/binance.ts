import { useDashboardStore } from '../store/useDashboardStore';
import { processTick } from '../utils/signalEngine';
import type { Trade, TickerData } from '../types';

let ws: WebSocket | null = null;
let pingInterval: any = null;
let screenerInterval: any = null;
let lastMessageTime: number = 0;
let isIntentionalClose = false;

const TOP_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'ARBUSDT', 'LTCUSDT', 'DOGEUSDT', 'MATICUSDT'];

export const startScreenerUpdates = () => {
  if (screenerInterval) clearInterval(screenerInterval);
  
  const fetchScreener = async () => {
    try {
      const resp = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(TOP_SYMBOLS)}`);
      if (resp.ok) {
        const data = await resp.json();
        const formatted: TickerData[] = data.map((t: any) => ({
          symbol: t.symbol,
          price: parseFloat(t.lastPrice),
          priceChangePercent: parseFloat(t.priceChangePercent),
          volume: parseFloat(t.quoteVolume)
        }));
        useDashboardStore.getState().setScreenerData(formatted);
      }
    } catch (e) {
      console.error('Screener fetch error:', e);
    }
  };

  fetchScreener();
  screenerInterval = setInterval(fetchScreener, 15000); // 15s refresh for 24h data
};

let tradeBuffer: Trade[] = [];
let lastFlushTime = 0;
const FLUSH_INTERVAL = 250; // Increased to 250ms for smoother UI

export const fetchDailyPivot = async (symbol: string) => {
  try {
    const resp = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=2`);
    const data = await resp.json();
    if (data.length >= 2) {
      // Index 0 is the previous completed day
      const prevDay = data[0];
      const h = parseFloat(prevDay[2]);
      const l = parseFloat(prevDay[3]);
      const c = parseFloat(prevDay[4]);
      
      const p = (h + l + c) / 3;
      const levels = {
        pivot: p,
        r1: (2 * p) - l,
        s1: (2 * p) - h,
        r2: p + (h - l),
        s2: p - (h - l)
      };
      useDashboardStore.getState().setDailyLevels(levels);
    }
  } catch (e) {
    console.error('Pivot fetch error:', e);
  }
};

let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 30000;

export const fetchKlineHistory = async (symbol: string, timeframe: string) => {
  try {
    const resp = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`);
    const data = await resp.json();
    const klines = data.map((k: any) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: k[6]
    }));
    useDashboardStore.getState().setKlines(klines);
  } catch (e) {
    console.error('History fetch error:', e);
  }
};

export const connectBinanceWs = (symbol: string, timeframe: string) => {
  if (ws) {
    isIntentionalClose = true;
    ws.close();
  }

  isIntentionalClose = false;
  const store = useDashboardStore.getState();
  store.setStatus('CONNECTING');
  
  // Fetch history first
  fetchKlineHistory(symbol, timeframe);

  const s = symbol.toLowerCase();
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${s}@trade/${s}@depth20@100ms/${s}@kline_${timeframe}`;
  
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    store.setStatus('LIVE');
    reconnectAttempts = 0; // Reset on success
    lastMessageTime = Date.now();
    tradeBuffer = [];
    lastFlushTime = Date.now();
    
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      const latency = Date.now() - lastMessageTime;
      useDashboardStore.getState().setLatency(latency > 0 ? latency : 0);
      
      // Heartbeat check: if no message for 8s, force reconnect
      if (latency > 8000 && !isIntentionalClose) {
        // console.warn('WebSocket heartbeat lost, reconnecting...');
        ws?.close();
      }
    }, 2000);
  };

  ws.onmessage = (event) => {
    lastMessageTime = Date.now();
    const parsed = JSON.parse(event.data);
    if (!parsed || !parsed.data) return;

    const data = parsed.data;
    const stream = parsed.stream;

    if (stream.includes('@trade')) {
      const trade: Trade = {
        id: data.t,
        price: parseFloat(data.p),
        qty: parseFloat(data.q),
        time: data.T,
        isBuyerMaker: data.m
      };
      
      tradeBuffer.push(trade);
      
      const now = Date.now();
      if (now - lastFlushTime >= FLUSH_INTERVAL) {
        store.addTrades(tradeBuffer);
        store.setCurrentPrice(trade.price);
        
        if (store.signalRunning) {
          processTick();
        }
        
        tradeBuffer = [];
        lastFlushTime = now;
      }
    } 
    else if (stream.includes('@depth')) {
      const now = Date.now();
      if (now - lastFlushTime >= (FLUSH_INTERVAL / 2)) {
        store.setOrderBook({
          bids: data.bids.map((b: string[]) => [parseFloat(b[0]), parseFloat(b[1])]),
          asks: data.asks.map((a: string[]) => [parseFloat(a[0]), parseFloat(a[1])])
        });
      }
    }
    else if (stream.includes('@kline')) {
      const k = data.k;
      store.updateKline({
        openTime: k.t,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v),
        closeTime: k.T
      });
    }
  };

  ws.onclose = () => {
    store.setStatus('DISCONNECTED');
    if (pingInterval) clearInterval(pingInterval);
    
    if (!isIntentionalClose) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
      setTimeout(() => {
        if (useDashboardStore.getState().symbol === symbol) {
          connectBinanceWs(symbol, timeframe);
        }
      }, delay);
    }
  };

  ws.onerror = () => {
    ws?.close();
  };
};

export const disconnectBinanceWs = () => {
  if (ws) {
    isIntentionalClose = true;
    ws.close();
    ws = null;
  }
  if (pingInterval) clearInterval(pingInterval);
};
