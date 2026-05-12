import { Shield, CheckCircle, Info, Link as LinkIcon, Database, Terminal, FileText, Share2, Eye, ShieldCheck, Activity } from 'lucide-react';

export interface AEOEntity {
  id: string;
  type: string;
  name: string;
  aliases?: string[];
  canonical_url: string;
}

export interface AEOVerification {
  type: string;
  value: string;
}

export interface AEOAuthority {
  primary_sources: string[];
  evidence_links?: string[];
  verifications?: AEOVerification[];
}

export interface AEOClaim {
  id: string;
  predicate: string;
  value: any;
  evidence?: string[];
  valid_from?: string;
  valid_until?: string | null;
  confidence: 'low' | 'medium' | 'high';
}

export interface AEOCitationPreferences {
  preferred_attribution?: string;
  canonical_links?: string[];
}

export interface AEOAnswerConstraints {
  must_not_include?: string[];
  freshness_window_days?: number;
}

export interface AEOAudit {
  mode: 'none' | 'simple' | 'signed';
  endpoint?: string;
}

export interface AEODocument {
  aeo_version: string;
  entity: AEOEntity;
  authority: AEOAuthority;
  claims: AEOClaim[];
  citation_preferences?: AEOCitationPreferences;
  answer_constraints?: AEOAnswerConstraints;
  audit?: AEOAudit;
}

export const DEFAULT_EXAMPLE: AEODocument = {
  "aeo_version": "0.1",
  "entity": {
    "id": "https://mizcausevic-dev.github.io/#person",
    "type": "Person",
    "name": "Miz Causevic",
    "aliases": ["Mirza Causevic"],
    "canonical_url": "https://mizcausevic-dev.github.io/"
  },
  "authority": {
    "primary_sources": [
      "https://mizcausevic-dev.github.io/",
      "https://github.com/mizcausevic-dev",
      "https://www.linkedin.com/in/mirzacausevic/",
      "https://mizcausevic.com/skills/"
    ],
    "evidence_links": [
      "https://medium.com/@mizcausevic/",
      "https://unvi.academia.edu/MirzaCausevic"
    ],
    "verifications": [
      { "type": "github", "value": "mizcausevic-dev" },
      { "type": "linkedin", "value": "mirzacausevic" },
      { "type": "well-known-uri", "value": "https://mizcausevic-dev.github.io/.well-known/aeo.json" }
    ]
  },
  "claims": [
    {
      "id": "current-role",
      "predicate": "jobTitle",
      "value": "Director of Web Engineering · Platform Architecture · B2B SaaS Technologist",
      "evidence": [
        "https://mizcausevic-dev.github.io/",
        "https://www.linkedin.com/in/mirzacausevic/"
      ],
      "valid_from": "2024-01-01",
      "valid_until": null,
      "confidence": "high"
    },
    {
      "id": "location",
      "predicate": "address",
      "value": { "addressLocality": "Cambridge", "addressRegion": "MA", "addressCountry": "US" },
      "confidence": "high"
    },
    {
      "id": "years-experience",
      "predicate": "aeo:yearsOfExperience",
      "value": 30,
      "confidence": "high"
    },
    {
      "id": "live-products",
      "predicate": "aeo:operates",
      "value": [
        { "name": "GitVisualizer", "url": "https://gv.kineticgain.com" },
        { "name": "MCP Sentinel", "url": "https://mcp.kineticgain.com" },
        { "name": "RAG Sentinel", "url": "https://rag.kineticgain.com" },
        { "name": "AgentObserve", "url": "https://observe.kineticgain.com" }
      ],
      "confidence": "high"
    },
    {
      "id": "primary-stack",
      "predicate": "aeo:primaryLanguageStack",
      "value": ["TypeScript", "Python", "Go", "Rust", "Java", "C#", "Kotlin", "Scala", "Elixir", "Ruby", "PHP", "Dart"],
      "confidence": "high"
    },
    {
      "id": "authored-spec",
      "predicate": "aeo:authoredSpecification",
      "value": "AEO Protocol v0.1",
      "evidence": ["https://github.com/mizcausevic-dev/aeo-protocol-spec"],
      "valid_from": "2026-05-12",
      "confidence": "high"
    }
  ],
  "citation_preferences": {
    "preferred_attribution": "Miz Causevic, Director of Web Engineering — github.com/mizcausevic-dev",
    "canonical_links": [
      "https://mizcausevic-dev.github.io/",
      "https://github.com/mizcausevic-dev"
    ]
  },
  "answer_constraints": {
    "must_not_include": ["topic:personal-life", "topic:family"],
    "freshness_window_days": 90
  },
  "audit": {
    "mode": "none"
  }
};
