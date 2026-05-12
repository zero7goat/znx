import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress for butter-smooth transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms - optimized with smaller ranges for subtlety
  const y1 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -300]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, 200]);
  const rotate = useTransform(smoothProgress, [0, 1], [0, 90]);
  
  // Dynamic color transitions based on section
  // 0: Hero (Gold), 0.25: About (Silver/Blue), 0.5: Portfolio (Amber), 0.8: Process (Gold), 1: Contact (Deep Gold)
  const sphere1Color = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["rgba(226, 176, 126, 0.3)", "rgba(148, 163, 184, 0.2)", "rgba(255, 179, 71, 0.25)", "rgba(226, 176, 126, 0.3)", "rgba(226, 176, 126, 0.4)"]
  );

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-black">
      {/* 3D Glass Sphere 1 - Float Top Left */}
      <motion.div
        style={{ 
          y: y1, 
          rotate,
          backgroundColor: sphere1Color,
        }}
        className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] will-change-transform transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* 3D Glass Sphere 2 - Float Mid Right */}
      <motion.div
        style={{ 
          y: y2,
          rotate: useTransform(smoothProgress, [0, 1], [0, -45]),
        }}
        className="absolute top-[30%] right-[-15%] w-[600px] h-[600px] bg-apple-amber/10 rounded-full blur-[140px] will-change-transform transform-gpu"
      />

      {/* 3D Glass Sphere 3 - Bottom Left */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] bg-white/5 rounded-full blur-[110px] will-change-transform transform-gpu"
      />

      {/* Dynamic Ambient Background Glow */}
      <motion.div 
        style={{
          background: useTransform(
            smoothProgress,
            [0, 0.3, 0.6, 1],
            [
              "radial-gradient(circle at 50% 0%, rgba(226, 176, 126, 0.05) 0%, transparent 70%)",
              "radial-gradient(circle at 100% 50%, rgba(148, 163, 184, 0.05) 0%, transparent 70%)",
              "radial-gradient(circle at 0% 100%, rgba(255, 179, 71, 0.05) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(226, 176, 126, 0.08) 0%, transparent 70%)"
            ]
          )
        }}
        className="absolute inset-0 transition-colors duration-1000"
      />

      {/* Noise Texture & Vignette */}
      <div className="absolute inset-0 noise opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 vignette opacity-60" />
    </div>
  );
}
