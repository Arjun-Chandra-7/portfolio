'use client';

import React, { useState } from 'react';
import { Project } from '@/data/portfolioData';
import { sound } from '@/lib/audio';
import { X, ExternalLink, Code2, CheckCircle2, AlertTriangle, Layers, Cpu, Activity, CornerRightDown } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ARCHITECTURE' | 'DECISIONS' | 'STACK'>('OVERVIEW');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#080808]/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Container Frame */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0c0f] border border-white/12 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#ff5500] font-bold">
              SYS_CASE_STUDY // {project.number}
            </span>
            <span className="text-neutral-600">|</span>
            <span className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
              {project.title}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
              {project.status}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playTelemetryTick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/8 bg-black/40 overflow-x-auto text-xs font-mono">
          {(['OVERVIEW', 'ARCHITECTURE', 'DECISIONS', 'STACK'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playTelemetryTick();
                setActiveTab(tab);
              }}
              className={`px-3 py-1.5 rounded uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Header Title Section */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              {project.category} · {project.year}
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 font-sans leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Tab 01: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded bg-white/[0.02] border border-white/8 space-y-1">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{m.label}</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#ff5500]">{m.value}</div>
                    <div className="text-[11px] text-neutral-400 leading-tight">{m.description}</div>
                  </div>
                ))}
              </div>

              {/* Problem vs Solution Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded border border-red-500/20 bg-red-500/[0.02] space-y-2">
                  <div className="text-xs font-mono text-red-400 flex items-center gap-1.5 uppercase font-semibold">
                    <AlertTriangle size={14} />
                    01 // The Problem
                  </div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                <div className="p-5 rounded border border-emerald-500/20 bg-emerald-500/[0.02] space-y-2">
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 uppercase font-semibold">
                    <CheckCircle2 size={14} />
                    02 // The Engineering Solution
                  </div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Key Results & Learnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    EMPIRICAL RESULTS
                  </div>
                  <ul className="space-y-2">
                    {project.results.map((res, i) => (
                      <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                        <span className="text-[#ff5500] font-mono text-xs mt-0.5">▸</span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    ARCHITECTURAL LEARNINGS
                  </div>
                  <ul className="space-y-2">
                    {project.learnings.map((lrn, i) => (
                      <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                        <span className="text-neutral-500 font-mono text-xs mt-0.5">▸</span>
                        <span>{lrn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 02: ARCHITECTURE (Interactive Flow) */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-6">
              <div className="text-xs font-mono text-neutral-400 uppercase">
                INTERACTIVE PIPELINE NODES (CLICK NODE TO INSPECT TELEMETRY)
              </div>

              <div className="space-y-3">
                {project.architectureNodes.map((node, i) => {
                  const isSelected = activeNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        sound.playNodeConnect();
                        setActiveNodeId(isSelected ? null : node.id);
                      }}
                      className={`p-4 rounded border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#ff5500] bg-[#ff5500]/[0.06]'
                          : 'border-white/8 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#ff5500] font-bold">
                            STEP {node.step}
                          </span>
                          <span className="font-sans font-bold text-neutral-100 text-sm sm:text-base uppercase">
                            {node.title}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                          <span>LATENCY:</span>
                          <span className="text-neutral-200">{node.latency}</span>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-400 font-sans mt-2">
                        {node.role}
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-xs font-mono text-[#ff5500] bg-black/40 p-3 rounded">
                          <span className="text-neutral-400">SUBSYSTEM SPECIFICATION: </span>
                          {node.details}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 03: ENGINEERING DECISIONS */}
          {activeTab === 'DECISIONS' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-neutral-400 uppercase">
                CRITICAL TRADE-OFF EVALUATIONS & RATIONALE
              </div>

              {project.engineeringDecisions.map((dec, i) => (
                <div key={i} className="p-5 rounded border border-white/8 bg-white/[0.02] space-y-3">
                  <h4 className="text-base font-bold font-sans text-neutral-100 uppercase">
                    {dec.title}
                  </h4>
                  <div className="space-y-2 text-sm font-sans">
                    <div className="text-neutral-300">
                      <strong className="text-neutral-400 font-mono text-xs uppercase mr-2">Rationale:</strong>
                      {dec.rationale}
                    </div>
                    <div className="text-neutral-400 bg-white/[0.02] p-3 rounded border border-white/5">
                      <strong className="text-[#ff5500] font-mono text-xs uppercase mr-2">Trade-off Managed:</strong>
                      {dec.tradeoff}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 04: TECH STACK */}
          {activeTab === 'STACK' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.techStack.map((stk, i) => (
                <div key={i} className="p-4 rounded border border-white/8 bg-white/[0.02] space-y-3">
                  <div className="text-xs font-mono text-[#ff5500] uppercase font-bold">
                    {stk.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stk.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Links */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/60">
          <div className="flex items-center gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <Code2 size={14} />
                <span>REPOSITORY</span>
              </a>
            )}
            {project.links.live && project.links.live !== '#' && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-[#ff5500] hover:underline"
              >
                <ExternalLink size={14} />
                <span>LIVE DEMO</span>
              </a>
            )}
          </div>

          <button
            onClick={() => {
              sound.playTelemetryTick();
              onClose();
            }}
            className="px-4 py-2 rounded bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ff5500] hover:text-white transition-colors"
          >
            CLOSE CASE STUDY
          </button>
        </div>
      </div>
    </div>
  );
}
