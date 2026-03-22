import React, { useState } from 'react';
import { Newspaper, Info, TrendingUp, DollarSign } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const NewsPanel: React.FC = () => {
  const symbol = useDashboardStore(state => state.symbol).replace('USDT', '');
  
  // Simulated news from Investing.com and CMC style
  const newsItems = [
    { source: 'CoinMarketCap', title: `${symbol} Market Cap sees 4% surge in 24 hours amid high volume.`, time: '12m ago', sentiment: 'BULLISH' },
    { source: 'Investing.com', title: `Technical Analysis: ${symbol} approaches key Gann resistance zone.`, time: '28m ago', sentiment: 'NEUTRAL' },
    { source: 'News', title: `Whale Alert: $14M in ${symbol} moved from exchange to private wallet.`, time: '1h ago', sentiment: 'BULLISH' },
    { source: 'Investing.com', title: `FED interest rate decision: How will ${symbol} respond?`, time: '2h ago', sentiment: 'NEUTRAL' },
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="glass-panel p-4">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
          <Newspaper className="w-3 h-3 text-neon-blue" />
          Real-time News Feed
        </h3>
        <div className="flex flex-col gap-3">
          {newsItems.map((item, i) => (
            <div key={i} className="border-l-2 border-white/5 pl-3 py-1 hover:border-neon-blue/40 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-neon-blue uppercase">{item.source}</span>
                <span className="text-[8px] text-gray-600 font-mono">{item.time}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-300 font-sans">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-4">
        <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
          <Info className="w-3 h-3 text-neon-purple" />
          Fundamentals Hub
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-mono uppercase">Market Cap</span>
            <span className="text-xs font-mono text-white">$1.2T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-mono uppercase">24h Volume</span>
            <span className="text-xs font-mono text-white">$45.8B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-mono uppercase">Circ. Supply</span>
            <span className="text-xs font-mono text-white">19.7M {symbol}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-mono uppercase">CMC Rank</span>
            <span className="text-xs font-mono text-white">#1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPanel;
