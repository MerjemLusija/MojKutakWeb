"use client";

import { useState } from "react";
import Image from "next/image";
import { youtubeThumb } from "@/lib/youtube";
import { PlayIcon } from "./Icons";
import styles from "./YouTubeEmbed.module.css";

/**
 * "Lite" YouTube: prikazuje samo sliku dok posjetilac ne klikne.
 * Pravi YouTube player (~1 MB) se učitava tek nakon klika.
 */
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.frame}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)}>
          <Image
            src={youtubeThumb(id)}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            className={styles.img}
          />
          <span className={styles.play}>
            <PlayIcon size={28} />
          </span>
          <span className="sr-only">Pusti video: {title}</span>
        </button>
      )}
    </div>
  );
}
