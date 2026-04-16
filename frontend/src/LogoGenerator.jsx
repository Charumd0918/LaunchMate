import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "./api";

function LogoGenerator({ idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get(`/logo-prompt?idea=${encodeURIComponent(idea)}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching logo prompt:", err);
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchLogo();
  }, [idea]);

  const copyPrompt = () => {
    if (data?.midjourney_prompt) {
      navigator.clipboard.writeText(data.midjourney_prompt);
      alert("Prompt copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d001a] via-black to-[#200040] text-white p-6">

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-8"
      >
        Brand & Logo AI 🎨
      </motion.h1>

      {loading ? (
         <div className="flex justify-center p-12">
            <p className="text-gray-400 animate-pulse text-lg">Designing your brand aesthetic and generating AI visual prompts...</p>
         </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* BRANDING CARD */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-2xl backdrop-blur-md shadow-xl flex flex-col gap-6"
           >
              <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                 <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Sovereign Brand Identity</h2>
                 <p className="text-3xl font-black text-white mb-2">{data.brand_name}</p>
                 <p className="text-gray-500 text-xs italic leading-relaxed">
                   {/* This handles the 'Etymological Reasoning' that the new prompt generates */}
                   "Etymological Rationale: {data.reasoning || 'Strategic nomenclature logic applied.'}"
                 </p>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                 <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Strategic Color Psychology</h2>
                 <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl" style={{ backgroundColor: data.primary_color }}></div>
                       <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{data.primary_color}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl" style={{ backgroundColor: data.secondary_color }}></div>
                       <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{data.secondary_color}</span>
                    </div>
                    <div className="flex-1 border-l border-white/10 pl-4">
                       <p className="text-[11px] text-gray-400 leading-relaxed italic">
                         {data.color_rationale || "Psychological triggers aligned with market entry strategy."}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                 <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Typography & Brand Voice</h2>
                 <p className="text-base font-bold text-purple-200 mb-1">{data.typography_style}</p>
                 <p className="text-[11px] text-gray-500 italic">"Rationale: {data.voice_justification || 'Visual tone optimized for trust and scalability.'}"</p>
              </div>
           </motion.div>

           {/* PROMPT GENERATOR CARD */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl backdrop-blur-md shadow-xl flex flex-col"
           >
              <h2 className="text-xl font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                Midjourney / DALL-E Prompt 🤖
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Copy this highly optimized prompt directly into any AI Image Generator to produce your logo.
              </p>

              <div className="bg-black/60 p-4 rounded-xl border border-white/10 mb-6 flex-1 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {data.midjourney_prompt}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={copyPrompt}
                className="w-full py-4 rounded-xl border border-indigo-500 text-indigo-400 font-bold transition flex justify-center items-center gap-2"
              >
                 📋 Copy Prompt
              </motion.button>
           </motion.div>

        </div>
      ) : (
         <p className="text-red-400">Failed to generate brand aesthetic.</p>
      )}
    </div>
  );
}

export default LogoGenerator;
