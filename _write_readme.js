const fs = require('fs');
const content = `# The Vibe Dashboard

A full-stack product discovery dashboard with glassmorphism UI, real-time URL-driven search, category filtering, MUI icons, and MongoDB Atlas as the live data source.

---

## Architecture Overview

\`\`\`
Browser (Next.js 14 App Router)
        |
        |  HTTP GET /api/items?search=<term>
        v
Express 4  (Node.js, port 4000)
  routes/items.js -> controllers/itemsController.js
  - Binds port immediately
  - MongoDB connects async in background (auto-retry every 5s)
  - Returns 503 if DB not yet ready
        |
        |  Mongoose regex query
        v
MongoDB Atlas (Cloud)
  database : vibe-dashboard
  collection: items (20 documents)
  text index on name / category / description
\`\`\`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3, custom \`glass\` utilities |
| Icons | \`@mui/icons-material\`, \`@mui/material\` |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Dev tools | nodemon, dotenv |

---

## Project Structure

\`\`\`
Techub-task/
├── backend/
│   ├── controllers/
│   │   └── itemsController.js   # Query logic, 503 guard, regex search
│   ├── db/
│   │   └── connect.js           # Async retry connection (no process.exit)
│   ├── models/
│   │   └── Item.js              # Mongoose schema + text index
│   ├── routes/
│   │   └── items.js             # GET / -> getItems
│   ├── scripts/
│   │   └── seed.js              # One-time: inserts 20 items into Atlas
│   ├── .env                     # NOT committed (see setup below)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express entry point
│
└── frontend/
    ├── app/
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Landing: hero, 6 featured items, categories
    │   └── items/
    │       └── page.tsx         # Catalogue: full grid, URL search/filter
    ├── components/
    │   ├── CategoryIcon.tsx     # MUI icon per category
    │   ├── ItemCard.tsx         # Glassmorphism card, stagger animation
    │   ├── Loader.tsx           # Spinner
    │   └── SearchBar.tsx        # Debounced input, initialValue, clear button
    ├── lib/
    │   └── api.ts               # fetchItems(search?) typed wrapper
    ├── styles/
    │   └── globals.css          # Tailwind base + glass/glass-strong utilities
    ├── .env.local               # NOT committed (see setup below)
    └── package.json
\`\`\`

---

## End-to-End Request Flow

\`\`\`
1. User types "headphones" in SearchBar
        | debounce 400ms
        v
2. router.replace('/items?search=headphones')
        | URL updates — shareable & browser-navigable
        v
3. useSearchParams() reads new value
        v
4. fetchItems('headphones')  ->  lib/api.ts
        | GET http://localhost:4000/api/items?search=headphones
        | cache: 'no-store'
        v
5. Express -> itemsController.js
        | readyState !== 1  ->  503 { success: false }
        | readyState === 1  ->  Item.find({ $or: [ /headphones/i on name/category/desc ] })
        v
6. MongoDB Atlas executes query, returns matching documents
        v
7. { success: true, total: N, data: [...] }
        v
8. React setState -> ItemCard grid re-renders
\`\`\`

---

## Prerequisites

- Node.js 18+
- npm 9+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account (M0 cluster works)

---

## Clone & Run Locally

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Sujay149/Vibe-dashboard.git
cd Vibe-dashboard
\`\`\`

---

### 2. Backend setup

\`\`\`bash
cd backend
npm install
\`\`\`

Create **\`backend/.env\`**:

\`\`\`env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vibe-dashboard?appName=<appName>
PORT=4000
\`\`\`

> Get your connection string from **Atlas -> Database -> Connect -> Drivers**.
> In Atlas -> **Network Access**, whitelist your IP (or use \`0.0.0.0/0\` for open access during dev).

**Seed the database (run once):**

\`\`\`bash
npm run seed
\`\`\`

Expected output:
\`\`\`
[DB] MongoDB connected
[Seed] Cleared existing items.
[Seed] Inserted 20 items successfully.
[Seed] Disconnected from MongoDB.
\`\`\`

**Start the backend:**

\`\`\`bash
npm run dev    # development — nodemon auto-restarts on file changes
# OR
npm start      # production — plain node
\`\`\`

Verify: open \`http://localhost:4000/health\`
\`\`\`json
{ "status": "ok", "db": "connected", "timestamp": "..." }
\`\`\`

---

### 3. Frontend setup

Open a **new terminal**:

\`\`\`bash
cd frontend
npm install
\`\`\`

Create **\`frontend/.env.local\`**:

\`\`\`env
NEXT_PUBLIC_API_BASE=http://localhost:4000
\`\`\`

**Start the frontend:**

\`\`\`bash
npm run dev
\`\`\`

Open \`http://localhost:3000\`

---

## Available Scripts

### Backend (\`/backend\`)

| Command | Description |
|---|---|
| \`npm run dev\` | Start with nodemon (auto-restart on changes) |
| \`npm start\` | Start with plain node |
| \`npm run seed\` | Clear Atlas collection and re-insert 20 items |

### Frontend (\`/frontend\`)

| Command | Description |
|---|---|
| \`npm run dev\` | Next.js dev server with hot reload |
| \`npm run build\` | Production build |
| \`npm start\` | Serve the production build |

---

## API Reference

### \`GET /api/items\`

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| \`search\` | string | Case-insensitive regex match on \`name\`, \`category\`, \`description\` |

**Success \`200\`:**
\`\`\`json
{
  "success": true,
  "total": 1,
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price": 2999,
      "description": "Premium sound with active noise cancellation."
    }
  ]
}
\`\`\`

**DB not ready \`503\`:**
\`\`\`json
{ "success": false, "message": "Database not ready. Please try again shortly." }
\`\`\`

### \`GET /health\`

\`\`\`json
{ "status": "ok", "db": "connected", "timestamp": "2026-02-22T10:00:00.000Z" }
\`\`\`

---

## Product Catalogue

| Category | Items |
|---|---|
| Electronics | Wireless Headphones, Mechanical Keyboard, 4K Monitor, Smart Watch, Noise Isolating Earbuds, Webcam HD |
| Furniture | Ergonomic Chair, Standing Desk, Desk Lamp |
| Accessories | Laptop Sleeve, USB-C Hub, Water Bottle, Backpack |
| Sportswear | Running Shoes, Yoga Mat, Resistance Bands |
| Kitchen | Coffee Maker, Blender |
| Home | Air Purifier, Scented Candles Set |

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| Express binds before MongoDB connects | Server never crashes on slow/missing DB; returns 503 until ready |
| Auto-retry in \`db/connect.js\` | No \`process.exit()\` — server stays alive, retries every 5s |
| \`'use client'\` pages | Data fetches in browser = always fresh, no stale SSR cache |
| Search state lives in URL (\`?search=\`) | Results are shareable, bookmarkable, browser-back navigable |
| \`cache: 'no-store'\` on fetch | Bypasses HTTP cache — always hits the live API |
| Seed script is separate from server | Production server never touches seed data |

---

## Deployment Guide

### Frontend → Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Set **Root Directory** to \`frontend\`
4. Add environment variable:
   \`\`\`
   NEXT_PUBLIC_API_BASE=https://your-backend-url.com
   \`\`\`
5. Click **Deploy**

### Backend → Railway (recommended free tier)

1. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub
2. Select the repo, set **Root Directory** to \`backend\`
3. Add environment variable:
   \`\`\`
   MONGO_URI=mongodb+srv://...
   \`\`\`
4. Railway auto-detects \`npm start\`
5. Copy the generated public URL → use as \`NEXT_PUBLIC_API_BASE\` in Vercel

---

## Environment Variables Reference

### \`backend/.env\`

\`\`\`env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/vibe-dashboard?appName=<app>
PORT=4000
\`\`\`

### \`frontend/.env.local\`

\`\`\`env
NEXT_PUBLIC_API_BASE=http://localhost:4000
\`\`\`

---

## Troubleshooting

**\`EADDRINUSE: port 4000\`** — port already occupied:
\`\`\`powershell
# Windows PowerShell
\$p = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue |
     Select-Object -ExpandProperty OwningProcess -First 1
if (\$p) { Stop-Process -Id \$p -Force }
\`\`\`
\`\`\`bash
# macOS / Linux
lsof -ti:4000 | xargs kill -9
\`\`\`

**Items not loading after backend restart:**
- Hard refresh: \`Ctrl + Shift + R\` (clears browser in-memory state)
- Open \`http://localhost:4000/health\` — \`db\` must show \`"connected"\`
- Verify \`NEXT_PUBLIC_API_BASE\` in \`frontend/.env.local\`

**Atlas connection fails:**
- Confirm your IP is whitelisted in Atlas → Network Access
- Check URL-encoded password in \`MONGO_URI\` (e.g. \`@\` → \`%40\`, \`!\` → \`%21\`)

**Seed script fails:**
- Ensure \`backend/.env\` exists with a valid \`MONGO_URI\`
- Run from inside \`backend/\`: \`npm run seed\`

---

## Author

**Sujay Babu Thota**
GitHub: [Sujay149](https://github.com/Sujay149)
`;

fs.writeFileSync('c:/Users/sujay/Desktop/Techub-task/README.md', content, 'utf8');
console.log('Done. Lines written:', content.split('\\n').length);
