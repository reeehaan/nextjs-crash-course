# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**DevEvent** — a Next.js App Router application for browsing developer events (hackathons, meetups, conferences). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (next core-web-vitals + typescript rules)
```

There is no test framework configured in this project.

## Environment Variables

`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — required for PostHog analytics. PostHog is proxied through `/ingest` (configured in `next.config.ts`) to avoid ad-blockers.

## Architecture

### Directory Structure
- `app/` — Next.js App Router: `layout.tsx` (root layout with fonts, Navbar, LightRays background) and `page.tsx` (home page)
- `components/` — React components consumed by the app
- `lib/` — Shared utilities and static data
  - `constants.ts` — `EventItem` interface and the static `events` array (the current branch `database-models` suggests this will move to a real DB)
  - `utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `instrumentation-client.ts` — PostHog initialization via Next.js instrumentation hook (runs client-side on every page)

### Key Architectural Notes

**React Compiler** is enabled (`reactCompiler: true` in `next.config.ts`). Avoid manual `useMemo`/`useCallback` for performance optimization; the compiler handles this.

**Path alias**: `@/` maps to the project root (e.g., `@/lib/utils`, `@/components/Navbar`).

**PostHog analytics**: Initialized in `instrumentation-client.ts`. Components call `posthog.capture(...)` directly (e.g., `EventCard`, `ExploreBtn`, `Navbar`). All analytics-instrumented components must be `'use client'`.

**LightRays** (`components/LightRays.jsx`) is a WebGL background effect using the OGL library with inline GLSL shaders. It uses an `IntersectionObserver` to pause rendering when off-screen. It remains `.jsx` (not `.tsx`) intentionally — do not convert it without care.

**shadcn/ui** is configured with the `radix-nova` style, `lucide` icons, and an additional registry for `@react-bits` components (`https://reactbits.dev/r/{name}.json`). Add new shadcn components via:
```bash
npx shadcn add <component>
```
