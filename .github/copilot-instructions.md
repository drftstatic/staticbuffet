# Copilot Instructions for Static Buffet

## Project Overview
- **Static Buffet** is a professional VJ/video workstation for live mixing of public domain/Archive.org video, with a focus on real-time effects, queue/timeline management, and theme-driven UI.
- **Frontend**: React 18+ (TypeScript, Vite), Zustand for state, Shadcn/ui (Radix UI), Tailwind CSS, Wouter for routing, TanStack Query for data fetching, @hello-pangea/dnd for drag-and-drop.
- **Backend**: Node.js (Express), PostgreSQL (Drizzle ORM, Neon), API proxy for Archive.org, session and rate limiting middleware.

## Architecture & Data Flow
- **Major Components**: Search, Player, Queue, Effects, Themes, EDL Recording, Soundboards, Layout Controls.
- **State**: Centralized in Zustand (`client/src/lib/store.ts`), with React Query for API data and sessionStorage for metadata caching.
- **Data Flow**: Search → Preview/Trim → Add to Queue → Mix/Effects → EDL Recording. Video/metadata fetched via backend proxy to Archive.org.
- **Theme System**: 10+ visual themes, all UI components inherit theme via CSS variables and theme functions. Soundboards and easter eggs are theme-specific.

## Developer Workflows
- **Build**: `npm run build` (Vite)
- **Dev**: `npm run dev` (Vite, hot reload)
- **Backend**: `npm run server` (Express API)
- **Test**: No formal test suite; manual QA and visual regression are primary.
- **Debug**: Use browser devtools, React DevTools, and Zustand middleware for state inspection.
- **Database**: Drizzle ORM migrations, but most features use in-memory or session storage by default.

## Project-Specific Patterns & Conventions
- **Component Consolidation**: Core features (soundboards, layout controls) are consolidated into single components (see `CoreSoundboards`, `LayoutControls`).
- **First-Run Tour**: `FirstRunTour.tsx` and `WelcomeModal.tsx` provide onboarding and workflow guidance.
- **Keyboard Shortcuts**: Comprehensive, with overlays and Command-K palette (`CommandPalette.tsx`).
- **Drag-and-Drop**: Only use @hello-pangea/dnd for queue and layout management.
- **Theme Functions**: All color/class logic is handled via theme functions (see `getThemeClasses`).
- **EDL Recording**: Professional set documentation via `EDLRecorder.tsx`.
- **API Integration**: All Archive.org and video metadata requests go through backend Express proxy for rate limiting and CORS.

## Integration Points
- **Archive.org**: All search and video fetches are proxied through backend (`server/routes.ts`).
- **Database**: PostgreSQL/Drizzle ORM, but can run with in-memory fallback for local/dev.
- **Session/Cache**: Uses sessionStorage and React Query for client-side caching.

## Examples & References
- **Key Files**: `client/src/pages/home.tsx`, `client/src/components/CoreSoundboards.tsx`, `client/src/components/LayoutControls.tsx`, `client/src/components/FirstRunTour.tsx`, `server/routes.ts`, `shared/schema.ts`.
- **Optimization**: See `optimization-roadmap.md` for consolidation and performance strategies.

---

**When in doubt, follow the patterns in the above files and prefer consolidation over proliferation.**
