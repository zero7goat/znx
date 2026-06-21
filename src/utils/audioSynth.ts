let projectorCtx: AudioContext | null = null;
let projectorHumNode: OscillatorNode | null = null;
let projectorNoiseSource: AudioBufferSourceNode | null = null;
let projectorGain: GainNode | null = null;

export function playMechanicalClick() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const bandpass = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    
    // Simulate mechanical tactile click sound (brief mechanical knock)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.035);
    
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(500, ctx.currentTime);
    bandpass.Q.setValueAtTime(4, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (err) {
    // Fail-safe
  }
}

export function startProjectorReelHum() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    projectorCtx = new AudioContextClass();
    
    // Technical camera mechanical hum generator (48Hz hum)
    const humOsc = projectorCtx.createOscillator();
    humOsc.type = 'triangle';
    humOsc.frequency.value = 48;
    
    const humGain = projectorCtx.createGain();
    humGain.gain.value = 0.025;
    
    // Pulsing shutter LFO oscillation (creating rhythmic rotation hum)
    const lfo = projectorCtx.createOscillator();
    lfo.frequency.value = 6; // 6Hz shutter rotations
    
    const lfoGain = projectorCtx.createGain();
    lfoGain.gain.value = 0.008;
    
    lfo.connect(lfoGain);
    lfoGain.connect(humGain.gain);
    
    humOsc.connect(humGain);
    
    // Crackle noise generator with low-pass filtering and intermittent crackle impulses
    const bufferSize = projectorCtx.sampleRate * 2.5; // 2.5 seconds loop
    const noiseBuffer = projectorCtx.createBuffer(1, bufferSize, projectorCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // White noise mix (ambient tape flutter)
      const white = Math.random() * 2 - 1;
      
      // Impulsive crackle pops
      let dustPop = 0;
      if (Math.random() < 0.00018) {
        dustPop = (Math.random() > 0.5 ? 1 : -1) * 0.35;
      }
      
      output[i] = (white * 0.008) + dustPop;
    }
    
    projectorNoiseSource = projectorCtx.createBufferSource();
    projectorNoiseSource.buffer = noiseBuffer;
    projectorNoiseSource.loop = true;
    
    const filter = projectorCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.5;
    
    const noiseGain = projectorCtx.createGain();
    noiseGain.gain.value = 0.09;
    
    projectorNoiseSource.connect(filter);
    filter.connect(noiseGain);
    
    // Connect mastering bus
    projectorGain = projectorCtx.createGain();
    projectorGain.gain.value = 0.15;
    
    humGain.connect(projectorGain);
    noiseGain.connect(projectorGain);
    projectorGain.connect(projectorCtx.destination);
    
    humOsc.start();
    lfo.start();
    projectorNoiseSource.start();
    
    projectorHumNode = humOsc;
  } catch (err) {
    // Fail-safe
  }
}

export function stopProjectorReelHum() {
  try {
    if (projectorHumNode) {
      projectorHumNode.stop();
      projectorHumNode = null;
    }
    if (projectorNoiseSource) {
      projectorNoiseSource.stop();
      projectorNoiseSource = null;
    }
    if (projectorCtx) {
      projectorCtx.close();
      projectorCtx = null;
    }
  } catch (err) {
    // Fail-safe
  }
}
