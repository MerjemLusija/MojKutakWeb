import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { InstagramIcon, YoutubeIcon } from "./Icons";
import styles from "./AuthorBox.module.css";

/** Kartica "o autorici" + linkovi na YouTube i Instagram — ista na svakom receptu. */
export default function AuthorBox({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.box} ${compact ? styles.compact : ""}`}>
      <div className={styles.top}>
        {/* Zamijeni /logo2.png pravom fotografijom (npr. /ismira.jpg) kad bude spremna */}
        <Image src="/logo2.png" alt="" width={64} height={64} className={styles.avatar} />
        <div>
          <p className={styles.kicker}>Autorica</p>
          <p className={styles.name}>{SITE.author}</p>
        </div>
      </div>
      <p className={styles.bio}>{SITE.authorBio}</p>
      <div className={styles.links}>
        <a href={SITE.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="btn btn-yt">
          <YoutubeIcon size={18} /> Pretplatite se
        </a>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ig">
          <InstagramIcon size={18} /> {SITE.instagramHandle}
        </a>
      </div>
      {!compact && (
        <Link href="/o-meni" className={styles.more}>
          Više o meni
        </Link>
      )}
    </div>
  );
}
