'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './trending.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Kategorija = 'Peciva' | 'Tjestenine' | 'Salate' | 'Kolači' | 'Pite' | 'Lonci' | 'Hljeb' | 'Meso' | 'Deserti';
type SezonskiEvent = 'ramazan' | 'bozic' | 'uskrs' | 'novo_ljeto' | null;

interface TrendingRecept {
  id: number;
  emoji: string;
  naziv: string;
  kategorija: Kategorija;
  opis: string;
  vrijeme: string;
  youtubeViews: number;   // views u zadnjih 7 dana
  youtubeLikes: number;   // lajkovi u zadnjih 7 dana
  webLikes: number;       // lajkovi na web u zadnjih 7 dana
  trendScore: number;     // izračunato: views*0.4 + likes*0.6
  sezonskiEvent: SezonskiEvent;
  tags: string[];
  youtubeUrl: string;
  thumbnailEmoji: string;
  trend: 'up' | 'down' | 'new';  // smjer trendinga
  trendPercent: number;           // % porast/pad
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const TRENDING_RECEPTI: TrendingRecept[] = [
  {
    id: 1, emoji: '🥧', thumbnailEmoji: '🥧',
    naziv: 'Pita sa sirom i jajima',
    kategorija: 'Pite',
    opis: 'Tanke kore, svježi sir — miris bakine kuhinje. Ovaj video je eksplodirao!',
    vrijeme: '60 min',
    youtubeViews: 48200, youtubeLikes: 3100, webLikes: 892,
    trendScore: 98,
    sezonskiEvent: 'ramazan',
    tags: ['bosanski', 'bakino', 'ramazan', 'iftar'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 142,
  },
  {
    id: 2, emoji: '🫓', thumbnailEmoji: '🫓',
    naziv: 'Somun sa susamom',
    kategorija: 'Hljeb',
    opis: 'Mekani bosanski somun za iftar — recept koji dijeli cijela Bosna.',
    vrijeme: '70 min',
    youtubeViews: 41800, youtubeLikes: 2870, webLikes: 741,
    trendScore: 94,
    sezonskiEvent: 'ramazan',
    tags: ['bosanski', 'ramazan', 'iftar', 'domace'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 118,
  },
  {
    id: 3, emoji: '🍩', thumbnailEmoji: '🍩',
    naziv: 'Krofne sa pekmezom',
    kategorija: 'Deserti',
    opis: 'Vazdušaste, mekane, nestanu za tren. Omiljeni recept za sehur.',
    vrijeme: '80 min',
    youtubeViews: 39500, youtubeLikes: 2640, webLikes: 680,
    trendScore: 91,
    sezonskiEvent: 'ramazan',
    tags: ['bakino', 'sehur', 'ramazan', 'domace'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 97,
  },
  {
    id: 4, emoji: '🍭', thumbnailEmoji: '🍭',
    naziv: 'Tulumbe u šerbetu',
    kategorija: 'Deserti',
    opis: 'Hrskave izvana, mekane iznutra — klasika svakog iftara.',
    vrijeme: '60 min',
    youtubeViews: 35200, youtubeLikes: 2410, webLikes: 598,
    trendScore: 87,
    sezonskiEvent: 'ramazan',
    tags: ['bosanski', 'iftar', 'ramazan', 'svecano'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 84,
  },
  {
    id: 5, emoji: '🍲', thumbnailEmoji: '🍲',
    naziv: 'Begova čorba',
    kategorija: 'Lonci',
    opis: 'Najtraženiji recept za iftar sofru — teletina i povrće.',
    vrijeme: '90 min',
    youtubeViews: 32800, youtubeLikes: 2180, webLikes: 534,
    trendScore: 85,
    sezonskiEvent: 'ramazan',
    tags: ['bosanski', 'iftar', 'ramazan', 'svecano'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 76,
  },
  {
    id: 6, emoji: '🥩', thumbnailEmoji: '🥩',
    naziv: 'Burek sa mesom',
    kategorija: 'Pite',
    opis: 'Pravi bosanski burek — hrskave kore i sočno meso.',
    vrijeme: '75 min',
    youtubeViews: 29400, youtubeLikes: 1960, webLikes: 487,
    trendScore: 82,
    sezonskiEvent: 'ramazan',
    tags: ['bosanski', 'bakino', 'ramazan'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 63,
  },
  {
    id: 7, emoji: '🥐', thumbnailEmoji: '🥐',
    naziv: 'Kroasani s maslacem',
    kategorija: 'Peciva',
    opis: 'Hrskavi, zlatni kroasani za savršeni sehur ili doručak.',
    vrijeme: '45 min',
    youtubeViews: 26100, youtubeLikes: 1740, webLikes: 421,
    trendScore: 78,
    sezonskiEvent: null,
    tags: ['bakino', 'domace', 'sehur'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'new', trendPercent: 0,
  },
  {
    id: 8, emoji: '🍞', thumbnailEmoji: '🍞',
    naziv: 'Domaći hljeb',
    kategorija: 'Hljeb',
    opis: 'Mirisni domaći hljeb koji puni kuću toplinom.',
    vrijeme: '120 min',
    youtubeViews: 24300, youtubeLikes: 1620, webLikes: 398,
    trendScore: 74,
    sezonskiEvent: null,
    tags: ['domace', 'bakino', 'zdravo'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'down', trendPercent: 12,
  },
  {
    id: 9, emoji: '🥐', thumbnailEmoji: '🥐',
    naziv: 'Kiflice bez mlijeka',
    kategorija: 'Peciva',
    opis: 'Mekane kiflice idealne za sehur — bez mlijeka i maslaca.',
    vrijeme: '60 min',
    youtubeViews: 22800, youtubeLikes: 1520, webLikes: 374,
    trendScore: 71,
    sezonskiEvent: 'ramazan',
    tags: ['domace', 'sehur', 'zdravo', 'ramazan'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 48,
  },
  {
    id: 10, emoji: '🍝', thumbnailEmoji: '🍝',
    naziv: 'Špageti carbonara',
    kategorija: 'Tjestenine',
    opis: 'Kremasta pasta bez pavlake — tajna je u jajima i siru.',
    vrijeme: '25 min',
    youtubeViews: 19600, youtubeLikes: 1308, webLikes: 312,
    trendScore: 66,
    sezonskiEvent: null,
    tags: ['brzo', 'ekonomicno'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'down', trendPercent: 8,
  },
  {
    id: 11, emoji: '🫕', thumbnailEmoji: '🫕',
    naziv: 'Bosanski lonac',
    kategorija: 'Lonci',
    opis: 'Miješano povrće i meso kuhano satima — srce bosanske kuhinje.',
    vrijeme: '180 min',
    youtubeViews: 17200, youtubeLikes: 1148, webLikes: 278,
    trendScore: 62,
    sezonskiEvent: null,
    tags: ['bosanski', 'domace', 'svecano'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'up', trendPercent: 22,
  },
  {
    id: 12, emoji: '🍰', thumbnailEmoji: '🍰',
    naziv: 'Čokoladna torta',
    kategorija: 'Kolači',
    opis: 'Vlažna, bogata čokoladom — za svaku posebnu prigodu.',
    vrijeme: '90 min',
    youtubeViews: 15800, youtubeLikes: 1054, webLikes: 256,
    trendScore: 58,
    sezonskiEvent: null,
    tags: ['svecano', 'praznici'],
    youtubeUrl: 'https://youtube.com/@MojKutak',
    trend: 'down', trendPercent: 18,
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RangBadge({ rang }: { rang: number }) {
  if (rang === 1) return <span className={styles.rang1}>🥇 #1</span>;
  if (rang === 2) return <span className={styles.rang2}>🥈 #2</span>;
  if (rang === 3) return <span className={styles.rang3}>🥉 #3</span>;
  return <span className={styles.rangN}>#{rang}</span>;
}

function TrendArrow({ trend, percent }: { trend: TrendingRecept['trend']; percent: number }) {
  if (trend === 'new') return <span className={styles.trendNew}>✦ NOVO</span>;
  if (trend === 'up')   return <span className={styles.trendUp}>↑ +{percent}%</span>;
  return                       <span className={styles.trendDown}>↓ -{percent}%</span>;
}

function HeroCard({ recept, rang }: { recept: TrendingRecept; rang: number }) {
  return (
    <div className={`${styles.heroCard} ${rang === 1 ? styles.heroCard1 : rang === 2 ? styles.heroCard2 : styles.heroCard3}`}>
      <div className={styles.heroCardTop}>
        <RangBadge rang={rang} />
        <TrendArrow trend={recept.trend} percent={recept.trendPercent} />
      </div>
      <div className={styles.heroCardEmoji}>{recept.thumbnailEmoji}</div>
      <div className={styles.heroCardBody}>
        {recept.sezonskiEvent && (
          <span className={styles.eventBadge}>
            {recept.sezonskiEvent === 'ramazan' && '🌙 Ramazan'}
            {recept.sezonskiEvent === 'bozic' && '🎄 Božić'}
            {recept.sezonskiEvent === 'uskrs' && '🐣 Uskrs'}
          </span>
        )}
        <div className={styles.heroCardNaziv}>{recept.naziv}</div>
        <div className={styles.heroCardOpis}>{recept.opis}</div>
        <div className={styles.heroCardStats}>
          <span className={styles.statItem}>
            <span className={styles.statIcon}>▶</span>
            {formatNumber(recept.youtubeViews)}
          </span>
          <span className={styles.statItem}>
            <span className={styles.statIcon}>♥</span>
            {formatNumber(recept.youtubeLikes)}
          </span>
          <span className={styles.statItem}>
            <span className={styles.statIcon}>★</span>
            {formatNumber(recept.webLikes)}
          </span>
        </div>
        <button className={styles.heroCardCta}>Pogledaj recept →</button>
      </div>
    </div>
  );
}

function ListCard({ recept, rang }: { recept: TrendingRecept; rang: number }) {
  return (
    <div className={styles.listCard} style={{ animationDelay: `${rang * 0.05}s` }}>
      <div className={styles.listRang}>
        <RangBadge rang={rang} />
      </div>
      <div className={styles.listEmoji}>{recept.thumbnailEmoji}</div>
      <div className={styles.listBody}>
        <div className={styles.listTop}>
          {recept.sezonskiEvent === 'ramazan' && (
            <span className={styles.listRamBadge}>🌙 Ramazan</span>
          )}
          <span className={styles.listKat}>{recept.kategorija}</span>
        </div>
        <div className={styles.listNaziv}>{recept.naziv}</div>
        <div className={styles.listOpis}>{recept.opis}</div>
        <div className={styles.listStats}>
          <span>▶ {formatNumber(recept.youtubeViews)}</span>
          <span>♥ {formatNumber(recept.youtubeLikes)}</span>
          <span>★ {formatNumber(recept.webLikes)}</span>
        </div>
      </div>
      <div className={styles.listRight}>
        <TrendArrow trend={recept.trend} percent={recept.trendPercent} />
        <div className={styles.scoreBar}>
          <div
            className={styles.scoreBarFill}
            style={{ width: `${recept.trendScore}%` }}
          />
        </div>
        <div className={styles.scoreLabel}>{recept.trendScore} pts</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type SortBy = 'score' | 'views' | 'likes' | 'web';
type FilterEvent = 'sve' | 'ramazan' | 'bozic' | 'uskrs' | 'novo_ljeto';

export default function TrendingPage() {
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [filterEvent, setFilterEvent] = useState<FilterEvent>('sve');
  const [filterKat, setFilterKat] = useState<string>('Sve');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sorted = useMemo(() => {
    let list = [...TRENDING_RECEPTI];
    if (filterEvent !== 'sve') {
      list = list.filter((r) => r.sezonskiEvent === filterEvent);
    }
    if (filterKat !== 'Sve') {
      list = list.filter((r) => r.kategorija === filterKat);
    }
    list.sort((a, b) => {
      if (sortBy === 'views') return b.youtubeViews - a.youtubeViews;
      if (sortBy === 'likes') return b.youtubeLikes - a.youtubeLikes;
      if (sortBy === 'web')   return b.webLikes - a.webLikes;
      return b.trendScore - a.trendScore;
    });
    return list;
  }, [sortBy, filterEvent, filterKat]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const totalViews = useMemo(() =>
    TRENDING_RECEPTI.reduce((s, r) => s + r.youtubeViews, 0), []);
  const totalLikes = useMemo(() =>
    TRENDING_RECEPTI.reduce((s, r) => s + r.youtubeLikes, 0), []);
  const totalWeb = useMemo(() =>
    TRENDING_RECEPTI.reduce((s, r) => s + r.webLikes, 0), []);

  const KATEGORIJE = ['Sve', 'Peciva', 'Tjestenine', 'Salate', 'Kolači', 'Pite', 'Lonci', 'Hljeb', 'Meso', 'Deserti'];

  return (
    <main className={styles.main}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroBlob3} />

        <Image
          src="/logo2.png"
          alt="Moj Kutak"
          width={72}
          height={72}
          className={styles.heroLogo}
          priority
        />

        <div className={styles.heroBadgeRow}>
          <span className={styles.heroBadgeLive}>● UŽIVO</span>
          <span className={styles.heroBadgeWeek}>Zadnjih 7 dana</span>
        </div>

        <h1 className={styles.heroTitle}>
          🔥 <em>Trending</em><br />ove sedmice
        </h1>
        <p className={styles.heroSub}>
          Najpopularniji recepti na YouTube kanalu i web stranici — rangirani po pregledima, lajkovima i aktivnosti
        </p>

        {/* Stats strip */}
        <div className={styles.statsStrip}>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{formatNumber(totalViews)}</span>
            <span className={styles.statLbl}>▶ YouTube pregledi</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNum}>{formatNumber(totalLikes)}</span>
            <span className={styles.statLbl}>♥ YouTube lajkovi</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNum}>{formatNumber(totalWeb)}</span>
            <span className={styles.statLbl}>★ Web lajkovi</span>
          </div>
        </div>
      </section>

      {/* Wavy */}
      <div className={styles.wavy}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,40 C150,10 350,60 600,30 C850,0 1050,50 1200,25 L1200,60 L0,60 Z"
            fill="rgba(255,253,245,0.45)" />
        </svg>
      </div>

      <div className={styles.container}>

        {/* ── RAMAZAN SEZONSKI BANNER ───────────────────────── */}
        <div className={styles.sezonskiBanner}>
          <div className={styles.sezonskiStars}>
            <span className={`${styles.sStar} ${styles.sStar1}`}>☪</span>
            <span className={`${styles.sStar} ${styles.sStar2}`}>★</span>
            <span className={`${styles.sStar} ${styles.sStar3}`}>✦</span>
            <span className={`${styles.sStar} ${styles.sStar4}`}>☪</span>
            <span className={`${styles.sStar} ${styles.sStar5}`}>✦</span>
          </div>
          <div className={styles.sezonskiInner}>
            <div className={styles.sezonskiLeft}>
              <div className={styles.sezonskiIcon}>🌙</div>
              <div>
                <h2 className={styles.sezonskiTitle}>Ramazan Trending ✨</h2>
                <p className={styles.sezonskiSub}>
                  {TRENDING_RECEPTI.filter(r => r.sezonskiEvent === 'ramazan').length} ramazanskih recepata
                  u top trending ovog tjedna — iftar, sehur i slatkiši
                </p>
              </div>
            </div>
            <div className={styles.sezonskiRight}>
              <div className={styles.sezonskiStat}>
                <span className={styles.sezonskiStatNum}>
                  {formatNumber(TRENDING_RECEPTI.filter(r => r.sezonskiEvent === 'ramazan').reduce((s,r) => s + r.youtubeViews, 0))}
                </span>
                <span className={styles.sezonskiStatLbl}>pregleda</span>
              </div>
              <button
                className={styles.sezonskiBtn}
                onClick={() => setFilterEvent(filterEvent === 'ramazan' ? 'sve' : 'ramazan')}
              >
                {filterEvent === 'ramazan' ? 'Prikaži sve' : 'Samo Ramazan →'}
              </button>
            </div>
          </div>

          {/* Upcoming events teaser */}
          <div className={styles.upcomingEvents}>
            <span className={styles.upcomingLabel}>Uskoro:</span>
            <span className={styles.upcomingChip}>🎄 Božić</span>
            <span className={styles.upcomingChip}>🐣 Uskrs</span>
            <span className={styles.upcomingChip}>🎆 Nova godina</span>
          </div>
        </div>

        {/* ── SORT & FILTER BAR ─────────────────────────────── */}
        <div className={styles.controlBar}>
          <div className={styles.controlLeft}>
            <span className={styles.controlLabel}>Sortiraj:</span>
            {([
              { id: 'score' as SortBy, label: '🏆 Trend score' },
              { id: 'views' as SortBy, label: '▶ Pregledi' },
              { id: 'likes' as SortBy, label: '♥ YT lajkovi' },
              { id: 'web'   as SortBy, label: '★ Web lajkovi' },
            ] as const).map((s) => (
              <button
                key={s.id}
                className={`${styles.sortPill} ${sortBy === s.id ? styles.sortPillActive : ''}`}
                onClick={() => setSortBy(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kategorija filter */}
        <div className={styles.katRow}>
          {KATEGORIJE.map((k) => (
            <button
              key={k}
              className={`${styles.katPill} ${filterKat === k ? styles.katPillActive : ''}`}
              onClick={() => setFilterKat(k)}
            >
              {k}
            </button>
          ))}
        </div>

        {/* ── TOP 3 PODIUM ─────────────────────────────────── */}
        {top3.length > 0 && (
          <>
            <h2 className={styles.secTitle}>
              🏆 Top 3 ove sedmice
              <span className={styles.secBadge}>PODIUM</span>
            </h2>
            <div className={styles.podiumGrid}>
              {top3.map((r, i) => (
                <HeroCard key={r.id} recept={r} rang={i + 1} />
              ))}
            </div>
          </>
        )}

        {/* ── LEADERBOARD ──────────────────────────────────── */}
        {rest.length > 0 && (
          <>
            <h2 className={styles.secTitle}>
              📊 Kompletan ranking
              <span className={styles.secBadge}>#{sorted.length} recepata</span>
            </h2>
            <div className={styles.leaderboard}>
              {rest.map((r, i) => (
                <ListCard key={r.id} recept={r} rang={i + 4} />
              ))}
            </div>
          </>
        )}

        {sorted.length === 0 && (
          <div className={styles.noResults}>
            😔 Nema recepata za ovaj filter.
          </div>
        )}

      </div>
    </main>
  );
}
