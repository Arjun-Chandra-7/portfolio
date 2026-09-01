'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/audio';
import { Play, Pause, RotateCcw, ArrowRight, CheckCircle2, Shield, Activity, Cpu, Database, Eye, Terminal } from 'lucide-react';

interface PipelineStage {
  id: string;
  step: string;
  name: string;
  subsystem: string;
  latency: string;
  throughput: string;
  description: string;
  state: 'idle' | 'processing' | 'verified';
  icon: React.ReactNode;
}

export default function ArchitectureVisualizer() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [cycleCount, setCycleCount] = useState(42);

  const stages: PipelineStage[] = [
    {
      id: 'stream_ingest',
      step: '01',
      name: 'STREAM NORMALIZATION',
      subsystem: 'ZERO-COPY BUFFER',
      latency: '24ms',
      throughput: '1.2 GB/s',
      description: 'Ingests multi-protocol asynchronous telemetry, demuxes media chunks, and constructs zero-overhead memory frames.',
      state: activeStageIndex === 0 ? 'processing' : activeStageIndex > 0 ? 'verified' : 'idle',
      icon: <Database size={16} />
    },
    {
      id: 'token_embed',
      step: '02',
      name: 'MULTIMODAL TOKENIZER',
      subsystem: 'VISION TRANSFORMER',
      latency: '140ms',
      throughput: '450 fps',
      description: 'Generates spatial keyframe embeddings, audio prosody spectrograms, and dense text token representations.',
      state: activeStageIndex === 1 ? 'processing' : activeStageIndex > 1 ? 'verified' : 'idle',
      icon: <Eye size={16} />
    },
    {
      id: 'agent_graph',
      step: '03',
      name: 'AGENTIC DAG DELIBERATION',
      subsystem: 'SYNAPSE RUNTIME',
      latency: '320ms',
      throughput: '4-NODE CONCURRENT',
      description: 'Dispatches bounded-context sub-agents for retention scoring, pacing analysis, and hallucination grounding checks.',
      state: activeStageIndex === 2 ? 'processing' : activeStageIndex > 2 ? 'verified' : 'idle',
      icon: <Cpu size={16} />
    },
    {
      id: 'verifier',
      step: '04',
      name: 'TRANSACTIONAL VERIFICATION',
      subsystem: 'RAFT STATE BUS',
      latency: '18ms',
      throughput: '100% INVARIANT',
      description: 'Enforces DAG invariants, checks write-ahead memory logs, and verifies evidentiary citation grounding.',
      state: activeStageIndex === 3 ? 'processing' : activeStageIndex > 3 ? 'verified' : 'idle',
      icon: <Shield size={16} />
    },
    {
      id: 'synthesis_deploy',
      step: '05',
      name: 'PRESCRIPTIVE SYNTHESIS',
      subsystem: 'EDGE DISPATCH',
      latency: '45ms',
      throughput: 'JSONL VECTOR EXPORT',
      description: 'Compiles executable editing blueprints, vector indices, and downstream automated action signals.',
      state: activeStageIndex === 4 ? 'processing' : 'idle',
      icon: <Activity size={16} />
    }
  ];

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setActiveStageIndex((prev) => {
        const next = (prev + 1) % 5;
        if (next === 0) setCycleCount((c) => c + 1);
        sound.playNodeConnect();
        return next;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isRunning]);

  const currentStage = stages[activeStageIndex];

  return (
    <section id="architecture-visualizer" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-3 uppercase tracking-widest">
            <span>04 // SYSTEM MECHANICS</span>
            <span className="w-12 h-[1px] bg-[#ff5500]/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
            Interactive Architecture
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400 max-w-xs text-left sm:text-right">
          LIVE SIMULATION OF THE END-TO-END MULTI-AGENT INFERENCE & VERIFICATION PIPELINE.
        </div>
      </div>

      {/* Main Interactive Machine Console */}
      <div className="rounded-xl border border-white/10 bg-[#09090c] p-6 sm:p-8 space-y-8">
        {/* Top Control Bar & Live Pipeline Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/8">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-2 text-neutral-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              RUNNING CYCLE #{cycleCount}
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">ACTIVE: {currentStage.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playTelemetryTick();
                setIsRunning(!isRunning);
              }}
              className="px-3 py-1.5 rounded border border-white/10 hover:border-white/20 bg-white/5 text-xs font-mono text-neutral-300 flex items-center gap-2"
            >
              {isRunning ? <Pause size={12} /> : <Play size={12} />}
              <span>{isRunning ? 'PAUSE PIPELINE' : 'RESUME PIPELINE'}</span>
            </button>

            <button
              onClick={() => {
                sound.playTelemetryTick();
                setActiveStageIndex(0);
              }}
              title="Reset Cycle"
              className="p-1.5 rounded border border-white/10 hover:border-white/20 bg-white/5 text-neutral-400 hover:text-white"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Nodes Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stages.map((stg, i) => {
            const isActive = activeStageIndex === i;
            const isCompleted = activeStageIndex > i;

            return (
              <div
                key={stg.id}
                onClick={() => {
                  sound.playNodeConnect();
                  setActiveStageIndex(i);
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer relative ${
                  isActive
                    ? 'border-[#ff5500] bg-[#ff5500]/10 shadow-[0_0_20px_rgba(255,85,0,0.15)]'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                }`}
              >
                {/* Node Status Badge */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-3">
                  <span>STAGE {stg.step}</span>
                  {isActive && <span className="text-[#ff5500] font-bold animate-pulse">PROCESSING</span>}
                  {isCompleted && <span className="text-emerald-400">VERIFIED</span>}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded ${isActive ? 'text-[#ff5500] bg-[#ff5500]/20' : 'text-neutral-400 bg-white/5'}`}>
                    {stg.icon}
                  </div>
                  <h4 className="font-sans font-bold text-xs text-neutral-200 uppercase leading-tight">
                    {stg.name}
                  </h4>
                </div>

                <div className="text-[10px] font-mono text-neutral-400">
                  {stg.subsystem}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Subsystem Inspector Card */}
        <div className="p-6 rounded-lg border border-white/8 bg-black/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff5500]">
              <Terminal size={14} />
              <span>ACTIVE SUBSYSTEM INSPECTOR // STAGE {currentStage.step}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-neutral-100 uppercase">
              {currentStage.name} — {currentStage.subsystem}
            </h3>
            <p className="text-sm text-neutral-300 font-sans leading-relaxed">
              {currentStage.description}
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded border border-white/5 bg-white/[0.02] space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">STAGE LATENCY</div>
              <div className="text-lg font-mono font-bold text-[#ff5500]">{currentStage.latency}</div>
            </div>
            <div className="p-3 rounded border border-white/5 bg-white/[0.02] space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">THROUGHPUT</div>
              <div className="text-lg font-mono font-bold text-white">{currentStage.throughput}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
