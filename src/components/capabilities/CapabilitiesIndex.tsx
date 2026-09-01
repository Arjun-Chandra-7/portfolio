'use client';

import React from 'react';
import { CAPABILITIES } from '@/data/portfolioData';
import { Cpu, Server, Layout, Binary, Check } from 'lucide-react';

export default function CapabilitiesIndex() {
  const getIcon = (code: string) => {
    switch (code) {
      case 'SYS_DOMAIN_01':
        return <Cpu size={16} className="text-[#ff5500]" />;
      case 'SYS_DOMAIN_02':
        return <Server size={16} className="text-[#ff5500]" />;
      case 'SYS_DOMAIN_03':
        return <Layout size={16} className="text-[#ff5500]" />;
      default:
        return <Binary size={16} className="text-[#ff5500]" />;
    }
  };

  return (
    <section id="capabilities-index" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff5500] mb-3 uppercase tracking-widest">
            <span>06 // CORE COMPETENCIES</span>
            <span className="w-12 h-[1px] bg-[#ff5500]/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
            Capabilities Index
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400 max-w-xs text-left sm:text-right">
          FUNCTIONAL DOMAINS ORGANIZED BY WHAT SYSTEMS CAN BE ARCHITECTED AND SHIPPED.
        </div>
      </div>

      {/* Structured Technical Index Matrix (No boring logo clouds) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CAPABILITIES.map((domain) => (
          <div
            key={domain.code}
            className="p-6 sm:p-8 rounded-xl border border-white/8 bg-[#0a0a0d] space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500">{domain.code}</span>
                {getIcon(domain.code)}
              </div>
              <h3 className="text-lg sm:text-xl font-sans font-extrabold text-neutral-100 uppercase tracking-tight">
                {domain.domain}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {domain.description}
              </p>
            </div>

            {/* List of concrete capabilities */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              {domain.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-sans font-bold text-neutral-200 uppercase">
                      {cap.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-sans">
                      {cap.details}
                    </div>
                  </div>
                  <div className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-[#ff5500] self-start sm:self-center border border-white/10 uppercase">
                    {cap.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
