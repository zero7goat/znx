import * as THREE from 'three';

export interface ClothSimOptions {
  gridX?: number; // Default: 96
  gridY?: number; // Default: 96
  stiffness?: number; // Default: 32.0
  damping?: number; // Default: 0.90
  forceScale?: number; // Default: 1.2
  specularColor?: string; // Default: '#ffffff'
  sheenIntensity?: number; // Default: 0.35
}

/**
 * Custom GLSL Shader for realistic silk/fabric cloth lighting,
 * folds, sheens, and specular highlights on displaced mesh geometry.
 */
const ClothShader = {
  uniforms: {
    uTexture: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uHoverProgress: { value: 0 },
    uLightDir: { value: new THREE.Vector3(0.4, 0.6, 1.0).normalize() },
    uSpecularColor: { value: new THREE.Color(0xffffff) },
    uSheenIntensity: { value: 0.35 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      vNormal = normalize(normalMatrix * normal);
      vDisplacement = position.z;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uHoverProgress;
    uniform vec3 uLightDir;
    uniform vec3 uSpecularColor;
    uniform float uSheenIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    void main() {
      vec2 uv = vUv;
      vec4 texColor = texture2D(uTexture, uv);

      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightDir);
      vec3 viewDir = normalize(vViewPosition);

      // Diffuse light (shade folds)
      float NdotL = max(dot(normal, lightDir), 0.0);
      float diffuse = mix(0.72, 1.0, NdotL);

      // Specular highlight (fabric sheen)
      vec3 halfDir = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfDir), 0.0);
      float specular = pow(NdotH, 24.0) * uSheenIntensity;

      // Fresnel rim light for silky edges
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.25;

      vec3 color = texColor.rgb * diffuse;
      color += uSpecularColor * (specular + fresnel);

      // Fold shadow enhancement
      float foldShadow = smoothstep(-0.08, 0.08, vDisplacement);
      color *= mix(0.85, 1.0, foldShadow);

      gl_FragColor = vec4(color, texColor.a * uHoverProgress);
    }
  `,
};

/**
 * Initializes physical WebGL cloth simulation overlay on a card element.
 */
export function initCardClothSimulation(
  cardElement: HTMLElement,
  options: ClothSimOptions = {}
): () => void {
  // Mobile / touch screen detection - fallback gracefully to static image
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 1024);

  if (isTouchDevice || !cardElement) {
    return () => {};
  }

  const gridX = options.gridX || 96;
  const gridY = options.gridY || 96;
  const stiffness = options.stiffness || 32.0;
  const damping = options.damping || 0.90;
  const forceScale = options.forceScale || 1.2;
  const sheenIntensity = options.sheenIntensity || 0.35;

  // Extract background image source from <img> tag or CSS background-image
  let imageSrc = '';
  const imgEl = cardElement.querySelector<HTMLImageElement>('img');
  if (imgEl && imgEl.src) {
    imageSrc = imgEl.src;
  } else {
    const bg = window.getComputedStyle(cardElement).backgroundImage;
    if (bg && bg !== 'none') {
      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        imageSrc = match[1];
      }
    }
  }

  if (!imageSrc) {
    return () => {};
  }

  // Ensure container element is positioned
  const originalPos = window.getComputedStyle(cardElement).position;
  if (originalPos === 'static') {
    cardElement.style.position = 'relative';
  }

  // Create canvas overlay
  const canvas = document.createElement('canvas');
  canvas.className = 'cloth-sim-overlay-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
  canvas.style.zIndex = '5';
  cardElement.appendChild(canvas);

  // Setup WebGL / Three.js Scene
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    canvas.remove();
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();

  // Orthographic Camera + PlaneGeometry(2, 2) ensures 100% pixel-exact match with canvas rectangle
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // 2D Spring-Mass Physical Grid Setup
  const numNodes = (gridX + 1) * (gridY + 1);
  const posZ = new Float32Array(numNodes);
  const velZ = new Float32Array(numNodes);
  const accZ = new Float32Array(numNodes);

  // PlaneGeometry matching orthographic frustum [-1, 1]
  const geometry = new THREE.PlaneGeometry(2, 2, gridX, gridY);

  // Material & Texture
  const textureLoader = new THREE.TextureLoader();
  let material: THREE.ShaderMaterial | null = null;
  let activeTexture: THREE.Texture | null = null;

  // Helper to scale texture UV coordinates to match DOM object-fit: cover
  const updateTextureCover = () => {
    if (!activeTexture || !activeTexture.image) return;
    const rect = cardElement.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    const canvasAspect = width / height;

    const img = activeTexture.image as { width?: number; height?: number };
    const imgWidth = img?.width || 1;
    const imgHeight = img?.height || 1;
    const imgAspect = imgWidth / imgHeight;

    if (canvasAspect > imgAspect) {
      activeTexture.repeat.set(1, imgAspect / canvasAspect);
      activeTexture.offset.set(0, (1 - imgAspect / canvasAspect) / 2);
    } else {
      activeTexture.repeat.set(canvasAspect / imgAspect, 1);
      activeTexture.offset.set((1 - canvasAspect / imgAspect) / 2, 0);
    }
  };

  textureLoader.setCrossOrigin('anonymous');
  textureLoader.load(
    imageSrc,
    (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      activeTexture = texture;

      updateTextureCover();

      material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(ClothShader.uniforms),
        vertexShader: ClothShader.vertexShader,
        fragmentShader: ClothShader.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      });

      material.uniforms.uTexture.value = texture;
      material.uniforms.uSheenIntensity.value = sheenIntensity;
      if (options.specularColor) {
        material.uniforms.uSpecularColor.value.setStyle(options.specularColor);
      }

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    undefined,
    () => {
      // Texture loading failed (e.g. CORS), gracefully remove overlay canvas
      canvas.remove();
    }
  );

  // Size calculation
  const updateSize = () => {
    if (!renderer) return;
    const rect = cardElement.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 200;

    renderer.setSize(width, height, false);
    updateTextureCover();
  };

  updateSize();

  // Pointer Force Interaction
  let isHovered = false;
  let animFrameId: number | null = null;
  let lastPointer = { x: 0, y: 0, hasMoved: false };
  let hoverProgress = 0;

  const handlePointerMove = (e: MouseEvent) => {
    const rect = cardElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (!lastPointer.hasMoved) {
      lastPointer = { x, y, hasMoved: true };
      return;
    }

    const dx = x - lastPointer.x;
    const dy = y - lastPointer.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Apply radial force vector to grid vertices
    if (speed > 0.001) {
      const gx = Math.floor(x * gridX);
      const gy = Math.floor((1 - y) * gridY);
      const radius = 6; // radius in grid segments

      for (let rx = -radius; rx <= radius; rx++) {
        for (let ry = -radius; ry <= radius; ry++) {
          const nx = gx + rx;
          const ny = gy + ry;

          if (nx >= 0 && nx <= gridX && ny >= 0 && ny <= gridY) {
            const distSq = (rx * rx + ry * ry) / (radius * radius);
            if (distSq <= 1.0) {
              const idx = ny * (gridX + 1) + nx;
              const falloff = Math.exp(-distSq * 3.5);
              const force = (dx + dy) * forceScale * falloff;
              velZ[idx] += Math.max(-0.15, Math.min(0.15, force));
            }
          }
        }
      }
    }

    lastPointer = { x, y, hasMoved: true };
  };

  const handleMouseEnter = () => {
    isHovered = true;
    canvas.style.opacity = '1';
    lastPointer.hasMoved = false;

    if (!animFrameId) {
      loop();
    }
  };

  const handleMouseLeave = () => {
    isHovered = false;
    canvas.style.opacity = '0';
    lastPointer.hasMoved = false;
  };

  // Physical Spring-Mass Simulation Loop
  let lastTime = performance.now();

  const loop = () => {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    // Hover fade interpolation
    if (isHovered) {
      hoverProgress += (1.0 - hoverProgress) * 0.12;
    } else {
      hoverProgress += (0.0 - hoverProgress) * 0.12;
    }

    if (material) {
      material.uniforms.uHoverProgress.value = hoverProgress;
      material.uniforms.uTime.value = now * 0.001;
    }

    // Spring-Mass Grid Physics Integration
    let maxDisplacement = 0;
    const posAttribute = geometry.attributes.position as THREE.BufferAttribute;

    for (let gy = 0; gy <= gridY; gy++) {
      for (let gx = 0; gx <= gridX; gx++) {
        const idx = gy * (gridX + 1) + gx;

        // Pin border edges slightly for draping realism
        const isBorder = gx === 0 || gx === gridX || gy === 0 || gy === gridY;
        const edgeFactor = isBorder ? 0.15 : 1.0;

        // Spring restoring force back to rest plane (z = 0)
        const springForce = -stiffness * posZ[idx];

        // Neighbor Laplacian smoothing forces for cloth surface tension
        let neighborZSum = 0;
        let neighbors = 0;

        if (gx > 0) { neighborZSum += posZ[idx - 1]; neighbors++; }
        if (gx < gridX) { neighborZSum += posZ[idx + 1]; neighbors++; }
        if (gy > 0) { neighborZSum += posZ[idx - (gridX + 1)]; neighbors++; }
        if (gy < gridY) { neighborZSum += posZ[idx + (gridX + 1)]; neighbors++; }

        const tensionForce = neighbors > 0 ? (neighborZSum / neighbors - posZ[idx]) * 12.0 : 0;

        // Accelerate node
        accZ[idx] = (springForce + tensionForce) * edgeFactor;
        velZ[idx] = (velZ[idx] + accZ[idx] * dt) * damping;
        posZ[idx] += velZ[idx] * dt;

        // Clamp displacement to prevent visual artifacts
        posZ[idx] = Math.max(-0.2, Math.min(0.2, posZ[idx]));

        // Update vertex buffer position
        posAttribute.setZ(idx, posZ[idx]);

        const absZ = Math.abs(posZ[idx]);
        if (absZ > maxDisplacement) {
          maxDisplacement = absZ;
        }
      }
    }

    posAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }

    // Continue animation if hovered or if grid is still returning to rest
    if (isHovered || hoverProgress > 0.01 || maxDisplacement > 0.0005) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      animFrameId = null;
    }
  };

  // Event Listeners
  cardElement.addEventListener('mousemove', handlePointerMove, { passive: true });
  cardElement.addEventListener('mouseenter', handleMouseEnter);
  cardElement.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', updateSize, { passive: true });

  // Cleanup
  return () => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
    }
    cardElement.removeEventListener('mousemove', handlePointerMove);
    cardElement.removeEventListener('mouseenter', handleMouseEnter);
    cardElement.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('resize', updateSize);

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    if (renderer) {
      renderer.dispose();
    }
    geometry.dispose();
    if (material) {
      material.dispose();
    }
    if (activeTexture) {
      activeTexture.dispose();
    }
  };
}

/**
 * Auto-initializes cloth simulation overlay on all matching DOM elements (e.g. `.custom-hover-card`).
 */
export function initAllCardClothSimulations(
  selector: string = '.custom-hover-card',
  options: ClothSimOptions = {}
): () => void {
  if (typeof document === 'undefined') return () => {};

  const cleanups: (() => void)[] = [];

  const attach = () => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      if (!el.dataset.clothSimInit) {
        el.dataset.clothSimInit = 'true';
        const cleanup = initCardClothSimulation(el, options);
        cleanups.push(cleanup);
      }
    });
  };

  attach();

  // Observe dynamically added cards
  const observer = new MutationObserver(() => {
    attach();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    cleanups.forEach((fn) => fn());
  };
}
