import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCES = [
  "ENGAGING SOVEREIGN CORE...",
  "AUDITING MARKET ARBITRAGE...",
  "SYNTHESIZING TACTICAL MOATS...",
  "EXTRACTING COMPETITIVE GAPS...",
  "MAPPING GROWTH TRAJECTORIES...",
  "PROTOCOL AUDIT: INITIALIZED...",
  "CALCULATING EXIT MULTIPLES...",
  "FINALIZING COMMAND DASHBOARD..."
];

export default function CinematicLoader({ isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % SEQUENCES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence shadow-xl>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-[#05000a] flex flex-col items-center justify-center p-10 text-center overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow" />

          {/* Core Animation */}
          <div className="relative w-48 h-48 mb-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-r-2 border-purple-500 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.3)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border-b-2 border-l-2 border-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl"
              >
                🚀
              </motion.span>
            </div>
          </div>

          <div className="max-w-xl w-full">
            <motion.h2
              key="main-msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white mb-4 tracking-tighter"
            >
              MISSION CONTROL
            </motion.h2>

            <div className="h-8 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.p
                   key={currentStep}
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: -20, opacity: 0 }}
                   className="text-purple-400 font-mono text-sm uppercase tracking-[0.4em] font-bold"
                >
                  {SEQUENCES[currentStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex justify-center gap-1.5">
               {[...Array(8)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     opacity: i <= currentStep ? [0.4, 1, 0.4] : 0.2,
                     scale: i === currentStep ? 1.5 : 1
                   }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                   className={`h-1.5 w-8 rounded-full ${i <= currentStep ? 'bg-purple-500' : 'bg-white/10'}`}
                 />
               ))}
            </div>
          </div>

          <div className="absolute bottom-10 left-10 text-left opacity-30 pointer-events-none hidden md:block">
            <p className="font-mono text-[10px] text-gray-400">STATUS: OVERRIDE_ACTIVE</p>
            <p className="font-mono text-[10px] text-gray-400">ENCRYPTION: AES-256-GCM</p>
            <p className="font-mono text-[10px] text-gray-400">NETWORK: SOVEREIGN_CLOUD</p>
          </div>

          <style>{`
            .animate-pulse-slow {
              animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.1; transform: scale(1); }
              50% { opacity: 0.3; transform: scale(1.1); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
