# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

**Next.js 16 App Router** project with TypeScript and Tailwind CSS v4.

- `app/layout.tsx` — Root layout: Geist font setup, global metadata
- `app/page.tsx` — Home page (`/`)
- `app/globals.css` — Global Tailwind imports and CSS variables (dark mode via `prefers-color-scheme`)

**Path alias:** `@/*` maps to the project root (configured in `tsconfig.json`).

This is an early-stage scaffold. No API routes, database, or auth are set up yet.
