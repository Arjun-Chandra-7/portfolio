export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  status: 'ACTIVE ARCHIVE' | 'PRODUCTION' | 'LAB ENGINE' | 'DEPLOYED';
  tags: string[];
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
  overview: string;
  problem: string;
  solution: string;
  architectureNodes: {
    id: string;
    step: string;
    title: string;
    role: string;
    latency: string;
    details: string;
  }[];
  engineeringDecisions: {
    title: string;
    rationale: string;
    tradeoff: string;
  }[];
  techStack: {
    category: string;
    technologies: string[];
  }[];
  challenges: string[];
  results: string[];
  learnings: string[];
  links: {
    live?: string;
    github?: string;
    paper?: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'viralyst',
    slug: 'viralyst',
    number: '01',
    title: 'VIRALYST',
    tagline: 'Autonomous multimodal content intelligence & creative optimization engine.',
    category: 'AI SYSTEMS × COMPUTER VISION × AGENTS',
    year: '2026',
    status: 'PRODUCTION',
    tags: ['MULTIMODAL AGENTS', 'COMPUTER VISION', 'TEMPORAL RAG', 'ASYNC PIPELINE', 'PYTHON'],
    metrics: [
      {
        label: 'VIDEOS ANALYZED',
        value: '15,400+',
        description: 'Frame-by-frame multimodal temporal token analysis'
      },
      {
        label: 'PARALLEL AGENTS',
        value: '04',
        description: 'Orchestrated asynchronous evaluation sub-systems'
      },
      {
        label: 'EXTRACTION LATENCY',
        value: '< 4.2s',
        description: 'Average per-minute video parsing & vector indexing'
      },
      {
        label: 'CREATIVE HIT-RATE',
        value: '84.6%',
        description: 'Empirically validated retention hook scoring'
      }
    ],
    overview: 'VIRALYST is an autonomous multimodal intelligence engine engineered to deconstruct short-form dynamic media into semantic tokens, pacing graphs, auditory cadence, and visual hooks. It replaces subjective content guesswork with deterministic retention vectors and agentic synthesis.',
    problem: 'Modern content analysis is predominantly retrospective and manual. Human teams cannot parse thousands of algorithmic media variations per day to extract microscopic hook mechanics, retention falloff points, and auditory-visual synchronicity at scale.',
    solution: 'Engineered a multi-stage distributed agent pipeline that ingests raw streams, executes frame-level scene decomposition via vision transformers, extracts transcript pacing semantics, and runs consensus-driven agentic evaluators to produce prescriptive creative variations.',
    architectureNodes: [
      {
        id: 'ingest',
        step: '01',
        title: 'INGESTION & DEMUX',
        role: 'Stream normalization, lossless frame extraction, audio isolation',
        latency: '850ms',
        details: 'Splits raw 4K/1080p feeds into 30fps keyframe tensors and 48kHz audio streams without disk bottlenecking.'
      },
      {
        id: 'vision_extract',
        step: '02',
        title: 'TEMPORAL VISION PARSER',
        role: 'Visual hook indexing, text OCR, gaze-tracking prediction',
        latency: '1.4s',
        details: 'Processes frame batches with spatial embeddings to identify optical shifts, focal anchors, and visual momentum.'
      },
      {
        id: 'audio_cadence',
        step: '03',
        title: 'ACOUSTIC & PROSODY ENGINE',
        role: 'Voice cadence, silence intervals, BGM frequency masking',
        latency: '620ms',
        details: 'Quantizes speech rate (syllables/sec) and aligns phoneme transitions to visual cuts.'
      },
      {
        id: 'agent_consensus',
        step: '04',
        title: 'MULTI-AGENT SYNTHESIS',
        role: 'Retention prediction, hook grading, structural optimization',
        latency: '1.1s',
        details: 'Triangulates outputs across 4 specialized agent evaluators with self-correcting verification loops.'
      },
      {
        id: 'export',
        step: '05',
        title: 'PRESCRIPTIVE DOSSIER',
        role: 'Dynamic blueprint generation, vector storage, telemetry export',
        latency: '180ms',
        details: 'Constructs actionable edit instructions and indexes vectors into high-dimensional latent space.'
      }
    ],
    engineeringDecisions: [
      {
        title: 'Decoupled Frame Tensor Streaming vs. Monolithic File Processing',
        rationale: 'Processed raw media in zero-copy in-memory chunks rather than disk writes, dropping IO wait by 73%.',
        tradeoff: 'Higher RAM utilization requiring strict memory leak telemetry and worker auto-recycling.'
      },
      {
        title: 'Hierarchical Multi-Agent Graph over Monolithic Large LLM Prompts',
        rationale: 'Divided vision, pacing, and hook grading into specialized sub-agents with bounded context rather than one massive prompt.',
        tradeoff: 'Requires custom consensus orchestration and deadlock resolution logic.'
      }
    ],
    techStack: [
      { category: 'AI & Inference', technologies: ['PyTorch', 'Vision Transformers', 'LangGraph', 'Whisper ASR', 'FastEmbed'] },
      { category: 'Backend & Orchestration', technologies: ['FastAPI', 'Redis Queue', 'Celery', 'PostgreSQL / pgvector', 'Docker'] },
      { category: 'Client & Visuals', technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'WebGL Canvas', 'GSAP'] }
    ],
    challenges: [
      'Maintaining token economy while streaming hundreds of dense video keyframes to multimodal endpoints.',
      'Calibrating deterministic scoring against subjective human attention falloff patterns.',
      'Synchronizing multi-agent async workflows without state drift.'
    ],
    results: [
      'Processed over 15,000 video artifacts across test datasets with zero memory leaks.',
      'Reduced average creative analysis iteration time from 4 hours of manual logging to under 15 seconds.',
      'Demonstrated high consistency in predicting algorithmic retention dropoff points.'
    ],
    learnings: [
      'Agentic pipelines need deterministic boundary schemas; unconstrained reasoning quickly degenerates into latency spikes.',
      'Multimodal video comprehension is 80% data preprocessing and 20% model inference.'
    ],
    links: {
      github: 'https://github.com/Arjun-Chandra-7/viralyst',
      live: '#'
    }
  },
  {
    id: 'synapse-core',
    slug: 'synapse-core',
    number: '02',
    title: 'SYNAPSE CORE',
    tagline: 'Deterministic agentic workflow orchestrator & dynamic state execution graph.',
    category: 'DISTRIBUTED SYSTEMS × AGENT ORCHESTRATION',
    year: '2025',
    status: 'PRODUCTION',
    tags: ['STATE MACHINES', 'DISTRIBUTED AGENTS', 'EVENT BUS', 'GO / RUST', 'DAG ENGINE'],
    metrics: [
      {
        label: 'THROUGHPUT',
        value: '12,000+',
        description: 'Concurrent agent node state evaluations / sec'
      },
      {
        label: 'FAILOVER RECOVERY',
        value: '< 18ms',
        description: 'Zero-loss state checkpointing with raft consensus'
      },
      {
        label: 'TRACEABILITY',
        value: '100%',
        description: 'Deterministic replay of every agentic deliberation'
      }
    ],
    overview: 'SYNAPSE CORE is a fault-tolerant, stateful execution runtime designed for multi-agent autonomous loops. It eliminates non-deterministic failure states, infinite loop stalls, and context corruption in complex LLM pipelines through directed acyclic graph (DAG) invariants.',
    problem: 'Autonomous multi-agent frameworks often lack transactional guarantees. A single rogue hallucination or API timeout can corrupt shared memory, deadlock parent tasks, or cause uncontrollable token-burn spirals without replayability.',
    solution: 'Engineered an event-driven runtime with snapshot-based state rollback, strict typed protocol buffers between agents, distributed rate-governance, and a deterministic step recorder.',
    architectureNodes: [
      {
        id: 'dispatcher',
        step: '01',
        title: 'DAG COMPILER & DISPATCH',
        role: 'Validates workflow graphs, resolves dependencies, assigns priority',
        latency: '12ms',
        details: 'Compiles JSON/YAML workflow schemas into acyclic execution graphs with cyclic deadlock prevention.'
      },
      {
        id: 'sandbox',
        step: '02',
        title: 'ISOLATED AGENT RUNTIME',
        role: 'Executes agent reasoning in isolated memory contexts',
        latency: '450ms',
        details: 'Enforces memory caps, tool execution timeout guards, and strict input/output contract validation.'
      },
      {
        id: 'state_bus',
        step: '03',
        title: 'TRANSACTIONAL STATE BUS',
        role: 'Raft-backed distributed memory & step checkpointing',
        latency: '4ms',
        details: 'Atomic updates to shared blackboard with snapshot replay capabilities.'
      },
      {
        id: 'governor',
        step: '04',
        title: 'TOKEN & DRIFT GOVERNOR',
        role: 'Real-time cost telemetry, loop detection, confidence thresholding',
        latency: '2ms',
        details: 'Auto-terminates drifting loops and enforces budget allocations across sub-tasks.'
      }
    ],
    engineeringDecisions: [
      {
        title: 'Memory Checkpoints via Write-Ahead Logs',
        rationale: 'Guaranteed that any interrupted sub-agent task could resume instantly without re-running expensive prior steps.',
        tradeoff: 'Requires compact binary serialization protocols (Protobuf) instead of raw JSON.'
      }
    ],
    techStack: [
      { category: 'Engine Runtime', technologies: ['Rust / Go', 'Tokio', 'Protobuf', 'Redis Raft'] },
      { category: 'Observability & Storage', technologies: ['OpenTelemetry', 'ClickHouse', 'Grafana', 'Docker'] },
      { category: 'SDK / Interface', technologies: ['TypeScript SDK', 'Python Bindings', 'React Inspector'] }
    ],
    challenges: [
      'Building zero-overhead snapshot mechanisms for high-dimensional embedding contexts.',
      'Designing an intuitive mental model for human operators to inspect and override agent graph branches.'
    ],
    results: [
      'Eliminated 99.4% of infinite-loop failure modes in agentic production pipelines.',
      'Achieved sub-20ms task transition overhead.'
    ],
    learnings: [
      'Reliability in AI systems is not an AI problem; it is a distributed systems state management problem.'
    ],
    links: {
      github: 'https://github.com/Arjun-Chandra-7/synapse-core'
    }
  },
  {
    id: 'nexus-rag',
    slug: 'nexus-rag',
    number: '03',
    title: 'NEXUS RAG',
    tagline: 'Context-engineered hybrid semantic retrieval & citation verification pipeline.',
    category: 'RETRIEVAL AUGMENTED GENERATION × KNOWLEDGE GRAPHS',
    year: '2025',
    status: 'PRODUCTION',
    tags: ['HYBRID SEARCH', 'KNOWLEDGE GRAPH', 'CROSS-ENCODER', 'DENSE EMBEDDINGS', 'BM25'],
    metrics: [
      {
        label: 'RETRIEVAL PRECISION',
        value: '96.2%',
        description: 'Mean Reciprocal Rank (MRR@10) across technical corpuses'
      },
      {
        label: 'HALLUCINATION DROP',
        value: '-82%',
        description: 'Verified sentence-level grounded citation scoring'
      },
      {
        label: 'QUERY LATENCY',
        value: '110ms',
        description: 'Hybrid dense-sparse reranked retrieval pipeline'
      }
    ],
    overview: 'NEXUS RAG is a resilient enterprise knowledge synthesis system combining dense vector search, sparse lexical BM25 indexing, and dynamic graph entity relations with strict hallucination verification.',
    problem: 'Standard vector similarity retrieval fails when queries involve exact alphanumeric tokens, complex relational logic, or temporal contradictions. Naive RAG pipelines blindly feed irrelevant context into LLMs, causing high hallucination rates.',
    solution: 'Engineered a multi-tier pipeline featuring query rewriting, reciprocal rank fusion (RRF), cross-encoder neural reranking, and an adversarial citation verifier that validates every claim against primary source spans.',
    architectureNodes: [
      {
        id: 'query_expand',
        step: '01',
        title: 'QUERY DECONSTRUCTION',
        role: 'Semantic expansion, keyword extraction, temporal scoping',
        latency: '35ms',
        details: 'Generates parallel dense and sparse query variants.'
      },
      {
        id: 'hybrid_retrieval',
        step: '02',
        title: 'HYBRID FUSION ENGINE',
        role: 'Qdrant dense search + BM25 sparse index + Reciprocal Rank Fusion',
        latency: '45ms',
        details: 'Merges top 100 candidate passages with adaptive weighting.'
      },
      {
        id: 'reranker',
        step: '03',
        title: 'CROSS-ENCODER RERANK',
        role: 'Deep semantic pair scoring and deduplication',
        latency: '30ms',
        details: 'Filters candidates to top 5 highest-confidence evidentiary paragraphs.'
      },
      {
        id: 'verifier',
        step: '04',
        title: 'EVIDENTIARY VERIFIER',
        role: 'Token-level claim validation and reference grounding',
        latency: '40ms',
        details: 'Flags and strips ungrounded synthetic claims before client delivery.'
      }
    ],
    engineeringDecisions: [
      {
        title: 'Reciprocal Rank Fusion vs Weighted Score Addition',
        rationale: 'RRF removes the need to constantly calibrate vector cosine scales against BM25 unbounded scores across differing query types.',
        tradeoff: 'Slightly higher compute overhead in array sort and merge operations.'
      }
    ],
    techStack: [
      { category: 'Vector & DB', technologies: ['Qdrant', 'Elasticsearch', 'PostgreSQL', 'Neo4j'] },
      { category: 'Embeddings & Models', technologies: ['BGE-Large', 'Cohere Rerank', 'Llama-3.3-70B', 'FastEmbed'] },
      { category: 'Frameworks', technologies: ['Python', 'FastAPI', 'Ray Serve'] }
    ],
    challenges: [
      'Eliminating false negatives during query expansion without diluting the candidate pool.',
      'Achieving sub-150ms round-trip latency including cross-encoder reranking.'
    ],
    results: [
      'Surpassed pure vector search by 34% in domain-specific technical retrieval accuracy.',
      'Zero ungrounded factual assertions across test suites.'
    ],
    learnings: [
      'Chunking strategy and metadata enrichment dictate 80% of RAG quality; changing LLMs only moves the needle 20%.'
    ],
    links: {
      github: 'https://github.com/Arjun-Chandra-7/nexus-rag'
    }
  },
  {
    id: 'aura-kinetics',
    slug: 'aura-kinetics',
    number: '04',
    title: 'AURA KINETICS',
    tagline: 'High-throughput WebGL generative audio-reactive spatial visualization system.',
    category: 'CREATIVE TECHNOLOGY × SHADER PROGRAMMING × WEBAUDIO',
    year: '2025',
    status: 'LAB ENGINE',
    tags: ['WEBGL', 'THREE.JS', 'GLSL SHADERS', 'FAST FOURIER TRANSFORM', 'COMPUTE PIPELINE'],
    metrics: [
      {
        label: 'FRAME RATE',
        value: '120 FPS',
        description: 'Rock-solid hardware accelerated particle simulation'
      },
      {
        label: 'PARTICLE DENSITY',
        value: '250,000',
        description: 'Simultaneous GPU-calculated instanced velocity vectors'
      },
      {
        label: 'AUDIO LATENCY',
        value: '< 8ms',
        description: 'Low-latency WebAudio frequency bucket decomposition'
      }
    ],
    overview: 'AURA KINETICS is an experimental WebGL shader environment that converts real-time acoustic frequencies into mathematical fluid dynamics and spatial particle fields running entirely on client GPUs.',
    problem: 'Most web audio visualizers rely on heavy CPU calculation or simplistic 2D canvas spectrum bars that lag on mobile devices and lack mathematical depth.',
    solution: 'Engineered custom WebGL vertex and fragment shaders utilizing GPGPU simulation passes, rendering a quarter-million interacting particles with zero main-thread CPU blocking.',
    architectureNodes: [
      {
        id: 'audio_node',
        step: '01',
        title: 'WEBAUDIO FFT ANALYZER',
        role: 'High-precision frequency domain decomposition',
        latency: '4ms',
        details: 'Splits raw audio into 1024 frequency bins with smoothing time constants.'
      },
      {
        id: 'gpgpu_pass',
        step: '02',
        title: 'GPGPU VELOCITY SIMULATION',
        role: 'GPU Framebuffer texture ping-pong pass',
        latency: '2ms',
        details: 'Calculates curl noise, gravitational wells, and velocity vectors directly on textures.'
      },
      {
        id: 'render_pass',
        step: '03',
        title: 'INSTANCED PARTICLE RENDER',
        role: 'High-performance vertex shader deformation',
        latency: '2ms',
        details: 'Renders 250k instanced particles with depth testing and bloom post-processing.'
      }
    ],
    engineeringDecisions: [
      {
        title: 'Ping-Pong Texture Simulation over CPU Float32Arrays',
        rationale: 'Kept position updates entirely inside GPU VRAM, eliminating expensive CPU-to-GPU memory transfer bottlenecks every frame.',
        tradeoff: 'Requires custom shader debugging tools and fallback modes for low-tier mobile GPUs.'
      }
    ],
    techStack: [
      { category: 'Graphics & WebGL', technologies: ['Three.js', 'Custom GLSL', 'WebGL 2.0', 'WebAudio API'] },
      { category: 'UI & Motion', technologies: ['React', 'GSAP', 'TypeScript', 'Tailwind CSS'] }
    ],
    challenges: [
      'Maintaining 60+ FPS on mid-tier mobile chipsets through dynamic particle count throttling.',
      'Synchronizing multi-layer post-processing passes with minimal draw calls.'
    ],
    results: [
      'Achieved seamless 120 FPS rendering on modern displays.',
      'Featured in creative coding showcases.'
    ],
    learnings: [
      'The GPU is an extraordinary computational engine for non-graphics data when programmed directly via GLSL.'
    ],
    links: {
      github: 'https://github.com/Arjun-Chandra-7/aura-kinetics'
    }
  }
];

