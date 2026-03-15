"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

/* ─── Scroll Reveal Hook ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── DATA ───────────────────────────────────────────────────── */

const recipes = [
  {
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    tag: "🍰 Deserti",
    title: "Čokoladna Torta sa Kremom",
    quote: '"Savršena za posebne prilike!"',
    time: "60 min",
    level: "Srednje",
  },
  {
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    tag: "🍅 Glavna jela",
    title: "Domaća Tjestenina",
    quote: '"Uvijek hit kod gostiju!"',
    time: "45 min",
    level: "Lako",
  },
  {
    img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=800&auto=format&fit=crop",
    tag: "🥐 Pecivo",
    title: "Jagodna Tarta",
    quote: '"Moj osobni favorit!"',
    time: "90 min",
    level: "Napredno",
  },
];

const videos = [
  {
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    title: "Savršeni Kroasani od Nule",
    views: "42k pregleda",
    when: "prije 3 dana",
    duration: "18:42",
  },
  {
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    title: "Domaći Kruh koji Svaki Put Uspije",
    views: "68k pregleda",
    when: "prije tjedan dana",
    duration: "24:15",
  },
  {
    img: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800&auto=format&fit=crop",
    title: "Zimska Juha od Bundeve",
    views: "31k pregleda",
    when: "prije 2 tjedna",
    duration: "14:58",
  },
];

const infoCards = [
  { icon: "🍕", label: "Omiljena kuhinja", value: "Talijanska" },
  { icon: "☕", label: "Jutro počinje s", value: "Cappuccinom" },
  { icon: "📚", label: "Kuharska knjiga", value: "Julia Child" },
  { icon: "🌿", label: "Hobi", value: "Bilje & cvijeće" },
];

const tools = [
  { icon: "🍲", name: "Lonac za kuhanje", sub: "Le Creuset 28cm" },
  { icon: "🔪", name: "Japanski nož", sub: "Santoku 18cm" },
  { icon: "🥄", name: "Silikonska lopatica", sub: "OXO Good Grips" },
  { icon: "⚖️", name: "Digitalna vaga", sub: "Preciznost do 1g" },
  { icon: "🫙", name: "Mixer", sub: "KitchenAid Artisan" },
  { icon: "🌡️", name: "Termometar", sub: "Instant-read" },
];

