-- ---------- 1. PERFIS ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- 2. PARTIDA SALVA (uma em andamento por usuário) ----------
create table if not exists public.game_saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- 3. ESTATÍSTICAS AGREGADAS ----------
create table if not exists public.game_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  games_played integer not null default 0,
  games_solved integer not null default 0,
  best_time integer,
  updated_at timestamptz not null default now()
);

-- ---------- 4. HISTÓRICO DE PARTIDAS CONCLUÍDAS ----------
create table if not exists public.game_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  difficulty text not null,
  seconds integer not null,
  completed_at timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY — cada usuário só enxerga os próprios dados
-- =========================================================
alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.game_stats enable row level security;
alter table public.game_history enable row level security;

-- profiles
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- game_saves
create policy "game_saves: select own" on public.game_saves
  for select using (auth.uid() = user_id);
create policy "game_saves: insert own" on public.game_saves
  for insert with check (auth.uid() = user_id);
create policy "game_saves: update own" on public.game_saves
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "game_saves: delete own" on public.game_saves
  for delete using (auth.uid() = user_id);

-- game_stats
create policy "game_stats: select own" on public.game_stats
  for select using (auth.uid() = user_id);
create policy "game_stats: insert own" on public.game_stats
  for insert with check (auth.uid() = user_id);
create policy "game_stats: update own" on public.game_stats
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- game_history
create policy "game_history: select own" on public.game_history
  for select using (auth.uid() = user_id);
create policy "game_history: insert own" on public.game_history
  for insert with check (auth.uid() = user_id);

-- =========================================================
-- TRIGGER — cria perfil e linha de estatísticas ao criar a conta
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)));

  insert into public.game_stats (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
