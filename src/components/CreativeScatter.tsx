import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CARD_ROTATION = 75; // All cards rotated exactly 75 degrees clockwise/to the right

const SCATTER_ITEMS = [
  {
    id: 0,
    eyebrow: 'Motion Design',
    title: 'NVIDIA',
    tag: 'BRAND DESIGN',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Top-Left corner: partially pushed out (approx 40% out, 60% visible)
    positionClass: '-top-8 -left-6 sm:-top-12 sm:-left-10',
    sizeClass: 'w-20 sm:w-28 md:w-34 lg:w-[135px]',
    hoverOffset: { x: 22, y: 22 }, // Moves inward on hover
  },
  {
    id: 1,
    eyebrow: 'Interactive Tech',
    title: 'NIKE RUN',
    tag: 'UX ARCHITECTURE DESIGN SYSTEM',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Middle-Left wall: partially pushed out (approx 35% out, 65% visible)
    positionClass: 'top-[36%] -left-8 sm:top-[38%] sm:-left-12',
    sizeClass: 'w-16 sm:w-22 md:w-26 lg:w-[110px]',
    hoverOffset: { x: 24, y: 0 },
  },
  {
    id: 2,
    eyebrow: 'Kinetic Physics',
    title: 'ADIDAS',
    tag: '3D MOTION LAB',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Bottom-Left corner: partially pushed out (approx 40% out, 60% visible)
    positionClass: '-bottom-8 -left-8 sm:-bottom-12 sm:-left-10',
    sizeClass: 'w-18 sm:w-24 md:w-28 lg:w-[125px]',
    hoverOffset: { x: 22, y: -22 },
  },
  {
    id: 3,
    eyebrow: 'Luxury Editorial',
    title: 'APPLE',
    tag: 'CREATIVE DIRECTION',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Top-Right corner: partially pushed out (approx 45% out, 55% visible)
    positionClass: '-top-10 -right-8 sm:-top-14 sm:-right-12',
    sizeClass: 'w-24 sm:w-32 md:w-38 lg:w-[155px]',
    hoverOffset: { x: -24, y: 24 },
  },
  {
    id: 4,
    eyebrow: 'Ambient Light',
    title: 'SONY',
    tag: 'SPATIAL 3D EXPERIENCES',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Middle-Right wall: partially pushed out (approx 40% out, 60% visible)
    positionClass: 'top-[34%] -right-10 sm:top-[36%] sm:-right-14',
    sizeClass: 'w-18 sm:w-24 md:w-28 lg:w-[120px]',
    hoverOffset: { x: -24, y: 0 },
  },
  {
    id: 5,
    eyebrow: 'Electric Core',
    title: 'HYUNDAI',
    tag: 'WEB DESIGN',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Bottom-Right corner: partially pushed out (approx 40% out, 60% visible)
    positionClass: '-bottom-8 -right-8 sm:-bottom-12 sm:-right-10',
    sizeClass: 'w-20 sm:w-28 md:w-34 lg:w-[140px]',
    hoverOffset: { x: -22, y: -22 },
  },
  {
    id: 6,
    eyebrow: 'Futuristic HUD',
    title: 'CYBER',
    tag: 'METAVERSE SHADER GRAPH',
    image: 'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
    // Top-Middle ceiling: partially pushed out (approx 45% out, 55% visible)
    positionClass: '-top-10 left-[42%] sm:-top-16 sm:left-[45%]',
    sizeClass: 'w-20 sm:w-26 md:w-30 lg:w-[130px]',
    hoverOffset: { x: 0, y: 24 },
  },
];

export default function CreativeScatter() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (isManual) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCATTER_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isManual]);

  const currentItem = SCATTER_ITEMS[activeIndex];

  return (
    <section
      id="brand-scatter"
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-[#000000] overflow-hidden select-none flex items-center justify-center py-16 border-b border-white/[0.04]"
    >
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      {/* Central Interactive Text Container (Mask Slide Reveal Animation) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 text-center select-none">
        
        {/* Eyebrow Mask Wrapper */}
        <div className="overflow-hidden h-[18px] flex items-center justify-center mb-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] sm:text-xs font-mono-tech tracking-[0.25em] text-neutral-400 uppercase leading-none block"
            >
              {currentItem.eyebrow}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Title Mask Wrapper */}
        <div className="overflow-hidden h-[45px] sm:h-[65px] md:h-[80px] lg:h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeIndex}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-sans font-black tracking-tight text-white uppercase leading-none select-none"
            >
              {currentItem.title}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Layout-Animated Category Tag Box - Changes width slowly and smoothly according to text length */}
        <motion.div
          layout
          transition={{
            layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="mt-4 bg-[#EDEAE3] px-6 py-1.5 rounded-none shadow-md overflow-hidden relative h-[34px] flex items-center justify-center border border-white/5 whitespace-nowrap z-30"
        >
          {/* Transparent flow dummy span that holds open the container to exactly the active text width */}
          <span className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-transparent uppercase select-none pointer-events-none block h-0 overflow-hidden">
            {currentItem.tag}
          </span>

          {/* Animating visible absolute text span */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#802223] uppercase whitespace-nowrap block"
            >
              {currentItem.tag}
            </motion.span>
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Scattered Images Loop (No overlaps, 75 degree angle, partially visible on borders, moving forward on hover) */}
      <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
        {SCATTER_ITEMS.map((item) => {
          const isActive = activeIndex === item.id;
          
          // Animate translation offsets to move inward/forward on hover
          const hoverX = isActive ? item.hoverOffset.x : 0;
          const hoverY = isActive ? item.hoverOffset.y : 0;

          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => {
                setActiveIndex(item.id);
                setIsManual(true);
              }}
              onMouseLeave={() => {
                setIsManual(false);
              }}
              animate={{
                x: hoverX,
                y: hoverY,
                opacity: isActive ? 1.0 : 0.4,
                zIndex: isActive ? 30 : 10,
              }}
              style={{
                scale: 0.9, // Constant scale, strictly NO ZOOM as requested
                rotate: CARD_ROTATION, // Exact same rotation angle of 75 degrees
              }}
              transition={{
                type: 'spring',
                stiffness: 110,
                damping: 18,
                mass: 0.6,
              }}
              className={`custom-hover-card absolute ${item.positionClass} ${item.sizeClass} aspect-[4/5] bg-neutral-900 overflow-hidden shadow-2xl rounded-none border-none select-none cursor-pointer will-change-transform`}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
