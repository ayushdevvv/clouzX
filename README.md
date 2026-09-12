# clouzX

Your files, understood. A premium, full stack cloud storage app: dark glass UI, JWT + Google OAuth, Cloudinary storage, AI powered file intelligence, secure share links, duplicate detection, large file insights, and a chronological file timeline.

## Stack

- Backend: Node, Express, MongoDB (Mongoose), JWT auth, Google OAuth (google-auth-library), Cloudinary for file storage, Multer for upload handling, Groq (via native `fetch`, no extra SDK) for file tagging and insights
- Frontend: React (Vite), Tailwind CSS, React Router, Framer Motion, Recharts, @react-oauth/google, Axios, react-hot-toast, lucide-react icons

## Features

- Email/password or one tap Google sign in
- Drag and drop upload straight to Cloudinary, 50MB per file, configurable per-user storage quota
- **Timeline** — files grouped into Today, Yesterday, This week, and Earlier
- **Smart file intelligence** — every upload is auto tagged and given a short insight via Groq, with a heuristic fallback if no API key is set or the request times out, so uploads never fail because of it
- **Share links** — generate a secure public link per file with view only or view and download permission, optional expiry, one tap revoke, and a view counter
- **Duplicate detection** — files are hashed (SHA-256) on upload; exact duplicates are grouped and surfaced with the storage you could reclaim. Nothing is ever deleted automatically
- **Large files** — every file sorted by size with a percent-of-total storage bar
- **Storage dashboard** — category breakdown, duplicate summary, and large file count, all pulled from real aggregation queries
- Star, trash, restore, and permanent delete (with an in-app confirm dialog, not the unreliable browser `confirm()`)
- Fully responsive: collapsible mobile sidebar, round profile avatar with Google photo or initial fallback

## 1. Cloudinary setup (free plan works fine)

1. Create a free account at https://cloudinary.com
2. From your dashboard copy: Cloud Name, API Key, API Secret

## 2. Google OAuth setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized JavaScript origin: `http://localhost:5173`
4. Copy the Client ID, used in both backend and frontend env files

## 3. Groq setup (for smart file intelligence)

1. Create a free account at https://console.groq.com
2. Generate an API key
3. This is optional: if `GROQ_API_KEY` is left empty, clouzX falls back to heuristic tags based on file name and type, uploads still work normally

## 4. MongoDB

Use a free MongoDB Atlas cluster (https://mongodb.com/atlas) and copy your connection string.

## 5. Backend setup

```
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
```
MONGO_URI=...
JWT_SECRET=any_long_random_string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GROQ_API_KEY=...
CLIENT_URL=http://localhost:5173
```

Run it:
```
npm run dev
```
Backend runs on http://localhost:5000

## 6. Frontend setup

```
cd frontend
npm install
cp .env.example .env
```

Fill in `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=same_google_client_id_as_backend
```

Run it:
```
npm run dev
```
Frontend runs on http://localhost:5173

## API overview

All routes below are prefixed with `/api`.

**Auth** (`/auth`)
- `POST /register`, `POST /login`, `POST /google`, `POST /logout`, `GET /me`

**Files** (`/files`, all require auth)
- `POST /upload` — upload a file, computes hash, runs Groq intelligence, checks quota
- `GET /` — list files, supports `search`, `category`, `starred`, `sort`
- `GET /timeline` — files grouped into today / yesterday / this week / earlier
- `GET /trash`, `PATCH /:id/trash`, `PATCH /:id/restore`, `DELETE /:id`
- `GET /duplicates` — duplicate groups by file hash with wasted storage
- `GET /large` — all files sorted by size with percent-of-total
- `GET /shared` — files with an active share link
- `POST /:id/share`, `DELETE /:id/share` — create or revoke a share link
- `PATCH /:id/star`
- `GET /stats` — storage usage, category breakdown, duplicate and large file summary

**Public** (`/public`, no auth)
- `GET /share/:token` — resolve a public share link, enforces expiry and increments the view count

## Deployment notes

- Backend: deploy to Render (free tier works). Set all env vars from `.env.example`, including `GROQ_API_KEY`, and set `CLIENT_URL` to your deployed frontend URL.
- Frontend: deploy to Vercel. Set `VITE_API_URL` to your deployed backend URL (with `/api` suffix) and `VITE_GOOGLE_CLIENT_ID`.
- Add your deployed frontend URL as an authorized JavaScript origin in Google Cloud Console.
- The `/share/:token` route is public and served by the frontend, which calls the backend's public API, no login required to view a shared file.
