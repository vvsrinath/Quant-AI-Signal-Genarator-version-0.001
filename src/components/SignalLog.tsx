import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

const SignalLog: React.FC = () => {
  const signalLog = useDashboardStore(state => state.signalLog);

  return (
    <div className="w-full text-sm font-mono text-left block max-h-full">
      <div className="grid grid-cols-6 text-gray-500 text-xs pb-2 border-b border-gray-800 sticky top-0 bg-transparent backdrop-blur-md">
        <span>TIME</span>
        <span>TYPE</span>
        <span>CONF</span>
        <span>ENTRY</span>
        <span>SL</span>
        <span>TP</span>
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        {signalLog.length === 0 ? (
           <div className="text-gray-600 italic mt-4 text-center">Waiting for signals...</div>
        ) : (
          signalLog.map((sig, idx) => (
            <div key={idx} className="grid grid-cols-6 py-1.5 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-default rounded px-1 -mx-1">
              <span className="text-gray-400">{new Date(sig.timestamp).toLocaleTimeString([], { hour12: false })}</span>
              <span className={`font-bold ${sig.type === 'BUY' ? 'text-neon-green' : 'text-neon-red'}`}>{sig.type}</span>
              <span className="text-white">{sig.confidence}%</span>
              <span className="text-white">{sig.entry.toFixed(2)}</span>
              <span className="text-neon-red/80">{sig.sl.toFixed(2)}</span>
              <span className="text-neon-green/80">{sig.tp.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SignalLog;
