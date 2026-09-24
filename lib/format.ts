// Ručno formatiranje (bez Intl) da server i browser uvijek daju isti tekst — nema hydration razlika.

const MJESECI = [
  "januara", "februara", "marta", "aprila", "maja", "juna",
  "jula", "augusta", "septembra", "oktobra", "novembra", "decembra",
];

export function formatBroj(n: number): string {
  if (n < 1000) return String(n);
  const [div, suf] = n < 1_000_000 ? [1000, "k"] : [1_000_000, "M"];
  return (n / div).toFixed(1).replace(/\.0$/, "").replace(".", ",") + suf;
}

export function formatDatum(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}. ${MJESECI[d.getUTCMonth()]} ${d.getUTCFullYear()}.`;
}

/** "tjestenine" → "Tjestenine", "bosanska-kuhinja" → "Bosanska kuhinja", "ŠarenaSalata" → "Šarena salata" */
export function tagLabel(tag: string): string {
  const t = tag
    .replace(/[-_]+/g, " ")
    .replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Bosanska množina: 1 recept, 2 recepta, 5 recepata, 21 recept… */
export function brojRecepata(n: number): string {
  const d = n % 10;
  const dd = n % 100;
  const rijec = d === 1 && dd !== 11 ? "recept" : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? "recepta" : "recepata";
  return `${n} ${rijec}`;
}
