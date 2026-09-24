// Tekst iz admin panela dolazi kao HTML (rich-text editor). Ovdje ga pretvaramo
// u običan tekst — HTML se nikad ne ubacuje direktno u stranicu.

const ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/**
 * HTML → tekst sa sačuvanim redovima. `<strong>` postaje `**…**`, `<li>` postaje "- ".
 * Običan tekst (bez tagova) vraća se nepromijenjen.
 */
export function htmlToText(s: string): string {
  if (!/<\/?[a-z][\s\S]*>/i.test(s)) return s;
  const text = decodeEntities(
    s
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h\d|ul|ol)>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/?(strong|b)(\s[^>]*)?>/gi, "**")
      .replace(/<[^>]+>/g, ""),
  );
  // "**" preko više redova se raspadne — takve oznake uklanjamo
  return text
    .split("\n")
    .map((l) => ((l.match(/\*\*/g)?.length ?? 0) % 2 ? l.replace(/\*\*/g, "") : l.replace(/\*\*\s*\*\*/g, "")))
    .join("\n");
}

/** Običan tekst bez oznaka: redovi očišćeni, najviše jedan prazan red zaredom. */
export function plainText(s: string | null | undefined): string {
  if (!s) return "";
  return htmlToText(s)
    .replace(/\*\*/g, "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Jedan red, skraćen na granici riječi — za meta opis, Open Graph i JSON-LD. */
export function excerpt(s: string | null | undefined, max = 160): string {
  const flat = plainText(s).replace(/\s+/g, " ");
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,.;:!-]+$/, "") + "…";
}

/** Samo pravi http(s) linkovi; `blob:` i slično (npr. pregled iz admina) se odbacuju. */
export function safeUrl(url: string | null | undefined): string | null {
  const u = url?.trim();
  return u && /^https?:\/\//i.test(u) ? u : null;
}

/** "Čorba", "corba" i "ČORBA" daju isti ključ. */
export function foldKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
