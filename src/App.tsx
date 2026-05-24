/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  CheckCircle,
  Info,
  Link as LinkIcon,
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
  Database,
  AlertCircle,
  Code,
  Github,
  FolderGit2,
  KeyRound,
  Radar,
} from 'lucide-react';
import { AEODocument, AEOClaim, DEFAULT_EXAMPLE } from './types';
import SpecExplorer from './SpecExplorer';

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>{children}</span>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-blue-500/15 text-blue-300 rounded-lg border border-blue-500/20">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 font-normal">{subtitle}</p>}
    </div>
  </div>
);

const ClaimCard = ({ claim, index }: { claim: AEOClaim; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderValue = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {val.map((v, i) => (
            <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
              {typeof v === 'object' ? (v.name || JSON.stringify(v)) : v}
            </span>
          ))}
        </div>
      );
    }
    if (typeof val === 'object') {
      return (
        <div className="mt-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800 overflow-x-auto text-slate-300">
          {JSON.stringify(val, null, 2)}
        </div>
      );
    }
    return String(val);
  };

  const confColor =
    claim.confidence === 'high'
      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      : claim.confidence === 'medium'
        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        : 'bg-slate-500/10 text-slate-300 border-slate-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="group bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
    >
      <div className="p-4 cursor-pointer flex items-start justify-between gap-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{claim.predicate}</span>
            <Badge className={`${confColor} flex items-center gap-1`}>
              <ShieldCheck size={10} /> {claim.confidence} confidence
            </Badge>
          </div>
          <h3 className="text-base font-semibold text-slate-100 leading-snug">
            {typeof claim.value === 'string' ? claim.value : claim.id}
          </h3>
          {typeof claim.value !== 'string' && <div className="mt-1">{renderValue(claim.value)}</div>}
        </div>
        <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-950/50 border-t border-slate-800"
          >
            <div className="p-4 space-y-4">
              {claim.evidence && claim.evidence.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <Database size={10} /> Supporting Evidence
                  </h4>
                  <ul className="space-y-1.5">
                    {claim.evidence.map((ev, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-blue-400 hover:underline">
                        <LinkIcon size={12} className="text-slate-500 shrink-0" />
                        <a href={ev} target="_blank" rel="noopener noreferrer" className="truncate">{ev}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {claim.valid_from && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Valid From</h4>
                    <p className="text-xs text-slate-400">{claim.valid_from}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Claim ID</h4>
                  <p className="text-xs font-mono text-slate-400">{claim.id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type View = 'visualizer' | 'editor' | 'explorer' | 'about';

export default function App() {
  const [doc, setDoc] = useState<AEODocument>(DEFAULT_EXAMPLE);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_EXAMPLE, null, 2));
  const initialView = (() => {
    if (typeof window === 'undefined') return 'visualizer';
    const p = new URLSearchParams(window.location.search).get('view');
    return p === 'editor' || p === 'about' || p === 'explorer' ? (p as View) : 'visualizer';
  })();
  const [view, setView] = useState<View>(initialView);
  const [error, setError] = useState<string | null>(null);

  const handleJsonUpdate = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (!parsed.aeo_version || !parsed.entity || !parsed.claims) {
        throw new Error('Missing required AEO fields (aeo_version, entity, claims)');
      }
      setDoc(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const tabs: { id: View; label: string; icon: any }[] = [
    { id: 'visualizer', label: 'Explore', icon: Eye },
    { id: 'editor', label: 'JSON Editor', icon: Code },
    { id: 'explorer', label: 'Spec Explorer', icon: FolderGit2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60" style={{ background: 'radial-gradient(900px 500px at 80% -10%, rgba(37,99,235,0.10), transparent 60%)' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#070b16]/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
              <Radar size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">AEO <span className="text-blue-400">Visualizer</span></h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Protocol v0.1 · Kinetic Gain</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === t.id ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2"><t.icon size={16} /> {t.label}</div>
              </button>
            ))}
          </div>

          <a
            href="https://github.com/mizcausevic-dev/aeo-protocol-spec"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="GitHub Repository"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === 'visualizer' && (
            <motion.div key="viz" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Entity & Authority */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 mb-2">{doc.entity.type}</Badge>
                      <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{doc.entity.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        {doc.entity.aliases?.map((alias, i) => (
                          <span key={i} className="text-sm text-slate-500 italic">aka {alias}</span>
                        ))}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                      {doc.entity.type === 'Person' ? <Share2 size={30} /> : <Terminal size={30} />}
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <LinkIcon size={16} className="text-slate-500" />
                      <a href={doc.entity.canonical_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                        {doc.entity.canonical_url} <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Terminal size={16} className="text-slate-500" />
                      <span className="text-xs font-mono text-slate-400 break-all">{doc.entity.id}</span>
                    </div>
                  </div>
                </div>

                {/* Authority */}
                <div className="bg-slate-950 rounded-3xl p-8 text-white border border-slate-800 shadow-xl">
                  <SectionHeader icon={ShieldCheck} title="Authority" subtitle="Primary sources & ed25519 verifications" />
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Sources</h4>
                      <div className="space-y-2">
                        {doc.authority.primary_sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg text-sm border border-slate-800 hover:border-slate-600 transition-colors">
                            <CheckCircle size={14} className="text-emerald-500 shrink-0" />
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
                            <div key={i} className="flex flex-col p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                              <span className="text-[9px] text-slate-500 uppercase font-mono">{v.type}</span>
                              <span className="text-xs font-medium truncate text-slate-200">{v.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer constraints */}
                {doc.answer_constraints && (
                  <div className="bg-amber-500/[0.06] rounded-3xl p-8 border border-amber-500/20">
                    <SectionHeader icon={AlertCircle} title="Answer Constraints" subtitle="Instructions for answer-engine synthesis" />
                    <div className="space-y-4">
                      {doc.answer_constraints.must_not_include && (
                        <div>
                          <h4 className="text-[10px] font-bold text-amber-400/70 uppercase mb-2">Exclusion List</h4>
                          <div className="flex flex-wrap gap-2">
                            {doc.answer_constraints.must_not_include.map((item, i) => (
                              <Badge key={i} className="bg-amber-500/10 text-amber-300 border-amber-500/30">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-[10px] font-bold text-amber-400/70 uppercase mb-1">Freshness Window</h4>
                        <p className="text-sm font-medium text-amber-200">{doc.answer_constraints.freshness_window_days} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Claims */}
              <div className="lg:col-span-7">
                <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 min-h-full">
                  <div className="flex items-center justify-between mb-8">
                    <SectionHeader icon={Activity} title="Authoritative Claims" subtitle={`Declaring ${doc.claims.length} machine-readable facts`} />
                    <div className="text-slate-500 flex items-center gap-2 text-xs font-medium">
                      Status: <span className="text-emerald-400 flex items-center gap-1 font-bold">● ACTIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {doc.claims.map((claim, index) => (
                      <ClaimCard key={claim.id} claim={claim} index={index} />
                    ))}
                  </div>

                  {doc.citation_preferences && (
                    <div className="mt-12 pt-8 border-t border-slate-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/15 text-blue-300 rounded-lg border border-blue-500/20"><Share2 size={20} /></div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Citation Preferences</h3>
                          <p className="text-sm text-slate-400">How this entity prefers to be attributed</p>
                        </div>
                      </div>
                      <div className="bg-blue-500/[0.05] p-6 rounded-2xl border border-blue-500/20">
                        <div className="mb-4">
                          <h4 className="text-[10px] font-bold text-blue-400/70 uppercase mb-2">Preferred Attribution</h4>
                          <p className="text-sm italic text-slate-300 leading-relaxed font-serif">"{doc.citation_preferences.preferred_attribution}"</p>
                        </div>
                        {doc.citation_preferences.canonical_links && (
                          <div>
                            <h4 className="text-[10px] font-bold text-blue-400/70 uppercase mb-3">Canonical Link References</h4>
                            <div className="space-y-2">
                              {doc.citation_preferences.canonical_links.map((link, i) => (
                                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-400 hover:underline">
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
            <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
              <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <SectionHeader icon={Terminal} title="AEO Document Editor" subtitle="Paste your /.well-known/aeo.json to visualize it" />
                  {error && (
                    <div className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-2">
                      <AlertCircle size={14} /> Invalid AEO Structure
                    </div>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonUpdate(e.target.value)}
                    className="w-full h-[600px] bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm leading-relaxed text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    spellCheck={false}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleJsonUpdate(JSON.stringify(DEFAULT_EXAMPLE, null, 2))} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700">
                      Reset Example
                    </button>
                    <button onClick={() => { setView('visualizer'); setError(null); }} className="px-4 py-1.5 bg-blue-600 border border-blue-500 rounded-lg text-xs font-medium text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40">
                      Visualize Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'explorer' && (
            <motion.div key="explorer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-8">
                <SectionHeader icon={FolderGit2} title="Spec Explorer" subtitle="Browse the live aeo-protocol-spec repository — spec, schema & examples" />
              </div>
              <SpecExplorer />
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} className="max-w-3xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">The Three Pillars of AEO</h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                  A machine-readable spec for the answer-engine era — so LLMs synthesize <em>your</em> facts, attributed the way you want.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: FileText, title: 'Declare', desc: 'Publish /.well-known/aeo.json with your entity and high-fidelity, machine-readable claims.', cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
                  { icon: KeyRound, title: 'Authority', desc: 'Primary sources, evidence links, and ed25519 verifications prove the claims came from you.', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                  { icon: Share2, title: 'Constrain & Cite', desc: 'Answer constraints (exclusions, freshness) and citation preferences govern how engines use and attribute you.', cls: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
                ].map((p, i) => (
                  <div key={i} className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 text-center flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 ${p.cls}`}>
                      <p.icon size={30} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{p.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 rounded-[2.5rem] p-12 text-white relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-8 text-white/[0.03] pointer-events-none"><Shield size={240} /></div>
                <div className="relative z-10 space-y-8">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold mb-4">Why AEO matters</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                      Search engines rank pages by relevance. Answer engines synthesize facts. AEO gives you a way to tell the model exactly which facts are authoritative — with proof and attribution requirements attached.
                    </p>
                    <div className="space-y-4">
                      {[
                        'Moves from "clickable links" to "canonical citations"',
                        'ed25519 verifications prove the facts came from the domain owner',
                        'Freshness windows + exclusion lists constrain how answer engines synthesize',
                        'Protects brands from LLM hallucinations via authoritative evidence',
                      ].map((t, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle size={14} className="text-white" /></div>
                          <p className="text-sm text-slate-300">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-800 flex flex-wrap gap-3">
                    <a href="https://github.com/mizcausevic-dev/aeo-protocol-spec/blob/main/SPEC.md" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg">
                      Read the Spec <ArrowRight size={18} />
                    </a>
                    <a href="https://suite.kineticgain.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-700 transition-all border border-slate-700">
                      Kinetic Gain Suite <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center text-slate-500 text-sm">
                <p>Reference visualizer for the AEO Protocol draft v0.1 · part of the <a href="https://suite.kineticgain.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Kinetic Gain Protocol Suite</a>.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
