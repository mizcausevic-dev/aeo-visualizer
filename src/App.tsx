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
    <div className="p-2 bg-cyan-400/10 text-cyan-200 rounded-lg border border-cyan-300/20">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 font-normal">{subtitle}</p>}
    </div>
  </div>
);

const MetricCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-stone-100">{value}</p>
    <p className="mt-2 text-sm leading-relaxed text-slate-400">{detail}</p>
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
      className="group overflow-hidden rounded-2xl border border-cyan-300/10 bg-[#0c1423]/85 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-all hover:border-cyan-300/35 hover:shadow-cyan-950/30"
    >
      <div className="p-4 cursor-pointer flex items-start justify-between gap-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{claim.predicate}</span>
            <Badge className={`${confColor} flex items-center gap-1`}>
              <ShieldCheck size={10} /> {claim.confidence} confidence
            </Badge>
          </div>
          <h3 className="text-base font-semibold text-stone-100 leading-snug">
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
            className="overflow-hidden border-t border-cyan-300/10 bg-black/25"
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
    <div className="min-h-screen overflow-x-hidden bg-[#030712] text-slate-200 font-sans selection:bg-cyan-300/25">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 opacity-90" style={{ background: 'radial-gradient(900px 520px at 84% -12%, rgba(34,211,238,0.12), transparent 58%), radial-gradient(720px 420px at 0% 12%, rgba(129,140,248,0.14), transparent 60%)' }} />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050912]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 font-mono text-sm font-bold tracking-widest text-cyan-200">
              AEO
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-stone-100">AEO Visualizer</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">AEO Protocol Visualizer</p>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 md:flex">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                  view === t.id ? 'bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)]' : 'text-slate-400 hover:text-stone-100'
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
            className="rounded-full border border-white/10 p-3 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            title="GitHub Repository"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {view === 'visualizer' && (
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#0b1422]/85 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.36)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.34em] text-emerald-300">
                  Answer-engine operating layer
                </div>
                <h2 className="mt-6 max-w-4xl font-serif text-5xl font-black leading-[0.95] tracking-[-0.05em] text-stone-100 sm:text-6xl lg:text-7xl">
                  Turn answer ambiguity into citation-ready proof.
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                  AEO Visualizer renders /.well-known/aeo.json into a board-readable proof surface for entity authority, claims, freshness rules, and citation preferences.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <MetricCard label="Protocol" value={doc.aeo_version} detail="Current declaration version under review." />
                <MetricCard label="Claims" value={String(doc.claims.length)} detail="Machine-readable facts with confidence labels." />
                <MetricCard label="Freshness" value={`${doc.answer_constraints?.freshness_window_days ?? 0}d`} detail="Answer-engine freshness window." />
              </div>
            </div>
          </section>
        )}

        <div className="mb-8 grid grid-cols-2 gap-2 md:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                view === t.id ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/10 bg-white/[0.035] text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'visualizer' && (
            <motion.div key="viz" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Entity & Authority */}
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <Badge className="mb-3 border-cyan-300/20 bg-cyan-300/10 text-cyan-200">{doc.entity.type}</Badge>
                      <h2 className="mb-2 text-4xl font-semibold tracking-tight text-stone-100">{doc.entity.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        {doc.entity.aliases?.map((alias, i) => (
                          <span key={i} className="text-sm text-slate-500 italic">aka {alias}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                      {doc.entity.type === 'Person' ? <Share2 size={30} /> : <Terminal size={30} />}
                    </div>
                  </div>
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                      <LinkIcon size={16} className="text-slate-500" />
                      <a href={doc.entity.canonical_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-cyan-300 hover:underline">
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
                <div className="rounded-[1.6rem] border border-cyan-300/10 bg-[#08111f] p-7 text-white shadow-xl">
                  <SectionHeader icon={ShieldCheck} title="Authority" subtitle="Primary sources & ed25519 verifications" />
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Sources</h4>
                      <div className="space-y-2">
                        {doc.authority.primary_sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-2 text-sm transition-colors hover:border-cyan-300/30">
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
                            <div key={i} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.035] p-3">
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
                <div className="min-h-full rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
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
                      <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] p-6">
                        <div className="mb-4">
                          <h4 className="mb-2 text-[10px] font-bold uppercase text-cyan-300/80">Preferred Attribution</h4>
                          <p className="text-sm italic text-slate-300 leading-relaxed font-serif">"{doc.citation_preferences.preferred_attribution}"</p>
                        </div>
                        {doc.citation_preferences.canonical_links && (
                          <div>
                            <h4 className="mb-3 text-[10px] font-bold uppercase text-cyan-300/80">Canonical Link References</h4>
                            <div className="space-y-2">
                              {doc.citation_preferences.canonical_links.map((link, i) => (
                                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-cyan-300 hover:underline">
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