export interface Experiment {
  id: string;
  code: string;
  title: string;
  category: string;
  year: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PROTOTYPE';
  description: string;
  tech: string[];
  interactiveType: 'shader' | 'terminal' | 'agent' | 'physics' | 'graph';
  demoUrl?: string;
  githubUrl?: string;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-01',
    code: 'LAB-091',
    title: 'NEURAL SIGNAL VOXELIZER',
    category: 'COMPUTE SHADERS',
    year: '2026',
    status: 'ACTIVE',
    description: 'Real-time raymarched 3D volumetric field generated from live audio entropy vectors.',
    tech: ['GLSL', 'Three.js', 'Raymarching', 'WebAudio'],
    interactiveType: 'shader'
  },
  {
    id: 'exp-02',
    code: 'LAB-084',
    title: 'CLI AGENT SHELL PROTOCOL',
    category: 'DEVELOPER TOOLS',
    year: '2026',
    status: 'ACTIVE',
    description: 'Headless subagent command execution orchestrator with real-time JSONL telemetry streaming.',
    tech: ['Go', 'TypeScript', 'WebSockets', 'TUI'],
    interactiveType: 'terminal'
  },
  {
    id: 'exp-03',
    code: 'LAB-077',
    title: 'LATENT EMBEDDING TOPOGRAPHY',
    category: 'DATA VISUALIZATION',
    year: '2025',
    status: 'ACTIVE',
    description: '3D t-SNE / UMAP dimensional reduction explorer for 50,000 text chunks in WebGL.',
    tech: ['WebGL', 'UMAP-JS', 'Regl', 'React'],
    interactiveType: 'graph'
  },
  {
    id: 'exp-04',
    code: 'LAB-062',
    title: 'TEMPORAL OPTICAL FLOW ESTIMATOR',
    category: 'COMPUTER VISION',
    year: '2025',
    status: 'PROTOTYPE',
    description: 'Client-side Gunnar-Farneback dense optical motion vector tracking in browser canvas.',
    tech: ['OpenCV.js', 'Web Workers', 'Canvas2D', 'Wasm'],
    interactiveType: 'physics'
  },
  {
    id: 'exp-05',
    code: 'LAB-051',
    title: 'AUTONOMOUS REASONING GRAPH',
    category: 'AI EXPERIMENT',
    year: '2025',
    status: 'ACTIVE',
    description: 'Self-assembling recursive problem decomposition tree with backtrack verification.',
    tech: ['LangGraph', 'Python', 'D3.js', 'FastAPI'],
    interactiveType: 'agent'
  },
  {
    id: 'exp-06',
    code: 'LAB-038',
    title: 'SYNTHETIC PHONEME SPECTROGRAM',
    category: 'AUDIO INTELLIGENCE',
    year: '2024',
    status: 'ARCHIVED',
    description: 'Wavelet-transformed spectrogram feature extractor for low-power voice trigger recognition.',
    tech: ['WebAudio', 'Rust Wasm', 'Spectrograms'],
    interactiveType: 'physics'
  }
];

