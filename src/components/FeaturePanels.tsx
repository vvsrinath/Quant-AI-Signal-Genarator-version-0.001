import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { Layers, Zap, Activity } from 'lucide-react';

const FeaturePanels: React.FC = () => {
  const orderFlowBias = useDashboardStore(state => state.orderFlowBias);
  const currentPrice = useDashboardStore(state => state.currentPrice);
  const vwap = useDashboardStore(state => state.vwap);
  
  const vwapDistance = vwap > 0 ? ((currentPrice - vwap) / vwap) * 100 : 0;
  
  // mock volume spike based on simple state or random for demo visual
  const isSpike = Math.random() > 0.95;

  return (
    <div className="flex flex-col gap-4">
      {/* Order Flow Imbalance */}
      <div className="glass-panel p-4">
        <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-300" />
          Order Flow Imbalance
        </h2>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neon-green">BUY</span>
            <span className="font-bold">{orderFlowBias > 0 ? '+' : ''}{orderFlowBias.toFixed(1)}%</span>
            <span className="text-neon-red">SELL</span>
          </div>
          
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
            {/* Normalize bias -100 to 100 into a 0 to 100 percentage for the fill */}
            <div 
               className="h-full bg-neon-green transition-all duration-500 ease-out"
               style={{ width: `${Math.max(0, 50 + (orderFlowBias / 2))}%` }}
            />
            <div 
               className="h-full bg-neon-red transition-all duration-500 ease-out"
               style={{ width: `${Math.max(0, 50 - (orderFlowBias / 2))}%` }}
            />
          </div>
        </div>
      </div>

      {/* VWAP Deviation */}
      <div className="glass-panel p-4">
        <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-neon-blue" />
          VWAP Deviation
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold">
            <span className={vwapDistance > 0 ? 'text-neon-green' : vwapDistance < 0 ? 'text-neon-red' : 'text-gray-400'}>
              {vwapDistance > 0 ? '+' : ''}{vwapDistance.toFixed(3)}%
            </span>
          </div>
          <div className="text-xs text-gray-500 text-right pr-2">
            <p>MEAN</p>
            <p>REVERSION</p>
          </div>
        </div>
      </div>
      
      {/* Volume Anomaly */}
      <div className={`glass-panel p-4 transition-colors duration-300 ${isSpike ? 'bg-neon-blue/10 border-neon-blue/50' : ''}`}>
         <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
          <Zap className={`w-4 h-4 ${isSpike ? 'text-neon-blue' : 'text-gray-400'}`} />
          Volume Anomaly
        </h2>
        <div className="flex items-center justify-between">
           <span className="text-xs font-mono text-gray-500">Aggressive Market Orders</span>
           {isSpike ? (
             <span className="px-2 py-0.5 bg-neon-blue text-black text-[10px] font-bold rounded animate-pulse">SPIKE DETECTED</span>
           ) : (
             <span className="text-xs font-mono text-gray-600">NORMAL</span>
           )}
        </div>
      </div>
    </div>
  );
};

export default FeaturePanels;
