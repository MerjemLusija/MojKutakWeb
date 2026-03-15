"use client";

/* ─── Newsletter Form ─────────────────────────────────────────
   Must be a Client Component because it uses the onSubmit handler.
────────────────────────────────────────────────────────────── */
export default function NewsletterForm() {
  return (
    <form
      className="mk-newsletter"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up to backend / email service
      }}
    >
      <input
        type="email"
        placeholder="Unesite vaš email..."
        className="mk-newsletter-input"
        required
      />
      <button type="submit" className="btn-newsletter">
        Prijavi se
      </button>
    </form>
  );
}
