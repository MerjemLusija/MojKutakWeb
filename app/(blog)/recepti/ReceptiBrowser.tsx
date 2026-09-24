"use client";

import { Fragment, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Playlist, PostSummary } from "@/lib/types";
import { brojRecepata, tagLabel } from "@/lib/format";
import { AD_SLOTS } from "@/lib/ads";
import AdSlot from "@/app/components/AdSlot";
import RecipeCard from "@/app/components/RecipeCard";
import { CloseIcon, SearchIcon } from "@/app/components/Icons";
import styles from "./recepti.module.css";

type Sort = "novo" | "popularno" | "lajkovi";

const SORTS: { id: Sort; label: string }[] = [
  { id: "novo", label: "Najnovije" },
  { id: "popularno", label: "Najgledanije" },
  { id: "lajkovi", label: "Najviše lajkova" },
];

const PAGE = 24;
const AD_EVERY = 8;

/** "Čorba" i "corba" daju isti rezultat. */
function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function ReceptiBrowser({ posts, playlists }: { posts: PostSummary[]; playlists: Playlist[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const tag = params.get("tag");
  const playlistSlug = params.get("playlist");
  const sort = (params.get("sort") as Sort | null) ?? "novo";

  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setLimit(PAGE);
  }

  // Tagovi iz stvarnih recepata, najčešći prvi. Tagovi s jednim receptom se ne nude kao filter
  // (ima ih previše), ali rade kroz link s recepta i kroz pretragu.
  const tags = useMemo(() => {
    const count = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()]
      .filter(([t, n]) => n >= 2 || t === tag)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [posts, tag]);

  const activePlaylist = playlists.find((pl) => pl.slug === playlistSlug) ?? null;

  const filtered = useMemo(() => {
    let list = posts;

    if (activePlaylist) {
      const order = new Map(activePlaylist.post_ids.map((id, i) => [id, i]));
      list = list.filter((p) => order.has(p.id));
      if (sort === "novo") list = [...list].sort((a, b) => order.get(a.id)! - order.get(b.id)!);
    }
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (q.trim()) {
      const needle = norm(q.trim());
      list = list.filter((p) =>
        norm(`${p.title} ${p.description ?? ""} ${p.tags.join(" ")}`).includes(needle),
      );
    }
    if (sort === "popularno") list = [...list].sort((a, b) => b.stats.total_views - a.stats.total_views);
    if (sort === "lajkovi") list = [...list].sort((a, b) => b.stats.total_likes - a.stats.total_likes);
    return list;
  }, [posts, activePlaylist, tag, q, sort]);

  const visible = filtered.slice(0, limit);
  const hasFilters = Boolean(tag || activePlaylist || q.trim());

  return (
    <>
      {playlists.length > 0 && (
        <section className={styles.playlists} aria-labelledby="playliste">
          <h2 id="playliste" className={styles.subhead}>Playliste</h2>
          <div className={styles.plRow}>
            {playlists.map((pl) => {
              const active = pl.slug === playlistSlug;
              return (
                <button
                  key={pl.id}
                  type="button"
                  className={styles.plCard}
                  aria-pressed={active}
                  onClick={() => setParam("playlist", active ? null : pl.slug)}
                >
                  <span className={styles.plThumb}>
                    {pl.thumbnail_url && (
                      <Image src={pl.thumbnail_url} alt="" fill sizes="220px" className={styles.plImg} />
                    )}
                  </span>
                  <span className={styles.plTitle}>{pl.title}</span>
                  <span className={styles.plCount}>{brojRecepata(pl.post_ids.length)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <SearchIcon size={18} />
          <span className="sr-only">Pretraži recepte</span>
          <input
            id="pretraga"
            type="search"
            placeholder="Pretraži, npr. pita, čorba, kolač…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(PAGE);
            }}
          />
          {q && (
            <button type="button" className={styles.clear} onClick={() => setQ("")} aria-label="Obriši pretragu">
              <CloseIcon size={16} />
            </button>
          )}
        </label>

        <label className={styles.sort}>
          <span>Sortiraj:</span>
          <select value={sort} onChange={(e) => setParam("sort", e.target.value === "novo" ? null : e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags} role="group" aria-label="Filtriraj po tagu">
          <button type="button" className="chip" aria-pressed={!tag} onClick={() => setParam("tag", null)}>
            Sve
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              aria-pressed={tag === t}
              onClick={() => setParam("tag", tag === t ? null : t)}
            >
              {tagLabel(t)}
            </button>
          ))}
        </div>
      )}

      <div className={styles.resultBar} aria-live="polite">
        <span>
          {activePlaylist ? `Playlista „${activePlaylist.title}“ · ` : ""}
          {brojRecepata(filtered.length)}
        </span>
        {hasFilters && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setQ("");
              router.replace(pathname, { scroll: false });
            }}
          >
            Poništi filtere
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>Nema recepata za ovu pretragu. Probajte drugu riječ ili uklonite filter.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((p, i) => (
            <Fragment key={p.id}>
              <RecipeCard post={p} priority={i < 3} showStats={sort !== "novo"} />
              {(i + 1) % AD_EVERY === 0 && i < visible.length - 1 && (
                <div className={styles.feedAd}>
                  <AdSlot slot={AD_SLOTS.listaFeed} format="in-feed" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {filtered.length > limit && (
        <div className={styles.more}>
          <button type="button" className="btn btn-outline" onClick={() => setLimit((l) => l + PAGE)}>
            Prikaži još recepata
          </button>
        </div>
      )}
    </>
  );
}
