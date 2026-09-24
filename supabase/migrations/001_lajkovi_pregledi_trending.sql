-- ============================================================================
-- Moj Kutak — lajkovi, pregledi i trending
--
-- Pokrenuti JEDNOM u Supabase → SQL Editor. Skripta je idempotentna
-- (može se pokrenuti ponovo bez štete).
--
-- Šta radi:
--   1. Čisti duplikate lajkova i dodaje UNIQUE (post_id, session_id)
--   2. Dodaje indekse i ON DELETE CASCADE (brisanje posta briše i statistiku)
--   3. Triggeri automatski održavaju tabelu post_stats
--   4. RPC funkcije koje stranica poziva: record_view, toggle_like,
--      get_like_state, trending_posts
--
-- VAŽNO: ako tvoj admin panel već sam ažurira post_stats (npr. radi
-- UPDATE post_stats ... total_views + 1), preskoči DIO 3 — inače će se
-- brojevi duplo brojati.
-- ============================================================================


-- ─── DIO 1: lajkovi — bez duplikata ─────────────────────────────────────────

delete from public.likes where post_id is null;

delete from public.likes a
using public.likes b
where a.id > b.id
  and a.post_id = b.post_id
  and a.session_id = b.session_id;

alter table public.likes alter column post_id set not null;

create unique index if not exists likes_post_session_uniq
  on public.likes (post_id, session_id);


-- ─── DIO 2: indeksi i kaskadno brisanje ─────────────────────────────────────

create index if not exists page_views_post_time_idx
  on public.page_views (post_id, viewed_at desc);
create index if not exists page_views_time_idx
  on public.page_views (viewed_at desc);
create index if not exists likes_time_idx
  on public.likes (created_at desc);

alter table public.likes drop constraint if exists likes_post_id_fkey;
alter table public.likes add constraint likes_post_id_fkey
  foreign key (post_id) references public.posts(id) on delete cascade;

alter table public.page_views drop constraint if exists page_views_post_id_fkey;
alter table public.page_views add constraint page_views_post_id_fkey
  foreign key (post_id) references public.posts(id) on delete cascade;

alter table public.post_stats drop constraint if exists post_stats_post_id_fkey;
alter table public.post_stats add constraint post_stats_post_id_fkey
  foreign key (post_id) references public.posts(id) on delete cascade;

alter table public.playlist_posts drop constraint if exists playlist_posts_post_id_fkey;
alter table public.playlist_posts add constraint playlist_posts_post_id_fkey
  foreign key (post_id) references public.posts(id) on delete cascade;

alter table public.playlist_posts drop constraint if exists playlist_posts_playlist_id_fkey;
alter table public.playlist_posts add constraint playlist_posts_playlist_id_fkey
  foreign key (playlist_id) references public.playlists(id) on delete cascade;


-- ─── DIO 3: post_stats se održava automatski ────────────────────────────────

create or replace function public.mk_bump_views()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.post_id is null then
    return null;
  end if;
  insert into post_stats (post_id, total_views, total_likes, last_updated)
  values (new.post_id, 1, 0, now())
  on conflict (post_id) do update
    set total_views  = post_stats.total_views + 1,
        last_updated = now();
  return null;
end;
$$;

create or replace function public.mk_bump_likes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into post_stats (post_id, total_views, total_likes, last_updated)
    values (new.post_id, 0, 1, now())
    on conflict (post_id) do update
      set total_likes  = post_stats.total_likes + 1,
          last_updated = now();
  elsif tg_op = 'DELETE' then
    update post_stats
      set total_likes  = greatest(total_likes - 1, 0),
          last_updated = now()
    where post_id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists mk_page_views_stats on public.page_views;
create trigger mk_page_views_stats
  after insert on public.page_views
  for each row execute function public.mk_bump_views();

drop trigger if exists mk_likes_stats on public.likes;
create trigger mk_likes_stats
  after insert or delete on public.likes
  for each row execute function public.mk_bump_likes();

-- Jednokratno preračunavanje iz sirovih podataka (ispravlja stare brojeve)
insert into public.post_stats (post_id, total_views, total_likes, last_updated)
select p.id,
       (select count(*) from public.page_views v where v.post_id = p.id),
       (select count(*) from public.likes l where l.post_id = p.id),
       now()
from public.posts p
on conflict (post_id) do update
  set total_views  = excluded.total_views,
      total_likes  = excluded.total_likes,
      last_updated = now();


-- ─── DIO 4: RPC funkcije za web stranicu ────────────────────────────────────

