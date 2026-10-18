# 🧠 RepoWise

> **AI-Powered Unified Intelligence Dashboard for Developer Onboarding & Code Intelligence**  
> Map architectures, localize bugs to source code, chat with codebases, triage GitHub issues, detect architectural hotspots, and generate comprehensive documentation.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC382D?logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🌟 Overview

**RepoWise** is an end-to-end repository intelligence platform engineered for onboarding developers, engineering leads, and open-source contributors exploring unfamiliar codebases. By integrating abstract syntax tree (AST) boundary chunking, bidirectional dependency graphs, recent commit telemetry, dense vector embeddings, and large language model reasoning, RepoWise turns any public GitHub repository URL into a unified, zero-setup developer intelligence dashboard.

---

## 🚀 Key Features

```
                                      REPOWISE PLATFORM
  ┌────────────────────────┬────────────────────────┬────────────────────────┐
  │  🎨 System Architecture │  💬 Code Q&A Assistant │  🐛 Bug → File Mapping │
  │  • GitDiagram Explorer │  • AST-Aware Chunk RAG │  • 5-Signal Ranker     │
  │  • Execution Flow Map  │  • Exact Line Evidence │  • Root Cause Triage   │
  ├────────────────────────┼────────────────────────┼────────────────────────┤
  │  📝 Auto README Agent  │  📋 Bug Triage Board   │  🔥 Hotspot Detector   │
  │  • Manifest Inspection │  • Pairwise Cosine Dup │  • Churn + Bug Density │
  │  • Tech Stack Detection│  • Severity Urgency    │  • Coupling Centrality │
  └────────────────────────┴────────────────────────┴────────────────────────┘
```

### 1. 🎨 Dual-View System Architecture & GitDiagram Explorer
- **Semantic System Architecture**: Powered by an LLM-driven `ArchitectureAgent` that groups components into subsystems across 20+ types (`frontend`, `api`, `backend`, `service`, `database`, `auth`, `middleware`, `storage`, `worker`, etc.), mapping entry points and sequential execution flows.
- **Interactive GitDiagram Canvas**: Compiles into dynamic Mermaid.js diagrams with cursor-anchored smooth pan and zoom, node details drawers, execution flows, and SVG export.
- **Hierarchical Dependency Graph**: Drill-down view built with `@xyflow/react` and `elkjs` automatic layout, connecting folder and file nodes via `CONTAINS` and resolved `IMPORTS` edges.

### 2. 💬 Code Q&A Assistant (Hybrid RAG Engine)
- **AST-Aware Syntax Chunking**: Splits code at declaration boundaries (functions, classes, route handlers, type aliases) using language-specific patterns with a maximum chunk span of 120 lines (triggering on boundaries $\ge 20$ lines), preserving symbol metadata.
- **Intent Classifier & Dense Retrieval**: Classifies queries into 7 intent categories (`FLOW`, `LOCATION`, `DEPENDENCY`, `DEBUGGING`, `ARCHITECTURE`, `FILE`, `GENERAL`) and searches Qdrant using `sentence-transformers/all-MiniLM-L6-v2` with multi-tenant filtering on `repository_id`.
- **Lexical Reranker & Graph Expansion**: Boosts chunks matching query keywords across declared symbols (+0.15), file paths (+0.10), or body tokens (+0.05). Expands context using 1-hop bidirectional import dependencies (incoming callers and outgoing imports for top-4 files) with a baseline score of 0.65.
- **Code Grounding**: Answers with verified file paths, exact line ranges (`Lines X–Y`), and syntax-highlighted code excerpts.

### 3. 🐛 Multi-Signal Bug-to-File Mapping (Novel Pipeline)
Locates the source files responsible for reported GitHub issues without requiring test suites, execution traces, or historical bug-fix annotations.
- **Stage 1: Issue Understanding**: Extracts structured problem summaries, error messages, code entities, file path hints, API endpoints, domain concepts, and search queries (with deterministic regex fallbacks).
- **Stage 2: Candidate Pool Retrieval**: Retrieves 20–30 candidate files via multi-query vector search, path hint matches, and entity symbol occurrences ($\ge 2$).
- **Stage 3: 5-Signal Scoring & Confidence Formula**:
  $$\text{FinalScore}(f) = 0.35 \cdot S_{\text{sem}} + 0.25 \cdot S_{\text{key}} + 0.15 \cdot S_{\text{dep}} + 0.10 \cdot S_{\text{path}} + 0.15 \cdot S_{\text{hist}}$$
  - **Semantic Similarity (0.35)**: Normalized cosine similarity from vector retrieval.
  - **Keyword & Symbol (0.25)**: Matches declared symbols (up to 0.35/match) and domain keywords (0.10/match).
  - **Dependency Relevance (0.15)**: Counts import/export connections to top-8 vector candidates.
  - **Path Relevance (0.10)**: Directory/filename token overlap and direct path hint matches (1.0).
  - **Historical Score (0.15)**: Weighted commit history ($0.70 \times \text{bug churn} + 0.30 \times \text{total churn}$; neutral baseline 0.50).
  - **Multi-Signal Agreement**: Computes confidence based on active signal thresholds; abstains when confidence is insufficient.
