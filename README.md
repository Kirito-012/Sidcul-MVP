# SIDCUL Careers — Hyper-Local Industrial Job Portal (MVP)

A job portal for the **SIDCUL Manufacturers Association** (IIE Haridwar industrial
estate). Verified manufacturers post jobs; local talent (students / ITI / diploma
holders) discovers and applies to them — replacing recruiters and paper directories.

This MVP implements the **Hyper-Local Job Portal** pillar from the association's
directory concept deck.

## Roles & flows

- **Student** (open signup) → browse/search jobs → apply with a cover note → track
  application status in "My Applications".
- **Company** (signup, then **admin-verified** before posting) → post jobs →
  review applicants → move them through Applied → Reviewed → Shortlisted → Rejected.
- **Admin** → verify / revoke companies. Only verified companies' jobs are public.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma 6 + MongoDB**
- **jose** (JWT session cookie) + **bcryptjs** (password hashing)

> MongoDB requires Prisma 6 (Prisma 7 has no MongoDB support). Prisma also needs
> the database to be a **replica set** — MongoDB Atlas is always a replica set,
> and for local dev you run a single-node one (see below).

## Getting started

You need MongoDB. For local dev, run a single-node replica set with Homebrew:

```bash
brew tap mongodb/brew && brew install mongodb-community
mkdir -p ~/.sidcul-mongo
mongod --dbpath ~/.sidcul-mongo --replSet rs0 --port 27017 &
mongosh --quiet --eval "rs.initiate()"
```

Then copy `.env.example` to `.env` and set `DATABASE_URL` (and `AUTH_SECRET`):

```bash
npm install
npm run db:push      # sync indexes/collections to the database (first time only)
npm run db:seed      # load demo data
npm run dev          # http://localhost:3000
```

## Deploying to Vercel

1. **Create the database:** make a free cluster on **MongoDB Atlas**. Under
   **Network Access**, allow connections from anywhere (`0.0.0.0/0`) so Vercel
   can reach it. Copy the `mongodb+srv://…` connection string (with your DB
   user/password and `/sidcul` as the database name).
2. **Add env vars** in Vercel → **Settings → Environment Variables**:
   - `DATABASE_URL` = your Atlas `mongodb+srv://…` string
   - `AUTH_SECRET` = a long random string (e.g. `openssl rand -hex 32`)
3. **Sync the schema once:** locally point `.env`'s `DATABASE_URL` at Atlas and
   run `npm run db:push` (creates the unique indexes). Optionally `npm run db:seed`.
4. **Deploy.** `postinstall` runs `prisma generate`, then `next build`. No
   migration step is needed — MongoDB is schemaless and collections are created
   on first write.

> Never put the real connection string in a committed file — it lives only in
> Vercel's environment variables (and your local, git-ignored `.env`).

### Demo accounts (password for all: `password123`)

| Role               | Email             |
| ------------------ | ----------------- |
| Admin              | admin@sidcul.in   |
| Company (verified) | hr@akums.in       |
| Company (verified) | hr@hul.in         |
| Company (pending)  | hr@havells.in     |
| Student            | rahul@student.in  |

> Log in as **hr@havells.in** to see the "awaiting verification" state, then log
> in as the admin to verify it.

## Useful scripts

- `npm run db:push` — sync the schema (indexes) to the database
- `npm run db:seed` — reset & reload demo data (rerunnable)
- `npm run db:studio` — open Prisma Studio to inspect the database
- `npm run db:reset` — wipe & re-sync the database (`db push --force-reset`)

## Project structure

```
prisma/
  schema.prisma          # data model (User, CompanyProfile, StudentProfile, Job, Application)
  seed.ts                # demo data
src/
  app/                   # routes: /, /jobs, /jobs/[id], /login, /register,
                         #         /company, /company/jobs/new, /company/jobs/[id],
                         #         /student, /admin
  components/            # Nav, JobCard, form components
  lib/
    prisma.ts            # Prisma client (MongoDB)
    auth.ts              # sessions, password hashing, role guards
    constants.ts         # roles, job types, sectors, statuses
    actions/             # server actions (auth, jobs, admin)
```

## Notes / next steps

- `AUTH_SECRET` in `.env` must be replaced with a long random value in production.
- Possible follow-ups: editable student/company profiles, resume uploads, email
  notifications, pagination, and richer search.
