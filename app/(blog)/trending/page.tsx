import type { Metadata } from "next";
import { getPosts, getTrending } from "@/lib/data";
import type { TrendingPost } from "@/lib/types";
import TrendingBoard from "./TrendingBoard";
import styles from "./trending.module.css";
import Backdrop from "@/app/components/Backdrop";

// Rang lista se osvježava svakih 5 minuta
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending recepti",
  description: "Najgledaniji i najomiljeniji recepti na Moj Kutak ove sedmice i ovog mjeseca.",
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const [sedmica, mjesec, svi] = await Promise.all([getTrending(7), getTrending(30), getPosts()]);

  const sveVrijeme: TrendingPost[] = svi.map(({ stats, ...p }) => ({
    ...p,
    views_period: stats.total_views,
    likes_period: stats.total_likes,
    views_prev: 0,
    total_views: stats.total_views,
    total_likes: stats.total_likes,
    score: stats.total_views + 5 * stats.total_likes,
  }));

  return (
    <main className={`container ${styles.page}`}>
      <Backdrop />
      <header className={styles.head}>
        <span className="eyebrow">Trending</span>
        <h1>Šta se najviše kuha</h1>
        <p>
          Recepti rangirani po pregledima i lajkovima na ovoj stranici. Lajk vrijedi kao pet pregleda.
        </p>
      </header>

      <TrendingBoard periods={{ sedmica, mjesec, sve: sveVrijeme }} />
    </main>
  );
}
