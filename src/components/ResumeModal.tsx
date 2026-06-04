import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, Hand } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialTouchScaleRef = useRef<number>(1);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset function
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse Wheel / Trackpad Scroll to Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 0.08;
    const change = e.deltaY < 0 ? zoomFactor : -zoomFactor;
    
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale + change * prevScale, 0.6), 5);
      return nextScale;
    });
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    // Bounds limit based on zoom scale
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Pinch-to-Zoom & Drag-to-Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single finger drag start
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
      initialTouchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      // Two fingers pinch start
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      initialTouchDistanceRef.current = distance;
      initialTouchScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Dragging
      const touch = e.touches[0];
      const newX = touch.clientX - dragStartRef.current.x;
      const newY = touch.clientY - dragStartRef.current.y;
      setPosition({ x: newX, y: newY });
    } else if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      // Pinching
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      const changeRatio = currentDistance / initialTouchDistanceRef.current;
      const targetScale = Math.min(
        Math.max(initialTouchScaleRef.current * changeRatio, 0.6),
        5
      );
      setScale(targetScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistanceRef.current = null;
  };

  // Zoom Button controls
  const zoomIn = () => {
    setScale(prev => Math.min(prev * 1.25, 5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev * 0.8, 0.6));
  };

  return (
    <AnimatePresence>
      {isOpen && (
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#070605] select-none overscroll-none"
        >
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between px-6 pt-6 pb-2 relative z-50">
            <div className="flex items-center gap-2 text-clay">
              <Hand size={18} className="animate-pulse" />
              <div className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-black uppercase">
                Interactive Viewer • Pinch/Scroll to Zoom, Drag to Pan
              </div>
              <div className="inline-block sm:hidden text-[10px] tracking-[0.2em] font-black uppercase">
                Drag to pan • Pinch to zoom
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-[var(--theme-border)] bg-[#181412] hover:bg-[#241c18] text-clay hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-md cursor-pointer"
              title="Close and return to App"
            >
              <X size={24} />
            </button>
          </div>

          {/* Interactive Zoom Map Area */}
          <div
            ref={containerRef}
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              style={{
                x: position.x,
                y: position.y,
                scale: scale,
              }}
              className="relative max-w-[90%] max-h-[85vh] flex items-center justify-center pointer-events-none origin-center"
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <img
                ref={imageRef}
                src="/Images/RESUME.png"
                alt="Suyog BC Resume"
                className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-[var(--theme-border)]"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Floating Dock Tool Bar */}
          <div className="w-full pb-8 pt-2 flex justify-center relative z-50">
            <div className="flex items-center gap-4 px-6 py-3 bg-[#120f0e] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[#ece3db]/25">
              <button
                onClick={zoomOut}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#fb5d30] hover:text-[#ece3db] hover:bg-[#ece3db]/10 active:scale-90 transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              
              <div className="text-[11px] text-[#ece3db] font-mono font-black tracking-widest uppercase w-16 text-center select-none bg-black/40 py-1.5 px-3 rounded-lg border border-[#ece3db]/10">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={zoomIn}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#fb5d30] hover:text-[#ece3db] hover:bg-[#ece3db]/10 active:scale-90 transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>

              <div className="w-px h-6 bg-[#ece3db]/20 mx-1" />

              <button
                onClick={resetView}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#fb5d30] hover:text-[#ece3db] hover:bg-[#ece3db]/10 active:scale-90 transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
