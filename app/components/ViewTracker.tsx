"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getSessionId } from "@/lib/session";

/** Bilježi pregled recepta. Baza broji najviše jedan pregled po posjetiocu u 6 sati. */
export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    // Ne broji posjete kraće od 1,5 s (slučajni klikovi, botovi koji odmah odu)
    const t = setTimeout(() => {
      client
        .rpc("record_view", { p_post_id: postId, p_session_id: getSessionId() })
        .then(({ error }) => {
          if (error) console.warn("[pregledi]", error.message);
        });
    }, 1500);
    return () => clearTimeout(t);
  }, [postId]);

  return null;
}
