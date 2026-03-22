import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { Shield, AlertTriangle } from 'lucide-react';

const RiskDashboard: React.FC = () => {
  const currentPrice = useDashboardStore(state => state.currentPrice);
  const volatility = useDashboardStore(state => state.volatility);
  const currentSignal = useDashboardStore(state => state.currentSignal);

  const accountSize = 100000; // Mock 100k account
  const riskPerTrade = 0.01; // 1% risk
  const riskAmount = accountSize * riskPerTrade;

  // Simple position sizing logic mock based on volatility
  const slDistance = volatility * 2.5 || currentPrice * 0.002;
  const slPercent = slDistance / currentPrice;
  const posSize = slPercent > 0 ? (riskAmount / slPercent) : 0;
  
  const rrRatio = 1.5; // Mock fixed target from engine logic

  return (
    <div className="flex flex-col gap-4">
      {/* Risk Meta */}
      <div className="glass-panel p-4 flex flex-col gap-4">
        <h2 className="text-sm text-gray-400 uppercase tracking-widest font-mono flex items-center gap-2">
           <Shield className="w-4 h-4 text-neon-blue" />
           Risk Engine
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 font-mono mb-1">Max Position Size</p>
            <span className="text-sm font-mono text-white">${posSize ? posSize.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 font-mono mb-1">Max Drawdown</p>
            <span className="text-sm font-mono text-neon-red">-0.45%</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 font-mono mb-1">R/R Target</p>
            <span className="text-sm font-mono text-neon-green">1 : {rrRatio}</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-[10px] text-gray-500 font-mono mb-1">Stop Distance</p>
            <span className="text-sm font-mono text-white">{(slPercent * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      {/* Current Trade Risk */}
      {currentSignal && (
        <div className="glass-panel p-4 border border-neon-purple/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-neon-purple/10 rounded-full blur-xl -mr-4 -mt-4 pointer-events-none" />
          <h3 className="text-xs text-neon-purple uppercase font-mono mb-3 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Active Signal Limits
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-mono">Entry</span>
            <span className="text-sm font-mono text-white">{currentSignal.entry.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-mono">Stop Loss</span>
            <span className="text-sm font-mono text-neon-red">{currentSignal.sl.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">Take Profit</span>
            <span className="text-sm font-mono text-neon-green">{currentSignal.tp.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskDashboard;
