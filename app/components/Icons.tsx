import type { SVGProps } from "react";

// Jedan set linijskih ikona (24×24, stroke) umjesto emojija u interfejsu.

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const EyeIcon = (p: P) => (
  <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Svg>
);

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  </Svg>
);

export const PlayIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" /></Svg>
);

export const SearchIcon = (p: P) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);

export const MenuIcon = (p: P) => (
  <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
);

export const CloseIcon = (p: P) => (
  <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
);

export const ArrowRightIcon = (p: P) => (
  <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
);

export const TrendUpIcon = (p: P) => (
  <Svg {...p}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></Svg>
);

export const TrendDownIcon = (p: P) => (
  <Svg {...p}><path d="m3 7 6 6 4-4 8 8" /><path d="M15 17h6v-6" /></Svg>
);

export const CalendarIcon = (p: P) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></Svg>
);

export const PrinterIcon = (p: P) => (
  <Svg {...p}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6z" /></Svg>
);

export const ShareIcon = (p: P) => (
  <Svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Svg>
);

export const MailIcon = (p: P) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>
);

export const ListIcon = (p: P) => (
  <Svg {...p}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></Svg>
);

export const YoutubeIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.7 3.1-5.7 3.1Z" />
  </Svg>
);

export const InstagramIcon = (p: P) => (
  <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></Svg>
);

export const TiktokIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2a7.5 7.5 0 0 1-4-1.2v6.2A6 6 0 1 1 10.5 9v3.3a2.8 2.8 0 1 0 2.9 2.8V3h3.2Z" />
  </Svg>
);
