import { useState, useEffect } from "react";
import api from "./api";
import { motion } from "framer-motion";

function Competitors({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/competitors?idea=${encodeURIComponent(idea)}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching market intel:", err);
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchData();
  }, [idea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sky-400 font-mono animate-pulse tracking-widest uppercase text-sm">Scanning Market Signals...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
      <p className="text-red-500 font-mono uppercase text-sm mb-4">INTEL NODE OFFLINE</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Retry Connection</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Market Intel</h1>
        <p className="text-sky-400 font-mono text-sm uppercase tracking-[0.4em]">Simple Competitor Analysis & Opportunity Gaps</p>
      </div>

      <div className="w-full max-w-6xl space-y-12">
        
        {/* Market Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="p-8 rounded-3xl bg-sky-900/10 border border-sky-500/20 text-center">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Market Status</h4>
              <div className="text-2xl font-black text-sky-400 uppercase italic tracking-tighter">{data.marketStatus}</div>
           </div>
           <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center px-10">
              <p className="text-gray-200 text-lg italic font-medium leading-tight">"{data.marketStatusReason}"</p>
           </div>
           <div className="p-8 rounded-3xl bg-sky-900/10 border border-sky-500/20 text-center">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Potential Pool</h4>
              <div className="text-2xl font-black text-white italic tracking-tighter">{data.marketSize}</div>
           </div>
        </div>

        {/* Competitors (Rivals) Section */}
        <div className="space-y-6">
           <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] font-mono">The Rival Playbook</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.competitors?.map((rival, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-indigo-950/10 border border-sky-500/10 hover:border-sky-500/40 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                       <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">{rival.name}</h4>
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rival.threatLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          Threat: {rival.threatLevel}
                       </span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-10 italic font-medium">"{rival.description}"</p>
                    
                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 group-hover:bg-emerald-500/10 transition-all">
                       <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Your Strategic Edge</div>
                       <p className="text-emerald-100 text-base font-bold">✓ {rival.yourEdge}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Trends & Opportunity Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Trends */}
           <div className="p-10 rounded-[4rem] bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-black text-sky-400 uppercase tracking-widest mb-8 font-mono">Growth Trends</h3>
              <div className="space-y-6">
                 {data.growth_trends?.map((trend, i) => (
                    <div key={i} className="flex gap-6 items-start">
                       <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-black text-sm shrink-0">↗</div>
                       <div>
                          <h5 className="text-white font-black text-lg mb-1 tracking-tight">{trend.name}</h5>
                          <p className="text-gray-400 text-base leading-snug">{trend.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Opportunity Gaps */}
           <div className="p-10 rounded-[4rem] bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-8 font-mono">Unsolved Gaps</h3>
              <div className="space-y-6">
                 {data.opportunity_gaps?.map((gap, i) => (
                    <div key={i} className="flex gap-6 items-start">
                       <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">💡</div>
                       <div>
                          <h5 className="text-white font-black text-lg mb-1 tracking-tight">{gap.gap}</h5>
                          <p className="text-gray-400 text-base leading-snug">{gap.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Launch Banner (Timing Advice) */}
        <div className="p-12 rounded-[4rem] bg-gradient-to-r from-sky-950 via-black to-emerald-950/20 border border-sky-500/20 relative overflow-hidden text-center group">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic select-none tracking-tighter uppercase italic">NOW</div>
           <div className="relative z-10">
              <h3 className="text-sm font-black text-sky-400 uppercase tracking-[0.4em] mb-6 font-mono">Strategic Timing Signal</h3>
              <p className="text-2xl md:text-3xl font-black text-white italic leading-tight tracking-tighter mb-10">
                 "{data.timing_advice}"
              </p>
              <button 
                onClick={() => setActivePage("main")}
                className="px-12 py-4 bg-sky-600 hover:bg-sky-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_10px_40px_rgba(14,165,233,0.3)]"
              >
                Capture the Market
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

export default Competitors;
