'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import styles from './recepti.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

type Kategorija = 'Peciva' | 'Tjestenine' | 'Salate' | 'Kolači' | 'Pite' | 'Lonci' | 'Hljeb' | 'Meso' | 'Deserti';
type Playlist = 'slatko' | 'slano' | 'pite' | 'kolaci' | 'hljeb' | 'salate' | 'lonci';
type Sezona = 'prolj' | 'ljeto' | 'jesen' | 'zima' | 'sve';
type Tezina = 'Lako' | 'Srednje' | 'Teže';

interface Recept {
  id: number;
  emoji: string;
  naziv: string;
  kategorija: Kategorija;
  playlist: Playlist;
  opis: string;
  vrijeme: string;
  tezina: Tezina;
  sezona: Sezona[];
  tags: string[];
  ramazan: boolean;
  trending: boolean;
  novi: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const RECEPTI: Recept[] = [
  { id: 1,  emoji: '🥐', naziv: 'Kroasani s maslacem',      kategorija: 'Peciva',     playlist: 'hljeb',  opis: 'Hrskavi, zlatni, savršeni za jutro uz kafu.',              vrijeme: '45 min',  tezina: 'Srednje', sezona: ['prolj','ljeto'],        tags: ['bakino','domace'],                       ramazan: false, trending: true,  novi: false },
  { id: 2,  emoji: '🍝', naziv: 'Špageti carbonara',        kategorija: 'Tjestenine', playlist: 'slano',  opis: 'Kremasta pasta bez pavlake — samo jaja i sir.',            vrijeme: '25 min',  tezina: 'Lako',    sezona: ['sve'],                  tags: ['brzo','ekonomicno'],                     ramazan: false, trending: true,  novi: false },
  { id: 3,  emoji: '🥧', naziv: 'Pita sa sirom i jajima',   kategorija: 'Pite',       playlist: 'pite',   opis: 'Tanke kore, svježi sir, miris bakine kuhinje.',            vrijeme: '60 min',  tezina: 'Srednje', sezona: ['sve'],                  tags: ['bosanski','bakino','ramazan'],            ramazan: true,  trending: true,  novi: false },
  { id: 4,  emoji: '🍰', naziv: 'Čokoladna torta',          kategorija: 'Kolači',     playlist: 'kolaci', opis: 'Vlažna, bogata čokoladom, za svaku proslavu.',             vrijeme: '90 min',  tezina: 'Teže',    sezona: ['sve'],                  tags: ['svecano','praznici'],                     ramazan: false, trending: false, novi: true  },
  { id: 5,  emoji: '🍲', naziv: 'Begova čorba',             kategorija: 'Lonci',      playlist: 'lonci',  opis: 'Klasična bosanska čorba od teletine i povrća.',            vrijeme: '90 min',  tezina: 'Teže',    sezona: ['jesen','zima'],         tags: ['bosanski','ramazan','iftar'],             ramazan: true,  trending: false, novi: true  },
  { id: 6,  emoji: '🍞', naziv: 'Domaći hljeb',             kategorija: 'Hljeb',      playlist: 'hljeb',  opis: 'Mirisni, mekani, pečen u kućnoj rerni.',                  vrijeme: '120 min', tezina: 'Srednje', sezona: ['sve'],                  tags: ['domace','bakino','zdravo'],               ramazan: false, trending: true,  novi: false },
  { id: 7,  emoji: '🥗', naziv: 'Grčka salata',             kategorija: 'Salate',     playlist: 'salate', opis: 'Svježe povrće, feta sir i masline.',                      vrijeme: '10 min',  tezina: 'Lako',    sezona: ['ljeto'],                tags: ['brzo','zdravo','vegetarijansko'],         ramazan: false, trending: false, novi: true  },
  { id: 8,  emoji: '🍩', naziv: 'Krofne sa pekmezom',       kategorija: 'Deserti',    playlist: 'slatko', opis: 'Mekane, vazdušaste, nestanu dok su vruće.',               vrijeme: '80 min',  tezina: 'Srednje', sezona: ['sve'],                  tags: ['bakino','domace','sehur'],                ramazan: true,  trending: true,  novi: false },
  { id: 9,  emoji: '🍖', naziv: 'Ćevapi s lukom',           kategorija: 'Meso',       playlist: 'slano',  opis: 'Domaći ćevapi po receptu moje nane.',                     vrijeme: '40 min',  tezina: 'Lako',    sezona: ['ljeto','prolj'],        tags: ['bosanski','domace','iftar'],              ramazan: true,  trending: false, novi: true  },
  { id: 10, emoji: '🥩', naziv: 'Burek sa mesom',           kategorija: 'Pite',       playlist: 'pite',   opis: 'Hrskave kore, sočno meso — pravi burek.',                 vrijeme: '75 min',  tezina: 'Teže',    sezona: ['sve'],                  tags: ['bosanski','bakino','ramazan','iftar'],    ramazan: true,  trending: true,  novi: false },
  { id: 11, emoji: '🥐', naziv: 'Kiflice bez mlijeka',      kategorija: 'Peciva',     playlist: 'hljeb',  opis: 'Mekane kao pamuk, nestanu dok su još vruće.',              vrijeme: '60 min',  tezina: 'Lako',    sezona: ['sve'],                  tags: ['domace','sehur','zdravo'],                ramazan: true,  trending: true,  novi: true  },
  { id: 12, emoji: '🌽', naziv: 'Proja od kukuruze',        kategorija: 'Hljeb',      playlist: 'hljeb',  opis: 'Tradicionalna bosanska proja uz toplo mlijeko.',           vrijeme: '50 min',  tezina: 'Lako',    sezona: ['jesen','zima'],         tags: ['bosanski','bakino','domace'],             ramazan: false, trending: false, novi: false },
  { id: 13, emoji: '🍭', naziv: 'Tulumbe',                  kategorija: 'Deserti',    playlist: 'slatko', opis: 'Hrskave izvana, mekane iznutra, u šerbetu.',               vrijeme: '60 min',  tezina: 'Srednje', sezona: ['sve'],                  tags: ['bosanski','svecano','ramazan','iftar'],   ramazan: true,  trending: false, novi: true  },
  { id: 14, emoji: '🥙', naziv: 'Salata od tjestenine',     kategorija: 'Salate',     playlist: 'salate', opis: 'Kremasta salata s kukuruzom, idealna za ljeto.',           vrijeme: '20 min',  tezina: 'Lako',    sezona: ['ljeto','prolj'],        tags: ['brzo','ekonomicno','vegetarijansko'],     ramazan: false, trending: false, novi: false },
  { id: 15, emoji: '🥩', naziv: 'Sitni ćevap',              kategorija: 'Meso',       playlist: 'slano',  opis: 'Ručak po receptu mame — uz krumpir i luk.',               vrijeme: '55 min',  tezina: 'Srednje', sezona: ['jesen','zima'],         tags: ['bosanski','domace','bakino'],             ramazan: false, trending: false, novi: false },
  { id: 16, emoji: '🍯', naziv: 'Medovik torta',            kategorija: 'Kolači',     playlist: 'kolaci', opis: 'Mekana, sočna, punog ukusa od meda.',                     vrijeme: '120 min', tezina: 'Teže',    sezona: ['jesen','zima'],         tags: ['svecano','praznici','bakino'],            ramazan: false, trending: false, novi: true  },
  { id: 17, emoji: '🫓', naziv: 'Somun sa susamom',         kategorija: 'Hljeb',      playlist: 'hljeb',  opis: 'Mekani bosanski somun, savršen za iftar sofru.',          vrijeme: '70 min',  tezina: 'Srednje', sezona: ['sve'],                  tags: ['bosanski','ramazan','iftar','domace'],    ramazan: true,  trending: true,  novi: true  },
  { id: 18, emoji: '🫕', naziv: 'Bosanski lonac',           kategorija: 'Lonci',      playlist: 'lonci',  opis: 'Miješano povrće i meso kuhano na tihoj vatri satima.',    vrijeme: '180 min', tezina: 'Teže',    sezona: ['jesen','zima'],         tags: ['bosanski','domace','bakino','svecano'],   ramazan: false, trending: false, novi: false },
];

// ─── Playlist config ──────────────────────────────────────────────────────────

interface PlaylistItem {
  id: Playlist;
  emoji: string;
  naziv: string;
  broj: string;
  gradient: string;
}

const PLAYLISTE: PlaylistItem[] = [
  { id: 'slatko', emoji: '🍰', naziv: 'Slatko',          broj: '24 recepta',  gradient: 'linear-gradient(150deg,#2a6f9a,#1e4a70)' },
  { id: 'slano',  emoji: '🥘', naziv: 'Slano',           broj: '31 recept',   gradient: 'linear-gradient(150deg,#c8521a,#8a3210)' },
  { id: 'pite',   emoji: '🥧', naziv: 'Pite',            broj: '18 recepata', gradient: 'linear-gradient(150deg,#5a8a3a,#2d5a1a)' },
  { id: 'kolaci', emoji: '🎂', naziv: 'Kolači & Torte',  broj: '20 recepata', gradient: 'linear-gradient(150deg,#9a4a8a,#5a1a6a)' },
  { id: 'hljeb',  emoji: '🍞', naziv: 'Hljeb & Peciva',  broj: '15 recepata', gradient: 'linear-gradient(150deg,#c89800,#8a6200)' },
  { id: 'salate', emoji: '🥗', naziv: 'Salate',          broj: '12 recepata', gradient: 'linear-gradient(150deg,#1a6a5a,#0a3a32)' },
  { id: 'lonci',  emoji: '🍲', naziv: 'Lonci & Čorbe',   broj: '16 recepata', gradient: 'linear-gradient(150deg,#7a3a1a,#4a1a0a)' },
];

// ─── Tag config ───────────────────────────────────────────────────────────────

const TAGS = [
  { id: 'brzo',            label: '⚡ Brzo'           },
  { id: 'zdravo',          label: '💚 Zdravo'         },
  { id: 'domace',          label: '🏠 Domaće'         },
  { id: 'bosanski',        label: '🇧🇦 Bosanski'      },
  { id: 'vegetarijansko',  label: '🥦 Vegetarijansko' },
  { id: 'djeca',           label: '👧 Za djecu'       },
  { id: 'praznici',        label: '🎉 Za praznike'    },
  { id: 'ramazan',         label: '🌙 Ramazan'        },
  { id: 'sehur',           label: '🌅 Sehur'          },
  { id: 'iftar',           label: '🌙 Iftar'          },
  { id: 'bakino',          label: '👵 Bakino'         },
  { id: 'svecano',         label: '✨ Svečano'        },
  { id: 'ekonomicno',      label: '💰 Ekonomično'     },
];

// ─── Category config ──────────────────────────────────────────────────────────

const KATEGORIJE = [
  { id: 'Sve',        emoji: '✨' },
  { id: 'Peciva',     emoji: '🥐' },
  { id: 'Tjestenine', emoji: '🍝' },
  { id: 'Salate',     emoji: '🥗' },
  { id: 'Kolači',     emoji: '🍰' },
  { id: 'Pite',       emoji: '🥧' },
  { id: 'Lonci',      emoji: '🍲' },
  { id: 'Hljeb',      emoji: '🍞' },
  { id: 'Meso',       emoji: '🍖' },
  { id: 'Deserti',    emoji: '🍮' },
];

// ─── Season config ────────────────────────────────────────────────────────────

const SEZONE = [
  { id: 'prolj' as Sezona, label: 'Proljeće', emoji: '🌸', cls: styles.sezonaProlj },
  { id: 'ljeto' as Sezona, label: 'Ljeto',    emoji: '☀️', cls: styles.sezonaLjeto },
  { id: 'jesen' as Sezona, label: 'Jesen',    emoji: '🍂', cls: styles.sezonaJesen },
  { id: 'zima'  as Sezona, label: 'Zima',     emoji: '❄️', cls: styles.sezonaZima  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendingCard({ recept, index }: { recept: Recept; index: number }) {
  return (
    <div
      className={styles.trendingCard}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className={styles.fireBadge}>🔥</div>
      <div className={styles.tcImg}>{recept.emoji}</div>
      <div className={styles.tcBody}>
        <span className={styles.tcBadge}>{recept.kategorija}</span>
        <div className={styles.tcNaziv}>{recept.naziv}</div>
        <div className={styles.tcMeta}>
          <span>⏱ {recept.vrijeme}</span>
          <span>⭐ {recept.tezina}</span>
        </div>
        <button className={styles.tcCta}>Pogledaj →</button>
      </div>
    </div>
  );
}

function NoviCard({ recept }: { recept: Recept }) {
  return (
    <div className={styles.noviCard}>
      <div className={styles.noviThumb}>{recept.emoji}</div>
      <div className={styles.noviInfo}>
        <div className={styles.noviNaziv}>{recept.naziv}</div>
        <div className={styles.noviOpis}>{recept.opis}</div>
        <div className={styles.noviMeta}>⏱ {recept.vrijeme} · {recept.tezina}</div>
      </div>
    </div>
  );
}

function ReceptCard({ recept, index }: { recept: Recept; index: number }) {
  return (
    <div
      className={styles.receptCard}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className={styles.rcImg}>
        <span className={styles.rcEmoji}>{recept.emoji}</span>
        <span className={styles.rcKatBadge}>{recept.kategorija}</span>
        {recept.ramazan && (
          <span className={styles.rcRamBadge}>🌙 Ramazan</span>
        )}
      </div>
      <div className={styles.rcBody}>
        <div className={styles.rcNaziv}>{recept.naziv}</div>
        <div className={styles.rcOpis}>{recept.opis}</div>
        <div className={styles.rcMeta}>
          <span>⏱ {recept.vrijeme}</span>
          <span>⭐ {recept.tezina}</span>
        </div>
        <button className={styles.rcCta}>Pogledaj recept →</button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReceptiPage() {
  const [activeKat, setActiveKat] = useState<string>('Sve');
  const [activeSeason, setActiveSeason] = useState<Sezona | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [mainTitle, setMainTitle] = useState('📖 Svi recepti');
  const sugTimeout = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [sugPos, setSugPos] = useState({ top: 0, left: 0, width: 0 });
  const searchRingRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter logic
  const filteredRecepti = useMemo(() => {
    return RECEPTI.filter((r) => {
      if (activeKat !== 'Sve' && r.kategorija !== activeKat) return false;
      if (activePlaylist && r.playlist !== activePlaylist) return false;
      if (activeSeason && !r.sezona.includes(activeSeason) && !r.sezona.includes('sve')) return false;
      if (activeTags.length > 0 && !activeTags.some((t) => r.tags.includes(t))) return false;
      if (searchValue) {
        const q = searchValue.toLowerCase();
        const match =
          r.naziv.toLowerCase().includes(q) ||
          r.opis.toLowerCase().includes(q) ||
          r.kategorija.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [activeKat, activeSeason, activeTags, searchValue, activePlaylist]);

  const trendingRecepti = useMemo(() => RECEPTI.filter((r) => r.trending).slice(0, 6), []);
  const noviRecepti = useMemo(() => RECEPTI.filter((r) => r.novi).slice(0, 4), []);

  function handleKat(kat: string) {
    setActiveKat(kat);
    setActivePlaylist(null);
    setMainTitle(kat === 'Sve' ? '📖 Svi recepti' : `📖 ${kat}`);
  }

  function handlePlaylist(pl: Playlist, naziv: string) {
    setActivePlaylist(pl);
    setActiveKat('Sve');
    setMainTitle(`🎬 Playlist: ${naziv}`);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  function handleSeason(s: Sezona) {
    setActiveSeason((prev) => (prev === s ? null : s));
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleRamazanPill(tip: string) {
    if (tip === 'ramazan') { setActiveTags(['ramazan']); setActiveKat('Sve'); }
    else if (tip === 'iftar') { setActiveTags(['iftar']); setActiveKat('Sve'); }
    else if (tip === 'sehur') { setActiveTags(['sehur']); setActiveKat('Sve'); }
    else if (tip === 'slatkisi') { setActiveTags(['ramazan']); setActiveKat('Deserti'); }
    setMainTitle('🌙 Ramazan recepti');
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  function handleSearch(v: string) {
    setSearchValue(v);
  }

  function clearSearch() {
    setSearchValue('');
  }

  function pickSuggestion(v: string) {
    setSearchValue(v);
    setSuggestionsOpen(false);
  }

  function openSug() {
    if (searchRingRef.current) {
      const rect = searchRingRef.current.getBoundingClientRect();
      setSugPos({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    if (sugTimeout.current) clearTimeout(sugTimeout.current);
    setSuggestionsOpen(true);
  }

  function closeSug() {
    sugTimeout.current = setTimeout(() => setSuggestionsOpen(false), 160);
  }

  useEffect(() => {
    return () => {
      if (sugTimeout.current) clearTimeout(sugTimeout.current);
    };
  }, []);

  return (
    <main className={styles.main}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />

        <Image
          src="/logo2.png"
          alt="Moj Kutak logo"
          width={80}
          height={80}
          className={styles.heroLogo}
          priority
        />

        <h1 className={styles.heroTitle}>
          Moj <em>Kutak</em><br />Recepti
        </h1>
        <p className={styles.heroSub}>
          Recepti naših nana i baka — s ljubavlju za vaš sto ✨
        </p>

        {/* Search */}
        <div className={styles.searchUniverse}>
          <span className={styles.bubble1} />
          <span className={styles.bubble2} />
          <span className={styles.bubble3} />
          <span className={styles.bubble4} />

          <div className={styles.searchTrack}>
            <div ref={searchRingRef} className={`${styles.searchRing} ${suggestionsOpen ? styles.searchRingFocus : ''}`}>
              <div className={styles.searchInner}>
                <div className={styles.searchIconWrap}>
                  <div className={`${styles.searchIconBg} ${suggestionsOpen ? styles.searchIconBgVisible : ''}`} />
                  <svg
                    className={`${styles.searchIconSvg} ${suggestionsOpen ? styles.searchIconSvgActive : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                </div>

                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Pretraži recepte... npr. pita, kolač, čorba"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={openSug}
                  onBlur={closeSug}
                />

                <button
                  className={`${styles.searchClear} ${searchValue ? styles.searchClearVisible : ''}`}
                  onClick={clearSearch}
                  type="button"
                >
                  ✕
                </button>

                <button className={styles.searchBtn} type="button">
                  Traži
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div className={styles.wavy}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path
            d="M0,40 C150,10 350,60 600,30 C850,0 1050,50 1200,25 L1200,60 L0,60 Z"
            fill="rgba(255,253,245,0.45)"
          />
        </svg>
      </div>

      {/* ── CONTAINER ────────────────────────────────────── */}
      <div className={styles.container}>

        {/* ── RAMAZAN BANNER ───────────────────────────────── */}
        <div className={styles.ramazanBanner}>
          <div className={styles.ramazanStars}>
            <span className={styles.rStar1}>☪</span>
            <span className={styles.rStar2}>★</span>
            <span className={styles.rStar3}>✦</span>
            <span className={styles.rStar4}>☪</span>
            <span className={styles.rStar5}>✦</span>
          </div>
          <div className={styles.ramazanInner}>
            <div className={styles.ramazanIcon}>🌙</div>
            <div className={styles.ramazanText}>
              <h2 className={styles.ramazanTitle}>Ramazan Mubarak ✨</h2>
              <p className={styles.ramazanSub}>
                Posebna selekcija recepata za iftar i sehur — obroci s dušom, pripremljeni s ljubavlju
              </p>
              <div className={styles.ramazanPills}>
                {[
                  { id: 'ramazan',   label: 'Svi Ramazan recepti' },
                  { id: 'iftar',     label: 'Iftar sofre' },
                  { id: 'sehur',     label: 'Sehur obroci' },
                  { id: 'slatkisi',  label: 'Ramazan slatkiši' },
                ].map((p) => (
                  <button
                    key={p.id}
                    className={`${styles.ramazanPill} ${activeTags.includes(p.id) ? styles.ramazanPillActive : ''}`}
                    onClick={() => handleRamazanPill(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PLAYLISTE ────────────────────────────────────── */}
        <h2 className={styles.secTitle}>
          🎬 Playliste
          <span className={styles.secBadge}>VIDEO RECEPTI</span>
        </h2>
        <div className={styles.playlistScroll}>
          {PLAYLISTE.map((pl, i) => (
            <div
              key={pl.id}
              className={styles.plCard}
              style={{ background: pl.gradient, animationDelay: `${i * 0.06}s` }}
              onClick={() => handlePlaylist(pl.id, pl.naziv)}
            >
              <div className={styles.plIcon}>{pl.emoji}</div>
              <div className={styles.plNaziv}>{pl.naziv}</div>
              <div className={styles.plBroj}>{pl.broj}</div>
            </div>
          ))}
        </div>

        {/* ── SEZONE ───────────────────────────────────────── */}
        <h2 className={styles.secTitle}>🍃 Sezonski recepti</h2>
        <div className={styles.sezonBar}>
          {SEZONE.map((s) => (
            <button
              key={s.id}
              className={`${styles.sezonPill} ${s.cls} ${activeSeason === s.id ? styles.sezonPillActive : ''}`}
              onClick={() => handleSeason(s.id)}
            >
              <span className={styles.sezonIcon}>{s.emoji}</span>
              {s.label}
            </button>
          ))}
          <button
            className={`${styles.sezonPill} ${activeSeason === null ? styles.sezonPillActive : ''}`}
            onClick={() => setActiveSeason(null)}
          >
            <span className={styles.sezonIcon}>🍽️</span>
            Sve sezone
          </button>
        </div>

        {/* ── FILTER KATEGORIJE ────────────────────────────── */}
        <div className={styles.filterRow}>
          {KATEGORIJE.map((k) => (
            <button
              key={k.id}
              className={`${styles.fpill} ${activeKat === k.id ? styles.fpillActive : ''}`}
              onClick={() => handleKat(k.id)}
            >
              <span className={styles.fpillIcon}>{k.emoji}</span>
              {k.id}
            </button>
          ))}
        </div>

        {/* ── TAG CLOUD ────────────────────────────────────── */}
        <div className={styles.tagLabel}>🏷️ Tagovi</div>
        <div className={styles.tagCloud}>
          {TAGS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tag} ${activeTags.includes(t.id) ? styles.tagActive : ''}`}
              onClick={() => toggleTag(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TRENDING ─────────────────────────────────────── */}
        <h2 className={styles.secTitle}>
          🔥 Trending ove sedmice
          <span className={styles.secBadge}>HOT</span>
        </h2>
        <div className={styles.trendingGrid}>
          {trendingRecepti.map((r, i) => (
            <TrendingCard key={r.id} recept={r} index={i} />
          ))}
        </div>

        {/* ── NOVI ─────────────────────────────────────────── */}
        <h2 className={styles.secTitle}>🆕 Najnoviji recepti</h2>
        <div className={styles.noviGrid}>
          {noviRecepti.map((r) => (
            <NoviCard key={r.id} recept={r} />
          ))}
        </div>

        {/* ── GLAVNI GRID ──────────────────────────────────── */}
        <div ref={gridRef}>
          {filteredRecepti.length > 0 && (
            <p className={styles.countLabel}>
              Prikazano: {filteredRecepti.length} recepata
            </p>
          )}
          <h2 className={styles.secTitle}>{mainTitle}</h2>

          {filteredRecepti.length === 0 ? (
            <div className={styles.noResults}>
              😔 Nema recepata za ovaj filter. Pokušajte nešto drugo!
            </div>
          ) : (
            <div className={styles.receptGrid}>
              {filteredRecepti.map((r, i) => (
                <ReceptCard key={r.id} recept={r} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>

      {mounted && suggestionsOpen && createPortal(
        <div
          style={{
            position: 'absolute',
            top: sugPos.top,
            left: sugPos.left,
            width: sugPos.width,
            zIndex: 99999,
            background: 'rgba(255,253,245,0.97)',
            backdropFilter: 'blur(20px)',
            borderRadius: '22px',
            border: '2px solid rgba(110,185,220,0.25)',
            boxShadow: '0 16px 48px rgba(42,111,154,0.14)',
            overflow: 'hidden',
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          <div style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.08em', color:'#3a8bc0', padding:'12px 18px 6px', textTransform:'uppercase' }}>
            Popularni recepti
          </div>
          {[
            { e: '🥧', n: 'Pita sa sirom',      sub: 'Pite · 60 min'     },
            { e: '🍩', n: 'Krofne sa pekmezom', sub: 'Deserti · 80 min'  },
            { e: '🍲', n: 'Begova čorba',       sub: 'Lonci · 90 min'    },
          ].map((s) => (
            <div
              key={s.n}
              onMouseDown={() => pickSuggestion(s.n)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 18px', cursor:'pointer', fontSize:'0.88rem', color:'#3d2b1f' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(110,185,220,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background='transparent')}
            >
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#e4f3fb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>
                {s.e}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#1a3e5c' }}>{s.n}</div>
                <div style={{ fontSize:'0.73rem', color:'#7a5c4f' }}>{s.sub}</div>
              </div>
            </div>
          ))}
          <div style={{ height:1, background:'rgba(110,185,220,0.15)', margin:'4px 14px' }} />
          <div style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.08em', color:'#3a8bc0', padding:'12px 18px 6px', textTransform:'uppercase' }}>
            Brza pretraga po tagovima
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'8px 18px 13px' }}>
            {['⚡ Brzo','🌙 Ramazan','🇧🇦 Bosanski','💚 Zdravo','👵 Bakino'].map((t) => (
              <span
                key={t}
                onMouseDown={() => pickSuggestion(t.split(' ').slice(1).join(' ').toLowerCase())}
                style={{ background:'rgba(110,185,220,0.12)', border:'1.5px solid rgba(110,185,220,0.28)', color:'#2a6f9a', fontSize:'0.74rem', fontWeight:700, padding:'4px 12px', borderRadius:'999px', cursor:'pointer' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
