import Script from "next/script";

// Layout za "blog" dio (recepti, trending) — SAMO ovdje se učitava AdSense.
// Info stranice (početna, o meni, privatnost) su u (info) i nemaju oglase.
//
// U AdSense-u ISKLJUČI "Auto ads" i koristi samo ručne jedinice (<AdSlot slot="...">),
// inače Google sam ubacuje oglase i na info stranice nakon navigacije.

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {ADSENSE_CLIENT && (
        <Script
          id="adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
      {children}
    </>
  );
}
