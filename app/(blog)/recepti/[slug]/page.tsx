import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaylistsForPost, getPostBySlug, getPosts, getRelated } from "@/lib/data";
import { coverImage, youtubeId, youtubeThumb } from "@/lib/youtube";
import { brojRecepata, formatBroj, formatDatum, tagLabel } from "@/lib/format";
import { AD_SLOTS } from "@/lib/ads";
import { SITE } from "@/lib/site";
import { excerpt } from "@/lib/text";
import AdSlot from "@/app/components/AdSlot";
import AuthorBox from "@/app/components/AuthorBox";
import LikeButton from "@/app/components/LikeButton";
import RecipeActions from "@/app/components/RecipeActions";
import RecipeCard from "@/app/components/RecipeCard";
import RecipeContent from "@/app/components/RecipeContent";
import ViewTracker from "@/app/components/ViewTracker";
import YouTubeEmbed from "@/app/components/YouTubeEmbed";
import { CalendarIcon, EyeIcon, FacebookIcon, InstagramIcon, ListIcon, TiktokIcon } from "@/app/components/Icons";
import styles from "./recept.module.css";

// Stranica se kešira i osvježava najviše jednom u minuti
export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Recept nije pronađen" };
  const img = coverImage(post);
  const description = excerpt(post.description) || undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/recepti/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.created_at,
      images: img ? [{ url: img }] : undefined,
    },
  };
}

export default async function ReceptPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, playlists] = await Promise.all([getRelated(post, 3), getPlaylistsForPost(post.id)]);

  const videoId = youtubeId(post.youtube_url);
  // Ako nema posebne slike, video ide na vrh umjesto slike
  const videoOnTop = Boolean(videoId && !post.image_url);
  const img = coverImage(post);

  // Prvi pasus opisa je uvod ispod naslova; ostatak (npr. sastojci upisani u opis) ide u tekst recepta
  const [lead, ...descRest] = (post.description ?? "").split(/\n{2,}/);
  const body = [descRest.join("\n\n"), post.content ?? ""].filter((s) => s.trim()).join("\n\n");
  const summary = excerpt(post.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: summary || undefined,
    image: img ? [img] : undefined,
    datePublished: post.created_at,
    author: { "@type": "Person", name: SITE.author, url: `${SITE.url}/o-meni` },
    publisher: { "@type": "Organization", name: SITE.name, logo: `${SITE.url}/logo2.png` },
    mainEntityOfPage: `${SITE.url}/recepti/${post.slug}`,
    keywords: post.tags.join(", ") || undefined,
    ...(videoId && {
      video: {
        "@type": "VideoObject",
        name: post.title,
        description: summary || post.title,
        thumbnailUrl: youtubeThumb(videoId, "maxres"),
        uploadDate: post.created_at,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      },
    }),
  };

  return (
    <main>
      <ViewTracker postId={post.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className={`container ${styles.page}`}>
        <header className={styles.head}>
          <nav className={styles.crumbs} aria-label="Putanja">
            <Link href="/recepti">Recepti</Link>
            {post.tags[0] && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/recepti?tag=${encodeURIComponent(post.tags[0])}`}>{tagLabel(post.tags[0])}</Link>
              </>
            )}
          </nav>

          <h1 className={styles.title}>{post.title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <CalendarIcon size={17} /> {formatDatum(post.created_at)}
            </span>
            <span className={styles.metaItem}>
              <EyeIcon size={17} /> {formatBroj(post.stats.total_views)} pregleda
            </span>
          </div>

          <div className={styles.actions}>
            <LikeButton postId={post.id} initialCount={post.stats.total_likes} />
            <RecipeActions title={post.title} />
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.main}>
            {videoOnTop && videoId ? (
              <YouTubeEmbed id={videoId} title={post.title} />
            ) : (
              img && (
                <div className={styles.cover}>
                  <Image
                    src={img}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 780px"
                    className={styles.coverImg}
                  />
                </div>
              )
            )}

            <AdSlot slot={AD_SLOTS.receptVrh} format="horizontal" className={styles.ad} />

            {videoId && !videoOnTop && (
              <section className={styles.block} aria-labelledby="video">
                <h2 id="video" className={styles.blockTitle}>Pogledaj video</h2>
                <YouTubeEmbed id={videoId} title={post.title} />
              </section>
            )}

            {body && (
              <section className={styles.block} id="recept">
                <RecipeContent
                  content={body}
                  afterIngredients={
                    <AdSlot slot={AD_SLOTS.receptSredina} format="rectangle" className={styles.ad} />
                  }
                />
              </section>
            )}

            <section className={styles.cta}>
              <div>
                <h2>Kako vam je uspjelo?</h2>
                <p>
                  Kliknite srce ako vam se recept svidio, a sliku ili video svog jela podijelite
                  na Instagramu (<strong>{SITE.instagramHandle}</strong>), TikToku
                  (<strong>{SITE.tiktokHandle}</strong>) ili Facebooku (<strong>Moj Kutak recepti</strong>)
                  i označite me — rado ću ga pogledati.
                </p>
              </div>
              <div className={styles.ctaActions}>
                <LikeButton postId={post.id} initialCount={post.stats.total_likes} size="lg" />
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
            </section>

            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((t) => (
                  <Link key={t} href={`/recepti?tag=${encodeURIComponent(t)}`} className="chip">
                    {tagLabel(t)}
                  </Link>
                ))}
              </div>
            )}

            {playlists.length > 0 && (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>Dio playliste</h2>
                <ul className={styles.playlists}>
                  {playlists.map((pl) => (
                    <li key={pl.id}>
                      <Link href={`/recepti?playlist=${encodeURIComponent(pl.slug)}`}>
                        <ListIcon size={18} />
                        <span>{pl.title}</span>
                        <span className={styles.plCount}>{brojRecepata(pl.post_ids.length)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className={styles.authorMobile}>
              <AuthorBox />
            </div>
          </div>

          <aside className={styles.sidebar}>
            <AuthorBox compact />
            <div className={styles.sticky}>
              <AdSlot slot={AD_SLOTS.sidebar} format="vertical" minWidth={1024} />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className={styles.related}>
            <div className="section-head">
              <h2>Možda će vam se svidjeti i</h2>
              <Link href="/recepti">Svi recepti</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <RecipeCard key={r.id} post={r} />
              ))}
            </div>
          </section>
        )}

        <AdSlot slot={AD_SLOTS.receptDno} format="horizontal" className={styles.ad} />
      </article>
    </main>
  );
}
