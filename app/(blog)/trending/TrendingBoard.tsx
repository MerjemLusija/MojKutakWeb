"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TrendingPost } from "@/lib/types";
import { formatBroj, tagLabel } from "@/lib/format";
import { coverImage } from "@/lib/youtube";
import { AD_SLOTS } from "@/lib/ads";
import AdSlot from "@/app/components/AdSlot";
import { EyeIcon, HeartIcon, TrendDownIcon, TrendUpIcon } from "@/app/components/Icons";
import styles from "./trending.module.css";

type Period = "sedmica" | "mjesec" | "sve";
type Sort = "score" | "views" | "likes";

const PERIODS: { id: Period; label: string }[] = [
  { id: "sedmica", label: "Ova sedmica" },
  { id: "mjesec", label: "Ovaj mjesec" },
  { id: "sve", label: "Sve vrijeme" },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "score", label: "Ukupno" },
  { id: "views", label: "Pregledi" },
  { id: "likes", label: "Lajkovi" },
];

function Trend({ post, period }: { post: TrendingPost; period: Period }) {
  if (period === "sve") return null;
  const { views_period: cur, views_prev: prev } = post;
  if (prev === 0) {
    return cur > 0 ? <span className={styles.trendNew}>Novo</span> : null;
  }
  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) return null;
  return pct > 0 ? (
    <span className={styles.trendUp} title="U odnosu na prethodni period">
      <TrendUpIcon size={15} /> {pct}%
    </span>
  ) : (
    <span className={styles.trendDown} title="U odnosu na prethodni period">
      <TrendDownIcon size={15} /> {Math.abs(pct)}%
    </span>
  );
}

function Stats({ post }: { post: TrendingPost }) {
  return (
    <span className={styles.stats}>
      <span><EyeIcon size={16} /> {formatBroj(post.views_period)}</span>
      <span><HeartIcon size={16} /> {formatBroj(post.likes_period)}</span>
    </span>
  );
}

export default function TrendingBoard({ periods }: { periods: Record<Period, TrendingPost[]> }) {
  const [period, setPeriod] = useState<Period>("sedmica");
  const [sort, setSort] = useState<Sort>("score");

  const list = useMemo(() => {
    const key = sort === "views" ? "views_period" : sort === "likes" ? "likes_period" : "score";
    return periods[period].filter((p) => p.score > 0).sort((a, b) => b[key] - a[key]);
  }, [periods, period, sort]);

  const top = list.slice(0, 3);
  const rest = list.slice(3);
  const ukupnoPregleda = list.reduce((s, p) => s + p.views_period, 0);
  const ukupnoLajkova = list.reduce((s, p) => s + p.likes_period, 0);

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.tabs} role="tablist" aria-label="Period">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              className={styles.tab}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={styles.sortGroup} role="group" aria-label="Sortiraj po">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              aria-pressed={sort === s.id}
              onClick={() => setSort(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className={styles.empty}>
          Za ovaj period još nema pregleda ni lajkova. Pogledajte rang listu za <strong>sve vrijeme</strong>.
        </p>
      ) : (
        <>
          <p className={styles.summary}>
            {formatBroj(ukupnoPregleda)} pregleda · {formatBroj(ukupnoLajkova)} lajkova
            {period === "sedmica" ? " u zadnjih 7 dana" : period === "mjesec" ? " u zadnjih 30 dana" : " ukupno"}
          </p>

          <ol className={styles.podium}>
            {top.map((p, i) => {
              const src = coverImage(p);
              return (
                <li key={p.id} className={styles.podiumItem}>
                  <Link href={`/recepti/${p.slug}`} className={styles.podiumLink}>
                    <div className={styles.podiumMedia}>
                      {src && (
                        <Image
                          src={src}
                          alt=""
                          fill
                          priority={i === 0}
                          sizes="(max-width: 767px) 100vw, 33vw"
                          className={styles.img}
                        />
                      )}
                      <span className={styles.rankBig}>{i + 1}</span>
                    </div>
                    <div className={styles.podiumBody}>
                      {p.tags[0] && <span className={styles.tag}>{tagLabel(p.tags[0])}</span>}
                      <h2 className={styles.podiumTitle}>{p.title}</h2>
                      <div className={styles.row}>
                        <Stats post={p} />
                        <Trend post={p} period={period} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <AdSlot slot={AD_SLOTS.listaFeed} format="horizontal" className={styles.ad} />

          {rest.length > 0 && (
            <ol className={styles.list} start={4}>
              {rest.map((p, i) => {
                const src = coverImage(p);
                return (
                  <li key={p.id}>
                    <Link href={`/recepti/${p.slug}`} className={styles.listLink}>
                      <span className={styles.rank}>{i + 4}</span>
                      <span className={styles.thumb}>
                        {src && <Image src={src} alt="" fill sizes="96px" className={styles.img} />}
                      </span>
                      <span className={styles.listBody}>
                        <span className={styles.listTitle}>{p.title}</span>
                        <Stats post={p} />
                      </span>
                      <span className={styles.listTrend}>
                        <Trend post={p} period={period} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </>
  );
}
