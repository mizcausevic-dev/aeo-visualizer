# AEO Visualizer

Interactive web visualizer for [AEO Protocol](https://github.com/mizcausevic-dev/aeo-protocol-spec) declarations. Paste any `/.well-known/aeo.json` document — or write one in the JSON editor — and see entity, authority, claims, and citation preferences rendered as a clean card layout.

**Live:** https://aeo.kineticgain.com

## What it does

- **Explore view** — entity card on the left, authority + verifications on a dark slate panel, claims grid on the right with expandable cards showing evidence and confidence
- **JSON Editor** — paste any AEO document and re-visualize in real time
- **About** — Three Pillars of AEO (Declare, Discover, Audit) with a one-page explainer

## Direct-link URLs

Append `?view=visualizer | editor | about` to deep-link any view:

- `https://aeo.kineticgain.com?view=editor`
- `https://aeo.kineticgain.com?view=about`

## Run locally

```bash
npm install
npm run dev
```

Visits to `http://localhost:3000` open the visualizer with the reference Person example pre-loaded.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Motion (Framer)
- Lucide icons

Zero runtime dependencies beyond the above — no API keys, no external services.

## Deploy

The bundled GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on every push to `main`. Forking and re-deploying is one config change:

1. Fork
2. Settings → Pages → Source: **GitHub Actions**
3. Edit `vite.config.ts` `base` if you fork under a different repo name
4. Push to `main` → live URL announced in the workflow run

## Kinetic Gain Protocol Suite

| Spec | Implementation |
|---|---|
| [AEO Protocol](https://github.com/mizcausevic-dev/aeo-protocol-spec) | [aeo-sdk-python](https://github.com/mizcausevic-dev/aeo-sdk-python) · [aeo-sdk-typescript](https://github.com/mizcausevic-dev/aeo-sdk-typescript) · [aeo-sdk-rust](https://github.com/mizcausevic-dev/aeo-sdk-rust) · [aeo-sdk-go](https://github.com/mizcausevic-dev/aeo-sdk-go) · [aeo-sdk-swift](https://github.com/mizcausevic-dev/aeo-sdk-swift) · [aeo-cli](https://github.com/mizcausevic-dev/aeo-cli) · [aeo-crawler](https://github.com/mizcausevic-dev/aeo-crawler) · [mcp-aeo-server](https://github.com/mizcausevic-dev/mcp-aeo-server) · **aeo-visualizer** (this) |
| [Prompt Provenance](https://github.com/mizcausevic-dev/prompt-provenance-spec) | — |
| [Agent Cards](https://github.com/mizcausevic-dev/agent-cards-spec) | — |
| [AI Evidence Format](https://github.com/mizcausevic-dev/ai-evidence-format-spec) | — |
| [MCP Tool Cards](https://github.com/mizcausevic-dev/mcp-tool-card-spec) | — |

## License

AGPL-3.0. Adapted from the Google AI Studio applet of the same concept.

---

**Connect:** [LinkedIn](https://www.linkedin.com/in/mirzacausevic/) · [Kinetic Gain](https://kineticgain.com) · [Medium](https://medium.com/@mizcausevic/) · [Skills](https://mizcausevic.com/skills/)
