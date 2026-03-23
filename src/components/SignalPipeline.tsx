import React from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, Cpu, Brain, ShieldCheck, Zap } from 'lucide-react';

const SignalPipeline: React.FC = () => {
  const steps = [
    { name: 'Market Data', icon: Database, color: 'text-gray-400' },
    { name: 'Kalman Filter', icon: Activity, color: 'text-neon-purple' },
    { name: 'Features', icon: Cpu, color: 'text-neon-blue' },
    { name: 'ML Model', icon: Brain, color: 'text-neon-purple' },
    { name: 'Risk Engine', icon: ShieldCheck, color: 'text-neon-blue' },
    { name: 'SIGNAL', icon: Zap, color: 'text-neon-green' },
  ];

  return (
    <div className="glass-panel p-4 overflow-hidden relative">
      <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-6 font-mono">Signal Generation Pipeline</h2>
      
      <div className="flex items-center justify-between relative px-2 overflow-x-auto custom-scrollbar pb-2 min-w-full">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-max min-w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
        
        {steps.map((step, i) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center relative z-10">
              <motion.div 
                className={`p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center mb-2`}
                animate={{ 
                  boxShadow: ['0 0 0px rgba(0,0,0,0)', '0 0 10px rgba(255,255,255,0.05)', '0 0 0px rgba(0,0,0,0)'],
                  borderColor: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <step.icon className={`w-4 h-4 ${step.color}`} />
              </motion.div>
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter whitespace-nowrap">{step.name}</span>
            </div>
            
            {i < steps.length - 1 && (
              <div className="flex-1 flex items-center justify-center py-2 opacity-30">
                <motion.div 
                  className="w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent"
                  animate={{ x: [-10, 10], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SignalPipeline;
