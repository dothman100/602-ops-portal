# 602 Ops Portal

Coffee shop and roastery operations portal.

## Current Scope

This version is built to load reliably on Render and includes lightweight server-backed employee login.

- File-backed account storage on the Render service
- HTTP-only session cookies
- Hashed employee passwords
- Sample data only
- Employee account creation with role/page permissions

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

## Login

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

Accounts are stored server-side in `.data/auth.json` by default. On Render without a persistent disk, a redeploy/restart can reset account changes, so keep owner credentials handy until Postgres is added.

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

No database is required for this lightweight version. Optional environment variables:

```txt
OWNER_PASSWORD=change-this-owner-password
AUTH_DATA_PATH=/opt/render/project/src/.data/auth.json
```

## Next Phase

After the UI is reviewed, add back features gradually:

- PostgreSQL and Prisma for durable account storage
- role permissions connected to the database
- real scheduling
- HR tracking
- inventory updates
- ordering workflows
