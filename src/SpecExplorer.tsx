/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { FileText, FileJson, FileCode, Folder, Image as ImageIcon, RefreshCw, Github, AlertCircle } from 'lucide-react';

const REPO = 'mizcausevic-dev/aeo-protocol-spec';
const BRANCH = 'main';

interface TreeFile { path: string; name: string; ext: string; }

const BINARY_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'svg', 'zip', 'gz', 'pdf', 'woff', 'woff2', 'ttf']);
const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'svg']);

// Files we always show even if the GitHub tree API is rate-limited (unauth = 60/hr).
const FALLBACK_TREE: TreeFile[] = [
  'README.md', 'SPEC.md', 'CHANGELOG.md', 'LICENSE',
  'aeo.schema.json', 'docs/ORIGIN.md',
  'examples/aeo-person.json', 'examples/aeo-organization.json', 'examples/aeo-product.json',
].map((p) => ({ path: p, name: p.split('/').pop() || p, ext: (p.split('.').pop() || '').toLowerCase() }));

function iconFor(ext: string) {
  if (ext === 'json') return FileJson;
  if (ext === 'md') return FileText;
  if (IMAGE_EXT.has(ext)) return ImageIcon;
  if (['ts', 'tsx', 'js', 'yml', 'yaml'].includes(ext)) return FileCode;
  return FileText;
}

/** Tiny dependency-free markdown → HTML for the spec docs (headings, code, bold, lists, links). */
function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const blocks = md.split(/```/);
  let html = '';
  blocks.forEach((blk, i) => {
    if (i % 2 === 1) {
      const body = blk.replace(/^[a-zA-Z0-9]*\n/, '');
      html += `<pre class="kg-code"><code>${esc(body)}</code></pre>`;
      return;
    }
    let t = esc(blk);
    t = t.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
      .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>');
    t = t.replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>').replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    t = t.replace(/`([^`]+)`/g, '<code class="kg-inline">$1</code>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    t = t.replace(/^(?!<[hlu])(.+)$/gm, '<p>$1</p>').replace(/<p><\/p>/g, '');
    html += t;
  });
  return html;
}

export default function SpecExplorer() {
  const [tree, setTree] = useState<TreeFile[]>(FALLBACK_TREE);
  const [active, setActive] = useState<string>('README.md');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Load the repo tree client-side (GitHub API is CORS-open; falls back on rate limit).
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: any) => {
        if (cancelled || !Array.isArray(data.tree)) return;
        const files: TreeFile[] = data.tree
          .filter((f: any) => f.type === 'blob')
          .map((f: any) => ({ path: f.path, name: f.path.split('/').pop(), ext: (f.path.split('.').pop() || '').toLowerCase() }))
          .filter((f: TreeFile) => !f.path.startsWith('.github/') || f.ext === 'yml');
        if (files.length) setTree(files);
      })
      .catch(() => { /* keep fallback tree */ });
    return () => { cancelled = true; };
  }, []);

  // Load active file content client-side from raw.githubusercontent (CORS-open).
  useEffect(() => {
    const ext = (active.split('.').pop() || '').toLowerCase();
    if (BINARY_EXT.has(ext)) { setContent(''); setErr(null); return; }
    let cancelled = false;
    setLoading(true); setErr(null);
    fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${active}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((text) => { if (!cancelled) setContent(text); })
      .catch((e) => { if (!cancelled) setErr(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [active]);

  const activeExt = (active.split('.').pop() || '').toLowerCase();
  const rawUrl = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${active}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* File tree */}
      <aside className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 h-fit lg:sticky lg:top-24">
        <div className="flex items-center justify-between px-2 py-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Folder size={12} /> aeo-protocol-spec
          </span>
          <a href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-200">
            <Github size={14} />
          </a>
        </div>
        <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto">
          {tree.map((f) => {
            const Icon = iconFor(f.ext);
            const on = f.path === active;
            return (
              <li key={f.path}>
                <button
                  onClick={() => setActive(f.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                    on ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 border border-transparent'
                  }`}
                  title={f.path}
                >
                  <Icon size={13} className="shrink-0 opacity-70" />
                  <span className="truncate">{f.path}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* File content */}
      <section className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden min-h-[60vh]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          <span className="text-sm font-mono text-slate-300 flex items-center gap-2">
            <FileText size={14} className="text-blue-400" /> {active}
          </span>
          <a href={rawUrl} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-slate-500 hover:text-blue-300 flex items-center gap-1">
            raw <Github size={12} />
          </a>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm"><RefreshCw size={14} className="animate-spin" /> Loading from GitHub…</div>
          )}
          {err && !loading && (
            <div className="flex items-center gap-2 text-rose-400 text-sm"><AlertCircle size={14} /> Couldn't load {active} ({err}).</div>
          )}
          {!loading && !err && IMAGE_EXT.has(activeExt) && (
            <img src={rawUrl} alt={active} className="max-w-full rounded-lg border border-slate-800" />
          )}
          {!loading && !err && BINARY_EXT.has(activeExt) && !IMAGE_EXT.has(activeExt) && (
            <div className="text-slate-500 text-sm font-mono">Binary file — <a href={rawUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">download raw</a>.</div>
          )}
          {!loading && !err && !BINARY_EXT.has(activeExt) && activeExt === 'md' && (
            <div className="kg-md text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
          )}
          {!loading && !err && !BINARY_EXT.has(activeExt) && activeExt !== 'md' && (
            <pre className="kg-code text-xs leading-relaxed overflow-x-auto"><code>{content}</code></pre>
          )}
        </div>
      </section>
    </div>
  );
}
