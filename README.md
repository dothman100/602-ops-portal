# 602 Ops Portal

Clickable Phase 1 prototype for coffee shop and roastery operations.

## Current Scope

This version is built to load reliably on Render and let the UI/workflow be reviewed before adding platform complexity.

- No login
- No permissions
- No database
- No Prisma
- No server-side app state
- Sample data only

## Pages

- Dashboard
- Employee schedule
- Training materials
- Quiz/training tests
- HR records
- Inventory
- Ordering
- Settings

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Render

The app includes a minimal `render.yaml`.

```txt
Build Command: npm install && npm run build
Start Command: npm run start
```

No database or environment variables are required for Phase 1.

## Next Phase

After the UI is reviewed, add back features gradually:

- authentication
- role permissions
- PostgreSQL and Prisma
- real scheduling
- HR tracking
- inventory updates
- ordering workflows
