# Arkham — Architecture Document

## System Overview

Arkham follows a simple, linear architecture optimized for a single-user command center:

```mermaid
graph LR
    A[Alexa Voice] -->|HTTP POST| B[Next.js API Routes]
    B -->|Drizzle ORM| C[Neon Postgres]
    C -->|Query| D[Dashboard API]
    D -->|JSON| E[Frontend - SWR Polling 5s]
    E --> F[TV Mode]
    E --> G[Desktop Mode]
```

## Data Flow

### Voice Command Flow (Alexa → Dashboard)

```mermaid
sequenceDiagram
    participant Alexa
    participant API as /api/alexa
    participant Service as Service Layer
    participant DB as Neon Postgres
    participant UI as Dashboard

    Alexa->>API: POST {action, payload}
    API->>API: Validate x-alexa-secret
    API->>Service: Dispatch action
    Service->>DB: Update state
    Service-->>API: Result
    API-->>Alexa: {success, message}
    Note over UI: Next poll cycle (≤5s)
    UI->>DB: GET /api/dashboard
    UI->>UI: Re-render with new state
```

### TV Mode Polling

```mermaid
sequenceDiagram
    participant TV as TV Dashboard
    participant API as /api/dashboard
    participant DB as Neon Postgres

    loop Every 5 seconds
        TV->>API: GET /api/dashboard
        API->>DB: Aggregated query
        DB-->>API: Results
        API-->>TV: {activeSession, prayers, tasks, activity, stats}
        TV->>TV: Update UI
    end
```

## Component Breakdown

### Backend

| Component | Path | Purpose |
|-----------|------|---------|
| DB Client | `src/lib/db/index.ts` | Neon serverless + Drizzle singleton |
| Schema | `src/lib/db/schema.ts` | All table definitions |
| Services | `src/lib/services/*.ts` | Business logic (protocol, prayer, task, project, activity) |
| API Routes | `src/app/api/**` | Thin HTTP handlers |
| Alexa Auth | `src/lib/api/alexa-auth.ts` | Shared secret validation |

### Frontend

| Component | Path | Purpose |
|-----------|------|---------|
| TV Dashboard | `src/app/tv/page.tsx` | Fullscreen TV layout |
| Desktop Dashboard | `src/app/page.tsx` | Interactive control panel |
| TV Components | `src/components/tv/*` | Protocol card, prayer tracker, task summary, clock |
| Desktop Components | `src/components/desktop/*` | Full CRUD interfaces |
| Shared Components | `src/components/shared/*` | Card, button, badge, prayer-dot |
| Polling Hooks | `src/lib/hooks/*` | SWR hooks with 5s refresh |

## Protocol Engine Design

Protocols are the core abstraction in Arkham — structured, ordered sequences of steps.

### State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Active: startSession()
    Active --> Active: advanceStep()
    Active --> Completed: completeSession() / last step
    Active --> Abandoned: abandonSession()
    Completed --> [*]
    Abandoned --> [*]
```

### Data Model

- **Protocol**: Template (name, description, ordered steps)
- **Protocol Steps**: Ordered list belonging to a protocol
- **Protocol Session**: An active run of a protocol — tracks current step index and step timestamps
- **Constraint**: Only one session can be active at a time

## Database Structure

```mermaid
erDiagram
    tasks {
        serial id PK
        text title
        text description
        text priority
        text category
        integer project_id FK
        text status
        date due_date
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }

    prayers {
        serial id PK
        text name
        date date
        boolean completed
        timestamp completed_at
        text notes
        timestamp created_at
    }

    projects {
        serial id PK
        text name
        text description
        text status
        integer progress
        timestamp created_at
        timestamp updated_at
    }

    protocols {
        serial id PK
        text name
        text description
        text display_mode
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    protocol_steps {
        serial id PK
        integer protocol_id FK
        text title
        text description
        integer order_index
        integer duration_seconds
        timestamp created_at
    }

    protocol_sessions {
        serial id PK
        integer protocol_id FK
        text status
        integer current_step_index
        timestamp started_at
        timestamp completed_at
        jsonb step_timestamps
    }

    activity_log {
        serial id PK
        text event_type
        text entity_type
        integer entity_id
        jsonb metadata
        timestamp created_at
    }

    projects ||--o{ tasks : "has"
    protocols ||--o{ protocol_steps : "has"
    protocols ||--o{ protocol_sessions : "runs"
```

## TV Mode Behavior

### Layout

The TV mode uses a CSS Grid layout optimized for 1920x1080 viewing at distance:

```
+--------------------------------------------------+
|  ARKHAM                     [clock]    [date]     |
+--------------------------------------------------+
|                    |                              |
|   ACTIVE PROTOCOL  |      PRAYER STATUS           |
|   (large card)     |      + MISSION STATS          |
|                    |                              |
+--------------------+------------------------------+
|   TODAY'S TASKS    |      ACTIVITY FEED            |
+--------------------+------------------------------+
```

- No scrolling, no interactive elements
- Large typography (step names 4-6xl, prayers 2-3xl)
- High contrast dark theme
- Hidden cursor (`cursor-none`)

### Screen Detection Strategy

1. `/tv` route always renders TV mode
2. `/` route always renders desktop mode
3. `useDisplayMode()` hook detects viewport width >= 1920px and shows a suggestion toast
4. Manual toggle button available in both modes

## Deployment Model

- **Vercel** (recommended): Zero-config Next.js deployment
- **Neon Postgres**: Serverless database, connection via `DATABASE_URL`
- **Environment variables**: Set in Vercel dashboard or `.env` locally
- **TV Client**: Chromium kiosk mode on Fire TV Stick or similar device pointing at `/tv`
