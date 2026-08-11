# Vigyanics — Railway Deployment Guide

This guide walks you through putting your Vigyanics website live on **Railway**
using your existing GoDaddy domain. The whole stack (store + admin + API) runs
from a single Railway service, so everything is same-origin and there are no
CORS issues.

---

## 1. Choose your hosting plan

Railway has two account tiers:

- **Hobby (free trial)** — sign up with GitHub. New users get **$5 of free
  credit** (or ~500 free hours) and **no credit card required** to start. This
  is enough to launch and test your app.
- **Pro (paid)** — only needed later as you scale. Starts at **$5/month**
  (usage-based) or **$20/month** (fixed).

> **Recommendation:** Start with the free **Hobby** tier. No credit card needed.

---

## 2. Push your code to GitHub

1. Create a **private** repository on GitHub (e.g. `Vigyanics-Nexus`).
2. Push the `Vigyanics-Nexus` folder. Make sure `.gitignore` excludes
   `node_modules`, `dist`, and any `.env` files (it already does).
3. The repo **must** contain these new deployment files (already created):
   - `Dockerfile`
   - `railway.json`
   - `server.mjs`
   - `.env.example`

---

## 3. Create the Railway account & project

1. Go to **railway.app** → **Login** → **Continue with GitHub**.
2. Authorize Railway to access your GitHub account (free Hobby account).
3. In the dashboard click **+ New Project** → **Deploy from GitHub repo**.
4. Select your `Vigyanics-Nexus` repo. Railway reads `railway.json` and uses
   the `Dockerfile` automatically.

---

## 4. Add Environment Variables

In your Railway **service → Variables**, add these (from
`app.supabase.com → Project Settings → API`):

| Variable | Example | Notes |
|----------|---------|-------|
| `PORT` | `8080` | Railway injects this automatically |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Public |
| `SUPABASE_ANON_KEY` | `eyJ...` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **Secret — never expose to browser** |
| `JWT_SECRET` | long random string | Signs admin tokens |

Optional:
- `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` — not used in production (see below).
- `ADMIN_PATH` — admin sub-path, defaults to `/admin/`.

> **Note:** In production (`NODE_ENV=production`), the local-dev admin fallback
> is disabled. Admin login uses **Supabase Auth**. You must create your admin
> user's account in Supabase and set their `role` to `admin` or `super_admin`
> in the `customers` table. See step 6.

---

## 5. Deploy & get your URL

1. Click **Deploy**. Railway builds the Docker image (installs deps, builds the
   API + store + admin) and starts `server.mjs`.
2. When the build succeeds you get a public URL like `https://yourapp.up.railway.app`.
3. Open it and verify:
   - Store: `https://yourapp.up.railway.app/`
   - Admin: `https://yourapp.up.railway.app/admin/`
   - Health: `https://yourapp.up.railway.app/api/healthz`

---

## 6. Set up your database & admin (Supabase)

Your Supabase database is already separate. If you haven't already:

1. In Supabase **SQL Editor**, run the contents of
   `artifacts/api-server/src/lib/migration.sql` to create all tables, RLS
   policies, buckets, and seed defaults.
2. Create your admin user **via Supabase Auth** (or via the API's
   `POST /api/admin/auth/create-admin` once logged in).
3. In the `customers` table, set that user's `role` to `super_admin` and
   `is_active` to `true`.

---

## 7. Connect your GoDaddy domain

1. In Railway, open your service → **Settings** → **Networking** → **Custom
   Domain**.
2. Add your domain: `yourdomain.com` and `www.yourdomain.com`.
3. Railway gives you a **CNAME target** (e.g. `yourdomain.up.railway.app`).
4. In **GoDaddy → My Products → your domain → DNS**:
   - Add a **CNAME** record: `www` → your Railway target.
   - For the apex `@`, follow Railway's instructions (usually a CNAME flattening
     or an A record pointing to Railway's IP; Railway shows the exact value).
5. Railway issues a **free SSL certificate** automatically. Turn on HTTPS.

---

## 8. Done!

Your Vigyanics site is now live at your GoDaddy domain, with the store, admin
panel, and API all served from one Railway service.

---

## Troubleshooting

- **Build fails on esbuild/rollup platform bins**: The `pnpm-workspace.yaml`
  already excludes non-Linux binaries. The Docker build runs on Linux, so this
  is handled.
- **Prod shows empty admin customers/requests**: The `SERVICE_ROLE_KEY` is
  missing or wrong. Verify it's set in Railway Variables.
- **Health check fails**: Ensure the API can start (check logs) and that
  `SUPABASE_URL` / keys are correct.
- **CORS errors**: Everything is same-origin via the proxy, so CORS shouldn't
  occur. If you see them, you're hitting the API directly instead of through
  the served frontend.
