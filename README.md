# BobChows — Frontend

React 18 + TypeScript single-page app for **BobChows**, a collaborative social dining food-ordering platform. Vite build, Tailwind CSS + shadcn/ui, React Query data fetching, Auth0 SPA auth, Stripe Checkout, and Socket.IO real-time group-order sync.

## Stack

- **UI:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Data:** React Query (server state, caching, 5 s polling fallback)
- **Forms:** React Hook Form + Zod validation
- **Auth:** Auth0 SPA (`@auth0/auth0-react`) — protected routes + user profile
- **Payments:** Stripe Checkout redirect via the API
- **Real-time:** `socket.io-client` — joins a room per group order and invalidates queries on push (`src/api/GroupOrderSocket.ts`)

## Getting started

```bash
npm install
cp .env.example .env   # fill in Auth0 + API base URL values
npm run dev            # Vite dev server (:5173)
```

Required environment variables:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (e.g. `http://localhost:7001`) |
| `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` | Auth0 tenant + SPA client |
| `VITE_AUTH0_AUDIENCE` | API identifier for the access token |
| `VITE_AUTH0_CALLBACK_URL` | Post-login redirect (e.g. `http://localhost:5173`) |
| `VITE_USE_WEBSOCKET` | `true` (default) = real-time push; `false` = 5 s polling |

## Pages

- **Home / Search** — hero, city + cuisine search, sort, pagination
- **Detail** — menu, cart, restaurant info, reviews
- **Checkout** — Stripe hosted checkout (single or group)
- **Group order** — join by invite link, live status page with 4-way payment split
- **Order status** — order progress with real-time updates
- **Manage restaurant** — restaurant profile + order management
- **Profile** — Auth0-protected user profile form

## Real-time sync

`useGroupOrderSocket(ids)` joins the group-order rooms for every order the user
can see and invalidates the group-order queries on each `groupOrder:update` push.
While a socket is connected the 5 s polling interval is disabled, so updates are
delivered only by push (see `useGroupOrderRealtimeQueryOptions`).

## Deployment

Static SPA — deploy the `dist/` output to any static host (Render Static Site,
Netlify, Vercel). API base URL is configured via `VITE_API_BASE_URL` at build time.
