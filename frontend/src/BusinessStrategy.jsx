import { useState, useEffect, useCallback } from "react";
import api from "./api";

function BusinessStrategy({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const url = `/strategy?idea=${encodeURIComponent(idea)}${refresh ? '&refresh=true' : ''}`;
      const response = await api.get(url);
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching business strategy:", err);
    } finally {
      setLoading(false);
    }
  }, [idea]);

  useEffect(() => {
    if (idea) fetchData();
  }, [idea, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-400 font-mono animate-pulse uppercase tracking-widest text-sm">Architecting Your Future...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="flex flex-col items-center justify-center p-20 bg-red-900/10 border border-red-500/20 rounded-[3rem] text-center min-h-[50vh]">
       <p className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">Strategy Node Offline</p>
       <button onClick={() => fetchData(true)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Re-Scan Environment (Fresh Intel)</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10">
      
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[8px] font-black uppercase tracking-widest rounded">Sovereign Strategic Architecture</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Business Strategy</h1>
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Co-Founder Strategic Series • Unit Logic Verified</p>
         </div>
         <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => fetchData(true)}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span className="animate-spin-slow">↻</span> Force Re-Scan
            </button>
            <div className="text-right hidden md:block">
               <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-1 italic italic">Draft Status: FINALIZED</p>
               <p className="text-white/40 font-mono text-[8px] uppercase tracking-widest">Protocol Version: 7.2.0X</p>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Grid for Core 8 Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Target Audience */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-indigo-500/30 transition-all">
             <div className="text-indigo-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">01. Target Audience</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">Who you are building for</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.targetAudience}</p>
          </div>

          {/* 2. Problem Statement */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-red-500/30 transition-all">
             <div className="text-red-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">02. Problem Statement</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">The pain point you solve</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.problemStatement}</p>
          </div>

          {/* 3. Value Proposition */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
             <div className="text-emerald-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">03. Value Proposition</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">Why they will choose you</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.valueProposition}</p>
          </div>

          {/* 4. Solution Overview */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-blue-500/30 transition-all">
             <div className="text-blue-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">04. Solution Overview</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">How the system functions</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.solutionOverview}</p>
          </div>

          {/* 5. Business Model */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-purple-500/30 transition-all">
             <div className="text-purple-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">05. Business Model</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">Sustainable architecture</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.businessModel}</p>
          </div>

          {/* 6. Unique Advantage */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-amber-500/30 transition-all">
             <div className="text-amber-500 text-sm font-black uppercase tracking-widest mb-4 font-mono">06. Unique Advantage</div>
             <h4 className="text-white text-xl font-black mb-3 leading-tight tracking-tight">The Strategic Moat</h4>
             <p className="text-gray-300 text-lg leading-relaxed">{data.uniqueAdvantage}</p>
          </div>

        </div>

        {/* Revenue & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-xl">
             <div className="text-emerald-500 text-sm font-black uppercase tracking-widest mb-6 font-mono flex items-center gap-2">
                07. How You Earn Money
             </div>
             <div className="grid grid-cols-1 gap-3">
                {data.revenue_streams?.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-black/40 border border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
                    <h5 className="text-emerald-400 font-black text-sm uppercase mb-1 tracking-tight">{item.method}</h5>
                    <p className="text-gray-200 text-base leading-relaxed">{item.description}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-xl">
             <div className="text-indigo-500 text-sm font-black uppercase tracking-widest mb-6 font-mono flex items-center gap-2">
                08. How You Grow
             </div>
             <div className="space-y-3">
                {data.growth_strategy?.map((item, i) => (
                  <div key={i} className="flex gap-4 bg-black/40 p-5 rounded-2xl border border-indigo-500/10 group hover:border-indigo-500/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">{i+1}</div>
                    <div>
                      <h4 className="text-indigo-300 font-black text-sm uppercase mb-1 tracking-tight">{item.step}</h4>
                      <p className="text-gray-200 text-base leading-tight">{item.action}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Final Confidence Message */}
        <div className="p-12 rounded-[4rem] bg-gradient-to-br from-indigo-950 via-black to-purple-950 border border-indigo-500/30 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-8xl font-black italic">WIN</div>
           <div className="relative z-10 text-center">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Expert Co-Founder Directive</h3>
              <p className="text-2xl md:text-3xl font-black text-white italic leading-tight tracking-tighter mb-4">
                 "{data.confidenceMessage}"
              </p>
              <div className="mt-8 flex justify-center gap-4">
                 <button 
                   onClick={() => setActivePage("main")}
                   className="px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-xl"
                 >
                   Return to Command Station
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default BusinessStrategy;
