# Development Guide

## Prerequisites

- Node.js 18 or later
- npm 9 or later

## First-Time Setup

```bash
# Clone and install
git clone <your-repo-url>
cd sql-brush-up
npm install

# Start development
npm run dev
```

Open http://localhost:5173

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client (5173) + server (3001) |
| `npm run dev:client` | Client only |
| `npm run build` | Production build |
| `npm test` | Run unit tests |
| `npm run preview` | Preview production build |

## Adding a Lesson

1. Edit `client/src/lessons/lessons.json`
2. Follow the existing `Lesson` type structure
3. Reference a `databaseId` from sample databases
4. Include hints (never reveal answer immediately)
5. Test in the lesson detail page

## Adding a Sample Database

1. Create `client/src/sample-data/your-db.ts`
2. Export schema SQL and data SQL
3. Register in `client/src/services/database/sample-databases.ts`

## Code Conventions

- Strict TypeScript — no `any`
- Small, focused components (< 200 lines)
- Business logic in `services/`, not components
- Lesson content in JSON, never hardcoded in JSX
- All SQL errors must be caught — never crash the app

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at vercel.com — zero config needed.
