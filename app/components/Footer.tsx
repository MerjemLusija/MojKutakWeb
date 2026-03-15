"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      {/* Ambient glow blobs */}
      <div className={styles.glow1} aria-hidden="true" />
      <div className={styles.glow2} aria-hidden="true" />
      <div className={styles.glow3} aria-hidden="true" />

      {/* SVG Wave at top */}
      <div className={styles.wave} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,0 L0,0 Z"
            fill="rgba(255,255,255,0.07)"
          />
        </svg>
      </div>

      {/* ── Welcome strip ── */}
      <div className={styles.welcome}>
        <Image
          src="/logo2.png"
          alt="Moj Kutak logo"
          width={72}
          height={72}
          className={styles.logo}
        />
        <h2 className={styles.welcomeTitle}>
          Drago nam je što ste ovdje,{" "}
          <em>dobrodošli kući 🏡</em>
        </h2>
        <p className={styles.welcomeText}>
          Svaki put kad otvorite Moj Kutak, nadamo se da osjetite onaj miris
          kafe i domaćeg kolača — kao da sjedite u našoj kuhinji i listamo
          recepte zajedno.
        </p>
      </div>

      {/* ── Gold divider ── */}
      <div className={styles.divider} aria-hidden="true">
        <div className={styles.dividerLine} />
        <span className={styles.dividerStar}>✦</span>
        <div className={styles.dividerLine} />
      </div>

      {/* ── Main 4-column grid ── */}
      <div className={styles.grid}>
        {/* Column 1 — Brand */}
        <div className={styles.col}>
          <p className={styles.brandDesc}>
            Moj Kutak je mjesto gdje se recepti pretvaraju u uspomene. Svaki
            zalogaj nosi priču — o toplini doma, o ljubavi prema hrani i o
            radosti dijeljenja tih trenutaka s vama.
          </p>
          <div className={styles.socials}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
              aria-label="Instagram"
            >
              📸 Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
              aria-label="TikTok"
            >
              🎵 TikTok
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
              aria-label="YouTube"
            >
              ▶️ YouTube
            </a>
            <a
              href="mailto:ismira@mojkutak.ba"
              className={styles.pill}
              aria-label="Email"
            >
              ✉️ Email
            </a>
          </div>
        </div>

        {/* Column 2 — Stranice */}
        <div className={styles.col}>
          <p className={styles.colTitle}>
            <span className={styles.colDot}>●</span> Stranice
          </p>
          <nav>
            {[
              { label: "Početna", href: "/" },
              { label: "O Meni", href: "/#o-meni" },
              { label: "Recepti", href: "/katalog" },
              { label: "Trending", href: "/#trending" },
              { label: "Kontakt", href: "/kontakt" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className={styles.navLink}>
                {label}
                <span className={styles.navArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 3 — Kategorije */}
        <div className={styles.col}>
          <p className={styles.colTitle}>
            <span className={styles.colDot}>●</span> Kategorije
          </p>
          <nav>
            {[
              { label: "🥐 Peciva", href: "/katalog?kat=peciva" },
              { label: "🍝 Tjestenine", href: "/katalog?kat=tjestenine" },
              { label: "🥗 Salate", href: "/katalog?kat=salate" },
              { label: "🍰 Kolači", href: "/katalog?kat=kolaci" },
              { label: "🍲 Lonci", href: "/katalog?kat=lonci" },
              { label: "🍞 Hljeb", href: "/katalog?kat=hljeb" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className={styles.navLink}>
                {label}
                <span className={styles.navArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 4 — Ostalo + Napišite nam */}
        <div className={styles.col}>
          <p className={styles.colTitle}>
            <span className={styles.colDot}>●</span> Ostalo
          </p>
          <nav>
            {[
              { label: "Politika privatnosti", href: "/privatnost" },
              { label: "Uslovi korištenja", href: "/uslovi" },
              { label: "Saradnja", href: "/kontakt#saradnja" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className={styles.navLink}>
                {label}
                <span className={styles.navArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>

          <p className={`${styles.colTitle} ${styles.colTitleSpaced}`}>
            <span className={styles.colDot}>●</span> Napišite nam
          </p>
          <a
            href="mailto:ismira@mojkutak.ba"
            className={styles.emailLink}
          >
            ismira@mojkutak.ba
          </a>
          <p className={styles.replyNote}>Odgovaramo u roku od 24h 🌸</p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © 2026{" "}
            <span className={styles.goldName}>Moj Kutak</span> — Sva prava
            pridržana.
          </span>
          <span className={styles.madeWith}>
            Napravljeno s{" "}
            <span className={styles.heart} aria-hidden="true">♥</span>{" "}
            od Ismire, u Bosni
          </span>
          <button
            className={styles.scrollTop}
            onClick={scrollToTop}
            aria-label="Vrati se gore"
          >
            Vrati se gore ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
