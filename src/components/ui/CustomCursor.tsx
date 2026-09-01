'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for pointer devices with fine tracking
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else if (target.closest('a, button, [role="button"], input, textarea')) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing for the outer follower ring
  useEffect(() => {
    let animId: number;
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const loop = () => {
      setDotPos(prev => ({
        x: lerp(prev.x, pos.x, 0.22),
        y: lerp(prev.y, pos.y, 0.22)
      }));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* Precision Core Dot */}
      <div
        className="fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5500]"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />

      {/* Kinetic Follower Frame */}
      <div
        className={`fixed top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-150 ease-out ${
          cursorText
            ? 'h-20 w-20 border-[#ff5500]/60 bg-[#0d0d0f]/90 text-[10px] tracking-widest font-mono text-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.2)]'
            : isHovered
            ? 'h-10 w-10 border-white/40 bg-white/5'
            : 'h-6 w-6 border-white/20'
        }`}
        style={{ transform: `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)` }}
      >
        {cursorText && (
          <span className="font-mono text-[9px] uppercase font-semibold">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
