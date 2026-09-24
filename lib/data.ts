import { cache } from "react";
import { supabase } from "./supabase";
import { foldKey, plainText, safeUrl } from "./text";
import type { Playlist, PostFull, PostStats, PostSummary, TrendingPost } from "./types";

// Sve čitanje iz baze za stranicu ide kroz ovaj fajl (samo na serveru).
// Bez Supabase ključeva (.env.local) stranica je prazna.

if (!supabase) {
  console.warn("[data] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY nisu podešeni — stranica nema recepata.");
}

const SUMMARY_COLS =
  "id, title, slug, description, image_url, youtube_url, tags, created_at, post_stats(total_views, total_likes)";

type StatsJoin = PostStats | PostStats[] | null | undefined;

function toStats(s: StatsJoin): PostStats {
  const row = Array.isArray(s) ? s[0] : s;
  return {
    total_views: Number(row?.total_views ?? 0),
    total_likes: Number(row?.total_likes ?? 0),
  };
}

/*
  Tagovi se u adminu upisuju ručno pa isti tag dolazi u više oblika
  ("Kolac", "Kolač", "BezPecenja", "Bez pečenja"). Svi oblici s istim ključem
  spajaju se u jedan — onaj sa kvačicama/razmacima, pa najčešći.
*/
type TagCanon = Map<string, string>;

function tagKey(t: string) {
  return foldKey(t).replace(/[\s_-]+/g, "");
}

function buildTagCanon(tags: string[]): TagCanon {
  const variants = new Map<string, Map<string, number>>();
  for (const raw of tags) {
    const t = raw.trim();
    if (!t) continue;
    const v = variants.get(tagKey(t)) ?? new Map<string, number>();
    v.set(t, (v.get(t) ?? 0) + 1);
    variants.set(tagKey(t), v);
  }
  // Prednost: kvačice ("Kolač" > "Kolac"), pa razmak ("Bez pečenja" > "BezPecenja"), pa broj upotreba
  const rank = (t: string, n: number) =>
    (t.match(/[čćžšđ]/gi)?.length ?? 0) * 100 + (/\s/.test(t) ? 50 : 0) + n;
  const canon: TagCanon = new Map();
  for (const [key, v] of variants) {
    canon.set(key, [...v.entries()].sort((a, b) => rank(b[0], b[1]) - rank(a[0], a[1]))[0][0]);
  }
  return canon;
}

function canonTags(tags: string[] | null | undefined, canon: TagCanon): string[] {
  const out: string[] = [];
  for (const raw of tags ?? []) {
    const t = raw.trim();
    if (!t) continue;
    const c = canon.get(tagKey(t)) ?? t;
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

/** Zajednička obrada svakog reda iz `posts`: čist opis, ispravna slika, sređeni tagovi. */
function cleanPost<T extends { description: string | null; image_url: string | null; tags?: string[] | null }>(
  row: T,
  canon: TagCanon,
) {
  return {
    ...row,
    description: plainText(row.description) || null,
    image_url: safeUrl(row.image_url),
    tags: canonTags(row.tags, canon),
  };
}

function normalize<
  T extends { post_stats?: StatsJoin; description: string | null; image_url: string | null; tags?: string[] | null },
>(row: T, canon: TagCanon) {
  const { post_stats, ...rest } = row;
  return { ...cleanPost(rest, canon), stats: toStats(post_stats) };
}

function logError(where: string, error: unknown) {
  console.error(`[data] ${where}:`, error);
}

const getPostRows = cache(async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(SUMMARY_COLS)
    .order("created_at", { ascending: false });
  if (error) {
    logError("getPosts", error);
    return [];
  }
  return data ?? [];
});

const getTagCanon = cache(async (): Promise<TagCanon> =>
  buildTagCanon((await getPostRows()).flatMap((r) => r.tags ?? [])),
);

export const getPosts = cache(async (): Promise<PostSummary[]> => {
  if (!supabase) return [];
  const [rows, canon] = await Promise.all([getPostRows(), getTagCanon()]);
  return rows.map((r) => normalize(r, canon) as PostSummary);
});

export const getPostBySlug = cache(async (slug: string): Promise<PostFull | null> => {
  if (!supabase) return null;
  const [{ data, error }, canon] = await Promise.all([
    supabase.from("posts").select(`content, ${SUMMARY_COLS}`).eq("slug", slug).maybeSingle(),
    getTagCanon(),
  ]);
  if (error) logError("getPostBySlug", error);
  return data ? (normalize(data, canon) as PostFull) : null;
});

export const getPlaylists = cache(async (): Promise<Playlist[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("playlists")
    .select("id, title, slug, description, thumbnail_url, created_at, tags, playlist_posts(post_id, position)")
    .order("created_at", { ascending: true });
  if (error) {
    logError("getPlaylists", error);
    return [];
  }
  return (data ?? []).map(({ playlist_posts, ...pl }) => ({
    ...pl,
    description: plainText(pl.description) || null,
    thumbnail_url: safeUrl(pl.thumbnail_url),
    tags: pl.tags ?? [],
    post_ids: [...(playlist_posts ?? [])]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((pp) => pp.post_id),
  }));
});

/** Rang lista za zadnjih `days` dana (RPC `trending_posts`). */
export const getTrending = cache(async (days: number, limit = 50): Promise<TrendingPost[]> => {
  if (!supabase) return [];
  const [{ data, error }, canon] = await Promise.all([
    supabase.rpc("trending_posts", { p_days: days, p_limit: limit }),
    getTagCanon(),
  ]);
  if (error) {
    logError("getTrending (da li je pokrenuta SQL migracija?)", error);
    return [];
  }
  return ((data ?? []) as TrendingPost[]).map((r) => ({
    ...cleanPost(r, canon),
    views_period: Number(r.views_period),
    likes_period: Number(r.likes_period),
    views_prev: Number(r.views_prev),
    total_views: Number(r.total_views),
    total_likes: Number(r.total_likes),
    score: Number(r.score),
  }));
});

/** Recepti sa zajedničkim tagovima; dopuni najnovijim ako ih nema dovoljno. */
export async function getRelated(post: PostSummary, n = 3): Promise<PostSummary[]> {
  const all = (await getPosts()).filter((p) => p.id !== post.id);
  const scored = all
    .map((p) => ({ p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.shared - a.shared);
  return scored.slice(0, n).map((s) => s.p);
}

export async function getPlaylistsForPost(postId: string): Promise<Playlist[]> {
  return (await getPlaylists()).filter((pl) => pl.post_ids.includes(postId));
}
