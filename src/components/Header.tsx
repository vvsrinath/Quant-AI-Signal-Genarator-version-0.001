import React, { useState } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { Wifi, Zap } from 'lucide-react';

const Header: React.FC = () => {
  const symbol = useDashboardStore(state => state.symbol);
  const setSymbol = useDashboardStore(state => state.setSymbol);
  const timeframe = useDashboardStore(state => state.timeframe);
  const setTimeframe = useDashboardStore(state => state.setTimeframe);
  const status = useDashboardStore(state => state.status);
  const latency = useDashboardStore(state => state.latency);
  const currentPrice = useDashboardStore(state => state.currentPrice);
  const signalRunning = useDashboardStore(state => state.signalRunning);
  const toggleSignalRunning = useDashboardStore(state => state.toggleSignalRunning);
  
  const [inputVal, setInputVal] = useState(symbol);

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSymbol(inputVal.trim().toUpperCase());
    }
  };

  return (
    <div className="glass-panel p-3 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
      {/* Left: Branding */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/40 border border-neon-blue/30 flex items-center justify-center">
              <Zap className="text-neon-blue w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-blue">
                Quantum Intraday
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-mono">Signal Engine v1.0</p>
            </div>
        </div>
        
        {/* Mobile-only latency indicator proxy */}
        <div className="flex md:hidden items-center gap-1.5 text-xs font-mono">
           <Wifi className={`w-3.5 h-3.5 ${status === 'LIVE' ? 'text-neon-green' : status === 'CONNECTING' ? 'text-yellow-400' : 'text-neon-red'}`} />
        </div>
      </div>

      {/* Center: Symbol & Price */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <form onSubmit={handleSymbolSubmit} className="flex items-center bg-black/40 border border-white/10 rounded overflow-hidden p-1 shadow-inner focus-within:border-neon-blue/50 transition-colors w-full sm:w-auto">
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="bg-transparent text-white font-mono text-sm uppercase px-2 py-1 outline-none w-full sm:w-28 placeholder:text-gray-600"
                placeholder="SYMBOL..."
              />
              <button type="submit" className="hidden" />
            </form>

            <div className="flex items-end gap-2 shrink-0 sm:w-32 justify-center">
              <span className="text-2xl font-mono font-semibold tracking-tight text-white">{currentPrice > 0 ? currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2}) : '---'}</span>
              <span className="text-xs text-gray-400 font-mono mb-1">{symbol.replace('USDT', '')}</span>
            </div>
        </div>

        <div className="flex bg-black/40 border border-white/10 rounded p-1 w-full sm:w-auto justify-between sm:justify-start overflow-x-auto custom-scrollbar">
          {['1m', '3m', '5m', '15m'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all flex-1 sm:flex-none text-center ${timeframe === tf ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50' : 'text-gray-500 hover:text-white'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Controls & Status */}
      <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-2 md:mt-0">
        <button 
          onClick={toggleSignalRunning}
          className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded text-sm font-semibold font-mono transition-all ${signalRunning ? 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green hover:text-black hover:shadow-neon-green' : 'bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red hover:text-white hover:shadow-neon-red'}`}
        >
          {signalRunning ? 'PAUSE SIGNALS' : 'START ENGINE'}
        </button>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Wifi className={`w-3.5 h-3.5 ${status === 'LIVE' ? 'text-neon-green' : status === 'CONNECTING' ? 'text-yellow-400' : 'text-neon-red'}`} />
            <span className={status === 'LIVE' ? 'text-neon-green drop-shadow-[0_0_5px_rgba(0,255,127,0.5)]' : 'text-gray-400'}>{status}</span>
          </div>
          <div className="flex flex-col items-end w-16">
            <span className="text-gray-500">LATENCY</span>
            <span className={`font-semibold ${latency < 100 ? 'text-neon-green' : latency < 300 ? 'text-yellow-400' : 'text-neon-red'}`}>{latency}ms</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;
