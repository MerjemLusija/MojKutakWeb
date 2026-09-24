import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/types";
import { coverImage, youtubeId } from "@/lib/youtube";
import { formatBroj, tagLabel } from "@/lib/format";
import { EyeIcon, HeartIcon, PlayIcon } from "./Icons";
import styles from "./RecipeCard.module.css";

type Props = {
  post: Pick<PostSummary, "slug" | "title" | "description" | "image_url" | "youtube_url" | "tags"> & {
    stats?: PostSummary["stats"];
  };
  /** Prikaži broj pregleda i lajkova ispod naslova. */
  showStats?: boolean;
  /** Prve kartice na stranici — učitaj sliku odmah (LCP). */
  priority?: boolean;
  sizes?: string;
};

export default function RecipeCard({
  post,
  showStats = false,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px",
}: Props) {
  const src = coverImage(post);
  const hasVideo = Boolean(youtubeId(post.youtube_url));

  return (
    <article className={styles.card}>
      <Link href={`/recepti/${post.slug}`} className={styles.link}>
        <div className={styles.media}>
          {src ? (
            <Image src={src} alt="" fill sizes={sizes} priority={priority} className={styles.img} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
          {hasVideo && (
            <span className={styles.videoBadge}>
              <PlayIcon size={12} /> Video
            </span>
          )}
        </div>

        <div className={styles.body}>
          {post.tags[0] && <span className={styles.tag}>{tagLabel(post.tags[0])}</span>}
          <h3 className={styles.title}>{post.title}</h3>
          {post.description && <p className={styles.desc}>{post.description}</p>}
          {showStats && post.stats && (
            <div className={styles.stats}>
              <span><EyeIcon size={16} /> {formatBroj(post.stats.total_views)}</span>
              <span><HeartIcon size={16} /> {formatBroj(post.stats.total_likes)}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
