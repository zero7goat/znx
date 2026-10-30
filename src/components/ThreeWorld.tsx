import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { liquidField, liquidFalloff } from '../utils/liquidField';

// ── Cinematic Camera Waypoints (Synchronized with remaining sections: Hero, Work, Services, Footer) ──
const CAM_WAYPOINTS = [
  { p: [0.0, 3.5, 12.0],  t: [0.0, 0.0, 0.0],    fov: 38 }, // 0: Hero (Central 3D ZNX core wireframe)
  { p: [1.8, 1.2, 2.8],   t: [-2.2, 0.3, -2.5],  fov: 42 }, // 1: Portfolio/Work (close fly-past)
  { p: [3.2, 0.2, -7.5],  t: [-2.4, 0.2, -12.0], fov: 46 }, // 2: Services (Panning across futuristic node geometry)
  { p: [0.0, 6.5, -14.0], t: [0.0, 10.5, -24.0], fov: 40 }, // 3: Footer/CTA (Looking up towards starry skies)
];

interface ThreeWorldProps {
  /** Keep rendering at every scroll position (pages where the canvas stays visible as a backdrop) */
  fullPage?: boolean;
}

export default function ThreeWorld({ fullPage = false }: ThreeWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgRef = useRef(0);
  const smoothProgRef = useRef(0);
  const mouseRef = useRef({ tx: 0, ty: 0, mx: 0, my: 0 });
  // Read inside the render loop so switching pages never rebuilds the scene
  const fullPageRef = useRef(fullPage);
  fullPageRef.current = fullPage;
  const remeasureRef = useRef<() => void>(() => {});

  // Page content swaps underneath the canvas; re-measure scroll anchors once it has rendered
  useEffect(() => {
    const id = requestAnimationFrame(() => remeasureRef.current());
    return () => cancelAnimationFrame(id);
  }, [fullPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile/tablet touch screens to simplify scene and disable post-processing
    const isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 1024);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Create Scene, Camera, and WebGL Renderer ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

    const camera = new THREE.PerspectiveCamera(
      CAM_WAYPOINTS[0].fov,
      window.innerWidth / window.innerHeight,
      0.1,
      150
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // A soft, fogged particle field gains nothing visible above 1.5x, but costs 1.8x the pixels at 2x
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // ── 2. Add Ambient and Directional Lights ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0x802223, 8, 30);
    redLight.position.set(0, 3, 2);
    scene.add(redLight);

    const goldLight = new THREE.PointLight(0xd4af37, 4, 25);
    goldLight.position.set(-3, -2, -4);
    scene.add(goldLight);

    // ── 3. Build Spline Curves for Smooth Camera Flight ──
    const pointsP = CAM_WAYPOINTS.map(w => new THREE.Vector3(w.p[0], w.p[1], w.p[2]));
    const pointsT = CAM_WAYPOINTS.map(w => new THREE.Vector3(w.t[0], w.t[1], w.t[2]));

    const curveP = new THREE.CatmullRomCurve3(pointsP, false, 'catmullrom', 0.42);
    const curveT = new THREE.CatmullRomCurve3(pointsT, false, 'catmullrom', 0.42);

    // ── 6. Floating Dust/Star Particle System (High-End Atmosphere) ──
    const pCount = isMobile ? 120 : 800;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 35;
      pPositions[i + 1] = (Math.random() - 0.5) * 20;
      pPositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      fog: true,
    });

    // Liquid cursor: the particles move with the same water field that distorts the page (see
    // utils/liquidField), replacing a full-screen SVG filter pass over this canvas. Each particle's
    // screen-space shift is computed on the CPU (800 particles x a few dozen stamps, only while the water
    // moves) and added after projection; the shader itself gains a single vec2 add and no loops.
    const liquidShift = new Float32Array(pCount * 2);
    const liquidAttr = new THREE.BufferAttribute(liquidShift, 2);
    pGeo.setAttribute('aLiquid', liquidAttr);
    const viewport = new THREE.Vector2(window.innerWidth, window.innerHeight);
    pMat.onBeforeCompile = (shader) => {
      shader.uniforms.uViewport = { value: viewport };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
attribute vec2 aLiquid;
uniform vec2 uViewport;`)
        .replace('#include <project_vertex>', `#include <project_vertex>
gl_Position.xy += vec2(aLiquid.x / uViewport.x, -aLiquid.y / uViewport.y) * 2.0 * gl_Position.w;`);
    };

    const viewProj = new THREE.Matrix4();
    const projected = new THREE.Vector3();
    let liquidWasActive = false;
    const updateLiquidShift = () => {
      const count = liquidField.count;
      if (count === 0) {
        if (liquidWasActive) {
          liquidShift.fill(0);
          liquidAttr.needsUpdate = true;
        }
        liquidWasActive = false;
        return;
      }
      liquidWasActive = true;
      particles.updateMatrixWorld();
      camera.updateMatrixWorld();
      viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(particles.matrixWorld);
      const positions = pGeo.getAttribute('position').array as Float32Array;
      const { stamps, radii } = liquidField;
      for (let p = 0; p < pCount; p++) {
        projected.set(positions[p * 3], positions[p * 3 + 1], positions[p * 3 + 2]).applyMatrix4(viewProj);
        let sx = 0;
        let sy = 0;
        if (projected.z < 1) {
          const px = (projected.x * 0.5 + 0.5) * viewport.x;
          const py = (0.5 - projected.y * 0.5) * viewport.y;
          for (let i = 0; i < count; i++) {
            const r = Math.hypot(px - stamps[i * 4], py - stamps[i * 4 + 1]) / radii[i];
            if (r >= 1) continue;
            const w = liquidFalloff(r);
            sx += stamps[i * 4 + 2] * w;
            sy += stamps[i * 4 + 3] * w;
          }
        }
        liquidShift[p * 2] = sx;
        liquidShift[p * 2 + 1] = sy;
      }
      liquidAttr.needsUpdate = true;
    };

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── 9. Pointer Handlers (Desktop Only) ──
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // ── 9b. Device-orientation parallax (touch devices) ──
    // Tilting the phone feeds the same camera-drift targets as the desktop mouse; the render
    // loop already smooths them, so the handler only writes two numbers (no React state).
    const ORIENTATION_RANGE_DEG = 20;
    let orientationBase: { x: number; y: number } | null = null;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // Map device axes onto screen axes for the current screen rotation
      const angle = screen.orientation?.angle ?? 0;
      let x = e.gamma;
      let y = e.beta;
      if (angle === 90) {
        x = e.beta;
        y = -e.gamma;
      } else if (angle === 270 || angle === -90) {
        x = -e.beta;
        y = e.gamma;
      }
      // The first reading is "neutral"; drift the neutral slowly so the effect re-centres
      // to however the phone is being held
      if (!orientationBase) orientationBase = { x, y };
      orientationBase.x += (x - orientationBase.x) * 0.003;
      orientationBase.y += (y - orientationBase.y) * 0.003;
      mouseRef.current.tx = THREE.MathUtils.clamp((x - orientationBase.x) / ORIENTATION_RANGE_DEG, -1, 1);
      mouseRef.current.ty = THREE.MathUtils.clamp(-(y - orientationBase.y) / ORIENTATION_RANGE_DEG, -1, 1);
    };
    const resetOrientationBase = () => {
      orientationBase = null;
    };

    let orientationListening = false;
    const startOrientation = () => {
      if (orientationListening) return;
      orientationListening = true;
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      screen.orientation?.addEventListener('change', resetOrientationBase);
    };
    // iOS 13+ only grants sensor access from inside a user gesture, so ask on the first tap
    const OrientationEventCtor = (window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
    }).DeviceOrientationEvent;
    const requestOrientationPermission = () => {
      window.removeEventListener('touchend', requestOrientationPermission);
      OrientationEventCtor?.requestPermission?.()
        .then((state) => {
          if (state === 'granted') startOrientation();
        })
        .catch(() => {});
    };
    if (isMobile && !reduceMotion && OrientationEventCtor) {
      if (typeof OrientationEventCtor.requestPermission === 'function') {
        window.addEventListener('touchend', requestOrientationPermission, { passive: true });
      } else {
        startOrientation();
      }
    }

    // ── 7. High-Performance Cached Scroll Stage Measurement ──
    let cachedAnchors: number[] = [0, 800, 1600, 2400];
    // On the homepage the canvas is only visible until the (opaque) Work section has fully
    // covered the hero; past that point the loop idles
    let coverEnd = window.innerHeight;
    const updateAnchors = () => {
      const scrollY = window.scrollY;
      const vpH = window.innerHeight;
      const workEl = document.getElementById('work');
      // offsetTop ignores sticky positioning, so this is Work's layout position even while pinned
      coverEnd = workEl ? workEl.offsetTop : vpH;
      const sections = ['top', 'work', 'services'];
      
      cachedAnchors = sections.map((id, index) => {
        const el = document.getElementById(id);
        if (index === 0 || !el) return 0;
        
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        return Math.max(0, top + rect.height * 0.5 - vpH * 0.5);
      });

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vpH);
      cachedAnchors.push(maxScroll);
    };

    const measureScrollProgress = () => {
      const scrollY = window.scrollY;
      if (cachedAnchors.length < 2) return;

      let currentProgress = 0;
      if (scrollY <= cachedAnchors[0]) {
        currentProgress = 0;
      } else {
        let found = false;
        for (let i = 0; i < cachedAnchors.length - 1; i++) {
          if (scrollY <= cachedAnchors[i + 1]) {
            const span = cachedAnchors[i + 1] - cachedAnchors[i];
            currentProgress = i + (span > 0 ? (scrollY - cachedAnchors[i]) / span : 0);
            found = true;
            break;
          }
        }
        if (!found) currentProgress = CAM_WAYPOINTS.length - 1;
      }

      scrollProgRef.current = THREE.MathUtils.clamp(currentProgress, 0, CAM_WAYPOINTS.length - 1);
    };

    updateAnchors();
    measureScrollProgress();
    remeasureRef.current = () => {
      updateAnchors();
      measureScrollProgress();
    };

    window.addEventListener('scroll', measureScrollProgress, { passive: true });

    // ── 8. Core Animation Frame Loop ──
    let lastTime = 0;
    let animFrameId: number;
    const startTime = performance.now();
    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();

    // Render-on-change: each new canvas frame costs a full-resolution (antialiased) resolve and composite
    // on the GPU, measured at ~6ms/frame on integrated graphics, which kept the GPU saturated at 144Hz
    // even with nothing moving. The camera re-renders every frame while it moves (mouse parallax, scroll);
    // when it is still, only the slow particle drift (~2px/s) changes, so ~30 renders/s look identical.
    const STILL_FRAME_MS = 33;
    const CAM_EPSILON_SQ = 1e-6; // ~0.1px of camera travel at hero distance
    const renderedCamPos = new THREE.Vector3(Infinity, 0, 0);
    const renderedCamTarget = new THREE.Vector3();
    let renderedFov = 0;
    let lastRenderTime = -Infinity;
    let pendingDrift = 0; // seconds of particle drift not yet applied
    let forceRender = true; // first frame, resizes and resuming after being covered/hidden

    let isIdle = false;
    const animate = (time: number) => {
      animFrameId = requestAnimationFrame(animate);

      // Idle when the tab is hidden, or on the homepage once the canvas is fully covered
      const idleNow = document.hidden || (!fullPageRef.current && window.scrollY > coverEnd);
      if (idleNow !== isIdle) {
        isIdle = idleNow;
        if (!idleNow) forceRender = true; // show the current state at once when uncovered
      }
      if (idleNow) {
        lastTime = time;
        return;
      }

      const dt = Math.min(0.1, (time - lastTime) / 1000); // Guard against giant frame skips
      lastTime = time;

      const elapsed = reduceMotion ? 0 : (time - startTime) / 1000;

      // Damp-interpolate scroll progress to create luxurious, lag-free momentum
      smoothProgRef.current += (scrollProgRef.current - smoothProgRef.current) * 4.5 * dt;

      // Hand-held camera drift (parallax damp-mapping)
      mouseRef.current.mx += (mouseRef.current.tx - mouseRef.current.mx) * 2.5 * dt;
      mouseRef.current.my += (mouseRef.current.ty - mouseRef.current.my) * 2.5 * dt;

      // ── Position Camera dynamically along spline curves ──
      const normalizedU = smoothProgRef.current / (CAM_WAYPOINTS.length - 1);

      curveP.getPoint(normalizedU, camPos);
      curveT.getPoint(normalizedU, camTarget);

      // Apply subtle cursor parallax to camera position and target
      const parallaxFactor = 1.0 - THREE.MathUtils.smoothstep(normalizedU, 0.0, 0.6) * 0.55;
      camPos.x += mouseRef.current.mx * 0.44 * parallaxFactor;
      camPos.y += mouseRef.current.my * 0.22 * parallaxFactor;

      camera.position.copy(camPos);
      camera.lookAt(camTarget);

      // Adjust aspect-ratio fixed field of view (handles mobile portrait crops gracefully)
      const aspect = window.innerWidth / window.innerHeight;
      const targetFov = CAM_WAYPOINTS[Math.min(Math.floor(smoothProgRef.current), CAM_WAYPOINTS.length - 1)].fov;
      camera.fov = aspect < 1.0 ? targetFov * 1.25 : targetFov;
      camera.updateProjectionMatrix();

      // Skip this frame when nothing visible has changed since the last render (see STILL_FRAME_MS)
      pendingDrift += dt;
      const cameraMoved =
        camera.position.distanceToSquared(renderedCamPos) > CAM_EPSILON_SQ ||
        camTarget.distanceToSquared(renderedCamTarget) > CAM_EPSILON_SQ ||
        camera.fov !== renderedFov;
      // Liquid cursor active (or just settled: one more frame clears the displacement)
      const liquidChanged = liquidField.count > 0 || liquidWasActive;
      // With reduced motion the particles never move, so only camera changes need a new frame
      const driftDue = !reduceMotion && time - lastRenderTime >= STILL_FRAME_MS;
      if (!forceRender && !cameraMoved && !liquidChanged && !driftDue) return;

      // Animate background particles
      if (reduceMotion) {
        // keep particles static
      } else if (!isMobile) {
        // Slowly drift background dust particles downward on desktop (all drift since the last render)
        const posAttr = pGeo.getAttribute('position') as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        const fall = 0.02 * pendingDrift;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= fall; // vertical float down
          if (positions[i] < -10) {
            positions[i] = 10; // Reset particles that fall off the screen
          }
        }
        posAttr.needsUpdate = true;
      } else {
        // On mobile, gently rotate particles using pure GPU transformation (zero buffer rebuilds)
        particles.rotation.y = elapsed * 0.015;
      }

      updateLiquidShift();

      // Render the scene!
      renderer.render(scene, camera);
      renderedCamPos.copy(camera.position);
      renderedCamTarget.copy(camTarget);
      renderedFov = camera.fov;
      lastRenderTime = time;
      pendingDrift = 0;
      forceRender = false;
    };

    animFrameId = requestAnimationFrame(animate);

    // ── 12. Smart Resize Handler ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      viewport.set(window.innerWidth, window.innerHeight);
      updateAnchors();
      measureScrollProgress();
      forceRender = true; // setSize clears the drawing buffer
    };

    window.addEventListener('resize', handleResize, { passive: true });
    // Section heights settle after fonts/images/lazy routes load; re-measure whenever the page resizes
    const resizeObserver = new ResizeObserver(() => remeasureRef.current());
    resizeObserver.observe(document.body);

    // ── 13. Component Cleanup ──
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', measureScrollProgress);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      window.removeEventListener('touchend', requestOrientationPermission);
      window.removeEventListener('deviceorientation', handleOrientation);
      screen.orientation?.removeEventListener('change', resetOrientationBase);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#0a0a0a]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
