"use client";

import { useState } from "react";
import { PrinterIcon, ShareIcon } from "./Icons";
import styles from "./RecipeActions.module.css";

/** Dijeli (native share na mobitelu, kopiranje linka na desktopu) i printaj. */
export default function RecipeActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // korisnik je zatvorio dijalog
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard nije dostupan
    }
  }

  return (
    <div className={styles.row}>
      <button type="button" className={styles.btn} onClick={share}>
        <ShareIcon size={18} />
        <span>{copied ? "Link kopiran" : "Podijeli"}</span>
      </button>
      <button type="button" className={styles.btn} onClick={() => window.print()}>
        <PrinterIcon size={18} />
        <span>Printaj</span>
      </button>
    </div>
  );
}
