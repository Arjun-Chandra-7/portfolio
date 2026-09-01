'use client';

import React from 'react';
import SystemGraphHero from './SystemGraphHero';
import { LIVE_SIGNALS } from '@/data/portfolioData';
import { sound } from '@/lib/audio';
import { ArrowDown, CornerDownRight, Terminal, Activity, Layers } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Background Subtle Coordinate Grid Line */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4 -z-10 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-dashed border-white/10 h-full" />
        ))}
      </div>

      {/* Top Editorial Identity Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-widest text-neutral-400">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#ff5500] font-semibold">
            SYSTEM ARCHITECT
          </span>
          <span className="text-neutral-600">//</span>
          <span>ARTIFICIAL INTELLIGENCE</span>
          <span className="text-neutral-600">×</span>
          <span>DISTRIBUTED SYSTEMS</span>
          <span className="text-neutral-600">×</span>
          <span>CREATIVE INTERFACES</span>
        </div>

        {/* Monumental Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans tracking-tight font-extrabold text-neutral-100 uppercase leading-[0.95] max-w-5xl">
          Building systems <br />
          that <span className="text-[#ff5500] font-serif italic lowercase">think</span>,{' '}
          <span className="text-neutral-400">reason</span> <br />
          and evolve.
        </h1>
      </div>

      {/* Center 3D Interactive Spatial Graph & Visualizer */}
      <div className="my-6 relative w-full rounded-lg border border-white/8 bg-[#0b0b0e]/60 backdrop-blur-sm overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Frame corner annotations */}
        <div className="absolute top-2 left-3 z-10 text-[9px] font-mono text-neutral-500 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[#ff5500] rounded-full inline-block" />
          <span>GRAPH_TOPOLOGY // MULTI-AGENT STATE MATRIX</span>
        </div>
        <div className="absolute top-2 right-3 z-10 text-[9px] font-mono text-neutral-500">
          [DRAG_VECTOR / ROTATE]
        </div>

        <SystemGraphHero />
      </div>

      {/* Hero Footnote & Narrative Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-4">
        {/* Left Column: Direct System Philosophy */}
        <div className="lg:col-span-7 space-y-3">
          <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed max-w-2xl">
            Designing deterministic runtime engines, multimodal vision pipelines, and resilient agentic architectures
            that bridge the gap between probabilistic intelligence and mission-critical production software.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CornerDownRight size={13} className="text-[#ff5500]" />
              ENGINEERED FOR DETERMINISTIC CONTROL
            </span>
          </div>
        </div>

        {/* Right Column: Live Status & Fast Action Cues */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-end">
          <div className="p-3.5 rounded bg-white/[0.03] border border-white/8 text-[11px] font-mono text-neutral-400 space-y-1">
            <div className="text-neutral-500 uppercase tracking-wider text-[10px]">CURRENT FOCUS</div>
            <div className="text-neutral-200 line-clamp-2">{LIVE_SIGNALS.building}</div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#selected-work"
              onClick={() => sound.playStateShift()}
              data-cursor="EXPLORE"
              className="flex-1 px-5 py-3 rounded bg-white text-black hover:bg-[#ff5500] hover:text-white transition-colors duration-200 font-mono text-xs font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2"
            >
              <span>EXPLORE WORK</span>
              <ArrowDown size={14} />
            </a>

            <a
              href="#contact-terminal"
              onClick={() => sound.playTelemetryTick()}
              className="px-5 py-3 rounded border border-white/15 hover:border-white/30 bg-transparent text-neutral-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors"
            >
              DISPATCH SIGNAL
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
