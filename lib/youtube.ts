/** Izvlači ID videa iz svih uobičajenih YouTube linkova (watch, youtu.be, shorts, embed, live). */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return clean(u.pathname.slice(1));
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v) return clean(v);
      const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
      if (m) return clean(m[1]);
    }
  } catch {
    // nije ispravan URL
  }
  return null;
}

function clean(id: string): string | null {
  return /^[\w-]{11}$/.test(id) ? id : null;
}

export function youtubeThumb(id: string, quality: "hq" | "maxres" = "hq"): string {
  return `https://i.ytimg.com/vi/${id}/${quality === "hq" ? "hqdefault" : "maxresdefault"}.jpg`;
}

/** Slika za karticu: `image_url`, a ako ga nema — YouTube thumbnail. */
export function coverImage(post: { image_url: string | null; youtube_url: string | null }): string | null {
  if (post.image_url) return post.image_url;
  const id = youtubeId(post.youtube_url);
  return id ? youtubeThumb(id) : null;
}
