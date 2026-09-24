/**
 * Podaci koji se prikazuju na svakom receptu, u footeru i na "O meni".
 * PROVJERI linkove — ovo su pretpostavljeni nazivi profila.
 */
export const SITE = {
  name: "Moj Kutak",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Domaći recepti iz moje kuhinje — pite, kolači, čorbe i sve između, uz video za svaki korak.",
  author: "Ismira",
  authorBio:
    "Ja sam Ismira i kuham onako kako me naučila nana — bez mjerica, ali s puno pažnje. Svaki recept prvo isprobam kod kuće, snimim ga i tek onda podijelim s vama.",
  email: "ismira@mojkutak.ba",
  youtube: "https://youtube.com/@mojkutak",
  youtubeSubscribe: "https://youtube.com/@mojkutak?sub_confirmation=1",
  instagram: "https://instagram.com/mojkutak",
  instagramHandle: "@mojkutak",
  tiktok: "https://tiktok.com/@mojkutak",
} as const;
