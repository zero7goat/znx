/**
 * Global Asset Preloader & Cache Manager for ZNX Studio
 */

const loadedAssetCache = new Set<string>();

/**
 * Preload a single image, returning a promise that resolves when decoded or loaded.
 */
export function preloadImage(src: string): Promise<void> {
  if (!src) return Promise.resolve();
  if (loadedAssetCache.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const onComplete = () => {
      loadedAssetCache.add(src);
      resolve();
    };

    if (img.complete) {
      onComplete();
    } else {
      if (typeof img.decode === 'function') {
        img.decode().then(onComplete).catch(() => {
          if (img.complete) onComplete();
          else {
            img.onload = onComplete;
            img.onerror = onComplete;
          }
        });
      } else {
        img.onload = onComplete;
        img.onerror = onComplete;
      }
    }
  });
}

/**
 * Preload an array of image URLs with a strict failsafe timeout.
 */
export function preloadImages(urls: string[], timeoutMs = 1500): Promise<void> {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  const promises = uniqueUrls.map((url) => preloadImage(url));

  const preloadPromise = Promise.all(promises).then(() => {});

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });

  return Promise.race([preloadPromise, timeoutPromise]);
}

/**
 * Ensure document fonts are ready (e.g. Satoshi, Syne, Bodoni Moda).
 */
export function preloadFonts(timeoutMs = 1200): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }

  const fontPromise = document.fonts.ready.then(() => {});
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

  return Promise.race([fontPromise, timeoutPromise]);
}

/**
 * Map of critical above-the-fold assets per route
 */
export const CRITICAL_ROUTE_ASSETS: Record<string, string[]> = {
  home: [
    '/Logo.png',
    'https://i.pinimg.com/1200x/ac/64/cc/ac64ccb69f913d9bc4fe99dad224472f.jpg',
    'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
  ],
  works: [
    '/Logo.png',
    'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
    'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
    'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
  ],
  services: [
    '/Logo.png',
    'https://i.pinimg.com/1200x/2b/89/1f/2b891f6e5c20c30901939bd83d7d5e77.jpg',
    'https://i.pinimg.com/736x/0c/8e/1c/0c8e1c3cca5be58498a8df4106c4bc9c.jpg',
  ],
  about: [
    '/Logo.png',
    '/images/1221.avif',
  ],
  privacy: [
    '/Logo.png',
  ],
};

/**
 * Preload all critical assets and fonts required for a target route.
 */
export async function preloadRouteAssets(route: string, timeoutMs = 1400): Promise<void> {
  const assets = CRITICAL_ROUTE_ASSETS[route] || CRITICAL_ROUTE_ASSETS.home;
  await Promise.all([
    preloadImages(assets, timeoutMs),
    preloadFonts(timeoutMs),
  ]);
}
