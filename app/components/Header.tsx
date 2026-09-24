"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import styles from "./Header.module.css";

const links = [
  { label: "Početna", href: "/" },
  { label: "Recepti", href: "/recepti" },
  { label: "Trending", href: "/trending" },
  { label: "O meni", href: "/o-meni" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <Image src="/logo2.png" alt="" width={44} height={44} priority className={styles.logo} />
          <span className={styles.wordmark}>Moj Kutak</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Glavna navigacija">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={styles.link}
              aria-current={isActive(pathname, href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/recepti#pretraga" className={styles.iconBtn} aria-label="Pretraži recepte" onClick={close}>
            <SearchIcon />
          </Link>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-expanded={open}
            aria-controls="mobilni-meni"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobilni-meni"
        className={styles.mobileNav}
        aria-label="Mobilna navigacija"
        hidden={!open}
      >
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={styles.mobileLink}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            onClick={close}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
