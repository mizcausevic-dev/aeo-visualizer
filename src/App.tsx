/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  CheckCircle, 
  Info, 
  Link as LinkIcon, 
  Database, 
  Terminal, 
  FileText, 
  Share2, 
  Eye, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Code,
  Github,
  BookOpen,
  Map,
  Zap
} from 'lucide-react';
import { AEODocument, AEOClaim, DEFAULT_EXAMPLE } from './types';

// Components
const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-slate-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 font-normal">{subtitle}</p>}
    </div>
  </div>
);

const ClaimCard = ({ claim, index }: { claim: AEOClaim, index: number, key?: React.Key }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderValue = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {val.map((v, i) => (
            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">
              {typeof v === 'object' ? (v.name || JSON.stringify(v)) : v}
            </span>
          ))}
        </div>
      );
    }
    if (typeof val === 'object') {
      return (
        <div className="mt-2 text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
          {JSON.stringify(val, null, 2)}
        </div>
      );
    }
    return String(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div 
        className="p-4 cursor-pointer flex items-start justify-between gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{claim.predicate}</span>
            {claim.confidence === 'high' && (
              <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <ShieldCheck size={10} /> High Confidence
              </Badge>
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-800 leading-snug">
            {typeof claim.value === 'string' ? claim.value : claim.id}
          </h3>
          {typeof claim.value !== 'string' && (
            <div className="mt-1">{renderValue(claim.value)}</div>
          )}
        </div>
        <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
          >
            <div className="p-4 space-y-4">
              {claim.evidence && claim.evidence.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <Database size={10} /> Supporting Evidence
                  </h4>
                  <ul className="space-y-1.5">
                    {claim.evidence.map((ev, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                        <LinkIcon size={12} className="text-slate-400 shrink-0" />
                        <a href={ev} target="_blank" rel="noopener noreferrer" className="truncate">{ev}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                 {claim.valid_from && (
                   <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Valid From</h4>
                     <p className="text-xs text-slate-600">{claim.valid_from}</p>
                   </div>
                 )}
                 <div>
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Claim ID</h4>
                   <p className="text-xs font-mono text-slate-600">{claim.id}</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [doc, setDoc] = useState<AEODocument>(DEFAULT_EXAMPLE);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_EXAMPLE, null, 2));
  const initialView = (() => {
    if (typeof window === 'undefined') return 'visualizer';
    const p = new URLSearchParams(window.location.search).get('view');
    return (p === 'editor' || p === 'about') ? p : 'visualizer';
  })() as 'visualizer' | 'editor' | 'about';
  const [view, setView] = useState<'visualizer' | 'editor' | 'about'>(initialView);
  const [error, setError] = useState<string | null>(null);

  const handleJsonUpdate = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      // Basic validation
      if (!parsed.aeo_version || !parsed.entity || !parsed.claims) {
        throw new Error("Missing required AEO fields (aeo_version, entity, claims)");
      }
      setDoc(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={24} fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AEO <span className="text-blue-600">Visualizer</span></h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Protocol v0.1 Build</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setView('visualizer')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'visualizer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><Eye size={16} /> Explore</div>
            </button>
            <button 
              onClick={() => setView('editor')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><Code size={16} /> JSON Editor</div>
            </button>
            <button 
              onClick={() => setView('about')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'about' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className="flex items-center gap-2"><Info size={16} /> About</div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/mizcausevic-dev/aeo-protocol-spec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === 'visualizer' && (
            <motion.div 
              key="viz"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Entity & Authority */}
              <div className="lg:col-span-5 space-y-8">
                {/* Entity Profile */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100 mb-2">{doc.entity.type}</Badge>
                      <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{doc.entity.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        {doc.entity.aliases?.map((alias, i) => (
                          <span key={i} className="text-sm text-slate-400 italic">aka {alias}</span>
                        ))}
                      </div>
                    </div>
                    {doc.entity.type === 'Person' ? (
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100">
                        <Share2 size={32} />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 border border-purple-100">
                        <Terminal size={32} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <LinkIcon size={16} className="text-slate-400" />
                      <a href={doc.entity.canonical_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {doc.entity.canonical_url} <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Terminal size={16} className="text-slate-400" />
                      <span className="text-xs font-mono text-slate-500 break-all">{doc.entity.id}</span>
                    </div>
                  </div>
                </div>

                {/* Authority & Verifications */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                  <SectionHeader 
                    icon={ShieldCheck} 
                    title="Authority Pillar" 
                    subtitle="Primary sources and cryptographic verifications" 
                  />
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Sources</h4>
                      <div className="space-y-2">
                        {doc.authority.primary_sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg text-sm border border-slate-700/50 hover:border-slate-500 transition-colors">
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                            <a href={src} target="_blank" rel="noopener noreferrer" className="truncate text-slate-300 hover:text-white">{src}</a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {doc.authority.verifications && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Verifications</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {doc.authority.verifications.map((v, i) => (
                            <div key={i} className="flex flex-col p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                              <span className="text-[9px] text-slate-500 uppercase font-mono">{v.type}</span>
                              <span className="text-xs font-medium truncate">{v.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer constraints */}
                {doc.answer_constraints && (
                  <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                    <SectionHeader 
                      icon={AlertCircle} 
                      title="Answer Constraints" 
                      subtitle="Instructions for answer engine synthesis" 
                    />
                    <div className="space-y-4">
                      {doc.answer_constraints.must_not_include && (
                        <div>
                          <h4 className="text-[10px] font-bold text-amber-600/60 uppercase mb-2">Exclusion List</h4>
                          <div className="flex flex-wrap gap-2">
                            {doc.answer_constraints.must_not_include.map((item, i) => (
                              <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-200">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-[10px] font-bold text-amber-600/60 uppercase mb-1">Freshness Window</h4>
                        <p className="text-sm font-medium text-amber-900">{doc.answer_constraints.freshness_window_days} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Claims */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-full">
                  <div className="flex items-center justify-between mb-8">
                     <SectionHeader 
                      icon={Activity} 
                      title="Authoritative Claims" 
                      subtitle={`Declaring ${doc.claims.length} machine-readable facts`} 
                    />
                    <div className="text-slate-400 flex items-center gap-2 text-xs font-medium">
                      Status: <span className="text-green-500 flex items-center gap-1 font-bold">● ACTIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {doc.claims.map((claim, index) => (
                      <ClaimCard key={claim.id} claim={claim} index={index} />
                    ))}
                  </div>

                  {doc.citation_preferences && (
                    <div className="mt-12 pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Share2 size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Citation Preferences</h3>
                          <p className="text-sm text-slate-500">How this entity prefers to be attributed</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div className="mb-4">
                          <h4 className="text-[10px] font-bold text-blue-600/60 uppercase mb-2">Preferred Attribution</h4>
                          <p className="text-sm italic text-slate-700 leading-relaxed font-serif">"{doc.citation_preferences.preferred_attribution}"</p>
                        </div>
                        {doc.citation_preferences.canonical_links && (
                          <div>
                            <h4 className="text-[10px] font-bold text-blue-600/60 uppercase mb-3">Canonical Link References</h4>
                            <div className="space-y-2">
                              {doc.citation_preferences.canonical_links.map((link, i) => (
                                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                                  <LinkIcon size={12} /> {link}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <SectionHeader 
                    icon={Terminal} 
                    title="AEO Document Editor" 
                    subtitle="Paste your /.well-known/aeo.json here to visualize it" 
                  />
                  {error && (
                    <div className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-medium flex items-center gap-2 animate-pulse">
                      <AlertCircle size={14} /> Invalid AEO Structure
                    </div>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonUpdate(e.target.value)}
                    className="w-full h-[600px] bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-inner"
                    spellCheck={false}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setJsonInput(JSON.stringify(DEFAULT_EXAMPLE, null, 2))}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm"
                    >
                      Reset Example
                    </button>
                    <button 
                      onClick={() => { setView('visualizer'); setError(null); }}
                      className="px-4 py-1.5 bg-blue-600 border border-blue-700 rounded-lg text-xs font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                      Visualize Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              {/* Pillar Visualization */}
              <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">The Three Pillars of AEO</h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                  AEO is a machine-readable spec for the "post-search" era, where LLMs synthesize the web.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: FileText, title: "Declare", desc: "A JSON document describing high-fidelity authoritative claims.", color: "blue" },
                  { icon: Map, title: "Discover", desc: "A fixed well-known URL so answer engines can find your data.", color: "green" },
                  { icon: Activity, title: "Audit", desc: "A signed surface for verifying which claims were cited.", color: "purple" }
                ].map((p, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-${p.color}-50 text-${p.color}-600 flex items-center justify-center mb-6`}>
                      <p.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                  <Shield size={240} />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold mb-4">Why AEO Matter?</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                      Search Engines rank pages based on relevance. Answer Engines synthesize facts. 
                      AEO gives you a way to tell the model exactly which facts are correct, 
                      providing proof and attribution requirements.
                    </p>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <p className="text-sm text-slate-300">Moves from "Clickable Links" to "Canonical Citations"</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <p className="text-sm text-slate-300">Enforces data freshness windows for AI synthesis</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <p className="text-sm text-slate-300">Protects brands from LLM hallucinations via authoritative evidence</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-800">
                    <a 
                      href="https://github.com/mizcausevic-dev/aeo-protocol-spec/blob/main/SPEC.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg"
                    >
                      Read Full Specification <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer-ish Info */}
              <div className="text-center text-slate-400 text-sm space-y-4">
                <p>Built as a reference visualizer for the AEO Protocol draft v0.1</p>
                <div className="flex items-center justify-center gap-6">
                  <a href="#" className="hover:text-slate-600 transition-colors">Spec</a>
                  <a href="#" className="hover:text-slate-600 transition-colors">Schema</a>
                  <a href="#" className="hover:text-slate-600 transition-colors">Examples</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50">
        <button 
          onClick={() => window.open('https://github.com/mizcausevic-dev/aeo-protocol-spec', '_blank')}
          className="px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-all"
        >
          <Github size={18} /> Repo
        </button>
        <div className="w-px h-8 bg-slate-100" />
        <button 
          onClick={() => window.open('https://github.com/mizcausevic-dev/aeo-protocol-spec/tree/main/examples', '_blank')}
          className="px-4 py-2 text-sm font-semibold flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-lg"
        >
          <BookOpen size={18} /> More Examples
        </button>
      </div>
    </div>
  );
}