export interface CapabilityDomain {
  domain: string;
  code: string;
  description: string;
  capabilities: {
    name: string;
    details: string;
    level: string;
  }[];
}

export const CAPABILITIES: CapabilityDomain[] = [
  {
    domain: 'ARTIFICIAL INTELLIGENCE & REASONING',
    code: 'SYS_DOMAIN_01',
    description: 'Architecting deterministic systems from probabilistic foundational models.',
    capabilities: [
      { name: 'Multi-Agent Autonomous Orchestration', details: 'Hierarchical state graphs, consensus mechanisms, tool call sandboxes', level: 'ADVANCED' },
      { name: 'Multimodal Computer Vision Pipelines', details: 'Spatial temporal analysis, video tokenization, optical flow, OCR', level: 'ADVANCED' },
      { name: 'Context Engineering & Hybrid RAG', details: 'Dense/sparse retrieval, cross-encoders, graph entity fusion, verifiable grounding', level: 'ADVANCED' },
      { name: 'Model Distillation & Evaluation Systems', details: 'Custom benchmark creation, automated synthetic grading, latency minimization', level: 'PROFICIENT' }
    ]
  },
  {
    domain: 'SYSTEMS ENGINEERING & DISTRIBUTED BACKEND',
    code: 'SYS_DOMAIN_02',
    description: 'Building high-throughput, fault-tolerant infrastructure and transactional runtimes.',
    capabilities: [
      { name: 'Asynchronous Event-Driven Architectures', details: 'Queue backpressures, transactional outboxes, zero-loss workers', level: 'ADVANCED' },
      { name: 'High-Performance API Design', details: 'FastAPI, Go, REST, WebSockets, gRPC, Protobuf serialization', level: 'ADVANCED' },
      { name: 'Vector & Relational Storage Systems', details: 'pgvector, Qdrant, PostgreSQL indexing, Redis caching & state locks', level: 'ADVANCED' },
      { name: 'Containerization & Cloud Automation', details: 'Docker, CI/CD pipelines, container orchestration, telemetry logging', level: 'ADVANCED' }
    ]
  },
  {
    domain: 'CREATIVE TECHNOLOGY & INTERACTIVE INTERFACES',
    code: 'SYS_DOMAIN_03',
    description: 'Transforming technical depth into cinematic, physically plausible digital craft.',
    capabilities: [
      { name: 'WebGL & GLSL Shader Programming', details: 'Custom fragment/vertex shaders, GPGPU simulation, Three.js pipelines', level: 'ADVANCED' },
      { name: 'Kinetic Typography & Motion Systems', details: 'GSAP, ScrollTrigger choreography, micro-interaction state models', level: 'ADVANCED' },
      { name: 'Frontend Architecture & Performance', details: 'Next.js App Router, React 19, TypeScript strict mode, zero-jank 120fps UI', level: 'ADVANCED' },
      { name: 'Spatial UI & Data Visualization', details: 'Interactive DAG graphs, canvas audio visualizers, telemetry dashboards', level: 'ADVANCED' }
    ]
  },
  {
    domain: 'LANGUAGES & TECHNICAL STACK',
    code: 'SYS_DOMAIN_04',
    description: 'Core toolchains and languages utilized for mission-critical builds.',
    capabilities: [
      { name: 'Core Languages', details: 'Python 3.12, TypeScript, JavaScript, Go, Rust (Intermediate)', level: 'NATIVE' },
      { name: 'AI Tooling', details: 'PyTorch, Hugging Face, LangGraph, Qdrant, Ollama, Whisper', level: 'NATIVE' },
      { name: 'Web & Graphics', details: 'Next.js, React, Three.js, GLSL, Tailwind CSS, GSAP, WebAudio', level: 'NATIVE' },
      { name: 'Infrastructure', details: 'Docker, Git, Linux / Bash, Redis, PostgreSQL, OpenTelemetry', level: 'NATIVE' }
    ]
  }
];

