import { Fragment, type ReactNode } from "react";
import { htmlToText } from "@/lib/text";

/*
  Pretvara tekst recepta iz admin panela u uredan HTML.
  Tekst dolazi iz rich-text editora (HTML) ili kao običan tekst. Prepoznaje se:

    Sastojci:  /  Krema;  /  Fil ;   ← kratak red koji završava s ":" ili ";" → podnaslov
    Sastojci za tijesto              ← kratak red koji počinje poznatom riječi  → podnaslov
    **Zaljev:**                      ← cijeli red podebljan                    → podnaslov
    ## Priprema                      ← red koji počinje s "#"                  → podnaslov
    500 g brašna                     ← redovi odmah ispod podnaslova            → lista sastojaka
    Otopiti maslac. (ispod Priprema) ← 3+ reda ispod "Priprema"/"Postupak"      → numerisani koraci
    - 500 g brašna  /  1. Umijesiti  ← "-", "*", "•" ili "1."                  → lista
    -------  /  .....                ← razdjelnici                              → prazan red

  YouTube odjava ("Pretplatite se na kanal, pritisnite zvono…") se ne prikazuje —
  na stranici to već radi kutija o autoru. HTML se nikad ne ubacuje direktno.
*/

type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; lines: string[] }
  | { kind: "ul" | "ol"; items: string[] };

type Token = { t: "blank" } | { t: "h"; text: string } | { t: "ul" | "ol"; text: string } | { t: "line"; text: string };

const UL = /^[-*•]\s+(.*)$/;
const OL = /^\d+[.)]\s+(.*)$/;
const HASH = /^#{1,3}\s+(.*)$/;
const BOLD_LINE = /^\*\*(.+?)\*\*\s*[:;]?$/;
const SEPARATOR = /^[\s.,\-–—_=*~•·]*$/;
const EMOJI_ONLY = /^[\p{Extended_Pictographic}\p{Emoji_Modifier}‍️\s]+$/u;
const HEADING_WORDS =
  /^(potrebni\s+)?(sastojci|priprema|postupak|fil|krema|sirup|glazura|ganache|preljev|sos|zaljev|agda|tijesto|tečnost|za\s+(glazuru|premazivanje|gustoću|fil|kremu|tijesto|sirup|preljev|posipanje|ukrašavanje|dekoraciju))\b/i;
/** Redovi YouTube odjave koji nemaju smisla na web stranici. */
const OUTRO = [
  /^prijatelji\s*[,!]?$/i,
  /^pretplatite se\b/i,
  /^ocijenite video\b/i,
  /^napišite komentar\b/i,
  /^pratite nas na\b/i,
  /^hvala vam\b.{0,20}$/i,
];
const STEPS_HEADING = /^(priprema|postupak|način pripreme)\b/i;
/** Red koji izgleda kao sastojak: počinje količinom. */
const QTY = /^(\d|½|¼|¾|pola\b|malo\b|prstohvat\b)/i;

function headingText(t: string): string | null {
  let m: RegExpMatchArray | null;
  if ((m = t.match(HASH))) return m[1];
  if ((m = t.match(BOLD_LINE)) && m[1].length <= 80) return m[1];
  if (t.length > 50 || /^\d/.test(t) || UL.test(t)) return null;
  if (/\s*[:;]$/.test(t) || HEADING_WORDS.test(t)) return t;
  return null;
}

function tokenize(raw: string): Token[] {
  return htmlToText(raw)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line): Token | null => {
      const t = line.replace(/[ \t ]+/g, " ").trim();
      if (SEPARATOR.test(t) || EMOJI_ONLY.test(t)) return { t: "blank" };
      if (OUTRO.some((re) => re.test(t))) return null;
      const h = headingText(t);
      if (h !== null) {
        const text = h.replace(/\*\*/g, "").replace(/[\s:;.]+$/, "").trim();
        return text ? { t: "h", text } : { t: "blank" };
      }
      let m: RegExpMatchArray | null;
      if ((m = t.match(UL))) return { t: "ul", text: m[1] };
      if ((m = t.match(OL))) return { t: "ol", text: m[1] };
      return { t: "line", text: t };
    })
    .filter((x): x is Token => x !== null);
}

export function parseContent(raw: string): Block[] {
  const tokens = tokenize(raw);
  const blocks: Block[] = [];
  const last = () => blocks[blocks.length - 1];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.t === "blank") continue;
    if (tok.t === "h") {
      blocks.push({ kind: "h", text: tok.text });
      continue;
    }
    if (tok.t === "ul" || tok.t === "ol") {
      // Prazni redovi između stavki ne prekidaju listu (inače bi numeracija krenula od 1)
      const prev = last();
      if (prev && prev.kind === tok.t) prev.items.push(tok.text);
      else blocks.push({ kind: tok.t, items: [tok.text] });
      continue;
    }

    // Niz običnih redova do prvog praznog reda / podnaslova
    const run: string[] = [];
    while (i < tokens.length && tokens[i].t === "line") run.push((tokens[i++] as { text: string }).text);
    i--;

    const prev = last();
    const short = run.every((l) => l.length <= 90);
    const allQty = run.every((l) => QTY.test(l));
    if (prev?.kind === "h" && STEPS_HEADING.test(prev.text) && run.length >= 3 && !allQty) {
      // Redovi ispod "Priprema" → numerisani koraci
      blocks.push({ kind: "ol", items: run });
    } else if (prev?.kind === "h" && short && (run.length >= 2 || allQty)) {
      // Redovi ispod "Sastojci:" → lista
      blocks.push({ kind: "ul", items: run });
    } else if (prev?.kind === "ul" && short && allQty) {
      // Sastojci razdvojeni praznim redom i dalje pripadaju istoj listi
      prev.items.push(...run);
    } else {
      blocks.push({ kind: "p", lines: run });
    }
  }

  return blocks;
}

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

type Props = {
  content: string;
  /** Ubacuje se nakon sastojaka (prve grupe podnaslova i lista), prije opisa pripreme. */
  afterIngredients?: ReactNode;
};

/** Pozicija iza koje ide `afterIngredients`: prije prvog pasusa koji slijedi iza liste. */
function insertIndex(blocks: Block[]): number {
  const firstList = blocks.findIndex((b) => b.kind === "ul" || b.kind === "ol");
  if (firstList < 0) return blocks.length - 1;
  for (let i = firstList + 1; i < blocks.length; i++) {
    if (blocks[i].kind === "p") return blocks[i - 1].kind === "h" ? i - 2 : i - 1;
  }
  return blocks.length - 1;
}

export default function RecipeContent({ content, afterIngredients }: Props) {
  const blocks = parseContent(content);
  const insertAt = insertIndex(blocks);

  return (
    <div className="prose">
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {renderBlock(b)}
          {i === insertAt && afterIngredients}
        </Fragment>
      ))}
    </div>
  );
}

function renderBlock(b: Block) {
  switch (b.kind) {
    case "h":
      return <h2>{inline(b.text)}</h2>;
    case "ul":
      return <ul>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
    case "ol":
      return <ol>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ol>;
    case "p":
      return (
        <p>
          {b.lines.map((l, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(l)}
            </Fragment>
          ))}
        </p>
      );
  }
}
