import { useState, useEffect, useCallback } from "react";
import api from "./api";
import { motion, AnimatePresence } from "framer-motion";

function Pitch({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState("slides"); // "slides" or "narrative"

  const fetchPitch = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const url = `/pitch?idea=${encodeURIComponent(idea)}${refresh ? '&refresh=true' : ''}`;
      const response = await api.get(url);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching pitch:", err);
    } finally {
      setLoading(false);
    }
  }, [idea]);

  useEffect(() => {
    if (idea) fetchPitch();
  }, [idea, fetchPitch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-400 font-mono animate-pulse tracking-[0.4em] uppercase text-[10px] mb-2">Synthesizing Narrative Script...</p>
        <p className="text-gray-500 font-mono text-[8px] uppercase tracking-widest">Encoding strategic highlights & investor logic</p>
      </div>
    );
  }

  if (!data) return (
    <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20 text-center">
      <p className="text-red-500 font-mono uppercase text-sm mb-4">STORYTELLER NODE OFFLINE</p>
      <button onClick={() => fetchPitch(true)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10 tracking-widest">Re-Scan Environment (Fresh Intel)</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[8px] font-black uppercase tracking-widest rounded">Sovereign Narrative Mode</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Pitch Deck</h1>
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Strategic Storytelling • Pitch Sequence Logic</p>
         </div>
         <button 
           onClick={() => fetchPitch(true)}
           className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
         >
           <span className="animate-spin-slow">↻</span> Force Re-Scan
         </button>
         
         <div className="relative z-50 flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md self-center md:self-auto">
            <button 
               onClick={() => setViewMode("slides")}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${viewMode === "slides" ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" : "text-gray-500 hover:text-white"}`}
            >
               Slide View
            </button>
            <button 
               onClick={() => setViewMode("narrative")}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${viewMode === "narrative" ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" : "text-gray-500 hover:text-white"}`}
            >
               Narrative Mode
            </button>
         </div>
      </div>

      <div className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {viewMode === "slides" ? (
            <motion.div 
              key="slides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                    {data.tagline}
                 </h2>
                 <p className="text-gray-300 text-lg leading-relaxed italic max-w-2xl mx-auto">
                    "{data.elevatorPitch}"
                 </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                 {/* Nav */}
                 <div className="lg:col-span-3 space-y-3">
                    {data.slides.map((slide, i) => (
                       <button 
                         key={i} 
                         onClick={() => setCurrentSlide(i)}
                         className={`w-full p-4 rounded-2xl border text-left transition-all ${currentSlide === i ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500/50' : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-100'}`}
                       >
                          <div className="text-[10px] font-mono text-indigo-400 mb-1">SLIDE 0{slide.slideNumber}</div>
                          <h4 className="text-white font-bold text-sm uppercase tracking-tighter truncate">{slide.title}</h4>
                       </button>
                    ))}
                 </div>

                 {/* Slide View */}
                 <div className="lg:col-span-9 p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#110022] to-black border border-indigo-500/20 flex flex-col justify-center min-h-[450px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full"></div>
                    
                    <AnimatePresence mode="wait">
                       <motion.div 
                          key={currentSlide}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="relative z-10 space-y-8"
                       >
                          <div className="space-y-2">
                             <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">{data.slides[currentSlide].title}</h4>
                             <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-tight">{data.slides[currentSlide].headline}</h3>
                          </div>
                          
                          <p className="text-gray-200 text-xl leading-relaxed max-w-3xl font-medium">
                             {data.slides[currentSlide].content}
                          </p>

                          <div className="flex flex-wrap gap-4">
                             {data.slides[currentSlide].keyPoints.map((pt, idx) => (
                                <div key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex gap-3 items-center">
                                   <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                                   <span className="text-xs font-black text-indigo-100 uppercase tracking-widest">{pt}</span>
                                </div>
                             ))}
                          </div>
                       </motion.div>
                    </AnimatePresence>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="narrative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
               <div className="p-12 md:p-20 rounded-[4rem] bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 text-center font-mono">The 60-Second Teleprompter</h3>
                  
                  <div className="text-3xl md:text-4xl font-bold text-white leading-relaxed text-center italic font-serif">
                     {data.narrative_script}
                  </div>

                  <div className="mt-12 flex justify-center">
                     <div className="px-8 py-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-black uppercase tracking-[0.2em]">
                        Read this slowly to sound like a Pro
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ SECTION */}
        <div className="mt-24 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5">
           <div className="text-center mb-16">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-4 font-mono">Smart Q&A Session</h3>
              <h2 className="text-3xl font-black text-white italic tracking-tighter">Your Investor Shield</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {data.investorFAQ?.map((faq, i) => (
                 <div key={i} className="p-10 rounded-[2.5rem] bg-black/40 border border-indigo-500/10 group hover:border-indigo-500/40 transition-all hover:-translate-y-1">
                    <h4 className="text-indigo-300 font-black text-lg mb-6 flex gap-4">
                       <span className="text-indigo-600 font-mono italic text-2xl">?</span>
                       {faq.question}
                    </h4>
                    <p className="text-gray-200 text-base leading-relaxed pl-8 border-l-2 border-indigo-500/10 font-medium">
                       {faq.answer}
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="mt-24 pt-10 border-t border-white/5 w-full max-w-6xl flex justify-center">
         <button 
           onClick={() => setActivePage("main")}
           className="text-gray-500 hover:text-indigo-400 font-black uppercase tracking-[0.3em] text-xs transition-colors"
         >
           ← Return to Command Station
         </button>
      </div>

    </div>
  );
}

export default Pitch;