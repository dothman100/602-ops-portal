# GitHub and Render Deployment Handoff

This project is ready for GitHub and Render. Do not paste account passwords into terminal commands or commit them to the repository.

## 1. Install Local Tools

Install these on your machine:

- Git for Windows: https://git-scm.com/download/win
- GitHub CLI: https://cli.github.com/

After installing, open PowerShell in this folder and run:

```powershell
.\scripts\push-to-github.ps1
```

The script will:

- Initialize a Git repository
- Commit the project
- Open GitHub's browser login flow through GitHub CLI
- Create a private `602-ops-portal` GitHub repo
- Push the app to `main`

## 2. Create the Render Services

1. Go to https://dashboard.render.com/
2. Choose **New > Blueprint**.
3. Connect the GitHub repository.
4. Select the repository containing this app.
5. Render will read `render.yaml` and create:
   - `602-ops-portal` web service
   - `602-ops-portal-db` PostgreSQL database

## 3. Set AUTH_URL

After Render creates the web service, copy its public URL.

In the Render service environment variables, set:

```txt
AUTH_URL=https://your-service-name.onrender.com
```

`DATABASE_URL` is connected automatically from Render Postgres. `AUTH_SECRET` is generated automatically by Render.

## 4. Seed the Production Database

After the first successful deploy:

1. Open the Render service.
2. Open **Shell**.
3. Run:

```bash
npm run prisma:seed
```

Seeded users all use:

```txt
Password123!
```

Change seeded passwords before using this with real staff.

## 5. Ongoing Deploys

The repository includes GitHub Actions CI. Render is configured to deploy after GitHub checks pass.
