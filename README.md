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
- **Prisma 7 + SQLite** (via the `better-sqlite3` driver adapter)
- **jose** (JWT session cookie) + **bcryptjs** (password hashing)

## Getting started

```bash
npm install
npm run db:migrate   # create the SQLite schema (first time only)
npm run db:seed      # load demo data
npm run dev          # http://localhost:3000
```

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

- `npm run db:seed` — reset & reload demo data (rerunnable)
- `npm run db:studio` — open Prisma Studio to inspect the database
- `npm run db:reset` — drop & recreate the database

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
    prisma.ts            # Prisma client (SQLite adapter)
    auth.ts              # sessions, password hashing, role guards
    constants.ts         # roles, job types, sectors, statuses
    actions/             # server actions (auth, jobs, admin)
```

## Notes / next steps

- SQLite is used for zero-config local dev. Switching to Postgres is a one-line
  change in `prisma/schema.prisma` + `DATABASE_URL`.
- `AUTH_SECRET` in `.env` must be replaced with a long random value in production.
- Possible follow-ups: editable student/company profiles, resume uploads, email
  notifications, pagination, and richer search.
