### Frontend (React + Vite + TypeScript)

This is the client for the ELD Trip Planner. It talks to the Django API and renders the trip form and ELD log sheet.

#### Prerequisites

- Node.js 18+ and npm

#### Install and run

```bash
cd frontend
npm install
npm run dev
```

Dev server: http://localhost:5173

Set the API base URL via `.env` (optional; defaults to `http://localhost:8000` in `src/lib/api.ts` if unset):

```env
VITE_API_BASE_URL=https://your-api.example.com
```

#### Notable files

- `src/lib/api.ts` — API client
- `src/components/TripForm.tsx` — create trip
- `src/components/LogSheet.tsx` — render ELD grid (react‑konva)
- `src/pages/NewTrip.tsx` and `src/pages/Logs.tsx` — main views

#### Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview build locally
```

#### Troubleshooting

- Ensure the backend is running (default: http://localhost:8000)
- CORS errors: configure CORS on the backend (`CORS_ALLOWED_ORIGINS` or `CORS_ALLOW_ALL=true` in dev)

For deployed frontend, see: https://eld-frontend-beryl.vercel.app
