# FlagMode

## Local development

Run `npm install`, then `npm run dev`. Without Turso configuration the app uses
`data.db`. For custom credentials, copy `.env.example` to `.env.local` and fill it
in before the first run. Existing local accounts and settings are preserved.

## Deploying to Vercel

Vercel cannot persist a writable SQLite file in the deployment directory. This
app uses a remote Turso database on Vercel, and local SQLite during development.
Do not move `data.db` to `/tmp`: that storage is temporary and is not shared
between function instances.

1. Create a Turso database through https://vercel.com/marketplace/tursocloud and
   connect it to your FlagMode project.
2. In Vercel project Settings → Environment Variables, confirm these are present
   for Production (and Preview if needed):
   - `TURSO_DATABASE_URL`: your remote `libsql://...` URL.
   - `TURSO_AUTH_TOKEN`: the database authentication token.
   - `ADMIN_USER`: your desired login username, for example `admin`.
   - `ADMIN_PASS`: your chosen strong login password.
   - `JWT_SECRET`: a random secret; generate one with `openssl rand -hex 32`.
3. Push these code changes to the repository Vercel deploys, then redeploy after
   setting the environment variables.
4. Open `/login` and sign in with `ADMIN_USER` and `ADMIN_PASS`.

Tables, default settings, and the initial admin account are created automatically
on the first database request. Seeding never overwrites existing settings or an
existing account's password. Changing `ADMIN_PASS` later does not reset an
existing password.

A new remote database starts empty; local `data.db` contents are not uploaded
by deploying this code. If existing local users, settings, or results are needed,
import the local SQLite database into Turso before the app first connects.
Keep tokens, passwords, and `.env.local` out of Git.

## Validation

Run `npm run build` to check types and create the production build.
