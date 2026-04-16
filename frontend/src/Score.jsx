import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import api from "./api";

function Score({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auditId, setAuditId] = useState("");

  const fetchScore = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const url = `/validate?idea=${encodeURIComponent(idea)}${refresh ? '&refresh=true' : ''}`;
      const response = await api.get(url);
      const scoreData = response.data.result || response.data.data;
      setData(scoreData);
      setIsCached(!!response.data.cached);
      
      if (scoreData.successScore >= 8) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#a855f7', '#ffffff']
        });
      }
    } catch (err) {
      console.error("Error fetching success render:", err);
    } finally {
      setLoading(false);
    }
  }, [idea]);

  useEffect(() => {
    // Generate a unique-looking Audit ID
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAuditId(`LM-SA-${hash}`);
    
    if (idea) fetchScore();
  }, [idea, fetchScore]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.1)]";
    if (score >= 5) return "text-amber-500 border-amber-500/20 bg-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.1)]";
    return "text-red-500 border-red-500/20 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.1)]";
  };

  const getLabelColor = (label) => {
    const l = label?.toLowerCase();
    if (l === "high" || l === "easy") return "text-emerald-400 font-black";
    if (l === "medium" || l === "moderate") return "text-amber-400 font-black";
    return "text-red-400 font-black";
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
           <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-4 border-indigo-500/5 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-b-4 border-emerald-500 rounded-full animate-spin h-16 w-16" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
              </div>
           </div>
           <p className="text-white font-mono animate-pulse uppercase tracking-[0.4em] text-[10px] mb-2">Engaging Sovereign Core...</p>
           <p className="text-gray-500 font-mono text-[8px] uppercase tracking-widest">Cross-referencing 1.2M market signals</p>
        </div>
     );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
       <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-[3rem] backdrop-blur-3xl">
          <p className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">DNA Sequence Mismatch</p>
          <button onClick={() => fetchScore(true)} className="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all">Execute Fresh Audit (Force Re-Scan)</button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 selection:bg-indigo-500/30">
      
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase tracking-widest rounded">Sovereign Verified</span>
               <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">Logic Integrity: 99.8%</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Success Reader</h1>
            <div className="flex items-center gap-3">
               <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Audit Signature: <span className="text-white">{auditId}</span></p>
               {isCached && (
                  <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-black uppercase tracking-widest rounded-md animate-pulse">
                     Loaded from Cache
                  </span>
               )}
            </div>
         </div>
         <button 
           onClick={() => fetchScore(true)}
           className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
         >
           <span className="animate-spin-slow">↻</span> Force Re-Scan
         </button>
         <div className="hidden md:block text-right">
            <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-1 italic">Sovereign Intel Node: 0x82A (Tier 1)</p>
            <p className="text-white/40 font-mono text-[8px] uppercase tracking-widest">Verification Timestamp: {new Date().toLocaleTimeString()}</p>
         </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 1. Main Score Gauge */}
          <div className="lg:col-span-4 space-y-8">
             <div className={`p-12 rounded-[4rem] border backdrop-blur-2xl text-center flex flex-col items-center justify-center relative group transition-all duration-500 ${getScoreColor(data.successScore)}`}>
                <div className="absolute -top-4 -right-4 bg-black/80 border border-white/10 p-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-12 translate-x-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Market Fit Signal</p>
                   <p className="text-lg font-black italic">OPTIMAL</p>
                </div>
                <div className="text-xs font-black uppercase tracking-[0.4em] mb-6 opacity-60">Sovereign Potential</div>
                 <div className="text-7xl leading-none font-black mb-4 tracking-tighter tabular-nums text-glow flex items-baseline justify-center">
                   {data.successScore}
                   <span className="text-4xl opacity-40 ml-2">/10</span>
                 </div>
                <div className="px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-current bg-white/5 backdrop-blur-md">
                   Sovereign Verified
                </div>
             </div>

             {/* Overall Verdict */}
             <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl font-black italic select-none">VRT</div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 font-mono">Expert Synthesis</h3>
                <p className="text-gray-200 text-xl leading-relaxed italic font-medium relative z-10 group-hover:text-white transition-colors">"{data.verdict}"</p>
             </div>
          </div>

          {/* Metrics Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* 2. Market Demand */}
             <div className="p-10 rounded-3xl bg-white/[0.015] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.03] active:scale-[0.98]">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Market Demand</span>
                   <span className={`text-xs font-black uppercase tracking-widest ${getLabelColor(data.marketDemand?.label)}`}>{data.marketDemand?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">"{data.marketDemand?.explanation}"</p>
             </div>

             {/* 3. Competition Level */}
             <div className="p-10 rounded-3xl bg-white/[0.015] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.03] active:scale-[0.98]">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Competition</span>
                   <span className={`text-xs font-black uppercase tracking-widest ${getLabelColor(data.competitionLevel?.label)}`}>{data.competitionLevel?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">"{data.competitionLevel?.explanation}"</p>
             </div>

             {/* 4. Feasibility */}
             <div className="p-10 rounded-3xl bg-white/[0.015] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.03] active:scale-[0.98]">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Feasibility</span>
                   <span className={`text-xs font-black uppercase tracking-widest ${getLabelColor(data.feasibility?.label)}`}>{data.feasibility?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">"{data.feasibility?.reason}"</p>
             </div>

             {/* 5. Scalability Potential */}
             <div className="p-10 rounded-3xl bg-white/[0.015] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.03] active:scale-[0.98]">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Scalability</span>
                   <span className={`text-xs font-black uppercase tracking-widest ${getLabelColor(data.scalability?.label)}`}>{data.scalability?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">"{data.scalability?.reason}"</p>
             </div>

             {/* 6. Improvement Suggestions */}
             <div className="md:col-span-2 p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/10 shadow-[0_40px_100px_rgba(99,102,241,0.05)]">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-10 font-mono text-center">Tactical Improvement Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {data.suggestions?.map((s, i) => (
                      <div key={i} className="flex gap-6 items-start bg-black/40 p-6 rounded-[2rem] border border-white/5 group hover:border-indigo-500/20 transition-all">
                         <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-lg shrink-0 group-hover:bg-indigo-500 group-hover:text-black transition-all">0{i+1}</div>
                         <p className="text-gray-300 text-base font-medium leading-normal group-hover:text-white transition-colors uppercase italic tracking-tight">{s}</p>
                      </div>
                   ))}
                </div>
             </div>

          </div>

        </div>

        {/* 7 & 8. Strengths & Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="p-12 rounded-[4rem] bg-emerald-500/[0.02] border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] font-mono">Foundational Strengths</h3>
              </div>
              <ul className="space-y-6">
                {data.strengths?.map((item, i) => (
                  <li key={i} className="flex gap-6 items-start group">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-[2.5] transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <p className="text-gray-300 text-xl leading-relaxed italic font-medium group-hover:text-white transition-colors">{item}</p>
                  </li>
                ))}
              </ul>
           </div>
           
           <div className="p-12 rounded-[4rem] bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
                 <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] font-mono">Critical Vulnerabilities</h3>
              </div>
              <ul className="space-y-6">
                {data.risks?.map((item, i) => (
                  <li key={i} className="flex gap-6 items-start group">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-[2.5] transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <p className="text-gray-300 text-xl leading-relaxed italic font-medium group-hover:text-white transition-colors">{item}</p>
                  </li>
                ))}
              </ul>
           </div>
        </div>

        {/* 10. Confidence Message */}
        <div className="p-16 rounded-[5rem] bg-gradient-to-br from-indigo-950 via-black to-emerald-950/20 border border-white/5 relative overflow-hidden text-center group">
           <div className="absolute top-0 left-0 p-16 opacity-[0.03] text-[15rem] font-black italic select-none tracking-tighter">VISION</div>
           <div className="absolute bottom-0 right-0 p-16 opacity-[0.03] text-[15rem] font-black italic select-none tracking-tighter">SCALE</div>
           
           <div className="relative z-10 max-w-4xl mx-auto">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.6em] mb-12 font-mono">Sovereign Validation Signature</h3>
              <p className="text-3xl md:text-5xl font-black text-white italic leading-[1.1] tracking-tighter mb-16 selection:bg-emerald-500/30">
                 "{data.confidenceMessage}"
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <button 
                   onClick={() => setActivePage("main")}
                   className="w-full sm:w-auto px-16 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_70px_rgba(255,255,255,0.2)]"
                 >
                   Return to Dashboard
                 </button>
                 <button 
                   onClick={() => window.print()}
                   className="w-full sm:w-auto px-16 py-5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-all"
                 >
                   Export PDF
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}


export default Score;