const seasonal = [
  {
    img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1200&auto=format&fit=crop",
    badge: "🌞 Sezona Ljeto",
    title: "Frešk Rajčica Salata",
    desc: "Ukusi Mediterana u jednoj zdjeli — rajčice, bosiljak, maslinovo ulje.",
  },
  {
    img: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=1200&auto=format&fit=crop",
    badge: "🍂 Sezona Jesen",
    title: "Panirani Pileći Medaljoni",
    desc: "Hrskavi izvana, sočni iznutra — savršen obrok za cijelu obitelj.",
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function Home() {
  useScrollReveal();

  return (
    <main>

      {/* ══════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="mk-hero" id="pocetna">
        {/* ── Left side ── */}
        <div className="mk-hero-left reveal reveal-left">
          {/* Welcome Badge */}
          <div className="mk-badge-yellow">
            <span>🍳</span> Dobrodošli u moju kuhinju
          </div>

          {/* Main Heading */}
          <h1 className="mk-hero-title">
            Dobrodošli u{" "}
            <em>Moj<br />Kutak</em>
          </h1>

          {/* Subtitle */}
          <p className="mk-hero-subtitle">
            Mjesto gdje kuhanje postaje radost. Recepti iz srca, puni okusa i
            ljubavi — za sve koji vole jesti dobro i živjeti slatko. 🍓
          </p>

          {/* CTA Buttons */}
          <div className="mk-hero-actions">
            <button className="btn-cta">
              Istraži Recepte 🍴
            </button>
            <button className="btn-ghost">
              O Meni →
            </button>
          </div>

          {/* Stats */}
          <div className="mk-hero-stats">
            <div>
              <div className="mk-stat-num">120</div>
              <div className="mk-stat-label">Recepata</div>
            </div>
            <div>
              <div className="mk-stat-num">50k</div>
              <div className="mk-stat-label">Pratitelja</div>
            </div>
            <div>
              <div className="mk-stat-num">5 ⭐</div>
              <div className="mk-stat-label">Ocjena</div>
            </div>
          </div>
        </div>

        {/* ── Right side: oval image ── */}
        <div className="mk-hero-right reveal reveal-right">
          {/* Decorative floating stars */}
          <span
            className="mk-deco"
            style={{ top: "10%", left: "5%", fontSize: "22px", animationDelay: ".5s" }}
          >
            ✦
          </span>
          <span
            className="mk-deco"
            style={{ top: "30%", left: "0%", fontSize: "14px", color: "#4A9CC8", animationDelay: "1s" }}
          >
            +
          </span>
          <span
            className="mk-deco"
            style={{ bottom: "20%", left: "8%", fontSize: "20px", color: "#FBBF24", animationDelay: "1.5s" }}
          >
            ★
          </span>
          <span
            className="mk-deco"
            style={{ top: "8%", right: "5%", fontSize: "26px", color: "#4A9CC8", animationDelay: ".8s" }}
          >
            ♀
          </span>
          <span
            className="mk-deco"
            style={{ bottom: "15%", right: "2%", fontSize: "18px", color: "#FBBF24", animationDelay: "1.2s" }}
          >
            ★
          </span>

          {/* Oval Image */}
          <div className="mk-hero-oval">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=900&auto=format&fit=crop"
              alt="Moderna kuhinja"
              width={460}
              height={460}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority
            />
          </div>

          {/* Floating badge */}
          <div className="mk-float-badge">
            <div className="mk-float-badge-icon">🥐</div>
            <div>
              <div className="mk-float-badge-label">Novi recept</div>
              <div className="mk-float-badge-title">Kroasani danas!</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. NAJNOVIJI RECEPTI
      ══════════════════════════════════════════════ */}
      <section className="mk-section mk-section-center" id="recepti">
        <div className="reveal reveal-up">
          {/* Section badge */}
          <div className="mk-section-badge">
            <span>🍽️</span> Svježi recepti
          </div>
          <h2 className="mk-section-title">Najnoviji Recepti</h2>
          <p className="mk-section-subtitle">
            Svjež, ukusan, i spreman za vaš stol.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mk-recipes-grid">
          {recipes.map((r, i) => {
            // Per-card polaroid tilt angles and float delays
            const rotations  = [-2, 1.5, -1];
            const floatDelay = [0, 0.8, 1.5];
            return (
              /* Outer wrapper handles the scroll-reveal; inner card handles tilt+float */
              <div key={r.title} className="reveal reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <div
                  className="mk-recipe-card"
                  style={{
                    // Pass the tilt angle as a CSS custom property so @keyframes can use it
                    ["--card-rot" as string]: `${rotations[i]}deg`,
                    animationDelay: `${floatDelay[i]}s`,
                  }}
                >
                  {/* Recipe image */}
                  <Image
                    src={r.img}
                    alt={r.title}
                    width={400}
                    height={220}
                    className="mk-recipe-img"
                  />

                  {/* Card body */}
                  <div className="mk-recipe-body">
                    <div className="mk-tag">{r.tag}</div>
                    <h3 className="mk-recipe-title">{r.title}</h3>
                    <p className="mk-recipe-quote">{r.quote}</p>
                    <div className="mk-recipe-meta">
                      <span className="mk-recipe-meta-left">
                        <span>⏱</span> {r.time} &nbsp;·&nbsp; {r.level}
                      </span>
                      <a href="#" className="mk-recipe-link">Pogledaj →</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All recipes CTA */}
        <div className="reveal reveal-up">
          <button className="btn-outline-pill">
            Svi Recepti 🍽️
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. YOUTUBE SECTION
      ══════════════════════════════════════════════ */}
      <div className="mk-yt-wrapper" id="youtube">
        {/* Wavy top SVG */}
        <div className="mk-yt-wave">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "80px" }}
          >
            <path
              d="M0,0 C360,80 720,0 1080,60 C1260,90 1380,20 1440,40 L1440,0 Z"
              fill="#E8F4FD"
            />
          </svg>
        </div>

        <div className="mk-yt-inner">
          <div className="reveal reveal-up">
            <h2 className="mk-section-title">Gledajte &amp; Kuhajte</h2>
            <p className="mk-section-subtitle">
              Novi videozapis svaki tjedan — uključite obavijesti! 🔔
            </p>
          </div>

          {/* Video grid */}
          <div className="mk-yt-grid">
            {videos.map((v, i) => (
              <div
                key={v.title}
                className={`mk-yt-card reveal reveal-up`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="mk-yt-thumb">
                  <Image
                    src={v.img}
                    alt={v.title}
                    width={400}
                    height={200}
                    style={{ objectFit: "cover", width: "100%", height: "100%", filter: "brightness(0.75)" }}
                  />
                  {/* Play button */}
                  <div className="mk-yt-play">▶</div>
                  {/* Duration badge */}
                  <span className="mk-yt-duration">{v.duration}</span>
                </div>
                <div className="mk-yt-info">
                  <h4 className="mk-yt-title">{v.title}</h4>
                  <div className="mk-yt-meta">
                    <span style={{ color: "#4A9CC8", fontWeight: 600 }}>{v.views}</span>
                    <span>{v.when}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="reveal reveal-up">
            <button className="btn-yt">▶ Pretplatite se na YouTube</button>
          </div>
        </div>

        {/* Wavy bottom SVG — clouds/bumps effect */}
        <div className="mk-bottom-wave">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "80px" }}
          >
            <path
              d="M0,40 
                 C40,40 60,80 80,80 C100,80 120,40 160,40 
                 C200,40 220,80 240,80 C260,80 280,40 320,40 
                 C360,40 380,80 400,80 C420,80 440,40 480,40 
                 C520,40 540,80 560,80 C580,80 600,40 640,40 
                 C680,40 700,80 720,80 C740,80 760,40 800,40 
                 C840,40 860,80 880,80 C900,80 920,40 960,40 
                 C1000,40 1020,80 1040,80 C1060,80 1080,40 1120,40 
                 C1160,40 1180,80 1200,80 C1220,80 1240,40 1280,40 
                 C1320,40 1360,80 1400,80 C1420,80 1430,60 1440,40 
                 L1440,80 L0,80 Z"
              fill="#E8F4FD"
            />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          4. O MENI (ABOUT)
      ══════════════════════════════════════════════ */}
      <section className="mk-about" id="o-meni">
        {/* Left: portrait */}
        <div className="mk-about-left reveal reveal-left">
          {/* Decorative emoji accents */}
          <span
            className="mk-about-emoji"
            style={{ top: "-10px", right: "40px" }}
          >
            🍓
          </span>
          <span
            className="mk-about-emoji"
            style={{ bottom: "0px", left: "20px", animationDelay: ".8s" }}
          >
            🍓
          </span>

          <div className="mk-about-ring">
            <div className="mk-about-portrait">
              <Image
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop"
                alt="Ana - kuharica"
                width={300}
                height={300}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Floating badge */}
          <div className="mk-about-since">
            <span>👩‍🍳</span>
            <span>Kuha od<br /><strong>2018. godine</strong></span>
          </div>
        </div>

        {/* Right: bio text */}
        <div className="mk-about-right reveal reveal-right">
          <div className="mk-about-badge-label">
            <span>🌸</span> O Meni
          </div>

          <h2 className="mk-about-title">
            Zdravo, ja sam <span>Ana!</span>
          </h2>

          <p className="mk-about-bio">
            Strastvena sam kuhinjska entuzijastica koja vjeruje da svaki obrok
            može biti mali čin ljubavi. Moj kutak je prostor gdje dijelim
            recepte koje sam naučila od bake, i one koje sam sama otkrila u
            pustolovinama diljem Mediterana.
          </p>
          <p className="mk-about-bio">
            Kuhanje nije samo hranjenje tijela — to je priča, tradicija, i
            radost. Svaki tjedan ovdje objavljujem nove recepte, savjete i mali
            dio svog srca. 🍓
          </p>

          {/* Info grid */}
          <div className="mk-info-grid">
            {infoCards.map((c) => (
              <div key={c.label} className="mk-info-card">
                <div className="mk-info-icon">{c.icon}</div>
                <div className="mk-info-label">{c.label}</div>
                <div className="mk-info-value">{c.value}</div>
              </div>
            ))}
          </div>

          <button className="btn-blue-pill">Pročitaj više o meni →</button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. KUHINJSKI FAVORITI (TOOLS)
      ══════════════════════════════════════════════ */}
      <section className="mk-section mk-section-center" id="alati">
        <div className="reveal reveal-up">
          <div className="mk-section-badge">
            <span>⚙️</span> Moji Alati
          </div>
          <h2 className="mk-section-title">Kuhinjski Favoriti</h2>
          <p className="mk-section-subtitle" style={{ marginBottom: "36px" }}>
            Alati kojima vjerujem svaki dan.
          </p>
        </div>

        <div className="mk-tools-grid">
          {tools.map((t, i) => (
            <div
              key={t.name}
              className={`mk-tool-card reveal reveal-up`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="mk-tool-icon">{t.icon}</span>
              <div className="mk-tool-name">{t.name}</div>
              <div className="mk-tool-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. SEZONSKI FAVORITI
      ══════════════════════════════════════════════ */}
      <section className="mk-section mk-section-center" id="sezonski">
        <div className="reveal reveal-up">
          <div className="mk-section-badge">
            <span>🍃</span> Sezonski
          </div>
          <h2 className="mk-section-title">Sezonski Favoriti</h2>
          <p className="mk-section-subtitle">
            Svježe i u sezoni — zato su i{" "}
            <strong style={{ color: "var(--text-dark)" }}>najukusnije</strong>.
          </p>
        </div>

        <div className="mk-seasonal-grid">
          {seasonal.map((s, i) => (
            <div
              key={s.title}
              className={`mk-seasonal-card reveal ${i === 0 ? "reveal-left" : "reveal-right"}`}
            >
              <Image
                src={s.img}
                alt={s.title}
                fill
                className="mk-seasonal-img"
                style={{ objectFit: "cover" }}
              />
              <div className="mk-seasonal-overlay" />
              <div className="mk-seasonal-content">
                <div className="mk-seasonal-badge">{s.badge}</div>
                <h3 className="mk-seasonal-title">{s.title}</h3>
                <p className="mk-seasonal-desc">{s.desc}</p>
                <button className="btn-white-pill">Pogledaj recept →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
