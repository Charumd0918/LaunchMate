import { useState, useEffect } from "react";
import api from "./api";
import { motion } from "framer-motion";

function MarketingAnalytics({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/marketing?idea=${encodeURIComponent(idea)}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching marketing data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchData();
  }, [idea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4"></div>
        <p className="text-pink-400 font-mono animate-pulse tracking-widest uppercase text-sm">Architecting Your Growth...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
      <p className="text-red-500 font-mono uppercase text-sm mb-4">GROWTH ENGINE OFFLINE</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Retry Connection</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">The Growth Guide</h1>
        <p className="text-pink-500 font-mono text-sm uppercase tracking-[0.4em]">Finding Your First 100 Fans & Scaling Fast</p>
      </div>

      <div className="w-full max-w-6xl space-y-16">
        
        {/* TOP ROW: Platforms & Hacks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Platforms */}
           <div className="lg:col-span-1 space-y-8">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest font-mono">Top Platforms for {idea.split(' ')[0]}</h3>
              <div className="space-y-4">
                 {data.target_platforms?.map((p, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-pink-900/10 border border-pink-500/20 hover:border-pink-500/40 transition-all">
                       <h4 className="text-white font-black text-base mb-3">{p.name}</h4>
                       <p className="text-gray-200 text-lg leading-relaxed italic font-medium">"{p.reason}"</p>
                    </div>
                 ))}
              </div>

              {/* Quick Hacks */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                 <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest font-mono">Growth Secrets</h3>
                 {data.growth_secrets?.map((h, i) => (
                    <div key={i} className="flex gap-5 items-start p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                       <div className="w-3 h-3 rounded-full bg-pink-500 mt-2 flex-shrink-0 animate-pulse"></div>
                       <div>
                          <h6 className="text-white text-sm font-black uppercase tracking-tight mb-1">{h.title}</h6>
                          <p className="text-gray-300 text-base leading-snug font-medium">{h.description}</p>
                          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest mt-3 block">Effort: {h.effort}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* First 100 Fans Action Plan */}
           <div className="lg:col-span-2 p-12 md:p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-12 opacity-5 font-black text-8xl italic">100</div>
              <h4 className="text-sm font-black text-pink-500 uppercase tracking-[0.3em] mb-16 text-center">First 100 Fans Action Plan</h4>
              
              <div className="space-y-16 relative flex-1 flex flex-col justify-center">
                 {/* Visual Connector Line */}
                 <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"></div>
                 
                 {data.first_100_action_plan?.map((step, i) => (
                    <div key={i} className="flex gap-12 items-start relative z-10">
                       <div className="w-16 h-16 rounded-3xl bg-black border-2 border-pink-500/40 flex items-center justify-center text-xl font-black text-white shadow-[0_0_30px_rgba(236,72,153,0.2)] transform rotate-12 group-hover:rotate-0 transition-transform">
                          0{i+1}
                       </div>
                       <div className="flex-1 p-8 rounded-[2.5rem] bg-pink-500/5 border border-pink-500/10 hover:border-pink-500/30 transition-all">
                          <h5 className="text-white font-black text-xl mb-3 tracking-tight">{step.step}</h5>
                          <p className="text-gray-200 text-lg leading-relaxed italic font-medium">"{step.action}"</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* The Growth Reel (Horizontal Timeline) */}
        <div className="p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#12001a] to-black border border-white/5 relative overflow-hidden">
           <div className="flex flex-col items-center mb-16">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 font-mono">Week 1 Growth Reel</h3>
              <h2 className="text-3xl font-black text-white italic text-center leading-tight">Your Daily Marketing Roadmap</h2>
           </div>
           
           <div className="relative group">
              {/* Progress Line Connector */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent -translate-y-1/2 z-0 hidden lg:block"></div>
              
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 scrollbar-none custom-scroll relative z-10 px-4">
                 {data.content_calendar?.map((day, i) => (
                    <div 
                      key={i} 
                      className="min-w-[240px] md:min-w-[280px] snap-center flex flex-col rounded-[2rem] bg-white/[0.03] border border-white/10 overflow-hidden backdrop-blur-xl group/card hover:border-pink-500/40 transition-all hover:-translate-y-2 shadow-2xl"
                    >
                       <div className="p-3 bg-pink-500/10 border-b border-white/5 flex justify-between items-center px-5">
                          <h5 className="text-[9px] font-black text-pink-400 uppercase tracking-widest">{day.day}</h5>
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
                       </div>
                       <div className="p-5 flex-1 flex flex-col justify-between min-h-[160px]">
                          <p className="text-gray-100 text-base font-bold leading-relaxed italic mb-4">"{day.post}"</p>
                          <div className="pt-4 border-t border-white/5">
                             <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Channel</div>
                             <div className="text-pink-400 font-black text-xs uppercase">{day.platform}</div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              
              {/* Hint */}
              <div className="text-center mt-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] animate-pulse">
                ← Swipe to explore your week →
              </div>
           </div>
        </div>

        <style>{`
          .custom-scroll::-webkit-scrollbar {
            height: 4px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(236, 72, 153, 0.3);
            border-radius: 10px;
          }
          .scrollbar-none {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>

      </div>

      <div className="mt-24 pt-10 border-t border-white/5 w-full max-w-6xl flex justify-center">
         <button 
           onClick={() => setActivePage("main")}
           className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_10px_40px_rgba(236,72,153,0.3)]"
         >
           Deploy Growth Strategy
         </button>
      </div>

    </div>
  );
}

export default MarketingAnalytics;
