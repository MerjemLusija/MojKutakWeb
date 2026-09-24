"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { tagLabel } from "@/lib/format";
import { CheckIcon, ChevronDownIcon, SearchIcon, TagIcon } from "@/app/components/Icons";
import styles from "./recepti.module.css";

type Props = {
  /** [tag, broj recepata], najčešći prvi */
  tags: [string, number][];
  value: string | null;
  onChange: (tag: string | null) => void;
  norm: (s: string) => string;
};

/** Padajući izbornik tagova s pretragom — zamjena za dugi red chipova. */
export default function TagPicker({ tags, value, onChange, norm }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // Prva opcija je uvijek "Sve kategorije" (null).
  const options = useMemo<(string | null)[]>(() => {
    const needle = norm(q.trim());
    const list = tags.filter(([t]) => !needle || norm(tagLabel(t)).includes(needle)).map(([t]) => t);
    return needle ? list : [null, ...list];
  }, [tags, q, norm]);

  const counts = useMemo(() => new Map(tags), [tags]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    function onDown(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Strelicama se lista skrola do aktivne opcije.
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function toggle() {
    setQ("");
    setActive(0);
    setOpen((o) => !o);
  }

  function pick(t: string | null) {
    onChange(t);
    setOpen(false);
    button.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && options.length > 0) {
      e.preventDefault();
      pick(options[active]);
    }
  }

  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <div className={styles.picker} ref={root} onKeyDown={open ? onKeyDown : undefined}>
      <button
        ref={button}
        type="button"
        className={styles.pickerBtn}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-selected={value ? "" : undefined}
        onClick={toggle}
      >
        <TagIcon size={18} />
        <span className={styles.pickerValue}>{value ? tagLabel(value) : "Sve kategorije"}</span>
        <ChevronDownIcon size={18} className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.popover}>
          <label className={styles.popSearch}>
            <SearchIcon size={16} />
            <span className="sr-only">Traži kategoriju</span>
            <input
              ref={input}
              type="text"
              placeholder="Traži kategoriju…"
              value={q}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={options.length ? optionId(active) : undefined}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
            />
          </label>

          <ul className={styles.options} role="listbox" id={listId} aria-label="Kategorije">
            {options.length === 0 && <li className={styles.noOption}>Nema takve kategorije</li>}
            {options.map((t, i) => {
              const selected = t === value;
              return (
                <li
                  key={t ?? "__sve"}
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  data-active={i === active ? "" : undefined}
                  className={styles.option}
                  onPointerMove={() => setActive(i)}
                  onClick={() => pick(t)}
                >
                  <span className={styles.check}>{selected && <CheckIcon size={16} />}</span>
                  <span className={styles.optionLabel}>{t ? tagLabel(t) : "Sve kategorije"}</span>
                  {t && <span className={styles.optionCount}>{counts.get(t)}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
