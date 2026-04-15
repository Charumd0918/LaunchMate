import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, useScroll, useTransform } from "framer-motion";

const ModernBackground = () => {
  const [init, setInit] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -500]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    background: { color: "transparent" },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: ["grab", "bubble"] },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          links: { opacity: 0.6, color: "#c084fc" }
        },
        bubble: {
          distance: 250,
          size: 8,
          duration: 2,
          opacity: 0.8,
          color: "#ffffff"
        },
      },
    },
    particles: {
      color: { value: ["#a855f7", "#8b5cf6", "#6366f1", "#ffffff"] },
      links: {
        enable: true,
        distance: 180,
        color: "#c084fc",
        opacity: 0.4, // HIGH VISIBILITY
        width: 1.5,   // THICKER LINES
        triangles: {
          enable: true,
          opacity: 0.05,
          color: "#a855f7"
        }
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
      },
      number: {
        value: 60,
        density: { enable: true, area: 800 },
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        }
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 4 },
      },
      shadow: {
        enable: true,
        blur: 5,
        color: "#a855f7"
      }
    },
    detectRetina: true,
  }), []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-[#050010]">
      {/* 1. Deep Space Base (Slightly more dark purple) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,0,35,1)_0%,_rgba(3,0,10,1)_100%)]" />
      
      {/* 2. Floating Kinetic Orbs (More intense colors) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: orb1Y }}
          animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen"
        />
        <motion.div 
          style={{ y: orb2Y }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 blur-[130px] rounded-full mix-blend-screen"
        />
      </div>

      {/* 3. High-Intensity Particle Constellation */}
      {init && (
        <Particles
          id="tsparticles-premium"
          className="absolute inset-0 h-full w-full pointer-events-none"
          options={particlesOptions}
        />
      )}

      {/* 4. GLASS REFLECTION LAYER (The SHEEN) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-[400%] h-[400%] bg-gradient-to-br from-white/10 via-transparent to-white/5 animate-sheen" />
      </div>

      {/* 5. VIGILANT AI GLOW (Radial Mask) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.1)_0%,_transparent_50%)]" />
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none contrast-150 brightness-150" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};

export default ModernBackground;
