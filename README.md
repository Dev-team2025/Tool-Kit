# DLithe ToolKit

DLithe ToolKit is a modern, responsive workspace portal for internal teams. It provides a unified dashboard, department toolkits, and authentication powered by Supabase.

## Highlights

- Supabase Auth login and password reset
- Department dashboards and quick-access tools
- Birthday reminders sourced from Supabase `employees` table
- Mobile-first, accessible UI with modern styling

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS + shadcn/ui
- Auth and data: Supabase (Postgres + Auth)

## Project Structure

```
client/   # React frontend
```

For client-specific details, see [client/README.md](client/README.md).

## Prerequisites

- Node.js 20+ (CI uses Node 20)
- npm 8+

## Quick Start

```bash
cd client
npm install
npm run dev
```

Open: http://localhost:5173

## Environment Variables

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_NINJAS_KEY=your_api_ninjas_key
```

Restart the dev server after editing `.env`.

## Supabase Setup

### 1) Create a project
Create a Supabase project and copy the **Project URL** and **Anon public key**.

### 2) Auth settings
In Supabase Dashboard -> Authentication -> URL Configuration, add:

```
http://localhost:5173/reset-password
```

### 3) Database table
Create an `employees` table with the following columns (all text unless stated):

- `id` uuid primary key (default uuid)
- `name`
- `email`
- `department`
- `birthday` (example: `05-30`)
- `avatar`
- `role`

Add any extra columns you need; the UI only reads `name`, `department`, `birthday`, and `avatar`.

### 4) RLS policy (required for reads)
If Row Level Security is enabled, allow authenticated reads:

```sql
create policy "employees_select_authenticated"
on employees
for select
using (auth.role() = 'authenticated');
```

To allow public reads instead:

```sql
create policy "employees_select_public"
on employees
for select
using (true);
```

## Scripts (client)

From the `client` directory:

- `npm run dev`: start the dev server
- `npm run build`: build for production
- `npm run preview`: preview the production build
- `npm run lint`: run ESLint

Production output is generated in `client/dist`.

## CI/CD and Security

- CI workflow: lint, build, and audit in [.github/workflows/ci.yml](.github/workflows/ci.yml)
- CodeQL SAST scanning in [.github/workflows/codeql.yml](.github/workflows/codeql.yml)

If CI fails with a Rollup native binary error on Linux, regenerate the lockfile on Linux or ensure the optional Rollup binary is installed during CI.

## Notes

- Login uses Supabase Auth. You must create users in the Supabase Auth dashboard (or via admin tools) before they can sign in.
- Password reset uses Supabase email flow, so email provider configuration is required in Supabase.
- The quote widget uses the API Ninjas key from `VITE_API_NINJAS_KEY`.

## Troubleshooting

- "Invalid API key": check `VITE_SUPABASE_ANON_KEY` and restart Vite.
- Birthdays not showing: check RLS policy on `employees` and data format for `birthday`.
- Password reset not working: ensure redirect URL is configured in Supabase Auth settings.
