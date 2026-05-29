import React, { useRef, useEffect } from 'react';

interface AudioWaveformProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
}

export default function AudioWaveform({ videoRef, isMuted }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup high density drawing resolutions
    canvas.width = 160;
    canvas.height = 36;

    let localAudioCtx: AudioContext | null = null;

    const initAudio = () => {
      const video = videoRef.current;
      if (!video || audioCtxRef.current) return;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        localAudioCtx = new AudioContextClass();
        audioCtxRef.current = localAudioCtx;

        const analyser = localAudioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        // Connect media element source
        const source = localAudioCtx.createMediaElementSource(video);
        source.connect(analyser);
        analyser.connect(localAudioCtx.destination);
        sourceRef.current = source;
      } catch (err) {
        // Fallback elegantly if blocked or disabled due to security/cross-origin
      }
    };

    // Auto-resume if active
    if (!isMuted) {
      if (!audioCtxRef.current) {
        initAudio();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    let phase = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let data: Uint8Array | null = null;
      if (!isMuted && analyserRef.current && audioCtxRef.current && audioCtxRef.current.state === 'running') {
        analyserRef.current.getByteFrequencyData(dataArray);
        data = dataArray;
      }

      // Render Primary Wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(236, 227, 219, 0.7)';
      ctx.lineWidth = 1.5;

      const points = 12;
      const width = canvas.width;
      const height = canvas.height;
      const step = width / (points - 1);

      ctx.moveTo(0, height / 2);
      phase += 0.05;

      for (let i = 0; i < points; i++) {
        const x = i * step;
        let amplitude = 0;

        if (data) {
          const bin = Math.min(Math.floor((i / points) * data.length), data.length - 1);
          amplitude = (data[bin] / 255) * (height * 0.42);
        } else {
          // Micro-breathing wave when muted
          amplitude = Math.sin(phase + i * 0.4) * 2;
        }

        const y = height / 2 + Math.sin(phase + i * 0.35) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render Secondary Out-of-Phase Wave for elite aesthetic
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(223, 138, 108, 0.3)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);

      for (let i = 0; i < points; i++) {
        const x = i * step;
        let amplitude = 0;

        if (data) {
          const bin = Math.min(Math.floor(((points - 1 - i) / points) * data.length), data.length - 1);
          amplitude = (data[bin] / 255) * (height * 0.3);
        } else {
          amplitude = Math.cos(phase + i * 0.4) * 1.5;
        }

        const y = height / 2 - Math.sin(phase + i * 0.35) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMuted, videoRef]);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <canvas ref={canvasRef} className="w-[120px] h-[28px] opacity-80" />
      <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-[#ece3db]/40">
        {isMuted ? "MUTED IDLE" : "AUDIO SYNCED"}
      </span>
    </div>
  );
}
