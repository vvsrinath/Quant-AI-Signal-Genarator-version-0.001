import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PriceChart: React.FC = () => {
  const klines = useDashboardStore(state => state.klines);
  const currentSignal = useDashboardStore(state => state.currentSignal);
  const gannLevels = useDashboardStore(state => state.gannLevels);
  const dailyLevels = useDashboardStore(state => state.dailyLevels);

  // transform klines for recharts with indicator calculations for visuals (Optimized)
  const data = React.useMemo(() => {
    return klines.map((k, i, arr) => {
      // Basic EMA estimation using simple sliding window to avoid O(N^2)
      const period20 = 20;
      const period50 = 50;
      
      const getEMA = (idx: number, period: number) => {
        if (idx < period) return k.close;
        const slice = arr.slice(idx - period + 1, idx + 1);
        const alpha = 2 / (period + 1);
        return slice.reduce((acc, v) => v.close * alpha + acc * (1 - alpha), slice[0].close);
      };

      return {
        time: new Date(k.closeTime).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        price: k.close,
        open: k.open,
        high: k.high,
        low: k.low,
        ema20: getEMA(i, period20),
        ema50: getEMA(i, period50),
        kalman: i > 0 ? (k.close * 0.4 + arr[i-1].close * 0.6) : k.close
      };
    });
  }, [klines]);

  if (data.length === 0) {
    return <div className="flex h-full w-full justify-center items-center font-mono opacity-50 animate-pulse">Waiting for market data streams...</div>;
  }

  const min = Math.min(...data.map(d => d.low));
  const max = Math.max(...data.map(d => d.high));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <XAxis 
          dataKey="time" 
          stroke="#4b5563" 
          fontSize={10} 
          tickFormatter={(v, i) => i % 10 === 0 ? v : ''}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          domain={[min - (min * 0.0005), max + (max * 0.0005)]} 
          stroke="#4b5563" 
          fontSize={10} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={(val) => val.toLocaleString()}
          orientation="right"
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(18, 20, 28, 0.9)', borderColor: '#374151', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
        />
        
        {/* Indicators */}
        <Line type="monotone" dataKey="ema20" stroke="#facc15" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="ema50" stroke="#f97316" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="kalman" stroke="#a855f7" strokeWidth={1} dot={false} strokeDasharray="3 3" isAnimationActive={false} />

        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#00f0ff" 
          strokeWidth={2} 
          dot={false} 
          activeDot={{ r: 4, fill: '#00f0ff', stroke: '#fff' }}
          isAnimationActive={false}
        />
        
        {/* Gann Support/Resistance */}
        {gannLevels.resistance.map((level, i) => (
          <ReferenceLine 
            key={`res-${i}`} 
            y={level} 
            stroke="#ff0055" 
            strokeWidth={1} 
            strokeOpacity={0.4} 
            label={{ value: `GAN R${i+1}`, fill: '#ff0055', fontSize: 8, position: 'right' }} 
          />
        ))}
        {gannLevels.support.map((level, i) => (
          <ReferenceLine 
            key={`sup-${i}`} 
            y={level} 
            stroke="#00ff9f" 
            strokeWidth={1} 
            strokeOpacity={0.4} 
            label={{ value: `GAN S${i+1}`, fill: '#00ff9f', fontSize: 8, position: 'right' }} 
          />
        ))}
        
        {/* Daily Pivot Levels */}
        {dailyLevels && (
          <>
            <ReferenceLine y={dailyLevels.pivot} stroke="#4b5563" strokeWidth={1} strokeDasharray="5 5" label={{ value: 'PIVOT', fill: '#4b5563', fontSize: 10, position: 'left' }} />
            <ReferenceLine y={dailyLevels.r1} stroke="#ff0055" strokeWidth={1} label={{ value: 'D-R1', fill: '#ff0055', fontSize: 10, position: 'left' }} />
            <ReferenceLine y={dailyLevels.s1} stroke="#00ff9f" strokeWidth={1} label={{ value: 'D-S1', fill: '#00ff9f', fontSize: 10, position: 'left' }} />
            <ReferenceLine y={dailyLevels.r2} stroke="#ff0055" strokeWidth={2} strokeOpacity={0.5} label={{ value: 'D-R2', fill: '#ff0055', fontSize: 10, position: 'left' }} />
            <ReferenceLine y={dailyLevels.s2} stroke="#00ff9f" strokeWidth={2} strokeOpacity={0.5} label={{ value: 'D-S2', fill: '#00ff9f', fontSize: 10, position: 'left' }} />
          </>
        )}
        
        {currentSignal && (
          <ReferenceLine 
            y={currentSignal.entry} 
            stroke={currentSignal.type === 'BUY' ? '#00ff7f' : '#ff003c'} 
            strokeDasharray="3 3" 
            label={{ position: 'insideTopLeft', value: `ENTRY ${currentSignal.entry}`, fill: '#fff', fontSize: 10 }} 
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
