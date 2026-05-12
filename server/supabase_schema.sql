-- Supabase schema for Tool-Kit backend migration (Mongo/Mongoose -> Postgres)

create extension if not exists "pgcrypto";

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),

  employee_id text,
  name text,
  email text unique not null,
  password text,
  department text,
  birthday text,
  avatar text,
  role text default 'employee',

  reset_code text,
  reset_code_expiry timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_employees_updated_at on employees;

create trigger update_employees_updated_at
before update on employees
for each row
execute function update_updated_at_column();
