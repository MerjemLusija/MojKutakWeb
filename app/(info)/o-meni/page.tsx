import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { InstagramIcon, MailIcon, TiktokIcon, YoutubeIcon } from "@/app/components/Icons";
import styles from "./o-meni.module.css";

export const metadata: Metadata = {
  title: "O meni",
  description: `Ko stoji iza Moj Kutak — ${SITE.author}, njena kuhinja i kako do nje doći.`,
  alternates: { canonical: "/o-meni" },
};

// PROVJERI: tekst priče je preuzet sa stare stranice — prilagodi ga svojim riječima.

const kanali = [
  { naziv: "YouTube", opis: "Video recepti svake sedmice", href: SITE.youtube, Icon: YoutubeIcon, cls: styles.yt },
  { naziv: "Instagram", opis: SITE.instagramHandle, href: SITE.instagram, Icon: InstagramIcon, cls: styles.ig },
  { naziv: "TikTok", opis: "Kratki recepti", href: SITE.tiktok, Icon: TiktokIcon, cls: styles.tt },
  { naziv: "Email", opis: SITE.email, href: `mailto:${SITE.email}`, Icon: MailIcon, cls: styles.mail },
];

export default function OMeniPage() {
  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.photo}>
          {/* Zamijeni pravom fotografijom: stavi npr. public/ismira.jpg i promijeni src */}
          <Image src="/logo2.png" alt={SITE.author} width={320} height={320} priority />
        </div>
        <div>
          <span className="eyebrow">O meni</span>
          <h1>Ja sam {SITE.author}, a ovo je moj kutak.</h1>
          <p className={styles.lead}>
            Volim hranu koja priča priče — o naninom stolu, o nedjeljnim ručkovima, o mirisima
            koji te odmah vrate kući. Ovdje dijelim sve to s vama, s puno pažnje i malo brašna
            na rukama.
          </p>
        </div>
      </section>

      <section className={styles.story}>
        <div>
          <h2>Sve je počelo u naninoj kuhinji</h2>
          <p>
            Odrasla sam uz miris svježe pečenog hljeba i lonaca koji su tiho krčkali na šporetu.
            Nana me naučila da kuhanje nije samo hranjenje — to je način da kažeš „volim te“ bez
            ijedne riječi.
          </p>
        </div>
        <div>
          <h2>Zašto Moj Kutak</h2>
          <p>
            Nisam profesionalna kuharica. Kuham uz muziku, ponekad uz malo nereda, uvijek s puno
            volje. Moj Kutak je nastao da podijelim recepte koji su jednostavni, ali puni
            karaktera — i savjete koje sam naučila na svojim greškama.
          </p>
          <blockquote className={styles.quote}>
            Svake sedmice novi recept, svaki recept nova avantura.
          </blockquote>
        </div>
      </section>

      <section className={styles.contact} id="kontakt">
        <h2>Pratite me i javite se</h2>
        <p>
          Pitanje o receptu, prijedlog za novi video ili saradnja — najbrže me nađete na
          Instagramu ili emailom.
        </p>
        <div className={styles.channels}>
          {kanali.map(({ naziv, opis, href, Icon, cls }) => (
            <a
              key={naziv}
              href={href}
              className={`${styles.channel} ${cls}`}
              {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <span className={styles.channelIcon}><Icon size={22} /></span>
              <span>
                <strong>{naziv}</strong>
                <span>{opis}</span>
              </span>
            </a>
          ))}
        </div>
        <p className={styles.back}>
          <Link href="/recepti">Pogledajte recepte</Link>
        </p>
      </section>
    </main>
  );
}
