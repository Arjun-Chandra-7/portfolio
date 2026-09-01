'use client';

import React from 'react';
import { Layers, ShieldCheck, Zap, Terminal } from 'lucide-react';

export default function ManifestoSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Small Metadata Index Label */}
      <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-8 uppercase tracking-widest">
        <span>02 // PHILOSOPHY & STATEMENT</span>
        <span className="w-12 h-[1px] bg-[#ff5500]/40" />
      </div>

      {/* Kinetic Typography Manifesto Statement */}
      <div className="space-y-6 max-w-5xl">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold uppercase tracking-tight text-neutral-100 leading-[1.05]">
          I don’t just assemble web applications.{' '}
          <span className="text-neutral-500 font-serif italic lowercase">I architect</span>{' '}
          <span className="text-[#ff5500]">autonomous systems</span>.
        </h2>

        <p className="text-lg sm:text-2xl text-neutral-300 font-sans leading-relaxed font-normal pt-4">
          The next era of software is not defined by static UI buttons or isolated API endpoints, but by
          cooperating agent graphs, high-throughput multimodal pipelines, and verifiable execution contracts.
          Every line of code is designed for deterministic reliability, speed, and mathematical clarity.
        </p>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
        <div className="p-6 rounded border border-white/8 bg-white/[0.02] space-y-3">
          <div className="text-[#ff5500] font-mono text-xs flex items-center justify-between">
            <span>PILLAR_01</span>
            <Zap size={14} />
          </div>
          <h3 className="text-lg font-bold font-sans text-neutral-100 uppercase">
            Multimodal Intelligence
          </h3>
          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            Deconstructing unstructured visual, acoustic, and textual streams into high-dimensional latent vectors and deterministic reasoning graphs.
          </p>
        </div>

        <div className="p-6 rounded border border-white/8 bg-white/[0.02] space-y-3">
          <div className="text-[#ff5500] font-mono text-xs flex items-center justify-between">
            <span>PILLAR_02</span>
            <ShieldCheck size={14} />
          </div>
          <h3 className="text-lg font-bold font-sans text-neutral-100 uppercase">
            Transactional Reliability
          </h3>
          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            Eliminating infinite loops, state drift, and probabilistic hallucinations using DAG invariants, write-ahead logs, and rigorous automated validation.
          </p>
        </div>

        <div className="p-6 rounded border border-white/8 bg-white/[0.02] space-y-3">
          <div className="text-[#ff5500] font-mono text-xs flex items-center justify-between">
            <span>PILLAR_03</span>
            <Layers size={14} />
          </div>
          <h3 className="text-lg font-bold font-sans text-neutral-100 uppercase">
            Cinematic Craft & WebGL
          </h3>
          <p className="text-sm text-neutral-400 font-sans leading-relaxed">
            Translating complex backend topology into intuitive, high-performance 120fps spatial interfaces, custom shaders, and visceral data visualizations.
          </p>
        </div>
      </div>
    </section>
  );
}
