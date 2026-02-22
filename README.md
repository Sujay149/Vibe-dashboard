# The Vibe Dashboard


<img width="2732" height="1474" alt="image" src="https://github.com/user-attachments/assets/bce08442-0e60-44f6-8595-8830f0a4d838" />
<img width="2794" height="1470" alt="image" src="https://github.com/user-attachments/assets/439a2c2b-e2c6-4c9e-949d-43e1e9f13918" />


A full-stack product discovery dashboard built with **Next.js 14**, **Express.js**, and **MongoDB Atlas**. Features glassmorphism UI, real-time search, category filtering, and MUI icons.

**Live Demo:** https://vibe-dashboard-topaz.vercel.app  
**Backend API:** https://vibe-dashboard-mi37.onrender.com

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │              Next.js 14 Frontend (Vercel)               │  │
│   │                                                         │  │
│   │   /          → Landing page (6 featured items)         │  │
│   │   /items     → Full catalogue (search + filter)        │  │
│   │                                                         │  │
│   │   Components:                                           │  │
│   │   ├── SearchBar.tsx   (debounced, URL-synced)           │  │
│   │   ├── ItemCard.tsx    (glassmorphism cards)             │  │
│   │   ├── CategoryIcon.tsx (MUI icons map)                  │  │
│   │   └── Loader.tsx                                        │  │
│   │                                                         │  │
│   │   lib/api.ts → fetchItems(search?)                      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                    HTTP (fetch)                                 │
│                    GET /api/items                               │
│                    ?search=<term>                               │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Express.js Backend (Render)                        │
│                      Port 4000                                  │
│                                                                 │
│   server.js                                                     │
│   ├── app.listen(4000)  ← starts immediately                   │
│   ├── GET /health       ← DB status check                      │
│   ├── GET /api/items    ← itemsController                      │
│   └── connectDB()       ← async, retries every 5s             │
│                                                                 │
│   itemsController.js                                            │
│   ├── Guard: mongoose.readyState !== 1 → 503                   │
│   ├── search? → regex on name/category/description             │
│   └── returns { success, total, data[] }                       │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                     Mongoose ODM
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (cloud.mongodb.com)                  │
│                                                                 │
│   Cluster:   cluster0.oca6msn.mongodb.net                      │
│   Database:  vibe-dashboard                                     │
│   Collection: items (20 documents)                             │
│                                                                 │
│   Schema: { id, name, category, price, description }           │
│   Index:  text index on name + category + description          │
└─────────────────────────────────────────────────────────────────┘
```

---

## End-to-End Request Flow

```
User types "headphones" in search bar
           │
           ▼
SearchBar.tsx debounces 400ms
           │
           ▼
router.replace('/items?search=headphones')   ← URL updates
           │
           ▼
ItemsContent re-renders, reads useSearchParams()
           │
           ▼
fetchItems('headphones')  [lib/api.ts]
  └── GET https://vibe-dashboard-mi37.onrender.com/api/items?search=headphones
           │
           ▼
Express router → itemsController.getItems()
  ├── Check mongoose.readyState === 1  (if not → 503)
  ├── Build regex: /headphones/i
  └── Item.find({ $or: [
          { name: regex },
          { category: regex },
          { description: regex }
      ]})
           │
           ▼
MongoDB Atlas executes query
           │
           ▼
Returns JSON: { success: true, total: 1, data: [...] }
           │
           ▼
Frontend renders filtered ItemCard grid
```

---

## Project Structure

```
Techub-task/
├── backend/
│   ├── controllers/
│   │   └── itemsController.js    # GET /api/items handler
│   ├── db/
│   │   └── connect.js            # MongoDB connection with auto-retry
│   ├── models/
│   │   └── Item.js               # Mongoose schema + text index
│   ├── routes/
│   │   └── items.js              # Express router
│   ├── scripts/
│   │   └── seed.js               # One-time DB seed (20 items)
│   ├── .env                      # MONGO_URI, PORT (gitignored)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page (hero + 6 featured items)
│   │   ├── items/
│   │   │   └── page.tsx          # Full catalogue (/items)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CategoryIcon.tsx      # MUI icon map per category
│   │   ├── ItemCard.tsx          # Glassmorphism product card
│   │   ├── Loader.tsx            # Spinner
│   │   └── SearchBar.tsx         # Debounced search with clear button
│   ├── lib/
│   │   └── api.ts                # fetchItems() typed wrapper
│   ├── .env.local                # NEXT_PUBLIC_API_BASE (gitignored)
│   ├── vercel.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── vercel.json
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS v3 |
| UI Components | MUI Icons (`@mui/icons-material`) |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Running Locally (Clone Guide)

### Prerequisites
- Node.js 18+
- Git
- A MongoDB Atlas account (free tier works)

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Sujay149/Vibe-dashboard.git
cd Vibe-dashboard
```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
# backend/.env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=4000
```

To get your `MONGO_URI`:
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click your cluster → **Connect** → **Drivers**
3. Copy the connection string, replace `<password>` with your DB user password
4. Add your IP to **Network Access** → **IP Access List**

Seed the database (first time only):

```bash
npm run seed
```

Start the backend:

```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

Backend runs at: `http://localhost:4000`  
Health check: `http://localhost:4000/health`

---

### Step 3 — Setup Frontend

```bash
cd ../frontend
npm install
```

Create the environment file:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

### Step 4 — Verify

Open `http://localhost:3000` — you should see the landing page with 6 featured products.  
Open `http://localhost:3000/items` — full catalogue with search and category filter.

---

## API Reference

### `GET /api/items`

Returns all items or filtered results.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Search across name, category, description |

**Response:**

```json
{
  "success": true,
  "total": 20,
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
```

**Error (DB not ready):**

```json
{
  "success": false,
  "message": "Database not ready"
}
```

### `GET /health`

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-02-22T10:00:00.000Z"
}
```

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. [render.com](https://render.com) → New Web Service → connect repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment Variables:
   - `MONGO_URI` → your Atlas URI
   - `PORT` → `4000`

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → import repo
2. Set **Root Directory** to `frontend`
3. Environment Variables:
   - `NEXT_PUBLIC_API_BASE` → your Render backend URL
4. Deploy

---

## Categories

| Category | Items |
|---|---|
| Electronics | Wireless Headphones, Mechanical Keyboard, 4K Monitor, Smart Watch, Noise Isolating Earbuds, Webcam HD |
| Furniture | Ergonomic Chair, Standing Desk, Desk Lamp |
| Accessories | Laptop Sleeve, USB-C Hub, Water Bottle, Backpack |
| Sportswear | Running Shoes, Yoga Mat, Resistance Bands |
| Kitchen | Coffee Maker, Blender |
| Home | Air Purifier, Scented Candles Set |
