# Moj Kutak

Web stranica s receptima za Moj Kutak YouTube i Instagram kanal. Next.js 16 + Supabase.
Recepti se unose kroz poseban admin panel; ova stranica ih samo čita.

## Pokretanje

```bash
npm install
cp .env.example .env.local   # upiši Supabase URL i anon ključ
npm run dev                  # http://localhost:3000
```

`npm run build` pravi produkcijsku verziju (i provjerava TypeScript), `npm run lint` provjerava kod.

## Baza

`supabase/migrations/001_lajkovi_pregledi_trending.sql` sadrži funkcije za lajkove, preglede i
trending koje stranica koristi. Već je pokrenuta — fajl ostaje kao zapis šta je u bazi
(i za ponovno pravljenje baze). Dio 5 (Row Level Security) još nije uključen.
