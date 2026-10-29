import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function ShowreelModal({ isOpen, onClose, videoUrl, title }: ShowreelModalProps) {
  const srcUrl = videoUrl || "https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1";
  const closeRef = useRef<HTMLButtonElement>(null);
  // Parents pass inline callbacks; keep the latest in a ref so the effect only runs on open/close
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape to close, lock page scroll, and move focus into the dialog while open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  // Portal to <body>: the modal is rendered from inside sticky/stacked sections whose
  // stacking contexts would otherwise let later sections paint over it
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Video player'}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 sm:p-12 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* YouTube Cinema Video Player */}
            <div className="absolute inset-0 z-10 w-full h-full bg-black">
              <iframe
                src={srcUrl}
                title={title || "ZNX Studio Cinema Showreel"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
