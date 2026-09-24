import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { FacebookIcon, InstagramIcon, MailIcon, TiktokIcon, YoutubeIcon } from "./Icons";
import styles from "./Footer.module.css";

const stranice = [
  { label: "Početna", href: "/" },
  { label: "Svi recepti", href: "/recepti" },
  { label: "Trending", href: "/trending" },
  { label: "O meni", href: "/o-meni" },
];

const drustvene = [
  { label: "YouTube", href: SITE.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: SITE.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: SITE.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: SITE.tiktok, Icon: TiktokIcon },
];

const josKanala = [
  { label: "YouTube: Kuhinja Recepti", href: SITE.youtubeKuhinja },
  { label: "Pletivo na YouTubeu", href: SITE.youtubePletivo },
  { label: `Pletenje na Instagramu`, href: SITE.instagramPletenje },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo2.png" alt="" width={40} height={40} />
            <span>Moj Kutak</span>
          </Link>
          <p>{SITE.description}</p>
          <div className={styles.socials}>
            {drustvene.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={20} />
              </a>
            ))}
            <a href={`mailto:${SITE.email}`} aria-label="Email">
              <MailIcon size={20} />
            </a>
          </div>
        </div>

        <nav className={styles.col} aria-label="Stranice">
          <h2>Stranice</h2>
          {stranice.map(({ label, href }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Još kanala">
          <h2>Još kanala</h2>
          {josKanala.map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </nav>

        <div className={styles.col}>
          <h2>Kontakt</h2>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <p className={styles.note}>Za saradnju i pitanja o receptima.</p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Moj Kutak. Sva prava zadržana.</span>
        <Link href="/privatnost">Politika privatnosti</Link>
      </div>
    </footer>
  );
}
