import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── Cinematic Camera Waypoints (Synchronized with remaining sections: Hero, Work, Services, Footer) ──
const CAM_WAYPOINTS = [
  { p: [0.0, 3.5, 12.0],  t: [0.0, 0.0, 0.0],    fov: 38 }, // 0: Hero (Central 3D ZNX core wireframe)
  { p: [1.8, 1.2, 2.8],   t: [-2.2, 0.3, -2.5],  fov: 42 }, // 1: Portfolio/Work (Close fly-past of floating 3D project planes)
  { p: [3.2, 0.2, -7.5],  t: [-2.4, 0.2, -12.0], fov: 46 }, // 2: Services (Panning across futuristic node geometry)
  { p: [0.0, 6.5, -14.0], t: [0.0, 10.5, -24.0], fov: 40 }, // 3: Footer/CTA (Looking up towards starry skies)
];

// ── Custom Shader for Floating 3D Image Planes (Warp/distort dynamically on scroll momentum) ──
const ImagePlaneShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uScrollSpeed;
    uniform float uHover;
    varying vec2 vUv;
    varying float vDistortion;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Calculate dynamic bend distortion based on scroll momentum speed and grid position
      float dist = sin(uv.y * 3.14159) * uScrollSpeed * 0.15;
      pos.z += dist;
      
      // Add a touch of hover float depth push
      pos.z += uHover * 0.25 * sin(uTime * 2.0 + uv.x * 5.0);
      
      vDistortion = dist;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uHover;
    varying vec2 vUv;
    varying float vDistortion;

    void main() {
      // Aberrate colors slightly based on scroll distortion/warp momentum
      vec2 aberratedUv = vUv;
      aberratedUv.x += vDistortion * 0.04;
      
      vec4 colR = texture2D(uTexture, aberratedUv + vec2(vDistortion * 0.02, 0.0));
      vec4 colG = texture2D(uTexture, aberratedUv);
      vec4 colB = texture2D(uTexture, aberratedUv - vec2(vDistortion * 0.02, 0.0));
      vec4 tex = vec4(colR.r, colG.g, colB.b, colG.a);
      
      // Tint towards pure white on hover to create a luxury focus shine
      vec4 hoverTint = vec4(1.0, 1.0, 1.0, tex.a);
      vec4 finalCol = mix(tex, hoverTint, uHover * 0.12);
      
      // Apply soft vignette shadow to the image plane borders
      float borderDist = length(vUv - 0.5);
      float vig = smoothstep(0.7, 0.45, borderDist);
      finalCol.rgb *= mix(0.5, 1.0, vig);
      
      gl_FragColor = finalCol;
    }
  `
};

export default function ThreeWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgRef = useRef(0);
  const smoothProgRef = useRef(0);
  const scrollSpeedRef = useRef(0);
  const mouseRef = useRef({ tx: 0, ty: 0, mx: 0, my: 0 });

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
    scene.fog = new THREE.FogExp2(0x05070a, 0.035);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 2.0));
    renderer.setClearColor(0x05070a, 1);
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

    // ── 4. Generate Central Core Wireframe Mesh (Hero Landmark) ──
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    scene.add(coreGroup);

    const icosahedronGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x802223,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(icosahedronGeo, wireframeMat);
    coreGroup.add(coreMesh);

    // Inner glowing core sphere
    const octaGeo = new THREE.OctahedronGeometry(0.8, 1);
    const glowCoreMat = new THREE.MeshBasicMaterial({
      color: 0xe0231c,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerGlowMesh = new THREE.Mesh(octaGeo, glowCoreMat);
    coreGroup.add(innerGlowMesh);

    // ── 5. Load Floating Portfolio Image Planes (Work Section) ──
    const textureLoader = new THREE.TextureLoader();
    const planeGroup = new THREE.Group();
    scene.add(planeGroup);

    const workImages = [
      '/images/work1.jpg',
      '/images/work2.jpg',
      '/images/work3.jpg',
      '/images/work4.jpg',
      '/images/work5.jpg',
    ];

    // Coordinates flanking the camera path during Section 2 (Work fly-past)
    const planePositions = [
      { pos: [-1.4, 0.4, -0.5],  rot: [0, 0.4, 0],   w: 1.8, h: 1.1 },
      { pos: [1.8, -0.2, -1.8],  rot: [0, -0.5, 0],  w: 1.6, h: 1.0 },
      { pos: [-1.9, 0.8, -3.2],  rot: [0, 0.6, 0],   w: 1.9, h: 1.2 },
      { pos: [2.0, 0.3, -4.8],   rot: [0, -0.4, 0],  w: 1.7, h: 1.1 },
      { pos: [-1.2, -0.5, -6.5], rot: [0, 0.3, 0],   w: 1.8, h: 1.1 },
    ];

    const planeMeshes: THREE.Mesh[] = [];

    planePositions.forEach((posConfig, index) => {
      const imgPath = workImages[index];
      textureLoader.load(imgPath, (texture) => {
        // Use custom vertex and fragment shaders for Kage-like fluid distortion
        const mat = new THREE.ShaderMaterial({
          vertexShader: ImagePlaneShader.vertexShader,
          fragmentShader: ImagePlaneShader.fragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uScrollSpeed: { value: 0.0 },
            uTime: { value: 0.0 },
            uHover: { value: 0.0 },
          },
          transparent: true,
          side: THREE.DoubleSide,
        });

        const geo = new THREE.PlaneGeometry(posConfig.w, posConfig.h, 16, 16);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(posConfig.pos[0], posConfig.pos[1], posConfig.pos[2]);
        mesh.rotation.set(posConfig.rot[0], posConfig.rot[1], posConfig.rot[2]);
        mesh.name = `work-plane-${index}`;

        planeGroup.add(mesh);
        planeMeshes.push(mesh);
      });
    });

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

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── 9. Interactive Raycasting & Pointer Handlers (Desktop Only) ──
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.tx = pointer.x;
      mouseRef.current.ty = pointer.y;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // ── 7. High-Performance Cached Scroll Stage Measurement ──
    let cachedAnchors: number[] = [0, 800, 1600, 2400];
    // The canvas is only visible behind the hero; every later section has an opaque background
    let heroBottom = window.innerHeight;
    const updateAnchors = () => {
      const scrollY = window.scrollY;
      const vpH = window.innerHeight;
      const heroEl = document.getElementById('hero');
      heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom + scrollY : vpH;
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

    window.addEventListener('scroll', measureScrollProgress, { passive: true });

    // ── 8. Core Animation Frame Loop ──
    let lastTime = 0;
    let animFrameId: number;
    const startTime = performance.now();
    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();

    const animate = (time: number) => {
      animFrameId = requestAnimationFrame(animate);

      // Idle when the tab is hidden or the hero (the only place the canvas shows) is scrolled away
      if (document.hidden || window.scrollY > heroBottom) {
        lastTime = time;
        return;
      }

      const dt = Math.min(0.1, (time - lastTime) / 1000); // Guard against giant frame skips
      lastTime = time;

      const elapsed = reduceMotion ? 0 : (time - startTime) / 1000;

      // Damp-interpolate scroll progress to create luxurious, lag-free momentum
      const oldProg = smoothProgRef.current;
      smoothProgRef.current += (scrollProgRef.current - smoothProgRef.current) * 4.5 * dt;

      // Extract scroll speed to drive shader warp distortion
      const speed = Math.abs(smoothProgRef.current - oldProg) / (dt || 0.016);
      scrollSpeedRef.current += (speed - scrollSpeedRef.current) * 3.5 * dt;

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

      // ── Animate Scene Meshes ──
      // Slow rotation on the nested wireframe
      coreGroup.rotation.y = elapsed * 0.16;
      coreGroup.rotation.x = elapsed * 0.08;

      // Pass time and scroll speed values to Image Plane shaders
      planeMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.ShaderMaterial;
        if (mat && mat.uniforms) {
          mat.uniforms.uTime.value = elapsed;
          // Apply a dampened velocity limit to the warp bend
          mat.uniforms.uScrollSpeed.value = THREE.MathUtils.clamp(scrollSpeedRef.current, 0, 15);
        }
      });

      // ── Raycasting to handle image plane hovers (Desktop Only) ──
      if (!isMobile) {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(planeGroup.children);

        // Dim hovers gently back to 0
        planeMeshes.forEach((mesh) => {
          const mat = mesh.material as THREE.ShaderMaterial;
          if (mat && mat.uniforms) {
            mat.uniforms.uHover.value += (0.0 - mat.uniforms.uHover.value) * 5.0 * dt;
          }
        });

        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh;
          const mat = hoveredMesh.material as THREE.ShaderMaterial;
          if (mat && mat.uniforms) {
            // Smoothly elevate hover intensity
            mat.uniforms.uHover.value += (1.0 - mat.uniforms.uHover.value) * 8.0 * dt;
          }
        }
      }

      // Animate background particles
      if (reduceMotion) {
        // keep particles static
      } else if (!isMobile) {
        // Slowly drift background dust particles downward on desktop
        const posAttr = pGeo.getAttribute('position') as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.02 * dt; // vertical float down
          if (positions[i] < -10) {
            positions[i] = 10; // Reset particles that fall off the screen
          }
        }
        posAttr.needsUpdate = true;
      } else {
        // On mobile, gently rotate particles using pure GPU transformation (zero buffer rebuilds)
        particles.rotation.y = elapsed * 0.015;
      }

      // Render the scene!
      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    // ── 12. Smart Resize Handler ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateAnchors();
      measureScrollProgress();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    // Section heights settle after fonts/images load; re-measure once the page is ready
    window.addEventListener('load', updateAnchors);

    // ── 13. Component Cleanup ──
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', measureScrollProgress);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', updateAnchors);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#05070a]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
