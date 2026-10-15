import { useEffect, useRef } from 'react';
import { BrowserController } from '@/browser';

/**
 * Measures header + footer and tells BrowserController where the
 * native WebView must sit so React chrome stays around the page.
 */
export function useBrowserLayout() {
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const measure = () => {
      const headerH = headerRef.current?.getBoundingClientRect().height ?? 120;
      const footerH = footerRef.current?.getBoundingClientRect().height ?? 56;
      const w = window.innerWidth;
      const h = window.innerHeight;
      BrowserController.setLayout({
        x: 0,
        y: headerH,
        width: w,
        height: Math.max(100, h - headerH - footerH),
      });
    };

    measure();
    window.addEventListener('resize', measure);
    const id = window.setInterval(measure, 800);
    return () => {
      window.removeEventListener('resize', measure);
      window.clearInterval(id);
    };
  }, []);

  return { headerRef, footerRef };
}
