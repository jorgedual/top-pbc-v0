# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AhorraVotos is a product voting platform for discount stores in Colombia (D1, Ara, Dollarcity, etc.). Users can discover, search, and vote for products. Built with Next.js 16 (App Router), Supabase backend, and shadcn/ui components.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Netlify deployment
netlify dev           # Run local Netlify dev environment
```

## Architecture

### Data Layer
- **Supabase**: PostgreSQL database with tables: `products`, `stores`, `categories`, `subcategories`
- **Client**: `lib/supabase/client.ts` - Browser client for mutations (votes)
- **Server**: `lib/supabase/server.ts` - Server client (available but not currently used)

### Data Fetching
- **SWR**: Used in `product-list.tsx` for caching and revalidating product data
- Fetcher function handles all Supabase queries with joins for related data

### State Management
- **React useState**: For local component state (filters, search, voted products)
- **localStorage**: Persists user votes across sessions
- **Filters**: Defined in `lib/types.ts` - store, category, subcategory, price range, sort order

### Component Structure
```
app/
  layout.tsx           # Root layout with fonts, analytics
  page.tsx             # Homepage with header, hero, footer
  globals.css          # Tailwind v4 + CSS variables for theming

components/
  product-list.tsx     # Main container (SWR, filtering, search)
  filter-bar.tsx       # Mobile/desktop filter controls
  filter-sidebar.tsx   # Collapsible sidebar filters
  product-card.tsx     # Individual product display with vote button
  ui/                  # shadcn/ui components (60+ components)

lib/
  types.ts             # TypeScript interfaces (Product, Store, Category, Filters)
  utils.ts             # cn() utility for merging Tailwind classes
  supabase/
    client.ts          # Browser Supabase client
    server.ts          # Server Supabase client
```

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)

### UI Configuration
- **shadcn/ui**: New York style, CSS variables, neutral base color
- **Icons**: Lucide React
- **Tailwind**: v4 with `@import` syntax, OKLCH color space
- **Fonts**: Geist Sans, Geist Mono (from next/font/google)

### Deployment
- **Netlify**: Configured in `netlify.toml`
- Build command: `pnpm build`
- Publish directory: `.next`
- Node version: 20
- Uses `@netlify/plugin-nextjs` for optimal Next.js support

## Key Implementation Details

### Store Colors
Store-specific colors are hardcoded in `product-card.tsx` (D1, Ara, Dollarcity, etc.) for brand identification.

### Vote Logic
Votes are optimistic UI updates that:
1. Check localStorage to prevent duplicate votes
2. Increment/decrement votes in Supabase
3. Update local state and localStorage
4. Trigger SWR revalidation

### Filtering
All filtering happens client-side after fetching all products. The `fetcher` in `product-list.tsx` queries all products with joins, then JavaScript handles filtering/sorting.

### Code Style
- **Comments**: Only use comments in complex code. Self-evident code should not be commented.

### TypeScript
- `ignoreBuildErrors` is enabled in `next.config.mjs`
- Images are unoptimized for Netlify compatibility
