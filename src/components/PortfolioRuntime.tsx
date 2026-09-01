'use client';

import { useEffect } from 'react';

type RuntimeWindow = Window & {
  gsap?: unknown;
  ScrollTrigger?: unknown;
  SplitText?: unknown;
  Lenis?: unknown;
  Swiper?: unknown;
};

export default function PortfolioRuntime() {
  useEffect(() => {
    let cancelled = false;
    let script: HTMLScriptElement | null = null;
    const fallbackTimer = window.setTimeout(() => {
      document.documentElement.classList.add('motion-fallback');
    }, 4200);

    async function start() {
      const [gsapModule, triggerModule, splitModule, lenisModule, swiperModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('lenis'),
        import('swiper'),
      ]);
      if (cancelled) return;

      const runtime = window as RuntimeWindow;
      runtime.gsap = gsapModule.gsap;
      runtime.ScrollTrigger = triggerModule.ScrollTrigger;
      runtime.SplitText = splitModule.SplitText;
      runtime.Lenis = lenisModule.default;
      runtime.Swiper = swiperModule.default;

      script = document.createElement('script');
      script.src = '/motion.js';
      script.async = false;
      script.dataset.portfolioRuntime = 'true';
      script.onerror = () => document.documentElement.classList.add('motion-fallback');
      document.body.appendChild(script);
    }

    start().catch(() => document.documentElement.classList.add('motion-fallback'));
    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      script?.remove();
    };
  }, []);

  return null;
}
