# Arkham — Work Log

## 2026-04-03

### Session 1: Full v1 Build

**Completed:**

#### Phase 0: Project Initialization
- Scaffolded Next.js 16 with TypeScript, Tailwind v4, App Router, src directory
- Installed all dependencies (drizzle-orm, @neondatabase/serverless, swr, zod, clsx, tailwind-merge, lucide-react, drizzle-kit, dotenv)
- Configured Drizzle ORM (`drizzle.config.ts`) with Neon Postgres
- Created DB client singleton (`src/lib/db/index.ts`) using Neon HTTP driver
- Set up Arkham dark theme in `globals.css` with custom color palette
- Removed Google Fonts dependency (was causing build errors) — using system fonts instead

#### Phase 1: Documentation
- Created `CLAUDE.md` — project operating document
- Created `ARCHITECTURE.md` — system design with Mermaid diagrams
- Created `WORK_LOG.md` — this file

#### Phase 2: Database
- Defined full Drizzle schema: tasks, prayers, projects, protocols, protocol_steps, protocol_sessions, activity_log
- Generated and applied migration to Neon Postgres
- Created and ran seed script — Fajr Protocol with 7 steps is in the database

#### Phase 3: Service Layer
- `activity-service.ts` — event logging and recent activity queries
- `task-service.ts` — full CRUD + complete + due-today filter
- `prayer-service.ts` — get today's prayers (with stub creation), mark complete, stats
- `project-service.ts` — full CRUD
- `protocol-service.ts` — CRUD for protocols and steps, lookup by name
- `session-service.ts` — protocol engine: start, advance, complete, abandon, get active (enforces single active session)

#### Phase 4: API Routes (18 endpoints)
- Tasks: GET list, POST create, GET/PATCH/DELETE by ID, POST complete
- Prayers: GET by date, POST mark complete, GET today
- Projects: GET list, POST create, GET/PATCH/DELETE by ID
- Protocols: GET list, POST create, GET/PATCH/DELETE by ID, GET/POST steps
- Sessions: GET list, POST start, GET active, POST advance, POST complete
- Dashboard: GET aggregated data (single fetch for TV mode)
- Alexa: POST dispatch (add_task, complete_prayer, start_protocol, advance_protocol) with x-alexa-secret auth
- Activity: GET recent events

#### Phase 5: TV Mode UI
- TV layout (`src/app/tv/layout.tsx`) — fullscreen, cursor-none, overflow-hidden
- TV dashboard with 2x2 grid layout
- Components: clock, protocol card (with progress bar + step indicators), prayer tracker, task summary, mission banner, activity feed
- 5-second polling via SWR `useDashboard` hook hitting `/api/dashboard`
- Loading state with Arkham branding

#### Phase 6: Desktop Mode UI
- Sidebar navigation with active state highlighting
- Desktop dashboard with 2-column grid: session controls + prayer grid + task list + project list
- Task management: add modal with priority picker, complete/delete, completed tasks collapsible
- Prayer grid: 5-column clickable grid with completion indicators
- Project list: add modal, status dropdown, progress bars, delete
- Session controls: start protocol buttons, advance/complete controls, step indicators
- Dedicated pages: /tasks, /projects, /protocols
- Shared components: Card, Button, Input, Select, Modal, StatusBadge

**Build status:** Clean compilation, 0 TypeScript errors, all 18 API routes + 5 pages registered.

**Decisions:**
- Tailwind v4 CSS-based config (no tailwind.config.ts) — colors defined via `@theme inline` in globals.css
- System fonts instead of Google Fonts (avoids network dependency at build time)
- Neon HTTP driver (not WebSocket) for serverless compatibility
- Zod v4 imported as `zod/v4` per latest package structure
- Next.js 16 async params pattern (`params: Promise<{id: string}>`)

**What's working:**
- Full backend with all CRUD operations and protocol engine
- TV mode with live polling dashboard
- Desktop mode with interactive CRUD for all entities
- Alexa endpoint ready for integration
- Fajr Protocol seeded and ready to run

**Future enhancements (not in v1):**
- WebSocket/SSE for true realtime instead of polling
- Tahajjud, Quran reading, streak tracking for prayers
- Protocol editor UI (create/edit protocols from desktop)
- Alexa skill code (Lambda function)
- Deployment to Vercel
- Dark/light theme toggle (currently dark only, as intended)
