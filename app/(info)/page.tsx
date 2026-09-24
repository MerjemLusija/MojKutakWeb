import Image from "next/image";
import Link from "next/link";
import { getPlaylists, getPosts, getTrending } from "@/lib/data";
import { brojRecepata, tagLabel } from "@/lib/format";
import { coverImage, youtubeId } from "@/lib/youtube";
import { SITE } from "@/lib/site";
import { excerpt } from "@/lib/text";
import RecipeCard from "@/app/components/RecipeCard";
import YouTubeEmbed from "@/app/components/YouTubeEmbed";
import { ArrowRightIcon, FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/app/components/Icons";
import styles from "./home.module.css";
import Backdrop from "@/app/components/Backdrop";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, playlists, trending] = await Promise.all([getPosts(), getPlaylists(), getTrending(7, 6)]);

  const [featured, ...others] = posts;
  const najnoviji = others.slice(0, 6);

  const popularni = trending.filter((t) => t.score > 0).slice(0, 3);
  const popularniFallback = [...posts].sort((a, b) => b.stats.total_views - a.stats.total_views).slice(0, 3);

  const zadnjiVideo = posts.find((p) => youtubeId(p.youtube_url));
  const videoId = zadnjiVideo ? youtubeId(zadnjiVideo.youtube_url) : null;
  const featuredImg = featured ? coverImage(featured) : null;

  return (
    <main>
      <Backdrop />
      {/* ── Hero ── */}
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <span className="eyebrow">Kulinarski blog i YouTube kanal</span>
          <h1>Domaći recepti koje zaista kuham kod kuće.</h1>
          <p>
            Pite, kolači, čorbe i jela za svaki dan, uz video za svaki korak. Recept prvo
            isprobam u svojoj kuhinji, a tek onda ga podijelim s vama.
          </p>
          <div className={styles.heroActions}>
            <Link href="/recepti" className="btn btn-primary">
              Pogledaj recepte <ArrowRightIcon size={18} />
            </Link>
            <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <YoutubeIcon size={18} /> YouTube kanal
            </a>
          </div>
        </div>

        {featured && (
          <Link href={`/recepti/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredMedia}>
              {featuredImg && (
                <Image
                  src={featuredImg}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 560px"
                  className={styles.img}
                />
              )}
            </div>
            <div className={styles.featuredBody}>
              <span className={styles.badge}>Najnoviji recept</span>
              <h2>{featured.title}</h2>
              {featured.description && <p>{excerpt(featured.description, 220)}</p>}
            </div>
          </Link>
        )}
      </section>

      {/* ── Najnoviji ── */}
      {najnoviji.length > 0 && (
        <section className={`container ${styles.section}`}>
          <div className="section-head">
            <h2>Najnoviji recepti</h2>
            <Link href="/recepti">Svi recepti</Link>
          </div>
          <div className={styles.grid}>
            {najnoviji.map((p) => (
              <RecipeCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Playliste ── */}
      {playlists.length > 0 && (
        <section className={`container ${styles.section}`}>
          <div className="section-head">
            <h2>Po playlistama</h2>
          </div>
          <div className={styles.playlists}>
            {playlists.map((pl) => (
              <Link key={pl.id} href={`/recepti?playlist=${encodeURIComponent(pl.slug)}`} className={styles.plCard}>
                {pl.thumbnail_url && (
                  <Image src={pl.thumbnail_url} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className={styles.img} />
                )}
                <span className={styles.plShade} />
                <span className={styles.plText}>
                  <strong>{pl.title}</strong>
                  <span>{brojRecepata(pl.post_ids.length)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Video ── */}
      {zadnjiVideo && videoId && (
        <section className={styles.videoBand}>
          <div className={`container ${styles.videoInner}`}>
            <div className={styles.videoText}>
              <span className="eyebrow">Novo na YouTubeu</span>
              <h2>{zadnjiVideo.title}</h2>
              {zadnjiVideo.description && <p>{excerpt(zadnjiVideo.description, 220)}</p>}
              <div className={styles.heroActions}>
                <Link href={`/recepti/${zadnjiVideo.slug}`} className="btn btn-primary">
                  Pročitaj recept
                </Link>
                <a href={SITE.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="btn btn-yt">
                  <YoutubeIcon size={18} /> Pretplatite se
                </a>
              </div>
            </div>
            <div className={styles.videoFrame}>
              <YouTubeEmbed id={videoId} title={zadnjiVideo.title} />
            </div>
          </div>
        </section>
      )}

      {/* ── Popularno ── */}
      <section className={`container ${styles.section}`}>
        <div className="section-head">
          <h2>{popularni.length > 0 ? "Najpopularnije ove sedmice" : "Najpopularniji recepti"}</h2>
          <Link href="/trending">Cijela rang lista</Link>
        </div>
        <ol className={styles.popular}>
          {(popularni.length > 0 ? popularni : popularniFallback).map((p, i) => (
            <li key={p.id}>
              <Link href={`/recepti/${p.slug}`} className={styles.popularItem}>
                <span className={styles.popularRank}>{i + 1}</span>
                <span>
                  {p.tags[0] && <span className={styles.popularTag}>{tagLabel(p.tags[0])}</span>}
                  <span className={styles.popularTitle}>{p.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── O meni ── */}
      <section className={`container ${styles.section}`}>
        <div className={styles.about}>
          <Image src="/logo2.png" alt="" width={120} height={120} className={styles.aboutImg} />
          <div>
            <span className="eyebrow">Ko kuha</span>
            <h2>Zdravo, ja sam {SITE.author}.</h2>
            <p>{SITE.authorBio}</p>
            <div className={styles.aboutActions}>
              <Link href="/o-meni" className="btn btn-outline">Više o meni</Link>
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-yt">
                <YoutubeIcon size={18} /> YouTube
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ig">
                <InstagramIcon size={18} /> Instagram
              </a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-tt">
                <TiktokIcon size={18} /> TikTok
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-fb">
                <FacebookIcon size={18} /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
