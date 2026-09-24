import styles from "./Backdrop.module.css";

/** Dekorativna pozadina (sjaj u uglovima + tačkice) koja prati skrolanje. Stavi jednom po stranici. */
export default function Backdrop() {
  return <div className={styles.root} aria-hidden="true" />;
}
