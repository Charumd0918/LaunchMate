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
    <div className="min-h-screen bg-gradient-to-b from-[#0d001a] to-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 font-bold tracking-widest text-sm uppercase mb-4">Founder Pitch Deck</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 leading-tight">
            "{data.tagline}"
          </h1>
          <p className="text-xl text-gray-300 italic max-w-2xl mx-auto border-l-4 border-purple-500/50 pl-6 py-2">
            {ideaStr}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#140026] rounded-3xl p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden mb-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/20 pb-4">Elevator Pitch</h2>
          <p className="text-lg text-gray-200 leading-relaxed relative z-10">
            {data.elevator_pitch}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/60 rounded-3xl p-10 border border-white/5 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-purple-500/20 pb-4">The Complete Vision</h2>
          <p className="text-base text-gray-300 whitespace-pre-line leading-loose">
            {data.investor_pitch}
          </p>
        </motion.div>

        <div className="text-center border-t border-purple-500/20 pt-10">
          <p className="text-gray-500 text-sm mb-4">Empowered by LaunchMate AI</p>
          <a href="/" className="inline-block px-6 py-2 bg-purple-600/20 text-purple-400 font-bold rounded-full border border-purple-500/30 hover:bg-purple-600/40 transition">
            Start Your Own Startup
          </a>
        </div>
      </div>
    </div>
  );
}

export default PublicPitch;
