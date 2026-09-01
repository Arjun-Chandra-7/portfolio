'use client';

import React, { useState } from 'react';
import { EXPERIMENTS, Experiment } from '@/data/portfolioData';
import { sound } from '@/lib/audio';
import { FlaskConical, Terminal, Code2, Sparkles, Cpu, Activity, Play } from 'lucide-react';

export default function LabArchive() {
  const [activeExp, setActiveExp] = useState<Experiment | null>(null);

  return (
    <section id="lab-archive" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-3 uppercase tracking-widest">
            <span>05 // EXPERIMENTS & PROTOTYPES</span>
            <span className="w-12 h-[1px] bg-[#ff5500]/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
            The Lab Archive
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400 max-w-xs text-left sm:text-right">
          RAW COMPUTATIONAL ARTIFACTS, EXPERIMENTAL SHADERS, WASM MODULES, AND CLI AGENT PROTOCOLS.
        </div>
      </div>

      {/* Irregular Asymmetric Technical Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            onClick={() => {
              sound.playTelemetryTick();
              setActiveExp(exp);
            }}
            data-cursor="INSPECT"
            className="p-6 rounded-lg border border-white/8 bg-[#0a0a0d] hover:border-[#ff5500]/40 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col justify-between group space-y-6"
          >
            <div className="space-y-3">
              {/* Top metadata */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span className="text-[#ff5500] font-bold">{exp.code}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-neutral-400 border border-white/5">
                  {exp.category}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-sans font-bold text-neutral-100 uppercase tracking-tight group-hover:text-[#ff5500] transition-colors">
                {exp.title}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {exp.description}
              </p>
            </div>

            {/* Tech Tags & Interactive Trigger */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-white/[0.03] text-[10px] font-mono text-neutral-400 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  STATUS: {exp.status}
                </span>
                <span className="group-hover:text-[#ff5500] transition-colors">
                  VIEW ARTIFACT →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
