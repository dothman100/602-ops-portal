# Render Deployment

This Phase 1 prototype is intentionally simple:

- No authentication
- No database
- No Prisma
- No environment variables
- No seed step

## Render Settings

Use the included `render.yaml` Blueprint, or configure a Render Web Service manually:

```txt
Build Command: npm install && npm run build
Start Command: npm run start
```

The only environment variable currently used is:

```txt
NODE_VERSION=22
```

## GitHub

Pushes to `main` run GitHub Actions:

- install dependencies
- lint
- build

Render should redeploy automatically after checks pass.
