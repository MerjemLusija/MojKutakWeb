"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Playlist, PostSummary } from "@/lib/types";
import { brojRecepata, tagLabel } from "@/lib/format";
import { AD_SLOTS } from "@/lib/ads";
import AdSlot from "@/app/components/AdSlot";
import RecipeCard from "@/app/components/RecipeCard";
import { CalendarIcon, CloseIcon, EyeIcon, HeartIcon, SearchIcon } from "@/app/components/Icons";
import { focusPretraga, PRETRAGA_ID } from "@/lib/pretraga";
import TagPicker from "./TagPicker";
import styles from "./recepti.module.css";

type Sort = "novo" | "popularno" | "lajkovi";

// `short` se prikazuje na uskim ekranima da sve tri opcije stanu u jedan red.
const SORTS: { id: Sort; label: string; short: string; Icon: typeof EyeIcon }[] = [
  { id: "novo", label: "Najnovije", short: "Novo", Icon: CalendarIcon },
  { id: "popularno", label: "Najgledanije", short: "Pregledi", Icon: EyeIcon },
  { id: "lajkovi", label: "Najviše lajkova", short: "Lajkovi", Icon: HeartIcon },
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
  const results = useRef<HTMLDivElement>(null);

  // Dolazak preko lupe u headeru (/recepti#pretraga): polje se renderuje tek u browseru,
  // pa browser ne može sam skrolati do njega — uradi to nakon prvog iscrtavanja.
  useEffect(() => {
    if (window.location.hash !== `#${PRETRAGA_ID}`) return;
    const raf = requestAnimationFrame(() => focusPretraga());
    return () => cancelAnimationFrame(raf);
  }, []);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setLimit(PAGE);
  }

  // Svi tagovi iz stvarnih recepata s brojem recepata, najčešći prvi (pa abecedno).
  const tags = useMemo(() => {
    const count = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

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
                  onClick={() => {
                    setParam("playlist", active ? null : pl.slug);
                    // Odabrana playlista: skrolaj do njenih recepata ispod.
                    if (!active) results.current?.scrollIntoView({ block: "start" });
                  }}
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
            id={PRETRAGA_ID}
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

        {tags.length > 0 && (
          <TagPicker tags={tags} value={tag} onChange={(t) => setParam("tag", t)} norm={norm} />
        )}

        <div className={styles.sort} role="radiogroup" aria-label="Sortiraj recepte">
          {SORTS.map(({ id, label, short, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={sort === id}
              className={styles.sortBtn}
              onClick={() => setParam("sort", id === "novo" ? null : id)}
            >
              <Icon size={16} />
              <span className={styles.sortLong}>{label}</span>
              <span className={styles.sortShort} aria-hidden="true">{short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultBar} aria-live="polite" ref={results}>
        <span className={styles.resultInfo}>
          {activePlaylist ? `Playlista „${activePlaylist.title}“ · ` : ""}
          {brojRecepata(filtered.length)}
          {tag && (
            <button type="button" className={styles.activeTag} onClick={() => setParam("tag", null)}>
              {tagLabel(tag)}
              <CloseIcon size={14} />
              <span className="sr-only">Ukloni kategoriju</span>
            </button>
          )}
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