- **Stage 4: Grounded LLM Reasoning**: Acts as a Principal Software Architect to synthesize an overall root-cause hypothesis and per-file technical explanations citing specific functions, variables, and code logic.

### 4. 📝 Code-Grounded Auto README Generator
- Reads project manifest files (`package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.) alongside core source code.
- Produces production-grade `README.md` documents complete with Project Overview, Architecture Summary, Tech Stack with detected versions, Setup Guides, API Specifications, and Contributing Rules.
- Includes formatted Markdown preview, Raw Markdown tab, Copy to Clipboard, and One-Click File Download.

### 5. 📋 Bug Triage Board & Duplicate Clustering
- Fetches open issues directly from GitHub (excluding pull requests).
- **Automated Triage Scoring**: Classifies severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, with `UNKNOWN` fallback) and categories (Bug, Feature Request, Enhancement, Documentation, Performance, Security, UI/UX, Configuration, Build/Deployment, Other) in batches of 8 using structured LLM schemas.
- **Pairwise Semantic Clustering**: Embeds issue titles and descriptions with `all-MiniLM-L6-v2` and computes pairwise cosine similarity matrices via NumPy ($\ge 0.85$ for duplicate clusters, $0.70 \le \text{sim} < 0.85$ for related issues).
- **Direct Localization Bridge**: One-click action dispatches any triaged issue directly into the Bug-to-File Mapping engine.

### 6. 🔥 Architectural Hotspot Detector
- Surfaces high-risk maintenance bottlenecks across the codebase.
- **Composite Risk Formula**:
  $$\text{Risk}(f) = 0.35 \cdot \text{Churn} + 0.35 \cdot \text{BugDensity} + 0.15 \cdot \text{BugFixHistory} + 0.15 \cdot \text{CouplingCentrality}$$
  - **Churn (0.35)**: Normalized commit modification frequency across recent commits.
  - **Bug Density (0.35)**: Number of localized bug reports mapped to this file via Feature 4.
  - **Bug-Fix History (0.15)**: Commits matching defect keywords (`fix`, `patch`, `resolve`, `crash`, `leak`).
  - **In-Degree Centrality (0.15)**: Architectural coupling and import centrality derived from the dependency graph.
- Classifies files into `CRITICAL` ($\ge 0.65$), `HIGH` ($\ge 0.45$), `MEDIUM` ($\ge 0.25$), and `LOW` ($< 0.25$) risk tiers with explainable risk drivers.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
  subgraph Client ["Client (React 19 + TypeScript + Vite)"]
    UI["Single-Page Dashboard\n(GitDiagram, RAG Q&A, Bug Localization, Hotspots, README)"]
    Mermaid["Mermaid.js + ReactFlow Canvas"]
  end

  subgraph Backend ["Backend Gateway (Node.js + Express)"]
    Routes["API Routers & Middleware\n(JWT Auth, Rate Limiter, Zod Validation)"]
    Controllers["Repository & Intelligence Controllers"]
    Prisma["Prisma ORM"]
  end

  subgraph AIService ["AI Intelligence Service (Python + FastAPI)"]
    ArchAgent["Architecture Agent"]
    BugRanker["Multi-Signal Bug Ranker"]
    TriageAgent["Triage & Clustering Service"]
    HotspotAgent["Hotspot Analysis Engine"]
    ReadmeAgent["Documentation Generator"]
    RAGEngine["Retrieval-Augmented Generation"]
  end

  subgraph Storage ["Databases & Search"]
    Postgres[("PostgreSQL 16\n(Users, Repos, Analyses, Issues)")]
    Qdrant[("Qdrant Vector Database\n(Code Chunk Embeddings)")]
  end

  subgraph External ["External Providers"]
    GitHub["GitHub REST API"]
    GroqGemini["Groq / Gemini LLMs"]
  end

  UI -->|HTTP / JSON / JWT| Routes
  Routes --> Controllers
  Controllers --> Prisma
  Prisma --> Postgres
  Controllers -->|Internal API Key| AIService
  Controllers --> GitHub
  AIService --> Qdrant
  AIService --> GroqGemini
```

---

## 📊 Empirical Evaluation & Benchmark

RepoWise was evaluated on **nine real-world open-source repositories** spanning JavaScript, TypeScript, and Python:

| Repository | Stack | Stars | Files Analyzed | Open Issues | Bug-to-File (Top-1 / Top-3 / Top-5) | Q&A Relevance / Faithfulness |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `axios/axios` | JavaScript | 105k | 98 | 142 | 48% / 67% / 76% | 82% / 87% |
| `expressjs/express` | JavaScript | 65k | 72 | 83 | 45% / 65% / 74% | 80% / 84% |
| `vercel/next.js` | TypeScript | 128k | 200 (capped) | 2,841 | 35% / 54% / 64% | 71% / 73% |
| `pallets/flask` | Python | 70k | 64 | 89 | 50% / 69% / 78% | 84% / 88% |
| `psf/requests` | Python | 52k | 48 | 114 | 54% / 71% / 82% | 85% / 89% |
| `tiangolo/fastapi` | Python | 78k | 142 | 530 | 42% / 60% / 71% | 76% / 80% |
| `reduxjs/redux` | TypeScript | 60k | 45 | 62 | 56% / 72% / 80% | 86% / 90% |
| `socketio/socket.io` | TypeScript | 61k | 84 | 95 | 42% / 63% / 74% | 79% / 82% |
| `facebook/docusaurus` | TypeScript | 56k | 180 (capped) | 410 | 36% / 56% / 67% | 73% / 75% |
| **Overall (370 issues)** | **JS / TS / Py** | **675k** | **933** | **4,466** | **43.4% / 62.4% / 72.4%** | **79.6% / 83.1%** |

- **Multi-Signal Localization vs Baseline**: Achieved **62.4% top-3 accuracy** (and **72.4% top-5 accuracy**) across 370 confirmed issues, outperforming standalone semantic search (**38.0%**), with a conservative **19.7% abstention rate** on low-confidence issues.
- **Q&A Assistant Grounding**: 79.6% (~80%) top-5 source file retrieval relevance and 83.1% (~83%) answer faithfulness with exact line citations.
- **Automated Bug Triage**: Weighted precision of **0.76** (F1 **0.75**) across 450 issues; duplicate clustering precision of **76.5%** (26 of 34 confirmed).

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, `@xyflow/react`, `elkjs`, `mermaid` (v12), `dompurify` |
| **Backend** | Node.js 22+, Express 5.1.0, TypeScript, Prisma ORM (v6.7), Argon2id, JWT, Zod, Helmet, Pino |
| **AI Intelligence Service** | Python 3.11+, FastAPI, Pydantic v2, `sentence-transformers` (`all-MiniLM-L6-v2`), `qdrant-client` |
| **LLM Inference** | Google Gemini (`gemini-2.0-flash`) as primary, with automatic fallback circuit breaker to Groq (`openai/gpt-oss-120b`) |
| **Databases** | PostgreSQL 16 (Relational & Auth), Qdrant (Vector Engine with `repository_id` payload isolation) |
| **Infrastructure** | Docker, Docker Compose |

---

## 📁 Repository Structure

```
Repowise/
├── client/                     # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/         # Feature components (MermaidDiagram, BugTriage, Hotspots, README)
│   │   │   └── architecture/   # GitDiagram, drawers, custom nodes & edges
│   │   ├── hooks/              # Custom React hooks (useArchitectureGraph, useSemanticArchitecture)
│   │   ├── services/           # Client-side compilers & utilities (elkLayout, mermaidCompiler)
│   │   ├── App.tsx             # Main dashboard & tab routing
│   │   └── api.ts              # Type-safe API client
│   └── package.json
│
├── server/                     # Express 5 + TypeScript backend gateway
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema & relationships
│   │   └── migrations/         # PostgreSQL migration history
│   ├── src/
│   │   ├── controllers/        # Thin HTTP request handlers
│   │   ├── services/           # GitHub, AI-bridge, Repository, and Auth services
│   │   ├── routes/             # Express route definitions
│   │   ├── middleware/         # Security (Helmet), JWT auth, validation (Zod), rate limiting
│   │   └── server.ts           # Server entrypoint (Port 3000)
│   └── package.json
│
├── ai-service/                 # FastAPI + Python AI intelligence engine
│   ├── app/
│   │   ├── api/routes/         # Endpoints (architecture, rag, bug_localization, triage, hotspots, readme)
│   │   ├── services/           # Multi-signal ranker, architecture agent, vector service, LLM service
│   │   ├── providers/          # Gemini and Groq API integrations
│   │   ├── utils/              # AST chunking, import parsing, and Mermaid compilation
│   │   └── main.py             # FastAPI entrypoint (Port 8000)
│   ├── requirements.txt
│   └── run.py
│
└── docker-compose.yml          # Container configuration for PostgreSQL 16 & Qdrant
```

---

## 🛠️ Local Development Setup

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (v20 or higher) & `npm`
- [Python](https://www.python.org/) (v3.11 or higher) & `pip`

---

### Step 1: Start Database Containers
Start PostgreSQL and Qdrant in the background:
```bash
docker compose up -d
```
Check status:
```bash
docker compose ps
```
- PostgreSQL runs on `localhost:5432`
- Qdrant runs on `localhost:6333`

---

### Step 2: Configure Environment Variables

#### Backend Gateway (`server/.env`):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://repowise:repowise_dev_password@localhost:5432/repowise?schema=public

JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_chars

AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your_shared_internal_secret_api_key_min_16_chars

GITHUB_API_URL=https://api.github.com
GITHUB_TOKEN=optional_github_personal_access_token_to_avoid_rate_limits
CLIENT_URL=http://localhost:5173
```

#### AI Intelligence Service (`ai-service/.env`):
```env
AI_SERVICE_PORT=8000
AI_SERVICE_API_KEY=your_shared_internal_secret_api_key_min_16_chars

QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION=repowise_code

EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
GROQ_API_KEY=optional_groq_api_key_for_fallback
GROQ_MODEL=openai/gpt-oss-120b
```

---

### Step 3: Start Backend Server
```bash
cd server
npm install
npm run prisma:deploy
npm run dev
```
The Node.js server will run on **`http://localhost:3000`**.

---

### Step 4: Start AI Intelligence Service
In a separate terminal:
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
The FastAPI AI service will run on **`http://localhost:8000`**.

---

### Step 5: Start Client Application
In a third terminal:
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to access the RepoWise dashboard!

---

## 📡 API Reference

All responses follow the standard envelope format: `{ success: true, data: ... }` or `{ success: false, error: ... }`.

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Log in and receive access token + HttpOnly refresh cookie |
| `POST` | `/api/auth/logout` | Revoke session and clear cookies |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

### Repository Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/repositories` | Connect a public GitHub repository URL |
| `GET` | `/api/repositories` | List connected repositories for the current user |
| `GET` | `/api/repositories/:id` | Fetch repository status and metadata |
| `DELETE` | `/api/repositories/:id` | Disconnect and remove repository data |

### Intelligence & AI Features
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/repositories/:id/architecture` | Generate hierarchical architecture & GitDiagram |
| `POST` | `/api/repositories/:id/index` | Chunk and embed repository source files into Qdrant |
| `POST` | `/api/repositories/:id/query` | Ask questions to the indexed codebase (Hybrid RAG) |
| `POST` | `/api/repositories/:id/bugs/localize` | Run 4-stage multi-signal bug-to-file localization |
| `GET` | `/api/repositories/:id/bugs/github-issue/:issueNumber` | Fetch details for a specific GitHub issue |
| `GET` | `/api/repositories/:id/bugs/history` | Retrieve past bug localization analyses |
| `POST` | `/api/repositories/:id/issues/sync` | Sync open issues from GitHub into PostgreSQL |
| `GET` | `/api/repositories/:id/issues` | Fetch synced repository issues with localized mappings |
| `POST` | `/api/repositories/:id/triage` | Classify issues for severity & duplicate clusters |
| `GET` | `/api/repositories/:id/triage` | Retrieve latest bug triage summary report |
| `POST` | `/api/repositories/:id/hotspots/calculate` | Compute architectural risk and code hotspots |
| `GET` | `/api/repositories/:id/hotspots` | Fetch cached hotspot analysis |
| `POST` | `/api/repositories/:id/readme/generate` | Generate code-grounded repository README |
| `GET` | `/api/repositories/:id/readme` | Fetch cached or generated README |

---

## 🔒 Security & Privacy

- **Data Isolation**: Multi-tenant Qdrant payloads indexed strictly by `repository_id` with payload filtering to prevent cross-repository vector leakage.
- **Secure Authentication**: Short-lived JSON Web Tokens (15 min) paired with argon2id-hashed refresh tokens stored in secure, HttpOnly, SameSite cookies.
- **Service Perimeter**: The AI Service is completely isolated behind an internal bearer token validation layer; clients only communicate through the Express API gateway.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
