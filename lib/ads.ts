// ID-evi oglasnih jedinica iz AdSense-a (Oglasi → Po oglasnoj jedinici).
// Dok su prazni, <AdSlot> u developmentu prikazuje isprekidani okvir, a u produkciji ništa.
export const AD_SLOTS = {
  receptVrh: process.env.NEXT_PUBLIC_AD_SLOT_RECEPT_VRH,
  receptSredina: process.env.NEXT_PUBLIC_AD_SLOT_RECEPT_SREDINA,
  receptDno: process.env.NEXT_PUBLIC_AD_SLOT_RECEPT_DNO,
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
  listaFeed: process.env.NEXT_PUBLIC_AD_SLOT_LISTA,
} as const;
