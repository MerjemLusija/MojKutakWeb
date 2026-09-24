const KEY = "mk_sid";
let memory: string | null = null;

/** Anonimni ID posjetioca za lajkove i preglede (čuva se u localStorage). */
export function getSessionId(): string {
  try {
    let sid = localStorage.getItem(KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(KEY, sid);
    }
    return sid;
  } catch {
    memory ??= crypto.randomUUID();
    return memory;
  }
}
