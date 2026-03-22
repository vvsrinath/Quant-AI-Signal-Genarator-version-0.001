import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

const TopMetrics: React.FC = () => {
  const currentSignal = useDashboardStore(state => state.currentSignal);
  const regime = useDashboardStore(state => state.regime);
  const volatility = useDashboardStore(state => state.volatility);
  const orderFlowBias = useDashboardStore(state => state.orderFlowBias);

  const overallTrend = useDashboardStore(state => state.overallTrend);

  const currentPrice = useDashboardStore(state => state.currentPrice);
  
  const getSignalColor = () => {
    if (currentSignal?.type === 'BUY') return 'text-neon-green shadow-neon-green';
    if (currentSignal?.type === 'SELL') return 'text-neon-red shadow-neon-red';
    return 'text-neon-purple shadow-neon-purple';
  };

  const calculatePnL = () => {
    if (!currentSignal || currentPrice === 0) return null;
    const diff = currentPrice - currentSignal.entry;
    const pnl = currentSignal.type === 'BUY' ? (diff / currentSignal.entry) * 100 : (-diff / currentSignal.entry) * 100;
    return pnl;
  };

  const currentPnL = calculatePnL();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
      
      {/* Primary Signal */}
      <div className="glass-panel p-4 flex items-center justify-between relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${currentSignal?.type === 'BUY' ? 'neon-green' : currentSignal?.type === 'SELL' ? 'neon-red' : 'neon-purple'}/10 rounded-full blur-2xl -mr-10 -mt-10 transition-colors duration-1000 pointer-events-none`} />
        <div className="relative z-10">
          <p className="text-xs text-gray-400 font-mono mb-1">LIVE SIGNAL {currentPnL !== null && (
            <span className={`ml-2 text-[10px] font-bold ${currentPnL >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              ({currentPnL >= 0 ? '+' : ''}{currentPnL.toFixed(2)}%)
            </span>
          )}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-wider ${getSignalColor()}`}>
              {currentSignal ? currentSignal.type : 'WAIT'}
            </span>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] text-gray-500 font-mono">CONFIDENCE</p>
          <span className="text-lg font-mono text-white">{currentSignal ? `${currentSignal.confidence}%` : '--%'}</span>
        </div>
      </div>

      {/* Market Regime */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">REGIME</p>
          <span className={`text-lg font-bold tracking-wide ${regime === 'Trending' ? 'text-neon-blue' : 'text-yellow-400'}`}>
            {regime}
          </span>
        </div>
        <TrendingUp className={`w-6 h-6 ${regime === 'Trending' ? 'text-neon-blue' : 'text-yellow-400 opacity-50'}`} />
      </div>

      {/* Volatility */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">VOLATILITY (1m)</p>
          <span className="text-lg font-mono font-bold text-white">
            {volatility.toFixed(1)}
          </span>
        </div>
        <Activity className="w-6 h-6 text-neon-purple" />
      </div>

      {/* Order Flow Bias */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">ORDER FLOW BIAS</p>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-mono font-bold ${orderFlowBias > 0 ? 'text-neon-green' : orderFlowBias < 0 ? 'text-neon-red' : 'text-gray-400'}`}>
              {orderFlowBias > 0 ? '+' : ''}{orderFlowBias.toFixed(1)}%
            </span>
          </div>
        </div>
        <BarChart2 className="w-6 h-6 text-gray-400" />
      </div>

      {/* Overall Trend */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">OVERALL TREND</p>
          <span className={`text-lg font-bold tracking-wide ${overallTrend === 'BULLISH' ? 'text-neon-green' : overallTrend === 'BEARISH' ? 'text-neon-red' : 'text-gray-400'}`}>
            {overallTrend}
          </span>
        </div>
        <TrendingUp className={`w-6 h-6 ${overallTrend === 'BULLISH' ? 'text-neon-green' : overallTrend === 'BEARISH' ? 'text-neon-red' : 'text-gray-400'}`} />
      </div>

    </div>
  );
};

export default TopMetrics;
