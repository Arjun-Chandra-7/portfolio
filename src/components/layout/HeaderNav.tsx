'use client';

import React, { useState, useEffect } from 'react';
import { LIVE_SIGNALS } from '@/data/portfolioData';
import { sound } from '@/lib/audio';
import { Volume2, VolumeX, Menu, X, Terminal, Cpu } from 'lucide-react';

interface HeaderNavProps {
  onOpenQuickTerminal?: () => void;
}

export default function HeaderNav({ onOpenQuickTerminal }: HeaderNavProps) {
  const [time, setTime] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAudioToggle = () => {
    const newState = sound.toggle();
    setAudioEnabled(newState);
    if (newState) sound.playTelemetryTick();
  };

  const navItems = [
    { label: '01 // WORK', href: '#selected-work' },
    { label: '02 // ARCHITECTURE', href: '#architecture-visualizer' },
    { label: '03 // LAB', href: '#lab-archive' },
    { label: '04 // CAPABILITIES', href: '#capabilities-index' },
    { label: '05 // TIMELINE', href: '#timeline-archive' },
    { label: '06 // CONTACT', href: '#contact-terminal' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/8 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Identity & Status */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2.5 group"
              onClick={() => sound.playTelemetryTick()}
            >
              <div className="h-2.5 w-2.5 bg-[#ff5500] rounded-xs group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-neutral-100 uppercase">
                OPERIS <span className="text-neutral-500 font-normal">// ARCHIVE</span>
              </span>
            </a>

            {/* Coordinates / Live Clock */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {time} UTC+05:30
              </span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-500">{LIVE_SIGNALS.coordinates}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-neutral-400 hover:text-neutral-100 transition-colors py-1 relative group"
                onClick={() => sound.playTelemetryTick()}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#ff5500] group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Action Tools: Sound Synthesis Toggle + Quick Terminal Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAudioToggle}
              title={audioEnabled ? 'Mute System Telemetry Audio' : 'Unmute System Telemetry Audio'}
              className="p-2 rounded border border-white/10 hover:border-white/20 bg-white/5 text-neutral-400 hover:text-neutral-100 transition-colors text-xs font-mono flex items-center gap-1.5"
            >
              {audioEnabled ? <Volume2 size={13} className="text-[#ff5500]" /> : <VolumeX size={13} />}
              <span className="hidden sm:inline text-[10px] uppercase">{audioEnabled ? 'SND:ON' : 'SND:OFF'}</span>
            </button>

            {onOpenQuickTerminal && (
              <button
                onClick={() => {
                  sound.playTelemetryTick();
                  onOpenQuickTerminal();
                }}
                title="Open Command Telemetry (Cmd+K)"
                className="p-2 rounded border border-white/10 hover:border-[#ff5500]/40 bg-white/5 hover:bg-[#ff5500]/10 text-neutral-400 hover:text-[#ff5500] transition-colors text-xs font-mono hidden sm:flex items-center gap-1.5"
              >
                <Terminal size={13} />
                <span className="text-[10px]">EXEC_CLI</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                sound.playTelemetryTick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded border border-white/10 bg-white/5 text-neutral-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808]/98 backdrop-blur-xl md:hidden pt-24 px-6 flex flex-col justify-between pb-10">
          <div className="flex flex-col gap-6">
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-3">
              SYSTEM DIRECTORY // NAVIGATION
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  sound.playTelemetryTick();
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-mono text-neutral-200 hover:text-[#ff5500] transition-colors py-2 flex items-center justify-between border-b border-white/5"
              >
                <span>{item.label}</span>
                <span className="text-xs text-neutral-600">→</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 text-xs font-mono text-neutral-500 flex flex-col gap-2">
            <div>STATUS: {LIVE_SIGNALS.systemStatus}</div>
            <div>VER: {LIVE_SIGNALS.version}</div>
          </div>
        </div>
      )}
    </>
  );
}
