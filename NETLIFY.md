# Netlify deployment

## Required setup

This is a Next.js application with server-side PostgreSQL access. It cannot be deployed as a static GitHub Pages site.

1. Import `hasonae/shatlet` into Netlify from GitHub.
2. Netlify reads `netlify.toml` automatically.
3. Add `DATABASE_URL` under Netlify Site configuration → Environment variables for the production context.
4. Use a hosted PostgreSQL database such as Neon, Supabase, or Railway. Do not use `127.0.0.1` in production.
5. Create the schema once from a machine with network access to the database:

```bash
DATABASE_URL="your-production-url" npx drizzle-kit push
```

6. Optionally load demo data with `seed.sql`. This file truncates the tables first, so do not run it against a database containing real data.
7. Deploy, then check `/api/health`. It should return `{"ok":true}`.

## Netlify settings

- Build command: `npm run build`
- Publish directory: `.next` (handled by `@netlify/plugin-nextjs`)
- Node.js: 22

The GitHub repository must never contain `.env`, `.env.local`, or production credentials.
