import { motion, useAnimation, AnimatePresence } from "framer-motion";
import ModernBackground from "./ModernBackground";

import { useState, useEffect, useRef } from "react";

function Home({ setPage }) {
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("input");
    } else {
      setPage("login");
    }
  };

  // Stagger Text Animation Variant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 10 } }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col selection:bg-purple-500/30">

      {/* NEW PREMIUM BACKGROUND SYSTEM */}
      <ModernBackground />

      {/* NAVBAR */}
      <header className="relative z-50">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 lg:px-12 border-b border-white/5 bg-black/40 backdrop-blur-xl"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-white font-black text-2xl cursor-pointer flex items-center gap-2 italic tracking-tighter uppercase"
              onClick={() => setPage("home")}
            >
              Launch<span className="text-purple-500">Mate</span>
              <motion.span 
                 animate={{ rotate: [0, -10, 10, -10, 0] }} 
                 transition={{ duration: 3, repeat: Infinity }}
                 className="not-italic"
              >
                🚀
              </motion.span>
            </motion.span>
          </div>

          {/* Menu */}
          <div className="hidden lg:flex lg:gap-x-12">
            {["product", "features", "about"].map((item) => (
              <motion.span
                key={item}
                whileHover={{ y: -2, color: "#fff" }}
                onClick={() => setPage(item)}
                className="text-[10px] font-black text-gray-500 cursor-pointer uppercase tracking-[0.4em] transition-colors"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Login Link */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <motion.button
               whileHover={{ x: 5, color: "#fff" }}
               onClick={() => setPage("login")}
               className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 transition-colors"
            >
               Secure Login →
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 lg:px-8 pt-10 pb-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="glass-panel px-8 py-3 rounded-full relative overflow-hidden inline-flex items-center gap-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]" />
              <span className="text-purple-300/80 font-black tracking-[0.5em] text-[10px] uppercase">
                Sovereign AI Engine Online
              </span>
            </div>
          </motion.div>

          {/* High-Impact Main Text */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter italic uppercase"
          >
            Go From Idea <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-600">to Scale.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-10 leading-relaxed font-medium italic"
          >
            Deep analysis. Tactical roadmaps. Automated marketing. <br />
            Everything your startup needs to out-build the competition.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-10"
          >
            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 50px rgba(168, 85, 247, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] text-white bg-purple-600 border border-purple-400/50 shadow-2xl transition-all"
            >
              Audit Your Idea ⚡
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "white", color: "white", backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage("features")}
              className="px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] text-gray-400 glass-panel transition-all"
            >
               Explore Toolkit
            </motion.button>
          </motion.div>

        </motion.div>



      </div>
    </div>
  );
}

export default Home;