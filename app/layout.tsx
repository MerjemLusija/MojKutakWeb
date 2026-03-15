import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";
import NewsletterForm from "./components/NewsletterForm";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Moj Kutak - Kulinarski Blog & YouTube Kanal",
  description:
    "Dobrodošli u Moj Kutak — mjesto gdje kuhanje postaje radost. Recepti iz srca, puni okusa i ljubavi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs">
      <body>
        {/* ─── Loading Screen ─── */}
        <LoadingScreen />

        {/* ─── STICKY PILL NAVBAR ─── */}
        <Header />

        {/* ─── PAGE CONTENT ─── */}
        {children}

        {/* ─── FOOTER ─── */}
        <footer className="mk-footer-wrapper">
          {/* Wavy SVG top border */}
          <div className="mk-footer-wave">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              style={{ display: "block", width: "100%", height: "80px" }}
            >
              <path
                d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z"
                fill="#C8E6F5"
              />
            </svg>
          </div>

          <div className="mk-footer-inner">
            {/* Logo */}
            <Link href="/" style={{ display: "inline-block", marginBottom: "28px" }}>
              <Image
                src="/logo2.png"
                alt="Moj Kutak"
                width={110}
                height={110}
                style={{ objectFit: "contain", margin: "0 auto" }}
              />
            </Link>

            {/* Nav links */}
            <div className="mk-footer-links">
              {["Početna", "Recepti", "O Meni", "Trending", "Kontakt"].map(
                (item) => (
                  <Link key={item} href="#" className="mk-footer-link">
                    {item}
                  </Link>
                )
              )}
            </div>

            {/* Social icons */}
            <div className="mk-footer-socials">
              {/* Instagram */}
              <button className="mk-social-btn" aria-label="Instagram">
                📸
              </button>
              {/* YouTube */}
              <button className="mk-social-btn" aria-label="YouTube">
                ▶️
              </button>
              {/* Pinterest */}
              <button className="mk-social-btn" aria-label="Pinterest">
                📌
              </button>
              {/* TikTok */}
              <button className="mk-social-btn" aria-label="TikTok">
                🎵
              </button>
            </div>

            {/* Newsletter — Client Component to allow event handlers */}
            <NewsletterForm />

            {/* Copyright */}
            <p className="mk-footer-copy">
              © {new Date().getFullYear()} Moj Kutak. Sva prava pridržana.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
