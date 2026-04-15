import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import api from "./api";

function Score({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await api.get(`/validate?idea=${encodeURIComponent(idea)}`);
        const scoreData = response.data.result || response.data.data;
        setData(scoreData);
        
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
    };
    if (idea) fetchScore();
  }, [idea]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 5) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-red-500 border-red-500/20 bg-red-500/10";
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
           <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
           <p className="text-indigo-400 font-mono animate-pulse uppercase tracking-widest text-sm">Auditing Success Probabilities...</p>
        </div>
     );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 bg-red-900/10 border border-red-500/20 rounded-3xl">
       <p className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">DNA Sequence Mismatch</p>
       <button onClick={() => window.location.reload()} className="text-white text-sm underline uppercase">Execute Hard Reboot</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10">
      
      {/* Header Section */}
      <div className="w-full max-w-6xl mx-auto mb-12">
         <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Success Render</h1>
         <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest">Venture DNA Analysis • Co-Founder Audit Series</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. Main Score Gauge */}
          <div className="lg:col-span-4 space-y-6">
             <div className={`p-10 rounded-[3rem] border backdrop-blur-xl text-center flex flex-col items-center justify-center ${getScoreColor(data.successScore)}`}>
                <div className="text-sm font-black uppercase tracking-[0.3em] mb-4 opacity-70">Sovereign Potential</div>
                <div className="text-8xl font-black mb-2 tracking-tighter tabular-nums">{data.successScore}<span className="text-xl opacity-40">/10</span></div>
                <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-current`}>
                   Analysis Complete
                </div>
             </div>

             {/* Overall Verdict */}
             <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 font-mono">Expert Verdict</h3>
                <p className="text-gray-200 text-lg leading-relaxed italic font-medium">"{data.verdict}"</p>
             </div>
          </div>

          {/* Metrics Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* 2. Market Demand */}
             <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Market Demand</span>
                   <span className={`text-sm font-black uppercase ${getLabelColor(data.marketDemand?.label)}`}>{data.marketDemand?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{data.marketDemand?.explanation}</p>
             </div>

             {/* 3. Competition Level */}
             <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Competition</span>
                   <span className={`text-sm font-black uppercase ${getLabelColor(data.competitionLevel?.label)}`}>{data.competitionLevel?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{data.competitionLevel?.explanation}</p>
             </div>

             {/* 4. Feasibility */}
             <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Feasibility</span>
                   <span className={`text-sm font-black uppercase ${getLabelColor(data.feasibility?.label)}`}>{data.feasibility?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{data.feasibility?.reason}</p>
             </div>

             {/* 5. Scalability Potential */}
             <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Scalability</span>
                   <span className={`text-sm font-black uppercase ${getLabelColor(data.scalability?.label)}`}>{data.scalability?.label}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{data.scalability?.reason}</p>
             </div>

             {/* 6. Improvement Suggestions */}
             <div className="md:col-span-2 p-10 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 font-mono">Improvement Roadmap</h3>
                <div className="space-y-4">
                   {data.suggestions?.map((s, i) => (
                      <div key={i} className="flex gap-4 items-start bg-black/40 p-5 rounded-xl border border-white/5">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">0{i+1}</div>
                         <p className="text-gray-200 text-base font-medium leading-tight">{s}</p>
                      </div>
                   ))}
                </div>
             </div>

          </div>

        </div>

        {/* 7 & 8. Strengths & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-6 font-mono">Key Strengths</h3>
              <ul className="space-y-4">
                {data.strengths?.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform"></div>
                    <p className="text-gray-200 text-lg leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
           </div>
           <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20">
              <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-6 font-mono">Critical Risks</h3>
              <ul className="space-y-4">
                {data.risks?.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <div className="mt-2 w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform"></div>
                    <p className="text-gray-200 text-lg leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
           </div>
        </div>

        {/* 10. Confidence Message */}
        <div className="p-12 rounded-[4rem] bg-gradient-to-br from-indigo-950 via-black to-emerald-950/20 border border-indigo-500/20 relative overflow-hidden text-center group">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic select-none">GROW</div>
           <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 font-mono">Sovereign Validation Signal</h3>
              <p className="text-2xl md:text-3xl font-black text-white italic leading-tight tracking-tighter mb-10">
                 "{data.confidenceMessage}"
              </p>
              <button 
                onClick={() => setActivePage("main")}
                className="px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl"
              >
                Return to Dashboard
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

export default Score;