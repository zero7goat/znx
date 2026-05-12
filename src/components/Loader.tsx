import { motion } from 'motion/react';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Glow during loading */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-apple-gold/10 rounded-full blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-1 overflow-visible h-[120px]">
          {["Z", "N", "X"].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.15 + 0.3, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="text-7xl md:text-9xl font-black tracking-tighter text-white select-none pr-[0.1em]"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] w-[300px] bg-gradient-to-r from-transparent via-apple-gold/50 to-transparent mt-4"
        />
        
        <motion.div
          initial={{ opacity: 0, letterSpacing: "1.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.6em" }}
          transition={{ delay: 1.2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-[9px] font-black uppercase text-apple-gold/30"
        >
          Cinematic Evolution
        </motion.div>
      </div>

      {/* Aesthetic Line elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 right-0 h-px bg-white/5 origin-left"
        />
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 origin-top"
        />
      </div>
    </motion.div>
  );
}
