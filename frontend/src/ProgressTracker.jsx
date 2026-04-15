import { useState, useEffect } from "react";
import api from "./api";
import { motion, AnimatePresence } from "framer-motion";

function ProgressGrowthTracker({ setActivePage, idea }) {
  const [updateText, setUpdateText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
        try {
            const response = await api.get(`/progress/check-in?idea=${encodeURIComponent(idea)}`);
            if (response.data.history) setHistory(response.data.history);
        } catch (e) {}
    };
    fetchHistory();
  }, [idea]);

  const handleSubmit = async () => {
    if (!updateText.trim()) return;
    
    setLoading(true);
    setCurrentResponse(null);

    try {
      const response = await api.post("/progress/check-in", {
        idea: idea,
        update_text: updateText
      });
      
      if (response.data.success) {
        setCurrentResponse(response.data.data);
        setHistory(response.data.history || []);
        setUpdateText("");
      }
    } catch (err) {
      console.error("Error submitting progress:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <button 
                    onClick={() => setActivePage('dashboard')}
                    className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors mb-4 group font-bold uppercase tracking-widest text-[10px]"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Hub
                </button>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">Progress & Growth Tracker</h1>
                <p className="text-violet-400 font-mono text-xs uppercase tracking-[0.3em]">Historical Momentum & Strategic Growth Milestones</p>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <span className="text-violet-400 text-lg">📈</span>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Momentum Level</div>
                    <div className="text-sm font-bold text-white uppercase tracking-tighter italic">High Performance</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Input Side */}
            <div className="lg:col-span-5 space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-violet-900/5 border border-violet-500/10 backdrop-blur-md">
                    <h2 className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-6">Daily Strategic Log</h2>
                    <textarea
                        className="w-full bg-black/40 border border-violet-500/20 rounded-2xl p-6 text-sm text-gray-200 focus:ring-2 focus:ring-violet-600 outline-none transition min-h-[180px] mb-6 shadow-inner"
                        placeholder="What did you achieve today? E.g. Secured first 10 users, finished landing page..."
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                    />
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-[0_4px_15px_rgba(139,92,246,0.3)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "SYNCING DATA..." : "SUBMIT GROWTH LOG"}
                    </button>
                </div>

                <AnimatePresence>
                    {currentResponse && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-8 rounded-[2.5rem] border backdrop-blur-md relative overflow-hidden ${currentResponse.status === 'on_track' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}
                        >
                            <div className="relative z-10">
                                <h3 className={`font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 ${currentResponse.status === 'on_track' ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {currentResponse.status === 'on_track' ? "✦ PROGRESS VERIFIED" : "⚡ STRATEGY DRIFT"}
                                </h3>
                                <p className="text-gray-300 text-sm mb-8 leading-relaxed italic">"{currentResponse.message}"</p>
                                
                                <div className="space-y-8">
                                    {currentResponse.milestones && currentResponse.milestones.length > 0 && (
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">📌 Milestones Achieved:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {currentResponse.milestones.map((m, idx) => (
                                                    <div key={idx} className="bg-emerald-500/10 border border-emerald-500/10 px-4 py-2 rounded-xl text-[10px] text-emerald-300 font-bold uppercase italic">
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentResponse.kpis && currentResponse.kpis.length > 0 && (
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black uppercase text-violet-500 tracking-[0.2em]">📊 KPIs to Track:</span>
                                            <div className="grid grid-cols-1 gap-2">
                                                {currentResponse.kpis.map((kpi, idx) => (
                                                    <div key={idx} className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl text-[11px] text-gray-300 flex items-center gap-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                                        {kpi}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentResponse.checkpoints && currentResponse.checkpoints.length > 0 && (
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">📈 Growth Checkpoints:</span>
                                            <div className="grid grid-cols-1 gap-2">
                                                {currentResponse.checkpoints.map((cp, idx) => (
                                                    <div key={idx} className="bg-orange-500/5 border border-orange-500/10 px-4 py-3 rounded-2xl text-[11px] text-orange-200/70 flex items-center gap-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40"></span>
                                                        {cp}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* NEW: Momentum Timeline Section */}
                                    {currentResponse.momentum_timeline && currentResponse.momentum_timeline.length > 0 && (
                                        <div className="pt-6 border-t border-white/5 space-y-6">
                                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">🚀 Momentum Timeline:</span>
                                            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-indigo-500/20">
                                                {currentResponse.momentum_timeline.map((step, idx) => (
                                                    <div key={idx} className="relative pl-8 group">
                                                        <div className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-[#05000a] border-2 border-indigo-500 z-10 group-hover:scale-125 transition-transform" />
                                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
                                                            <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{step.time}</div>
                                                            <div className="text-sm font-bold text-white mb-2 leading-tight">{step.action}</div>
                                                            <div className="text-[11px] text-gray-400 italic flex items-center gap-2">
                                                                <span className="text-indigo-500">→</span> {step.result}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* History Side (Timeline) */}
            <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Momentum Ledger</h2>
                    <span className="text-[10px] font-bold text-violet-500 bg-violet-500/10 px-3 py-1 rounded-full uppercase italic">{history.length} TRACES</span>
                </div>
                
                <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-violet-500/20 before:via-violet-500/40 before:to-transparent">
                    
                    {history.length === 0 && !loading && (
                        <div className="p-12 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5 text-center ml-10">
                            <p className="text-gray-600 text-sm uppercase font-black tracking-widest italic">Zero Traces Detected. Resume Execution.</p>
                        </div>
                    )}

                    {history.map((log, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            
                            {/* Dot / Pulse Indicator */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border bg-[#05000a] group-hover:scale-110 transition-all duration-500 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl ${log.is_system_trace ? 'border-indigo-500/50 shadow-indigo-500/20' : 'border-violet-500/30'}`}>
                                <div className={`w-2 h-2 rounded-full ${log.is_system_trace ? 'bg-indigo-400 animate-pulse' : 'bg-violet-400'}`}></div>
                            </div>

                            {/* Card */}
                            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-[2.5rem] bg-white/[0.02] border transition-all shadow-xl group-hover:bg-white/[0.04] ${log.is_system_trace ? 'border-indigo-500/20 border-dashed bg-indigo-500/5' : 'border-white/5 hover:border-violet-500/20'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <time className="text-[10px] font-mono text-gray-500 font-bold">{new Date(log.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                                    <div className="flex gap-2">
                                        {log.is_system_trace && (
                                            <span className="text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                                                System Trace
                                            </span>
                                        )}
                                        <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${log.status === 'on_track' || !log.status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-400'}`}>
                                            {log.status === 'on_track' || !log.status ? 'Verified' : 'Drift'}
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-[13px] leading-relaxed italic mb-6 ${log.is_system_trace ? 'text-indigo-200' : 'text-gray-400'}`}>"{log.update_text}"</p>
                                
                                {((log.milestones && log.milestones.length > 0) || (log.milestones_achieved && log.milestones_achieved.length > 0)) && (
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                        {(log.milestones || log.milestones_achieved).map((m, i) => (
                                            <span key={i} className={`text-[8px] font-black uppercase tracking-wider ${log.is_system_trace ? 'text-indigo-400/80' : 'text-violet-400/60'}`}>#{m}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressGrowthTracker;
