import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "./api";

function PublicPitch() {
  const [data, setData] = useState(null);
  const [ideaStr, setIdeaStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ideaId = params.get("shared");
    
    if (!ideaId) {
      setError("Invalid share link.");
      setLoading(false);
      return;
    }

    const fetchPublicPitch = async () => {
      try {
        const response = await api.get(`/public/pitch/${ideaId}`);
        if (response.data.success) {
          setData(response.data.data);
          setIdeaStr(response.data.idea);
        } else {
          setError("Pitch not found or is private.");
        }
      } catch (err) {
        console.error("Network error fetching pitch:", err);
        setError("Network error fetching pitch.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPitch();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d001a]">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d001a] text-white">
        <div className="text-center bg-black/50 p-10 rounded-2xl border border-red-500/30">
          <h2 className="text-2xl text-red-400 font-bold mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05000a] text-white py-20 px-6 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Sovereign Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
             <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Founder Pitch Deck</span>
             <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest hidden md:block">Logic Integrity: 99.8%</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-8 leading-none">
            {data.tagline}
          </h1>
          
          <div className="max-w-2xl mx-auto p-8 rounded-[2.5rem] bg-indigo-950/10 border border-indigo-500/20 backdrop-blur-xl">
             <p className="text-xl text-indigo-100 italic leading-relaxed font-medium">
               "{ideaStr}"
             </p>
          </div>
        </motion.div>

        {/* Executive Summary Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/[0.02] rounded-[3rem] p-12 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden mb-12 group hover:border-indigo-500/20 transition-all"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-black italic select-none">SUM</div>
          <div className="relative z-10">
             <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-8 font-mono">01. Elevator Pitch</h2>
             <p className="text-2xl text-gray-200 leading-relaxed font-semibold italic">
               {data.elevator_pitch}
             </p>
          </div>
        </motion.div>

        {/* Strategic Narrative Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-[#0a0014] to-black rounded-[4rem] p-12 md:p-20 border border-white/5 shadow-2xl mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12 font-mono">02. The Complete Vision</h2>
          <p className="text-lg md:text-xl text-gray-300 whitespace-pre-line leading-relaxed font-medium">
            {data.investor_pitch}
          </p>
        </motion.div>

        {/* Sovereign Footer */}
        <div className="text-center border-t border-white/5 pt-16">
          <div className="mb-8">
             <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-1 italic">Sovereign Intel Node: 0x82A (Public)</p>
             <p className="text-indigo-400/40 font-mono text-[8px] uppercase tracking-widest">Empowered by LaunchMate Strategic AI</p>
          </div>
          <a href="/" className="inline-block px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            Analyze Your Venture
          </a>
        </div>
      </div>
    </div>
  );
}

export default PublicPitch;
