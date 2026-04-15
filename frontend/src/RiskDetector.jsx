import { useState, useEffect } from "react";
import api from "./api";
import { motion } from "framer-motion";

function RiskDetector({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/risk?idea=${encodeURIComponent(idea)}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching risk detector:", err);
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchRisks();
  }, [idea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-orange-400 font-mono animate-pulse tracking-widest uppercase text-sm">Simulating Threat Scenarios...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
      <p className="text-red-500 font-mono uppercase text-sm mb-4">THREAT SENSOR OFFLINE</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Re-Scan Environment</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Risk Detector</h1>
        <p className="text-orange-500 font-mono text-sm uppercase tracking-[0.4em]">Identifying Risks & Building Your Shield</p>
      </div>

      <div className="w-full max-w-6xl space-y-12">
        
        {/* Overall Fear Level Gauge */}
        <div className="p-10 md:p-12 rounded-[3.5rem] bg-orange-950/10 border border-orange-500/20 backdrop-blur-xl flex flex-col items-center">
           <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 font-mono">Overall Complexity & Risk</div>
           <div className="w-full max-w-2xl h-6 bg-white/5 rounded-full overflow-hidden mb-6 relative border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                style={{ width: `${data.overall_fear_level}%` }}
              ></div>
           </div>
           <div className="flex justify-between w-full max-w-2xl text-[10px] font-black uppercase text-gray-500 px-2 tracking-widest">
              <span>Very Safe</span>
              <span className="text-orange-400 text-lg">{data.overall_fear_level}% Danger Level</span>
              <span>High Risk</span>
           </div>
           
           <div className="mt-10 p-8 rounded-3xl bg-black/40 border border-white/5 max-w-4xl text-center">
              <p className="text-gray-200 text-lg italic font-medium leading-relaxed">"{data.expert_summary}"</p>
           </div>
        </div>

        {/* The Big Three Risks */}
        <div className="space-y-6">
           <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] font-mono">The Big Three Hurdle</h3>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {data.the_big_three?.map((risk, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all group flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{risk.name}</h4>
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${risk.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {risk.severity} Severity
                       </span>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <div>
                          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 font-mono">Warning Sign</p>
                          <p className="text-gray-400 text-base leading-snug font-medium italic">"{risk.warning_sign}"</p>
                       </div>
                       
                       <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 group-hover:bg-orange-500/10 transition-all">
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">The Shield (The Fix)</p>
                          <p className="text-gray-100 text-base font-bold">🛡️ {risk.the_fix}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Safety Checklist */}
        <div className="p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#1a0f00] to-black border border-white/5 relative overflow-hidden">
           <div className="flex flex-col items-center mb-12">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4 font-mono">Safety Checklist</h3>
              <h2 className="text-3xl font-black text-white italic text-center leading-tight tracking-tighter">Stay Safe While Starting Fast</h2>
           </div>
           
           <div className="max-w-4xl mx-auto space-y-4">
              {data.safety_checklist?.map((item, i) => (
                 <div key={i} className="flex gap-6 items-center p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold shrink-0">✓</div>
                    <p className="text-gray-200 text-lg font-medium leading-tight">{item}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Expert Final Verdict */}
        <div className="p-12 rounded-[4rem] bg-gradient-to-r from-orange-950 via-black to-red-950/20 border border-orange-500/20 relative overflow-hidden text-center group">
           <div className="absolute top-0 left-0 p-12 opacity-5 text-9xl font-black italic select-none tracking-tighter uppercase italic">SAFE</div>
           <div className="relative z-10">
              <h3 className="text-sm font-black text-orange-400 uppercase tracking-[0.4em] mb-6 font-mono">expert validation final Signal</h3>
              <p className="text-2xl md:text-3xl font-black text-white italic leading-tight tracking-tighter mb-10">
                 "{data.expert_verdict}"
              </p>
              <button 
                onClick={() => setActivePage("main")}
                className="px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_10px_40px_rgba(249,115,22,0.3)]"
              >
                Launch with Confidence
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

export default RiskDetector;
