"use client";

import Image from "next/image";
import styles from "./kontakt.module.css";

export default function KontaktPage() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.contentWrap}>
        {/* ════════════════════════════════════════
            SECTION 1 — HERO SPLIT
            ════════════════════════════════════════ */}
        <section className={styles.hero}>
          {/* Left — Badge Frame */}
          <div className={styles.badgeFrame}>

            {/* Circle image container */}
            <div className={styles.badgeInner}>
              {/* Next.js Image — falls back to emoji placeholder */}
              <Image
                src="/profile.jpg"
                alt="Ismira — Moj Kutak"
                width={260}
                height={260}
                className={styles.profileImg}
                onError={(e) => {
                  // Hide broken image and show placeholder
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
              <div
                className={styles.profilePlaceholder}
                style={{ display: "none", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
              >
                👩‍🍳
              </div>

            </div>

            {/* Stars */}
            <div className={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>

            {/* Floating deco */}
            <span
              className={styles.floatDeco}
              style={{ top: 10, right: 28, fontSize: 26, animationDuration: "3s" }}
            >
              🥄
            </span>
            <span
              className={styles.floatDeco}
              style={{ bottom: 30, left: 10, fontSize: 22, animationDuration: "4.2s", animationDelay: "0.8s" }}
            >
              ✦
            </span>
            <span
              className={styles.floatDeco}
              style={{ top: 60, left: 0, fontSize: 18, animationDuration: "3.8s", animationDelay: "0.4s" }}
            >
              🌿
            </span>
          </div>

          {/* Right — Text */}
          <div className={styles.heroText}>
            {/* Badge pill */}
            <div className={styles.badgePill}>
              <span className={styles.badgePillText}>🏆 Dobrodošli u Moj Kutak</span>
            </div>

            {/* Title */}
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine1}>Ja sam Ismira</span>
              i ovo je moj
              <span className={styles.heroTitleLine3}>omiljeni kutak</span>
            </h1>

            {/* Paragraph */}
            <p className={styles.heroParagraph}>
              Volim hranu koja priča priče — o bakinom stolu, o nedjeljnim ručkovima,
              o mirisima koji te odmah vrate kući. Ovdje dijelim sve to s tobom,
              s puno ljubavi i malo brašna na rukama. 🤍
            </p>

            {/* Dashed divider */}
            <div className={styles.dashedDivider}>
              <span className={styles.dividerEmoji}>🍂</span>
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statNum}>120</div>
                <div className={styles.statLbl}>Recepata</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>50k</div>
                <div className={styles.statLbl}>Pratitelja</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNum}>5 ★</div>
                <div className={styles.statLbl}>Ocjena</div>
              </div>
            </div>

            {/* CTA */}
            <a href="#kontakt" className={styles.btnNapisi}>
              <span className={styles.btnText}>✉️ Napiši mi →</span>
            </a>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — WAVE BREAK DIVIDER
            ════════════════════════════════════════ */}
        <div className={styles.waveBreak}>
          <div className={styles.waveLine} />
          <div className={styles.waveBadge}>
            <span className={styles.waveBadgeText}>MOJA PRIČA</span>
          </div>
          <div className={styles.waveLine} />
        </div>

        {/* ════════════════════════════════════════
            SECTION 3 — PRIČA GRID
            ════════════════════════════════════════ */}
        <section className={styles.pricaGrid}>
          {/* Card 1 — Blue top */}
          <div className={`${styles.pricaCard} ${styles.blueTop}`}>
            <div className={styles.pricaContent}>
              <span className={styles.eyebrow}>✦ Kako je sve počelo</span>
              <h2 className={styles.pricaTitle}>
                Sve je počelo u <em>bakinoj kuhinji</em>
              </h2>
              <p className={styles.pricaBody}>
                Odrasla sam uz miris svježe pečenog hljeba i lonaca koji su tiho krčkali
                na šporetu. Moja baka me naučila da kuhanje nije samo hranjenje tijela — to je način
                da kažeš &quot;volim te&quot; bez da izgovoriš ni jednu riječ. Završila sam prehrambenu
                tehnologiju, ali srce me uvijek vuklo natrag — pred ringle, pred bijeli papir
                na kojem nastaju recepti.
              </p>
              <div className={styles.quoteBlock}>
                <p className={styles.quoteText}>
                  &ldquo;Svako jelo koje napravim nosi komadić sjećanja koji je oduvijek bio tu.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Gold top */}
          <div className={`${styles.pricaCard} ${styles.goldTop}`}>
            <div className={styles.pricaContent}>
              <span className={styles.eyebrow}>🏆 Zašto Moj Kutak</span>
              <h2 className={styles.pricaTitle}>
                Mjesto gdje se <em>hrana osjeća</em>
              </h2>
              <p className={styles.pricaBody}>
                Nisam profesionalni kuhar. Ja sam osoba koja iskreno voli kuhati — uz muziku,
                ponekad uz malo nereda, uvijek uz puno entuzijazma. Moj Kutak je nastao iz potrebe
                da podijelim ono što me ispunjava: recepti koji su jednostavni ali puni karaktera,
                savjeti iz iskustva, i razgovor koji se ne završava dok se tanjir ne isprazni.
              </p>
              <div className={styles.quoteBlock}>
                <p className={styles.quoteText}>
                  &ldquo;Svaki tjedan novi recept, svaki recept nova avantura.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — SPECIJALITETI
            ════════════════════════════════════════ */}
        <section className={styles.specSection}>
          <div className={styles.specHeader}>
            <div className={styles.specStarburst} />
            <h2 className={styles.specTitle}>
              Moji <em>omiljeni</em> specijaliteti
            </h2>
            <p className={styles.specSubtitle}>Jela koja uvijek vraćaju osmijeh 🌟</p>
          </div>

          <div className={styles.specGrid}>
            {[
              { emoji: "🥐", name: "Kroasani", desc: "Lagani, hrskavi, savršeno lisnatih tijesta. Tri dana rada, jedan sekund sreće.", tag: "Pečenje" },
              { emoji: "🍝", name: "Tjestenine", desc: "Jednostavne, brze, uvijek dobre. Od karbonare do domaćeg sousa.", tag: "Talijanska" },
              { emoji: "🍰", name: "Kolači", desc: "Cheesecake, tarte, tiramisu — sve što nedjelju čini posebnom.", tag: "Deserti" },
              { emoji: "🥗", name: "Svježe salate", desc: "Zdrave ali nikad dosadne. Puni okusi i boja na jednom tanjiru.", tag: "Zdravo" },
              { emoji: "🍲", name: "Domaći lonci", desc: "Čorba, varivo, gulaš. Jela koja griju iznutra i podsjećaju na dom.", tag: "Comfort food" },
              { emoji: "🫓", name: "Svježi hljeb", desc: "Ništa ne miriše kao svježe pečen hljeb. Naučit ćeš i ti za 30 minuta.", tag: "Pečenje" },
            ].map((item, i) => (
              <div key={i} className={styles.specCard}>
                <span className={styles.specEmoji}>{item.emoji}</span>
                <div className={styles.specName}>{item.name}</div>
                <p className={styles.specDesc}>{item.desc}</p>
                <span className={styles.specTag}>{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — KONTAKT / POVEŽIMO SE
            ════════════════════════════════════════ */}
        <section id="kontakt" className={styles.kontakt}>
          <div className={styles.kontaktCard}>
            <div className={styles.kontaktContent}>
              {/* Logo */}
              <Image
                src="/logo2.png"
                width={80}
                height={80}
                alt="Moj Kutak"
                style={{ margin: "0 auto 20px" }}
              />

              <h2 className={styles.kontaktTitle}>
                Povežimo <em>se</em>
              </h2>
              <p className={styles.kontaktSubtitle}>
                Imaš pitanje o receptu, ideju za saradnju, ili samo želiš pozdraviti?
                Pronađi me na tvojoj omiljenoj platformi — uvijek sam tu! 🤍
              </p>

              {/* Social grid */}
              <div className={styles.socialGrid}>
                <a
                  href="https://instagram.com/mojkutak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socLink} ${styles.socInstagram}`}
                >
                  <span className={styles.socIcon}>📸</span>
                  <div className={styles.socInfo}>
                    <span className={styles.socName}>Instagram</span>
                    <span className={styles.socHandle}>@mojkutak</span>
                  </div>
                </a>

                <a
                  href="https://tiktok.com/@mojkutak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socLink} ${styles.socTiktok}`}
                >
                  <span className={styles.socIcon}>🎵</span>
                  <div className={styles.socInfo}>
                    <span className={styles.socName}>TikTok</span>
                    <span className={styles.socHandle}>@mojkutak</span>
                  </div>
                </a>

                <a
                  href="https://youtube.com/@mojkutak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socLink} ${styles.socYoutube}`}
                >
                  <span className={styles.socIcon}>▶️</span>
                  <div className={styles.socInfo}>
                    <span className={styles.socName}>YouTube</span>
                    <span className={styles.socHandle}>Moj Kutak</span>
                  </div>
                </a>

                <a
                  href="mailto:ismira@mojkutak.ba"
                  className={`${styles.socLink} ${styles.socEmail}`}
                >
                  <span className={styles.socIcon}>✉️</span>
                  <div className={styles.socInfo}>
                    <span className={styles.socName}>Email</span>
                    <span className={styles.socHandle}>ismira@mojkutak.ba</span>
                  </div>
                </a>
              </div>

              <p className={styles.footerNote}>
                Odgovaram u roku od 24h — obećavam!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}