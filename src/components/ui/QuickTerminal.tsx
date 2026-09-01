'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/audio';
import { PROJECTS, EXPERIMENTS, LIVE_SIGNALS } from '@/data/portfolioData';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';

interface QuickTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickTerminal({ isOpen, onClose }: QuickTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'OPERIS TELEMETRY CLI [Version 2.8.4]',
    'Type "help" for available system commands, or "projects" to query archive.',
    ''
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    sound.playTelemetryTick();
    const newHistory = [...history, `> ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push(
          'AVAILABLE SYSTEM COMMANDS:',
          '  projects    - Query all indexed flagship engineering architectures',
          '  lab         - List active experimental prototypes and shader projects',
          '  signals     - Inspect live focus, learning telemetry, and coordinates',
          '  clear       - Flush terminal buffer',
          '  exit        - Terminate CLI runtime session'
        );
        break;
      case 'projects':
        PROJECTS.forEach(p => {
          newHistory.push(`[${p.number}] ${p.title} (${p.year}) - ${p.tagline}`);
        });
        break;
      case 'lab':
        EXPERIMENTS.forEach(exp => {
          newHistory.push(`[${exp.code}] ${exp.title} - ${exp.category}`);
        });
        break;
      case 'signals':
        newHistory.push(
          `STATUS: ${LIVE_SIGNALS.systemStatus}`,
          `BUILDING: ${LIVE_SIGNALS.building}`,
          `EXPLORING: ${LIVE_SIGNALS.exploring}`,
          `COORDINATES: ${LIVE_SIGNALS.coordinates}`
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        return;
      default:
        newHistory.push(`Unknown command: "${cmd}". Type "help" for command matrix.`);
    }

    newHistory.push('');
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#09090c] border border-white/15 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[480px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff5500]">
            <TerminalIcon size={14} />
            <span>OPERIS // QUICK_COMMAND_INTERFACE</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Terminal Output */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-neutral-300 space-y-1.5 bg-black/50">
          {history.map((line, idx) => (
            <div key={idx} className={line.startsWith('>') ? 'text-[#ff5500] font-semibold' : 'text-neutral-300'}>
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleCommand} className="flex items-center px-4 py-3 border-t border-white/10 bg-white/[0.02]">
          <span className="font-mono text-xs text-[#ff5500] mr-2">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command ('help', 'projects', 'signals')..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-neutral-100 placeholder-neutral-600"
          />
          <button type="submit" className="text-neutral-500 hover:text-white">
            <CornerDownLeft size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