-- Bilježi pregled. Isti posjetilac se broji najviše jednom u 6 sati po receptu.
create or replace function public.record_view(p_post_id uuid, p_session_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_session_id is null or length(p_session_id) not between 8 and 64 then
    return;
  end if;
  if not exists (select 1 from posts where id = p_post_id) then
    return;
  end if;
  if exists (
    select 1 from page_views
    where post_id = p_post_id
      and session_id = p_session_id
      and viewed_at > now() - interval '6 hours'
  ) then
    return;
  end if;
  insert into page_views (post_id, session_id) values (p_post_id, p_session_id);
end;
$$;

-- Lajk / ukloni lajk. Vraća novo stanje i ukupan broj lajkova.
create or replace function public.toggle_like(p_post_id uuid, p_session_id text)
returns table (is_liked boolean, like_count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_session_id is null or length(p_session_id) not between 8 and 64 then
    raise exception 'neispravan session_id';
  end if;

  delete from likes where post_id = p_post_id and session_id = p_session_id;
  if found then
    is_liked := false;
  else
    insert into likes (post_id, session_id) values (p_post_id, p_session_id)
    on conflict (post_id, session_id) do nothing;
    is_liked := true;
  end if;

  select count(*) into like_count from likes where post_id = p_post_id;
  return next;
end;
$$;

-- Da li je ovaj posjetilac lajkao recept + ukupan broj lajkova.
create or replace function public.get_like_state(p_post_id uuid, p_session_id text)
returns table (is_liked boolean, like_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (select 1 from likes where post_id = p_post_id and session_id = p_session_id),
    (select count(*) from likes where post_id = p_post_id);
$$;

-- Rang lista za period (npr. 7 ili 30 dana).
--   views_period / likes_period  — u zadnjih p_days dana
--   views_prev                   — u periodu prije toga (za strelicu gore/dole)
--   score                        — pregledi + 5 × lajkovi u periodu
create or replace function public.trending_posts(p_days int default 7, p_limit int default 50)
returns table (
  id uuid,
  title text,
  slug text,
  description text,
  image_url text,
  youtube_url text,
  tags text[],
  created_at timestamptz,
  views_period bigint,
  likes_period bigint,
  views_prev bigint,
  total_views bigint,
  total_likes bigint,
  score bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with v as (
    select post_id,
           count(*) filter (where viewed_at >  now() - make_interval(days => p_days)) as cur,
           count(*) filter (where viewed_at <= now() - make_interval(days => p_days)) as prev
    from page_views
    where viewed_at > now() - make_interval(days => p_days * 2)
    group by post_id
  ),
  l as (
    select post_id, count(*) as cur
    from likes
    where created_at > now() - make_interval(days => p_days)
    group by post_id
  )
  select p.id, p.title, p.slug, p.description, p.image_url, p.youtube_url,
         p.tags, p.created_at,
         coalesce(v.cur, 0),
         coalesce(l.cur, 0),
         coalesce(v.prev, 0),
         coalesce(s.total_views, 0),
         coalesce(s.total_likes, 0),
         coalesce(v.cur, 0) + 5 * coalesce(l.cur, 0)
  from posts p
  left join v on v.post_id = p.id
  left join l on l.post_id = p.id
  left join post_stats s on s.post_id = p.id
  order by 14 desc, 13 desc, p.created_at desc
  limit least(greatest(p_limit, 1), 100);
$$;

grant execute on function public.record_view(uuid, text)      to anon, authenticated;
grant execute on function public.toggle_like(uuid, text)      to anon, authenticated;
grant execute on function public.get_like_state(uuid, text)   to anon, authenticated;
grant execute on function public.trending_posts(int, int)     to anon, authenticated;


-- ─── DIO 5 (PREPORUČENO, ručno): Row Level Security ─────────────────────────
--
-- Web stranica NE piše direktno u tabele — sve ide kroz funkcije iznad
-- (security definer). Zato posjetioci ne trebaju INSERT/DELETE prava.
--
-- Prije uključivanja provjeri kako se admin panel prijavljuje. Ako admin
-- koristi Supabase Auth (authenticated), ove politike ga ne blokiraju.
-- Ako admin koristi samo anon ključ, NE uključuj ovo dok admin ne pređe
-- na prijavu ili service_role ključ na serveru.
--
-- alter table public.posts          enable row level security;
-- alter table public.playlists      enable row level security;
-- alter table public.playlist_posts enable row level security;
-- alter table public.post_stats     enable row level security;
-- alter table public.likes          enable row level security;
-- alter table public.page_views     enable row level security;
--
-- create policy "javno čitanje" on public.posts          for select using (true);
-- create policy "javno čitanje" on public.playlists      for select using (true);
-- create policy "javno čitanje" on public.playlist_posts for select using (true);
-- create policy "javno čitanje" on public.post_stats     for select using (true);
--
-- create policy "admin sve" on public.posts          for all to authenticated using (true) with check (true);
-- create policy "admin sve" on public.playlists      for all to authenticated using (true) with check (true);
-- create policy "admin sve" on public.playlist_posts for all to authenticated using (true) with check (true);
-- create policy "admin čita" on public.post_stats    for all to authenticated using (true) with check (true);
-- create policy "admin čita" on public.likes         for select to authenticated using (true);
-- create policy "admin čita" on public.page_views    for select to authenticated using (true);
