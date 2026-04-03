# Arkham — Project Operating Document

## What is Arkham?

Arkham is a **central command center for daily discipline and life tracking**. It is a single-user, dark, modern dashboard application designed to be displayed primarily on a TV screen, with a secondary desktop control interface.

## System Philosophy

- The dashboard is always **live and reactive** (5-second polling)
- Alexa is an **input layer**, not the system itself
- The backend is the **source of truth** (Neon Postgres)
- The frontend reflects **real-time state**
- Protocols are **structured systems**, not static screens
- The system should feel **intentional, disciplined, and minimal**

## User Experience Vision

Arkham is designed to feel like a **command center** — a place where you glance at your TV and instantly know: what protocol is active, which prayers are done, what tasks remain. The TV display is cinematic, high-contrast, and optimized for distance viewing. The desktop interface is a detailed control panel for managing the system.

## TV-First Design

- **TV mode** (`/tv` route) is the primary experience: fullscreen, large typography, minimal interaction
- **Desktop mode** (`/` route) is the control interface: full CRUD, detailed panels, interactive
- Auto-detection suggests TV mode on large screens; manual toggle available in both modes

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (CSS-based theme config in `globals.css`)
- **Neon Postgres** via `@neondatabase/serverless`
- **Drizzle ORM** + `drizzle-kit` for migrations
- **SWR** for data fetching with 5-second polling
- **Zod** for request validation
- **Lucide React** for icons

## How to Run

```bash
npm install
npm run dev          # Start dev server (http://localhost:3000)
npm run db:generate  # Generate migration files from schema
npm run db:migrate   # Apply migrations to Neon
npm run db:seed      # Seed Fajr Protocol data
npm run db:studio    # Open Drizzle Studio (DB browser)
```

### Environment Variables (`.env`)

```
DATABASE_URL=postgresql://...   # Neon connection string
ALEXA_SECRET=...                # Shared secret for Alexa API auth
```

## Core Components

### Protocol Engine
Protocols are first-class system objects — structured sequences of steps that can be started, advanced, and completed. Example: **Fajr Protocol** (Reflect -> Get Up -> Make Wudu -> Pray Tahajjud -> Prepare for Fajr -> Pray Fajr -> Morning Adhkar). Only one protocol session can be active at a time.

### Prayer Tracker
Tracks the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) with per-day records. Designed for future expansion: Tahajjud, Quran reading, streaks.

### Task Management
Create, complete, and view tasks. Optional priority and categorization. Tasks can be linked to projects.

### Project Tracking
Create projects, track status (active/paused/completed/archived), view progress.

### Alexa Integration
Single POST endpoint (`/api/alexa`) protected with `x-alexa-secret` header. Supports actions: add_task, complete_prayer, start_protocol, advance_protocol. Returns natural-language responses for Alexa to speak.

## Project Structure

```
src/
  app/                    # Next.js App Router
    api/                  # API routes
    tv/                   # TV mode pages
    page.tsx              # Desktop dashboard
  components/
    tv/                   # TV mode components
    desktop/              # Desktop mode components
    shared/               # Reusable UI components
    providers/            # Context providers
  lib/
    db/                   # Drizzle schema, client, seed
    services/             # Business logic layer
    hooks/                # SWR polling hooks
    api/                  # API utilities (auth, response helpers)
    types/                # Shared TypeScript types
    utils.ts              # cn() utility
drizzle/                  # Generated migration files
```

## Development Standards

- **Services first**: Business logic lives in `src/lib/services/`, not in API routes
- **API routes are thin**: Parse request -> call service -> return response
- **Zod validation**: Validate all incoming request bodies
- **Single schema file**: All Drizzle tables in `src/lib/db/schema.ts`
- **No auth**: Single-user system, no users table (except Alexa secret for API protection)
- **Polling, not WebSocket**: 5-second SWR refresh interval in v1

## How Future Agents Should Operate

1. Read this file first to understand the system
2. Check `WORK_LOG.md` for current status and recent changes
3. Check `ARCHITECTURE.md` for system design and data flow
4. Follow existing patterns — services for logic, thin API routes, Tailwind for styling
5. Update `WORK_LOG.md` with any changes made
6. Never hardcode secrets — always use environment variables
7. TV mode is the priority experience — test changes there first

## Progress Tracking

- `WORK_LOG.md` — timestamped implementation log
- `ARCHITECTURE.md` — system design documentation
