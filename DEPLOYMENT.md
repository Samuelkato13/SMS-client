# Deployment (strict split)

Use **only** these two repositories:

| Role | Repository | Typical host |
|------|------------|--------------|
| **Frontend** | [Samuelkato13/SMS-client](https://github.com/Samuelkato13/SMS-client) | Vercel (or Netlify) |
| **Backend** | [Samuelkato13/SMS-server](https://github.com/Samuelkato13/SMS-server) | Render, Railway, Fly.io, etc. |

Do **not** deploy the old monorepo `Samuelkato13/SMS` for production if you have standardized on SMS-client + SMS-server.

## Frontend (SMS-client)

1. Connect Vercel to **Samuelkato13/SMS-client** (root directory = repo root).
2. Build: `npm run build` — output is Vite’s `dist/`.
3. **API URL:** `vercel.json` rewrites `/api/*` and `/uploads/*` to your live API. After you deploy SMS-server, edit `vercel.json` and set `destination` to your real API origin, for example:
   - `https://<your-service>.onrender.com/api/$1`
4. Redeploy the Vercel project after changing `vercel.json`.

The browser calls **same-origin** `/api/...`, so Vercel proxies to the backend. You do not need CORS on the API for that path.

## Backend (SMS-server)

1. Connect Render (or your host) to **Samuelkato13/SMS-server**.
2. Set `DATABASE_URL` (Postgres / Supabase), `PORT` if required, and any secrets your app expects.
3. Build/start per your host (often `npm install` + `npm run build` + `npm start`, or `node dist/index.js` if you compile TS).

## Troubleshooting

### `Uncaught SyntaxError: Unexpected token 'export'`

Usually the browser loaded a **`.js` file that is actually HTML** (e.g. SPA fallback) or a non-bundled source file. Check:

- Vercel **Output Directory** matches Vite (`dist`).
- Hard refresh / clear site data (and unregister any old service worker).
- Network tab: failing `*.js` request — open it; if body starts with `<!DOCTYPE`, fix static asset routing or base path.

### `401` on `/api/auth/login`

Wrong username/password, inactive user, or missing `password_hash` for that user — fix in database or reset password flow.

### `500` on `/api/classes`

Fix in **SMS-server** (see latest `routes/classes.ts`): class create must satisfy DB `NOT NULL` columns (`level`, `academic_year`). The client may send only `name`, `section`, `schoolId`; the server fills safe defaults.
