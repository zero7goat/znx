import React, { useEffect, useState } from 'react';

export default function LiquidFilter() {
  const [scale, setScale] = useState(0);
  const [freq, setFreq] = useState(0.01);

  useEffect(() => {
    const triggerRipple = (e: Event) => {
      const customEvent = e as CustomEvent;
      const duration = customEvent.detail?.duration || 1000;
      const maxScale = customEvent.detail?.scale || 40;
      
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Sine curve for wave ripple swell (0 -> max -> 0)
        const currentScale = Math.sin(progress * Math.PI) * maxScale;
        const currentFreq = 0.01 + Math.sin(progress * Math.PI) * 0.015;
        
        setScale(currentScale);
        setFreq(currentFreq);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setScale(0);
        }
      };
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('trigger-liquid-ripple', triggerRipple);
    return () => window.removeEventListener('trigger-liquid-ripple', triggerRipple);
  }, []);

  return (
    <svg className="absolute w-0 h-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <defs>
        <filter id="liquid-dist">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency={`${freq}`} 
            numOctaves="3" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale={`${scale}`} 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>
  );
}

export function triggerLiquidRipple(scale = 40, duration = 1000) {
  const event = new CustomEvent('trigger-liquid-ripple', { detail: { scale, duration } });
  window.dispatchEvent(event);
}
