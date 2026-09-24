import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import styles from "./privatnost.module.css";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  alternates: { canonical: "/privatnost" },
};

// NACRT — pregledaj prije objave i prije prijave na AdSense.

export default function PrivatnostPage() {
  return (
    <main className={`container ${styles.page}`}>
      <h1>Politika privatnosti</h1>
      <p className={styles.updated}>Posljednja izmjena: septembar 2026.</p>

      <div className="prose">
        <p>
          Ova stranica objašnjava koje podatke {SITE.name} ({SITE.url}) prikuplja kada posjetite
          stranicu i kako se ti podaci koriste.
        </p>

        <h2>Lajkovi i pregledi recepata</h2>
        <p>
          Da bismo prikazali koliko je recept gledan i koliko se sviđa, vaš browser dobija nasumičan
          anonimni identifikator koji se čuva u lokalnoj memoriji browsera (localStorage). Uz njega
          bilježimo koji ste recept otvorili ili lajkali i vrijeme. Ne tražimo ime ni email i ove
          podatke ne povezujemo s vašim identitetom. Identifikator možete
          obrisati brisanjem podataka stranice u browseru.
        </p>

        <h2>Oglasi (Google AdSense)</h2>
        <p>
          Na stranicama s receptima prikazuju se oglasi putem usluge Google AdSense. Google i
          njegovi partneri mogu koristiti kolačiće (cookies) za prikaz oglasa na osnovu vaših
          prethodnih posjeta ovoj i drugim stranicama. Personalizirane oglase možete isključiti u{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google postavkama oglasa
          </a>
          . Više o tome kako Google koristi podatke:{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>

        <h2>YouTube video</h2>
        <p>
          Video snimci se učitavaju preko YouTubea u načinu pojačane privatnosti
          (youtube-nocookie.com) i tek nakon što kliknete na video. Tada važe pravila privatnosti
          kompanije Google.
        </p>

        <h2>Kontakt</h2>
        <p>
          Za sva pitanja o privatnosti pišite na <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </main>
  );
}
