'use client';

import React, { useState } from 'react';
import { PROJECTS, Project } from '@/data/portfolioData';
import ProjectModal from './ProjectModal';
import { sound } from '@/lib/audio';
import { ArrowUpRight, Cpu, Layers, Activity, ShieldCheck } from 'lucide-react';

export default function SelectedWork() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openProject = (proj: Project) => {
    sound.playStateShift();
    setSelectedProject(proj);
  };

  return (
    <section id="selected-work" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-3 uppercase tracking-widest">
            <span>03 // FLAGSHIP ARCHITECTURE</span>
            <span className="w-12 h-[1px] bg-[#ff5500]/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
            Selected Work
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400 max-w-xs text-left sm:text-right">
          DECONSTRUCTED CASE STUDIES, REAL BENCHMARKS, AND PRODUCTION ARCHITECTURES.
        </div>
      </div>

      {/* Flagship projects list */}
      <div className="space-y-16">
        {PROJECTS.map((proj, idx) => (
          <div
            key={proj.id}
            onClick={() => openProject(proj)}
            data-cursor="INSPECT"
            className="group relative rounded-xl border border-white/10 bg-[#0c0c0f]/80 hover:border-[#ff5500]/50 transition-all duration-300 overflow-hidden cursor-pointer p-6 sm:p-10"
          >
            {/* Top Row: Index & Category */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/8 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="text-[#ff5500] font-bold text-sm sm:text-base">
                  {proj.number}
                </span>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-300 font-semibold">{proj.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                  {proj.year}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                  {proj.status}
                </span>
              </div>
            </div>

            {/* Middle Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight group-hover:text-[#ff5500] transition-colors">
                    {proj.title}
                  </h3>
                  <ArrowUpRight className="text-neutral-500 group-hover:text-[#ff5500] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={28} />
                </div>
                <p className="text-base sm:text-xl text-neutral-300 font-sans leading-relaxed max-w-3xl">
                  {proj.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/8 font-mono text-[11px] text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Hero Metric Snapshot */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                {proj.metrics.slice(0, 2).map((m, i) => (
                  <div
                    key={i}
                    className="p-4 rounded bg-white/[0.02] border border-white/5 group-hover:border-white/15 transition-all space-y-1"
                  >
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      {m.label}
                    </div>
                    <div className="text-2xl font-mono font-bold text-white group-hover:text-[#ff5500] transition-colors">
                      {m.value}
                    </div>
                    <div className="text-xs text-neutral-400 leading-tight">
                      {m.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Prompt Bar */}
            <div className="pt-6 border-t border-white/8 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500]" />
                <span>CLICK TO DECONSTRUCT ARCHITECTURE & ENGINEERING DECISIONS</span>
              </div>
              <div className="text-neutral-300 font-semibold group-hover:text-[#ff5500] transition-colors">
                READ SYSTEM CASE STUDY →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal Viewer */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
