import type { Metadata } from "next";
import { Suspense } from "react";
import { getPlaylists, getPosts } from "@/lib/data";
import { brojRecepata } from "@/lib/format";
import RecipeCard from "@/app/components/RecipeCard";
import ReceptiBrowser from "./ReceptiBrowser";
import styles from "./recepti.module.css";
import Backdrop from "@/app/components/Backdrop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Recepti",
  description: "Svi recepti s Moj Kutak YouTube kanala — pretraga po nazivu, tagu i playlisti.",
  alternates: { canonical: "/recepti" },
};

export default async function ReceptiPage() {
  const [posts, playlists] = await Promise.all([getPosts(), getPlaylists()]);

  return (
    <main className={styles.page}>
      <Backdrop />
      <div className="container">
        <header className={styles.head}>
          <span className="eyebrow">Recepti</span>
          <h1>Svi recepti</h1>
          <p>
            {brojRecepata(posts.length)} iz moje kuhinje, svaki s videom
            ili korak-po-korak uputama.
          </p>
        </header>

        {/* Fallback se renderuje na serveru (dobro za Google), filteri se uključe u browseru */}
        <Suspense
          fallback={
            <div className={styles.grid}>
              {posts.map((p, i) => (
                <RecipeCard key={p.id} post={p} priority={i < 3} />
              ))}
            </div>
          }
        >
          <ReceptiBrowser posts={posts} playlists={playlists} />
        </Suspense>
      </div>
    </main>
  );
}
