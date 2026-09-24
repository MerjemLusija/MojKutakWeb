/**
 * Podaci koji se prikazuju na svakom receptu, u footeru i na "O meni".
 */
const YT_MOJ_KUTAK = "https://www.youtube.com/channel/UCFmRaf_VVGi7cyWYVUVkGkQ";
const YT_KUHINJA_RECEPTI = "https://www.youtube.com/channel/UCcoUnrZXWZrfrUEm2_PYcQA";

export const SITE = {
  name: "Moj Kutak",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Domaći recepti iz moje kuhinje — pite, kolači, čorbe i sve između, uz video za svaki korak.",
  author: "Ismira",
  authorBio:
    "Ja sam Ismira i kuham onako kako me naučila nana — bez mjerica, ali s puno pažnje. Svaki recept prvo isprobam kod kuće, snimim ga i tek onda podijelim s vama.",
  email: "mojkutakchannel@gmail.com",
  // Glavni kanal — na njemu su video recepti sa stranice.
  youtube: YT_MOJ_KUTAK,
  youtubeSubscribe: `${YT_MOJ_KUTAK}?sub_confirmation=1`,
  youtubeKuhinja: YT_KUHINJA_RECEPTI,
  youtubePletivo: "https://www.youtube.com/playlist?list=PLWNNDAMAujdTUp3Npn-9hXwEb6TamTxPd",
  instagram: "https://www.instagram.com/moj.kutak.recepti",
  instagramHandle: "@moj.kutak.recepti",
  instagramPletenje: "https://www.instagram.com/moj.kutak.pletenje",
  instagramPletenjeHandle: "@moj.kutak.pletenje",
  facebook: "https://www.facebook.com/mojkutakrecepti",
  tiktok: "https://www.tiktok.com/@kuhinjarecepti",
  tiktokHandle: "@kuhinjarecepti",
} as const;
