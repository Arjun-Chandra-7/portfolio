'use client';

import React, { useState } from 'react';
import { LIVE_SIGNALS } from '@/data/portfolioData';
import { sound } from '@/lib/audio';
import { Mail, Terminal, CheckCircle2, ArrowUpRight, Copy, Code2, Globe } from 'lucide-react';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const email = 'arjun.chandra.engineer@gmail.com';

  const copyEmail = () => {
    sound.playTelemetryTick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact-terminal" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-8 uppercase tracking-widest">
        <span>08 // DISPATCH SIGNAL</span>
        <span className="w-12 h-[1px] bg-[#ff5500]/40" />
      </div>

      {/* Monumental Contact Callout */}
      <div className="space-y-8 max-w-5xl">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold uppercase tracking-tight text-neutral-100 leading-[0.95]">
          Let’s build something <br />
          that <span className="text-[#ff5500] font-serif italic lowercase">shouldn’t exist</span> yet.
        </h2>

        <p className="text-base sm:text-xl text-neutral-300 font-sans leading-relaxed max-w-2xl">
          Available for ambitious technical collaborations, high-throughput AI architecture contracts,
          and senior system engineering roles.
        </p>

        {/* Action Transmission Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {/* Email Direct Trigger */}
          <div className="p-6 rounded-xl border border-white/10 bg-[#0a0a0d] space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                <Mail size={13} className="text-[#ff5500]" />
                PRIMARY_CHANNEL
              </div>
              <div className="text-sm font-mono text-neutral-200 font-semibold break-all">
                {email}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                onClick={() => sound.playTelemetryTick()}
                className="flex-1 py-2 px-3 rounded bg-white text-black font-mono text-xs font-bold uppercase tracking-wider text-center hover:bg-[#ff5500] hover:text-white transition-colors"
              >
                DISPATCH EMAIL
              </a>
              <button
                onClick={copyEmail}
                title="Copy email to clipboard"
                className="p-2 rounded border border-white/10 hover:border-white/20 bg-white/5 text-neutral-300 hover:text-white"
              >
                {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {/* GitHub Repository Profile */}
          <a
            href="https://github.com/Arjun-Chandra-7"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playTelemetryTick()}
            className="p-6 rounded-xl border border-white/10 bg-[#0a0a0d] hover:border-white/25 transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                <Code2 size={13} className="text-[#ff5500]" />
                CODE_ARCHIVE
              </div>
              <div className="text-sm font-mono text-neutral-200 font-semibold flex items-center justify-between">
                <span>github.com/Arjun-Chandra-7</span>
                <ArrowUpRight size={15} className="text-neutral-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              EXPLORE OPEN-SOURCE REPOSITORIES & DAG RUNTIMES →
            </div>
          </a>

          {/* LinkedIn Profile */}
          <a
            href="https://linkedin.com/in/Arjun-Chandra-7"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playTelemetryTick()}
            className="p-6 rounded-xl border border-white/10 bg-[#0a0a0d] hover:border-white/25 transition-all space-y-4 flex flex-col justify-between group sm:col-span-2 lg:col-span-1"
          >
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                <Globe size={13} className="text-[#ff5500]" />
                PROFESSIONAL_INDEX
              </div>
              <div className="text-sm font-mono text-neutral-200 font-semibold flex items-center justify-between">
                <span>linkedin.com/in/Arjun-Chandra-7</span>
                <ArrowUpRight size={15} className="text-neutral-500 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              ESTABLISH DIRECT DIALOGUE & NETWORK →
            </div>
          </a>
        </div>
      </div>

      {/* Footer System Telemetry Status */}
      <div className="mt-24 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{LIVE_SIGNALS.systemStatus}</span>
        </div>
        <div className="text-center sm:text-right">
          © {new Date().getFullYear()} OPERIS // ARJUN CHANDRA. ALL RIGHTS RESERVED.
        </div>
      </div>
    </section>
  );
}
