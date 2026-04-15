import { useState, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // SNAPPY SPRINGS: High performance tracking
  const springConfig = { stiffness: 3500, damping: 65, mass: 0.05 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const mouseMove = e => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    const mouseOver = e => {
      const target = e.target;
      const isInteractable = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.interactable') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isInteractable);
    };

    const style = document.createElement("style");
    style.innerHTML = `
      * { cursor: none !important; }
      
      .stellar-core {
        position: fixed;
        top: 0;
        left: 0;
        width: 5px;
        height: 5px;
        background: #fff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100001;
        transform: translate3d(var(--cursor-x), var(--cursor-y), 0);
        margin-left: -2.5px;
        margin-top: -2.5px;
        box-shadow: 0 0 10px #fff, 0 0 20px rgba(168, 85, 247, 0.7);
        filter: blur(0.2px);
        will-change: transform;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mouseover", mouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mouseover", mouseOver);
      document.head.removeChild(style);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* COMPACT STELLAR CORE */}
      <div className="stellar-core hidden md:block" />

      {/* REVERTED SPARK DESIGN (SMALLER) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100000] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform"
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : (isHovering ? 1.4 : 1),
            rotate: isHovering ? 45 : 0,
            opacity: 1
          }}
          transition={{ type: "spring", stiffness: 1000, damping: 50 }}
          className="relative flex items-center justify-center"
        >
          {/* 4-Pointed Spark (Smaller version) */}
          <svg 
            width={isHovering ? "32" : "24"} 
            height={isHovering ? "32" : "24"} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
          >
            <path 
              d="M50 0L56 44L100 50L56 56L50 100L44 56L0 50L44 44L50 0Z" 
              fill="white"
            />
          </svg>

          {/* Subtle Breathing Aura */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-purple-500/20 blur-[15px] rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* PULSING CLICK FLASH */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-16 h-16 bg-white/30 rounded-full blur-[8px] pointer-events-none z-[99999] hidden md:block"
            style={{
              x: mouseX,
              y: mouseY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default CustomCursor;
