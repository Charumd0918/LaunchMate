import { useState, useEffect } from "react";
import api from "./api";
import { motion, AnimatePresence } from "framer-motion";

function KanbanBoard({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({}); // { "phase-task": true }

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/execution-board?idea=${encodeURIComponent(idea)}`);
        const boardData = response.data.data;
        setData(boardData);
        
        // Restore completed tasks if available
        if (boardData.completedTasks) {
          setCompletedTasks(boardData.completedTasks);
        }
      } catch (err) {
        console.error("Error fetching execution board:", err);
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchBoard();
  }, [idea]);

  const toggleTask = async (pIdx, tIdx) => {
    const key = `${pIdx}-${tIdx}`;
    const newCompleted = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(newCompleted);

    try {
      await api.post("/execution-board/save", {
        idea,
        board: { ...data, completedTasks: newCompleted }
      });
    } catch (err) {
      console.error("Error saving task status:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-blue-400 font-mono animate-pulse tracking-widest uppercase text-sm">Drafting Launch Sequence...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
      <p className="text-red-500 font-mono uppercase text-sm mb-4">TACTICAL OFFLINE</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Retry Feed</button>
    </div>
  );

  const activePhase = data.phases[activePhaseIdx];

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Step-by-Step Launch Plan</h1>
           <p className="text-blue-500 font-mono text-sm uppercase tracking-[0.4em]">4 Phases from Idea to Profit</p>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Phase Rail (Navigation) */}
        <div className="lg:col-span-3 space-y-4">
           <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-8 font-mono">The Roadmap</h3>
           <div className="relative pl-6 border-l border-white/10 space-y-12">
              {data.phases.map((phase, i) => (
                <button 
                  key={i} 
                  onClick={() => setActivePhaseIdx(i)}
                  className={`relative w-full text-left transition-all group ${activePhaseIdx === i ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
                >
                   {/* Circle indicator on vertical line */}
                   <div className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full border-2 transition-all ${activePhaseIdx === i ? 'bg-blue-500 border-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#05000a] border-white/20'}`}></div>
                   
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activePhaseIdx === i ? 'text-blue-400' : 'text-gray-500'}`}>Phase {i + 1}</span>
                      <h4 className="text-xl font-black text-white italic tracking-tighter leading-none group-hover:text-blue-200 uppercase">{phase.name}</h4>
                   </div>
                </button>
              ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-10">
           
           {/* Day Zero / Directive Card */}
           {activePhaseIdx === 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-indigo-950/20 border border-blue-500/20 shadow-2xl relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic tracking-tighter uppercase select-none">ZERO</div>
                <div className="relative z-10">
                   <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4 font-mono">Directive: Day Zero</h3>
                   <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
                      "{data.day_zero_directive}"
                   </h2>
                   <p className="text-gray-400 text-lg font-medium leading-relaxed italic border-l-2 border-blue-500/30 pl-6">
                      "Don't wait for perfection. This single step is what separates founders from dreamers."
                   </p>
                </div>
             </motion.div>
           )}

           {/* Phase Detail Section */}
           <div className="space-y-10">
              
              {/* Readiness & Mental Load Header */}
              <div className="p-10 rounded-[4rem] bg-white/[0.02] border border-white/5">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                    <div>
                       <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{activePhase.name}</h3>
                       <p className="text-gray-400 text-lg italic font-medium leading-snug">The strategic foundation of your launch.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 px-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center min-w-[200px]">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Mental Load</span>
                       <div className={`text-xl font-black uppercase tracking-tighter ${activePhase.mental_load === 'High' ? 'text-red-400' : activePhase.mental_load === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {activePhase.mental_load} Energy
                       </div>
                    </div>
                 </div>

                 {/* Readiness Signal */}
                 <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700"></div>
                    <div className="relative z-10">
                       <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 font-mono">When to proceed (Readiness Signal)</h5>
                       <p className="text-blue-100 text-xl font-black italic leading-tight">
                          "Move to the next phase when: {activePhase.readiness_signal}"
                       </p>
                    </div>
                 </div>
              </div>

              {/* Actionable Tasks List */}
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono">Mandatory Directives</h3>
                 <div className="space-y-4">
                    {activePhase.tasks?.map((task, i) => {
                       const isDone = completedTasks[`${activePhaseIdx}-${i}`];
                       return (
                          <div 
                            key={i} 
                            onClick={() => toggleTask(activePhaseIdx, i)}
                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex flex-col md:flex-row gap-8 items-center ${isDone ? 'bg-blue-500/5 border-blue-500/20 opacity-60' : 'bg-white/[0.03] border-white/10 hover:border-blue-500/40'}`}
                          >
                             <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${isDone ? 'bg-blue-500 border-blue-500' : 'border-white/20 group-hover:border-blue-500/50'}`}>
                                {isDone && <span className="text-black font-black text-xl">✓</span>}
                             </div>
                             
                             <div className="flex-1 text-center md:text-left">
                                <h4 className={`text-xl font-black uppercase tracking-tight italic mb-1 transition-all ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                                   {task.title}
                                </h4>
                                <p className={`text-base font-medium transition-all ${isDone ? 'text-gray-600' : 'text-gray-400'}`}>
                                   {task.desc}
                                </p>
                             </div>

                             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${task.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {task.priority}
                             </span>
                          </div>
                       )
                    })}
                 </div>
              </div>

           </div>

           {/* Finish Banner */}
           <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setActivePage("main")}
                className="px-12 py-4 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all hover:bg-blue-500 hover:text-white shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
              >
                Return to Command
              </button>
           </div>
        </div>

      </div>

    </div>
  );
}

export default KanbanBoard;
