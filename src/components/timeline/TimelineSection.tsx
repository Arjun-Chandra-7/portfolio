'use client';

import React from 'react';
import { TIMELINE } from '@/data/portfolioData';
import { Clock, GitCommit, CheckCircle2 } from 'lucide-react';

export default function TimelineSection() {
  return (
    <section id="timeline-archive" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-3 uppercase tracking-widest">
            <span>07 // CHRONOLOGICAL EVOLUTION</span>
            <span className="w-12 h-[1px] bg-[#ff5500]/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
            System Timeline
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400 max-w-xs text-left sm:text-right">
          UNFILTERED PROGRESSION OF LEARNING, SYSTEM BREAKTHROUGHS, AND ARCHITECTURAL MILESTONES.
        </div>
      </div>

      {/* Editorial Timeline (Nesh-inspired linear technical ledger) */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-[1px] before:bg-white/10">
        {TIMELINE.map((item, idx) => (
          <div
            key={idx}
            className="relative pl-12 sm:pl-20 group"
          >
            {/* Timeline Node Bullet */}
            <div className="absolute left-2.5 sm:left-6.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#ff5500] bg-[#080808] group-hover:bg-[#ff5500] transition-colors" />

            {/* Timeline Card */}
            <div className="p-6 sm:p-8 rounded-xl border border-white/8 bg-[#0a0a0d] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{item.year}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[#ff5500] border border-white/10 font-semibold">
                    {item.quarter}
                  </span>
                  <span className="text-neutral-500 hidden sm:inline">{item.tag}</span>
                </div>
                <div className="text-[10px] text-neutral-500">
                  STATE: {item.systemState}
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-sans font-bold text-neutral-100 uppercase tracking-tight">
                {item.headline}
              </h3>

              <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                {item.summary}
              </p>

              {/* Artifacts Produced */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 uppercase mr-1">ARTIFACTS:</span>
                {item.artifacts.map((art, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/8 text-xs font-mono text-neutral-300"
                  >
                    {art}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
