"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./AdSlot.module.css";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type Format = "horizontal" | "rectangle" | "vertical" | "in-feed";

type Props = {
  /** ID oglasne jedinice iz AdSense-a (data-ad-slot). */
  slot?: string;
  format?: Format;
  /** Prikaži samo na ekranima širim od ovoga (npr. 1024 za sidebar). */
  minWidth?: number;
  className?: string;
};

function useMinWidth(px: number | undefined) {
  return useSyncExternalStore(
    (cb) => {
      if (!px) return () => {};
      const mq = window.matchMedia(`(min-width: ${px}px)`);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => (px ? window.matchMedia(`(min-width: ${px}px)`).matches : true),
    () => !px,
  );
}

/**
 * Rezervisano mjesto za AdSense oglas. Visina je fiksirana unaprijed
 * da se sadržaj ne pomjera kad se oglas učita (CLS).
 * Bez NEXT_PUBLIC_ADSENSE_CLIENT prikazuje isprekidani okvir u developmentu, a ništa u produkciji.
 */
export default function AdSlot({ slot, format = "horizontal", minWidth, className }: Props) {
  const visible = useMinWidth(minWidth);
  const pushed = useRef(false);

  useEffect(() => {
    if (!visible || !CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense skripta još nije učitana ili ju je blokirao ad-blocker
    }
  }, [visible, slot]);

  if (!visible) return null;

  const cls = `${styles.slot} ${styles[format]} ${className ?? ""}`;

  if (!CLIENT || !slot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className={`${cls} ${styles.placeholder}`} aria-hidden="true">
        Oglas · {format}
      </div>
    );
  }

  return (
    <div className={cls}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === "in-feed" ? "fluid" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
