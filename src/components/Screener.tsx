import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const Screener: React.FC = () => {
  const screenerData = useDashboardStore(state => state.screenerData);
  const setSymbol = useDashboardStore(state => state.setSymbol);
  const currentSymbol = useDashboardStore(state => state.symbol);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-neon-green" />
        Market Screener (24h)
      </h2>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-3 text-[10px] text-gray-500 font-mono pb-2 border-b border-gray-800 sticky top-0 bg-[#0a0b10] z-10 p-1">
          <span>SYMBOL</span>
          <span className="text-right">PRICE</span>
          <span className="text-right">CHANGE</span>
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          {screenerData.length === 0 ? (
            <div className="text-gray-600 italic mt-4 text-center text-xs">Fetching market data...</div>
          ) : (
            screenerData.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => setSymbol(coin.symbol)}
                className={`grid grid-cols-3 py-2 px-1 rounded transition-all group ${currentSymbol === coin.symbol ? 'bg-neon-blue/10 border border-neon-blue/20' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="flex items-center gap-1">
                   <span className="text-xs font-bold text-white">{coin.symbol.replace('USDT', '')}</span>
                   {currentSymbol === coin.symbol && <ArrowRight className="w-2.5 h-2.5 text-neon-blue" />}
                </div>
                
                <span className="text-right text-xs text-gray-300 font-mono">
                  {coin.price > 1000 ? coin.price.toLocaleString(undefined, {maximumFractionDigits: 1}) : coin.price.toFixed(coin.price < 0.1 ? 5 : 2)}
                </span>
                
                <div className={`text-right text-xs font-mono flex items-center justify-end gap-1 ${coin.priceChangePercent >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                   {coin.priceChangePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                   {coin.priceChangePercent > 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Screener;
