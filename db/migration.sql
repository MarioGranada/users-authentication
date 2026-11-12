-- users-authentication schema + seed (idempotent). Run with: npm run db:migrate
-- Schema is `auth_demo` (not `auth`, which Supabase reserves for its own Auth).
create schema if not exists auth_demo;

create table if not exists auth_demo.users (
  id integer generated always as identity primary key,
  email text not null unique,
  password text not null
);

-- Lucia session table (see @lucia-auth/adapter-postgresql).
create table if not exists auth_demo.sessions (
  id text primary key,
  expires_at timestamptz not null,
  user_id integer not null references auth_demo.users (id) on delete cascade
);

create table if not exists auth_demo.trainings (
  id serial primary key,
  title text not null unique,
  image text not null,
  description text not null
);

-- Not exposed through the Supabase Data API; the app queries server-side only.
alter table auth_demo.users enable row level security;
alter table auth_demo.sessions enable row level security;
alter table auth_demo.trainings enable row level security;

insert into auth_demo.trainings (title, image, description) values
  ('Yoga', 'yoga.jpg', 'A gentle way to improve flexibility and balance.'),
  ('Boxing', 'boxing.jpg', 'A high-energy workout that improves strength and speed.'),
  ('Running', 'running.jpg', 'A great way to improve cardiovascular health and endurance.'),
  ('Weightlifting', 'weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
  ('Cycling', 'cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
  ('Gaming', 'gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
  ('Sailing', 'sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.')
on conflict (title) do nothing;
