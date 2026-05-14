# Graph Report - .  (2026-05-14)

## Corpus Check
- Corpus is ~12,771 words - fits in a single context window. You may not need a graph.

## Summary
- 177 nodes · 305 edges · 27 communities (14 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 9,776 input · 9,814 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dashboard & UI Components|Dashboard & UI Components]]
- [[_COMMUNITY_API Routes & AI|API Routes & AI]]
- [[_COMMUNITY_Landing & Features|Landing & Features]]
- [[_COMMUNITY_Layout & Providers|Layout & Providers]]
- [[_COMMUNITY_Knowledge Graph|Knowledge Graph]]
- [[_COMMUNITY_Theme & Button|Theme & Button]]
- [[_COMMUNITY_Backend Intelligence|Backend Intelligence]]
- [[_COMMUNITY_Middleware|Middleware]]
- [[_COMMUNITY_Database Migration|Database Migration]]
- [[_COMMUNITY_Second Brain Core|Second Brain Core]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_API Library|API Library]]
- [[_COMMUNITY_Mock Data|Mock Data]]
- [[_COMMUNITY_3D Visualization|3D Visualization]]
- [[_COMMUNITY_UI Framework|UI Framework]]
- [[_COMMUNITY_Design Principles|Design Principles]]
- [[_COMMUNITY_UX Patterns|UX Patterns]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind CSS|Tailwind CSS]]
- [[_COMMUNITY_Icon Assets|Icon Assets]]
- [[_COMMUNITY_Icon Assets|Icon Assets]]
- [[_COMMUNITY_Icon Assets|Icon Assets]]
- [[_COMMUNITY_Icon Assets|Icon Assets]]
- [[_COMMUNITY_Icon Assets|Icon Assets]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `useUiStore` - 12 edges
3. `Button()` - 10 edges
4. `useAuth()` - 7 edges
5. `generateEmbedding()` - 7 edges
6. `createClient()` - 7 edges
7. `DashboardPage()` - 5 edges
8. `Navbar()` - 5 edges
9. `LoginModal()` - 5 edges
10. `Card()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `generateEmbedding()`  [EXTRACTED]
  app/api/ai/chat/route.ts → lib/ai.ts
- `POST()` --calls--> `generateEmbedding()`  [EXTRACTED]
  app/api/search/route.ts → lib/ai.ts
- `SkeletonBlock()` --calls--> `cn()`  [EXTRACTED]
  components/features/dashboard-skeleton.tsx → lib/utils.ts
- `NoteCard()` --calls--> `cn()`  [EXTRACTED]
  components/features/note-card.tsx → lib/utils.ts
- `ChatModal()` --calls--> `cn()`  [EXTRACTED]
  components/modals/chat-modal.tsx → lib/utils.ts

## Hyperedges (group relationships)
- **Three Core UX Design Principles** — cognitive_ease, spatial_recall, context_preservation [EXTRACTED 1.00]
- **Frontend Stack** — nextjs_15, tailwind_framer, react_force_graph [EXTRACTED 1.00]
- **Backend Intelligence Stack** — supabase_postgres, google_gemma, supabase_storage, text_embedding_004 [EXTRACTED 1.00]

## Communities (27 total, 13 thin omitted)

### Community 0 - "Dashboard & UI Components"
Cohesion: 0.18
Nodes (20): useAuth(), DashboardPage(), AddNoteSidebar(), DashboardSkeleton(), SkeletonBlock(), useBrain(), Navbar(), cn() (+12 more)

### Community 1 - "API Routes & AI"
Cohesion: 0.15
Nodes (13): genAI, POST(), genAI, generateEmbedding(), generateSummaryAndTags(), POST(), genAI, FilterState (+5 more)

### Community 2 - "Landing & Features"
Cohesion: 0.16
Nodes (10): FeaturesSection(), items, Hero(), Badge(), BadgeProps, badgeVariants, Card(), CardContent() (+2 more)

### Community 3 - "Layout & Providers"
Cohesion: 0.13
Nodes (11): geistMono, geistSans, metadata, Providers(), AuthContext, AuthContextValue, AuthProvider(), Footer() (+3 more)

### Community 4 - "Knowledge Graph"
Cohesion: 0.17
Nodes (10): BrainGraph3D(), ForceGraph3D, GraphNode, useCurrentTheme(), formatDate(), NoteCard(), BrainNote, defaultFilters (+2 more)

### Community 5 - "Theme & Button"
Cohesion: 0.21
Nodes (8): Theme, ThemeToggle(), Button(), ButtonProps, Size, sizeClasses, Variant, variantClasses

### Community 6 - "Backend Intelligence"
Cohesion: 0.32
Nodes (8): The Cortex (Logic), Gemini LLM, Google Gemma 3, Ingest Pipeline, Recall Pipeline, Supabase PostgreSQL + pgvector, Supabase Storage, Google Text-Embedding-004

### Community 7 - "Middleware"
Cohesion: 0.47
Nodes (4): config, middleware(), Cookie, updateSession()

### Community 8 - "Database Migration"
Cohesion: 0.4
Nodes (3): genAI, model, supabase

### Community 9 - "Second Brain Core"
Cohesion: 0.4
Nodes (5): 3D Knowledge Graph, Retrieval Augmented Generation (RAG), Second Brain, Spatial Recall, Vector Embeddings

### Community 10 - "ESLint Config"
Cohesion: 0.5
Nodes (3): compat, __dirname, __filename

### Community 13 - "3D Visualization"
Cohesion: 0.67
Nodes (3): CSS3DRenderer, React Force Graph 3D, WebGL

## Knowledge Gaps
- **60 isolated node(s):** `__filename`, `__dirname`, `compat`, `config`, `supabase` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Dashboard & UI Components` to `Landing & Features`, `Layout & Providers`, `Knowledge Graph`, `Theme & Button`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Button()` connect `Theme & Button` to `Dashboard & UI Components`, `Landing & Features`, `Layout & Providers`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `useUiStore` connect `Dashboard & UI Components` to `Landing & Features`, `Theme & Button`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout & Providers` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._