import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectBinanceWs, disconnectBinanceWs, startScreenerUpdates, fetchDailyPivot } from './services/binance';
import { useDashboardStore } from './store/useDashboardStore';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const symbol = useDashboardStore(state => state.symbol);
  const timeframe = useDashboardStore(state => state.timeframe);

  useEffect(() => {
    connectBinanceWs(symbol, timeframe);
    startScreenerUpdates();
    fetchDailyPivot(symbol);
    return () => {
      disconnectBinanceWs();
    };
  }, [symbol, timeframe]);

  return (
    <div className="relative h-screen w-screen bg-[#030303] overflow-hidden">
      <div className="scanline pointer-events-none z-50" />
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={symbol}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full h-full p-4 flex flex-col gap-4 overflow-hidden"
        >
          <DashboardLayout />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;
