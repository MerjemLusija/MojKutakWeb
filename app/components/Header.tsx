'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fraunces, Nunito } from 'next/font/google';
import styles from './Header.module.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const links = [
  { label: 'Početna', href: '/' },
  { label: 'Recepti', href: '/recepti' },
  { label: 'O Meni', href: '/kontakt' },
  { label: 'Trending', href: '/trending' },
] as const;

type NavLink = (typeof links)[number];

export default function Header() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const splashLayerRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Splash effect on click ──────────────────────────────────────────
  const fireSplash = useCallback((x: number, y: number) => {
    const layer = splashLayerRef.current;
    if (!layer) return;

    const addTimeout = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    // Expanding ring
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:68px; height:68px;
      margin-left:-34px; margin-top:-34px;
      border-radius:50%;
      background:rgba(245,196,48,0.18);
      transform:scale(0);
      transition:transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease;
      pointer-events:none;
    `;
    layer.appendChild(ring);
    requestAnimationFrame(() => {
      ring.style.transform = 'scale(1)';
      ring.style.opacity = '0';
    });
    addTimeout(() => ring.remove(), 700);

    // Border pop
    const border = document.createElement('div');
    border.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:68px; height:68px;
      margin-left:-34px; margin-top:-34px;
      border-radius:50%;
      border:2px solid rgba(245,196,48,0.65);
      transform:scale(0.2);
      opacity:1;
      transition:transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease;
      pointer-events:none;
    `;
    layer.appendChild(border);
    requestAnimationFrame(() => {
      border.style.transform = 'scale(2.2)';
      border.style.opacity = '0';
    });
    addTimeout(() => border.remove(), 700);

    // 9 gold dots scattered radially
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * 2 * Math.PI;
      const dist = 20 + Math.random() * 22;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const dot = document.createElement('div');
      dot.style.cssText = `
        position:fixed; left:${x}px; top:${y}px;
        width:6px; height:6px;
        margin-left:-3px; margin-top:-3px;
        border-radius:50%;
        background:#F5C430;
        box-shadow:0 0 5px rgba(245,196,48,0.9);
        transform:translate(0,0) scale(1);
        opacity:1;
        transition:
          transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.022}s,
          opacity 0.35s ease ${i * 0.022 + 0.25}s;
        pointer-events:none;
      `;
      layer.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${dx}px,${dy}px) scale(0)`;
        dot.style.opacity = '0';
      });
      addTimeout(() => dot.remove(), 750);
    }
  }, []);

  // ── Inject SVG orbit + pill bg per nav link ─────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const linkEls = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.' + styles.navLink));
    const cleanups: (() => void)[] = [];

    linkEls.forEach((el) => {
      // Pill background spring div
      const pillBg = document.createElement('div');
      pillBg.className = styles.navLinkPillBg;
      el.style.position = 'relative';
      el.insertBefore(pillBg, el.firstChild);

      // Measure after paint
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      svg.style.cssText = `
        position:absolute; inset:0; overflow:visible;
        z-index:10; pointer-events:none; opacity:0;
        transition:opacity 0.18s ease;
      `;

      // Defs: linearGradient
      const defs = document.createElementNS(ns, 'defs');
      const grad = document.createElementNS(ns, 'linearGradient');
      const gradId = `grad-${Math.random().toString(36).slice(2)}`;
      grad.setAttribute('id', gradId);
      grad.setAttribute('x1', '0%');
      grad.setAttribute('y1', '0%');
      grad.setAttribute('x2', '100%');
      grad.setAttribute('y2', '0%');
      const stop1 = document.createElementNS(ns, 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', 'transparent');
      const stop2 = document.createElementNS(ns, 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#F5C430');
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);
      svg.appendChild(defs);

      // Dashed orbit track rect
      const pad = 1.5;
      const rx = h / 2 - pad;
      const track = document.createElementNS(ns, 'rect');
      track.setAttribute('x', String(pad));
      track.setAttribute('y', String(pad));
      track.setAttribute('width', String(w - pad * 2));
      track.setAttribute('height', String(h - pad * 2));
      track.setAttribute('rx', String(rx));
      track.setAttribute('fill', 'none');
      track.setAttribute('stroke', 'rgba(212,175,55,0.28)');
      track.setAttribute('stroke-width', '1.2');
      track.setAttribute('stroke-dasharray', '3 5');
      svg.appendChild(track);

      // Pill perimeter path for animateMotion
      const r = rx;
      const path = [
        `M ${pad + r} ${pad}`,
        `L ${w - pad - r} ${pad}`,
        `A ${r} ${r} 0 0 1 ${w - pad} ${pad + r}`,
        `L ${w - pad} ${h - pad - r}`,
        `A ${r} ${r} 0 0 1 ${w - pad - r} ${h - pad}`,
        `L ${pad + r} ${h - pad}`,
        `A ${r} ${r} 0 0 1 ${pad} ${h - pad - r}`,
        `L ${pad} ${pad + r}`,
        `A ${r} ${r} 0 0 1 ${pad + r} ${pad} Z`,
      ].join(' ');

      // Orbiting group
      const g = document.createElementNS(ns, 'g');
      const motion = document.createElementNS(ns, 'animateMotion');
      motion.setAttribute('dur', '1.8s');
      motion.setAttribute('repeatCount', 'indefinite');
      motion.setAttribute('rotate', 'auto');
      const mpath = document.createElementNS(ns, 'mpath');
      // Use path element in defs
      const pathEl = document.createElementNS(ns, 'path');
      const pathId = `mp-${Math.random().toString(36).slice(2)}`;
      pathEl.setAttribute('id', pathId);
      pathEl.setAttribute('d', path);
      pathEl.setAttribute('fill', 'none');
      defs.appendChild(pathEl);
      mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`);
      motion.appendChild(mpath);
      g.appendChild(motion);

      // Tail
      const tail = document.createElementNS(ns, 'path');
      tail.setAttribute('d', 'M -13 0 Q -8 -2.5 0 0');
      tail.setAttribute('fill', 'none');
      tail.setAttribute('stroke', `url(#${gradId})`);
      tail.setAttribute('stroke-width', '1.8');
      tail.setAttribute('stroke-linecap', 'round');
      g.appendChild(tail);

      // Dot
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', '3.6');
      dot.setAttribute('fill', '#F5C430');
      dot.setAttribute('filter', 'drop-shadow(0 0 4px rgba(245,196,48,1))');
      g.appendChild(dot);

      svg.appendChild(g);
      el.appendChild(svg);

      // Hover show/hide
      const onEnter = () => {
        svg.style.opacity = '1';
        pillBg.style.transform = 'scale(1)';
        pillBg.style.opacity = '1';
      };
      const onLeave = () => {
        svg.style.opacity = '0';
        pillBg.style.transform = 'scale(0.65)';
        pillBg.style.opacity = '0';
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        svg.remove();
        pillBg.remove();
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // ── Click splash setup ──────────────────────────────────────────────
  useEffect(() => {
    // Create fixed splash layer
    const layer = document.createElement('div');
    layer.id = 'splash-layer';
    layer.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(layer);
    splashLayerRef.current = layer;

    return () => {
      layer.remove();
      splashLayerRef.current = null;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      fireSplash(e.clientX, e.clientY);
    },
    [fireSplash]
  );

  return (
    <div className={styles.navWrapper}>
      <div className={styles.pill} ref={navRef}>
        {/* Left: Početna + Recepti */}
        <div className={styles.linkGroup}>
          {(links.slice(0, 2) as NavLink[]).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`${styles.navLink} ${nunito.className} ${pathname === href ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navLinkText}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Center: Logo */}
        <Link href="/" className={styles.logoWrap} aria-label="Moj Kutak – početna">
          <div className={styles.logoRing} />
          <div className={styles.logoRingInner} />
          <Image
            src="/logo2.png"
            alt="Moj Kutak"
            width={80}
            height={80}
            priority
            className={styles.logoImg}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        {/* Right: O Meni + Trending */}
        <div className={styles.linkGroup}>
          {(links.slice(2) as NavLink[]).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`${styles.navLink} ${nunito.className} ${pathname === href ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navLinkText}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
