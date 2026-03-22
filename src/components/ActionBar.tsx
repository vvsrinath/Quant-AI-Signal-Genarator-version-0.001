import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { Play, Pause, Download, BarChart2, Radio } from 'lucide-react';

const ActionBar: React.FC = () => {
  const signalRunning = useDashboardStore(state => state.signalRunning);
  const toggleSignalRunning = useDashboardStore(state => state.toggleSignalRunning);

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${signalRunning ? 'bg-neon-green animate-pulse shadow-[0_0_8px_#00ff7f]' : 'bg-gray-600'}`} />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{signalRunning ? 'SIGNAL ENGINE ACTIVE' : 'SIGNAL ENGINE PAUSED'}</span>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSignalRunning}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all ${signalRunning ? 'border-neon-red/50 text-neon-red hover:bg-neon-red/10' : 'border-neon-green/50 text-neon-green hover:bg-neon-green/10'}`}
          >
            {signalRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {signalRunning ? 'Pause Engine' : 'Start Engine'}
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase tracking-wider">
             <Radio className="w-3 h-3" /> Auto Trade
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest">
           <Download className="w-3 h-3" /> Export Logs
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-neon-blue hover:text-white hover:bg-neon-blue/20 font-mono text-[10px] uppercase tracking-widest bg-neon-blue/10">
           <BarChart2 className="w-3 h-3" /> Run Backtest
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
