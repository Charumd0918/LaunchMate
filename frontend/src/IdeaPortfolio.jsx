import { useState, useEffect } from "react";
import api from "./api";
import { motion } from "framer-motion";

function IdeaPortfolio({ setActivePage, setLatestIdea }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ideas");
      if (response.data.success) {
        setIdeas(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenIdea = (idea) => {
    setLatestIdea(idea);
    setActivePage("main");
  };

  const handleDeleteIdea = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this startup architecture from the vault?")) return;
    
    try {
      const response = await api.delete(`/ideas/${id}`);
      if (response.data.success) {
        setIdeas(ideas.filter(i => i._id !== id));
      }
    } catch (err) {
      console.error("Error deleting idea:", err);
    }
  };

  const handleClearAllHistory = async () => {
    const confirmation = window.confirm("WARNING: PROCEEDING WITH DEEP PURGE. This will permanently delete ALL startup architectures, caches, and progress logs from the Vault. Are you absolutely certain?");
    if (!confirmation) return;

    try {
      setLoading(true);
      const response = await api.delete("/ideas");
      if (response.data.success) {
        setIdeas([]);
      }
    } catch (err) {
      console.error("Error clearing history:", err);
      alert("Deep Purge failed. Check network link.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-purple-400 font-mono animate-pulse tracking-widest uppercase text-sm">Accessing Idea Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">The Idea Vault</h1>
           <p className="text-purple-500 font-mono text-sm uppercase tracking-[0.4em]">Your Secured Startup Architectures</p>
        </div>
        {ideas.length > 0 && (
          <button 
            onClick={handleClearAllHistory}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-red-500/10 hover:border-red-500/30 flex items-center gap-2 mb-1"
          >
            <span className="text-lg">☢</span> All Clear
          </button>
        )}
      </div>

      <div className="w-full max-w-6xl">
        {ideas.length === 0 ? (
          <div className="p-20 rounded-[4rem] bg-white/[0.02] border border-white/5 text-center flex flex-col items-center justify-center">
             <div className="text-6xl mb-6 opacity-30">📁</div>
             <p className="text-gray-500 text-xl font-medium leading-relaxed italic mb-8">
                "Your vault is currently empty. Start your first analysis to secure it here."
             </p>
             <button 
               onClick={() => setActivePage("input")}
               className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all"
             >
               Begin Initiation
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea, idx) => (
              <motion.div 
                key={idea._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleOpenIdea(idea)}
                className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/10 hover:border-purple-500/40 cursor-pointer group transition-all relative overflow-hidden shadow-2xl h-full flex flex-col justify-between"
              >
                {/* Delete Button (Always Semi-Visible) */}
                <div className="absolute top-0 right-0 p-8 z-20">
                   <button 
                     onClick={(e) => handleDeleteIdea(idea._id, e)}
                     className="text-white/20 hover:text-red-500 transition-colors p-2 rounded-lg bg-white/5 hover:bg-red-500/10"
                     title="Delete Architecture"
                   >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6 pr-8">
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${parseFloat(idea.score) >= 8 ? 'bg-emerald-500/20 text-emerald-400' : parseFloat(idea.score) >= 6 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                        Score: {idea.score?.toString().includes('/10') ? idea.score : `${idea.score}/10`}
                     </span>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-mono">
                        {new Date(parseInt(idea._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                     </span>
                  </div>

                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {idea.idea}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block group-hover:text-purple-400/60 transition-colors">Demand</span>
                        <span className="text-xs font-black text-white uppercase">{idea.demand || 'High'}</span>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block group-hover:text-purple-400/60 transition-colors">Rivals</span>
                        <span className="text-xs font-black text-white uppercase">{idea.competition || 'Low'}</span>
                     </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3 text-purple-600 text-[10px] font-black uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                   <span>Restore Architecture</span>
                   <span className="group-hover:translate-x-2 transition-transform select-none">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-20 pt-10 border-t border-white/5 flex justify-center">
         <button 
           onClick={() => setActivePage("main")}
           className="text-gray-600 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-colors"
         >
           Return to HUB Center
         </button>
      </div>

    </div>
  );
}

export default IdeaPortfolio;
