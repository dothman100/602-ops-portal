# 602 Ops Portal

Clickable Phase 1 prototype for coffee shop and roastery operations.

## Current Scope

This version is built to load reliably on Render and let the UI/workflow be reviewed before adding platform complexity.

- No database
- No Prisma
- No server-side app state
- Sample data only
- Prototype login stored in browser local storage
- Prototype employee account creation with permissions

## Pages

- Dashboard
- Employee schedule
- Training materials
- Quiz/training tests
- HR records
- Inventory
- Ordering
- Settings
- Employee account management

## Prototype Login

Seeded owner account:

```txt
Email: dothman12@gmail.com
Password: 602Admin!
```

Sample manager:

```txt
Email: hb.manager@602ops.com
Password: Manager123!
```

Sample staff:

```txt
Email: staff@602ops.com
Password: Staff123!
```

Accounts and permissions are stored in the browser for Phase 1. Clearing browser site data resets the prototype accounts.

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

- server-backed authentication
- role permissions connected to the database
- PostgreSQL and Prisma
- real scheduling
- HR tracking
- inventory updates
- ordering workflows
