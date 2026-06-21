import React, { useEffect, useRef, useState } from 'react';

export default function WebGLLiquid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if desktop user has fine cursor and wide screen
    const checkDesktop = () => {
      const isDesk = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;
      setIsDesktop(isDesk);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    // Vertex shader source - absolute simple vertex projection
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader source - calculates smooth fluid flow without cursor-drag distortion
    const fsSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_ripple_intensity;

      // GLSL Procedural 2D noise for organic flow structures
      vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        const float K1 = 0.366025403; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        float m = step(a.y, a.x);
        vec2 o = vec2(m, 1.0 - m);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;

        vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));

        return dot(n, vec3(70.0));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 p = uv * aspect;

        // Generate fluid flow structure using stacked sine/cosine noise fields
        float flowNoise1 = noise(p * 2.0 + vec2(u_time * 0.06, -u_time * 0.05));
        float flowNoise2 = noise(p * 4.5 + vec2(-u_time * 0.04, u_time * 0.08));
        
        float pulse = sin(u_time * 1.5) * 0.5 + 0.5;
        vec2 offset = vec2(flowNoise1 * 0.012 + flowNoise2 * 0.005) + vec2(pulse * u_ripple_intensity * 0.05);

        // Apply a subtle luxury background shift to simulate the "liquid washing over the background"
        vec3 colorBg = vec3(0.047, 0.039, 0.035); // Deep background color charcoal equivalent
        
        // Add subtle chromatic distortion highlight near flows
        float shift = length(offset);
        vec3 colorRipple = vec3(0.925, 0.890, 0.859) * 0.05 * shift * 15.0; // Warm clay color highlights

        vec3 finalColor = colorBg + colorRipple;
        gl_FragColor = vec4(finalColor, 0.16); // Blend translucent WebGL so tailwind page layers can mix
      }
    `;

    // Compile Helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compiler error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    // Program Setup
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRippleIntensity = gl.getUniformLocation(program, 'u_ripple_intensity');

    // Buffer Setup for viewport-aligned quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([
      -1, -1, 
       1, -1, 
      -1,  1, 
      -1,  1, 
       1, -1, 
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

    let targetIntensity = 0;
    let currentIntensity = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Listen for global custom events to trigger ripple on page transitions or section transitions
    const handleTransitionRipple = () => {
      targetIntensity = 3.5; // High swell
    };
    window.addEventListener('trigger-liquid-ripple', handleTransitionRipple);

    let startTime = Date.now();
    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000.0;

      currentIntensity = currentIntensity * 0.93 + targetIntensity * 0.07;
      targetIntensity *= 0.95; // Decay intensity slowly

      // Set WebGL viewport Uniforms
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uRippleIntensity, currentIntensity);

      // Clear color
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('trigger-liquid-ripple', handleTransitionRipple);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] select-none opacity-35 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