export interface TimelineMilestone {
  year: string;
  quarter: string;
  tag: string;
  headline: string;
  summary: string;
  artifacts: string[];
  systemState: string;
}

export const TIMELINE: TimelineMilestone[] = [
  {
    year: '2026',
    quarter: 'PRESENT',
    tag: 'SYSTEMS // AI MULTIMODAL',
    headline: 'Autonomous Media Intelligence & Distributed Agent Engines',
    summary: 'Architected VIRALYST and advanced agentic execution graphs. Focused on breaking down complex unstructured media streams into deterministic token structures and real-time generative evaluations.',
    artifacts: ['VIRALYST Engine', 'Multi-Agent Consensus Runtime', 'Temporal Video Parser'],
    systemState: 'SYS_ACTIVE'
  },
  {
    year: '2025',
    quarter: 'Q3–Q4',
    tag: 'RAG // KNOWLEDGE GRAPHS',
    headline: 'Context Engineering, Hybrid Retrieval & WebGL Shader Engines',
    summary: 'Built NEXUS RAG and AURA KINETICS. Mastered cross-encoder semantic retrieval, dense-sparse fusion, and high-performance WebGL compute shader simulations.',
    artifacts: ['NEXUS RAG Pipeline', 'AURA Kinetics WebGL', 'GPGPU Particle Engine'],
    systemState: 'SYS_STABLE'
  },
  {
    year: '2025',
    quarter: 'Q1–Q2',
    tag: 'AGENT RUNTIMES // DAGS',
    headline: 'Deterministic State Machines & Distributed Workflows',
    summary: 'Developed SYNAPSE CORE to resolve catastrophic infinite-loop failure states in production LLM workflows using transactional write-ahead logs and graph invariants.',
    artifacts: ['SYNAPSE CORE DAG', 'Step Telemetry Protocol', 'Rust Tokio Engine'],
    systemState: 'SYS_ARCHIVED'
  },
  {
    year: '2024',
    quarter: 'FOUNDATION',
    tag: 'FOUNDATIONS // COMPILERS',
    headline: 'Deep Dive into Machine Learning, Systems & Modern Web Standards',
    summary: 'Transitioned from standard web applications into low-level systems programming, neural network architectures, and hardware-accelerated interactive graphics.',
    artifacts: ['Neural Net from Scratch (NumPy)', 'Custom Shader Library', 'CLI Toolchains'],
    systemState: 'SYS_INITIALIZED'
  }
];

export const LIVE_SIGNALS = {
  building: 'Next-generation autonomous agent synthesis runtime with multi-modal visual grounding.',
  learning: 'Sparse autoencoders for latent feature steering in large vision-language models.',
  exploring: 'Real-time WebGPU compute pipelines for client-side local neural network inference.',
  systemStatus: 'ONLINE // ALL SUBSYSTEMS NOMINAL',
  coordinates: '19.0760° N, 72.8777° E',
  version: 'OPERIS v2.8.4'
};
