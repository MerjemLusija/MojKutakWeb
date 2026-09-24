import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ paddingBlock: "96px", textAlign: "center" }}>
      <span className="eyebrow">Greška 404</span>
      <h1 style={{ marginTop: 12, fontSize: "clamp(2rem, 5vw, 3rem)" }}>Ovaj recept nije u kuhinji</h1>
      <p style={{ marginTop: 12, color: "var(--ink-soft)" }}>
        Stranica je možda premještena ili obrisana.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
        <Link href="/recepti" className="btn btn-primary">Svi recepti</Link>
        <Link href="/" className="btn btn-outline">Početna</Link>
      </div>
    </main>
  );
}
