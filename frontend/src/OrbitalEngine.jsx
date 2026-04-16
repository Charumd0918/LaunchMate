import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import scoreImg from "./assets/score.png";
import strategyImg from "./assets/strategy.png";
import businessImg from "./assets/business.png";
import budgetImg from "./assets/budget.png";
import marketingImg from "./assets/marketing.png";
import pitchImg from "./assets/pitch.png";
import analyticsImg from "./assets/analytics.png";
import riskImg from "./assets/risk.png";

const modules = [
  { id: "score", title: "Success Reader", img: scoreImg, icon: "🔬", color: "from-purple-500", delay: 0 },
  { id: "strategy", title: "Business Strategy", img: businessImg, icon: "💎", color: "from-indigo-500", delay: 4 },
  { id: "financial", title: "Financial Hub", img: budgetImg, icon: "📈", color: "from-emerald-500", delay: 8 },
  { id: "plan", title: "Launch Plan", img: strategyImg, icon: "🚀", color: "from-blue-500", delay: 12 },
  { id: "pitch", title: "Pitch Deck", img: pitchImg, icon: "📢", color: "from-amber-500", delay: 16 },
  { id: "marketing", title: "Marketing AI", img: marketingImg, icon: "🎯", color: "from-red-500", delay: 20 },
  { id: "market", title: "Market Intel", img: analyticsImg, icon: "📊", color: "from-sky-500", delay: 24 },
  { id: "risk", title: "Risk Detector", img: riskImg, icon: "⚠️", color: "from-orange-500", delay: 28 },
];

const OrbitalEngine = () => {
  const [hoveredModule, setHoveredModule] = useState(null);

  return (
    <section className="relative w-full py-10 min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* SECTION HEADER (Moved Above) */}
      <div className="absolute top-0 left-0 w-full text-center z-20">
         <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
           The Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Engine.</span>
         </h3>
      </div>

      {/* THE CORE: Mission Control Hub */}
      <div className="relative z-10 w-40 h-40 flex items-center justify-center">
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"
         />
         <div className="glass-panel w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-purple-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent animate-pulse-glow" />
            <span className="text-5xl mb-2 z-10 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">🧠</span>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] z-10">AI Core</span>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border border-dashed border-purple-500/20 rounded-full"
            />
         </div>
      </div>

      {/* THE ORBITAL SYSTEM */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Orbital Rings - Visual Reference */}
        <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full" />

        {/* SATELITTES */}
        {modules.map((module, idx) => {
          const radius = idx % 2 === 0 ? 120 : 200;
          const duration = idx % 2 === 0 ? 40 : 60;
          
          return (
            <div 
               key={module.id}
               className="absolute animate-orbit pointer-events-auto"
               style={{ 
                 "--orbit-radius": `${radius}px`,
                 "--orbit-duration": `${duration}s`,
                 animationDelay: `-${module.delay}s`
               }}
               onMouseEnter={() => setHoveredModule(module)}
               onMouseLeave={() => setHoveredModule(null)}
            >
              <motion.div 
                 whileHover={{ scale: 1.2, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                 className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center cursor-pointer border-white/10 shadow-2xl relative group"
              >
                  <span className="text-xl z-10">{module.icon}</span>
                  <div className={`absolute inset-[-2px] rounded-2xl bg-gradient-to-br ${module.color} to-transparent opacity-0 group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Dynamic Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                     <span className="text-[8px] font-black text-purple-300 uppercase tracking-widest bg-black/80 px-2 py-1 rounded">
                       {module.title}
                     </span>
                  </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* THE GLASS PORTAL: Large Focus Panel */}
      <AnimatePresence>
        {hoveredModule && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-10 top-1/2 -translate-y-1/2 z-50 w-[400px] hidden xl:block"
          >
            <div className="glass-card p-8 rounded-[3rem] shadow-[0_0_100px_rgba(168,85,247,0.2)] border-purple-500/20">
               <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">{hoveredModule.icon}</span>
                  <div>
                    <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">{hoveredModule.title}</h4>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Module Overview</span>
                  </div>
               </div>
               
               <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 relative group">
                  <img 
                     src={hoveredModule.img} 
                     alt={hoveredModule.title} 
                     className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                     <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-pulse delay-75" />
                     <span className="w-1.5 h-1.5 rounded-full bg-purple-500/20 animate-pulse delay-150" />
                  </div>
               </div>

               <p className="text-gray-400 font-medium leading-relaxed italic text-sm mb-8">
                 Revolutionary AI synthesis for {hoveredModule.title.toLowerCase()}—providing zero-latency strategic intelligence for high-stakes decisions.
               </p>

               <button className="w-full py-4 rounded-xl bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-purple-500 transition-all active:scale-95">
                 Analyze Now →
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE COMPATIBILITY HINT */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center xl:hidden text-center px-4">
         <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 animate-bounce">Tap Satellites to Explore</span>
         <p className="text-gray-600 text-[10px] font-medium italic">Sovereign Orbital Engine v1.0.4</p>
      </div>

    </section>
  );
};

export default OrbitalEngine;
