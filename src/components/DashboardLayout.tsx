import React from 'react';
import Header from './Header';
import TopMetrics from './TopMetrics';
import PriceChart from './PriceChart';
import RiskDashboard from './RiskDashboard';
import FeaturePanels from './FeaturePanels';
import SignalLog from './SignalLog';
import Screener from './Screener';
import SignalPipeline from './SignalPipeline';
import ActionBar from './ActionBar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Header Bar */}
      <Header />

      {/* Top Metrics Row */}
      <TopMetrics />
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-4">
        
        {/* Left Panel: Chart & Signals (Takes up main space) */}
        <div className="lg:col-span-3 xl:col-span-8 flex flex-col gap-4">
          <div className="flex-1 glass-panel p-4 flex flex-col">
            <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-blue shadow-neon-blue"></span> Price & Signal
            </h2>
            <div className="flex-1 w-full bg-black/20 rounded border border-white/5 flex items-center justify-center text-gray-500 overflow-hidden">
               <PriceChart />
            </div>
          </div>
          
          <SignalPipeline />
          
          <div className="h-48 glass-panel p-4 overflow-hidden flex flex-col">
            <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-purple shadow-neon-purple"></span> Signal Log
            </h2>
            <div className="flex-1 overflow-auto custom-scrollbar">
               <SignalLog />
            </div>
          </div>
        </div>

        {/* Right Panel: Risk & Features */}
        <div className="lg:col-span-1 xl:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <RiskDashboard />
          <FeaturePanels />
          <div className="glass-panel p-4 flex-1 min-h-[300px]">
             <Screener />
          </div>
        </div>
      </div>
      
      <ActionBar />
    </div>
  );
};

export default DashboardLayout;
