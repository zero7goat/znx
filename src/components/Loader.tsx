import { motion } from 'motion/react';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[100] bg-[#0c0a09] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-1 overflow-visible h-[120px]">
          {["Z", "N", "X"].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.12 + 0.2, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="text-7xl md:text-9xl font-black tracking-tighter text-[#ece3db] select-none pr-[0.1em]"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] w-[200px] bg-[#ece3db]/20 mt-4"
        />
        
        <motion.div
          initial={{ opacity: 0, letterSpacing: "1.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ delay: 0.9, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-[9px] font-black uppercase text-[#ece3db]/60 tracking-[0.4em]"
        >
          Cinematic Evolution
        </motion.div>
      </div>

      {/* Aesthetic Line elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 right-0 h-px bg-[#ece3db]/5 origin-left"
        />
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 left-1/2 w-px bg-[#ece3db]/5 origin-top"
        />
      </div>
    </motion.div>
  );
}
