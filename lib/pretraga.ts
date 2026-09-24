/** ID polja za pretragu na /recepti — na njega vodi lupa u headeru. */
export const PRETRAGA_ID = "pretraga";

/**
 * Skrola do pretrage (tačno ispod sticky headera, preko `scroll-padding-top`) i fokusira je.
 * Vraća false ako polje nije na trenutnoj stranici.
 */
export function focusPretraga(): boolean {
  const input = document.getElementById(PRETRAGA_ID);
  if (!(input instanceof HTMLInputElement)) return false;
  (input.closest("label") ?? input).scrollIntoView({ block: "start" });
  input.focus({ preventScroll: true });
  return true;
}
