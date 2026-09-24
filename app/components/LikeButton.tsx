"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSessionId } from "@/lib/session";
import { formatBroj } from "@/lib/format";
import { HeartIcon } from "./Icons";
import styles from "./LikeButton.module.css";

type Props = {
  postId: string;
  initialCount: number;
  size?: "sm" | "lg";
};

type LikeRow = { is_liked: boolean; like_count: number };

// Više dugmadi za isti recept na stranici (gore i dole) ostaju usklađena preko ovog eventa.
const EVENT = "mk-like";
type LikeDetail = { postId: string; liked: boolean; count: number };

function broadcast(detail: LikeDetail) {
  window.dispatchEvent(new CustomEvent<LikeDetail>(EVENT, { detail }));
}

export default function LikeButton({ postId, initialCount, size = "sm" }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onLike = (e: Event) => {
      const d = (e as CustomEvent<LikeDetail>).detail;
      if (d.postId !== postId) return;
      setLiked(d.liked);
      setCount(d.count);
    };
    window.addEventListener(EVENT, onLike);
    return () => window.removeEventListener(EVENT, onLike);
  }, [postId]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .rpc("get_like_state", { p_post_id: postId, p_session_id: getSessionId() })
      .single<LikeRow>()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setLiked(data.is_liked);
        setCount(Number(data.like_count));
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function toggle() {
    if (busy) return;
    // Optimistično: odmah promijeni prikaz, vrati nazad ako baza odbije.
    const prev = { postId, liked, count };
    broadcast({ postId, liked: !liked, count: count + (liked ? -1 : 1) });

    if (!supabase) return; // demo način bez baze
    setBusy(true);
    const { data, error } = await supabase
      .rpc("toggle_like", { p_post_id: postId, p_session_id: getSessionId() })
      .single<LikeRow>();
    setBusy(false);
    if (error || !data) {
      broadcast(prev);
      return;
    }
    broadcast({ postId, liked: data.is_liked, count: Number(data.like_count) });
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[size]}`}
      aria-pressed={liked}
      onClick={toggle}
    >
      <HeartIcon size={size === "lg" ? 22 : 18} filled={liked} />
      <span>{formatBroj(count)}</span>
      <span className={size === "lg" ? styles.label : "sr-only"}>
        {liked ? "Sviđa ti se" : "Sviđa mi se"}
      </span>
    </button>
  );
}
