// Line icons and food glyphs from the original design, as one component.
const LINE = {
  bike: <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h2l3 11.5M5.5 17.5 9 10h6l3.5 7.5M9 10 7.5 6H5" /></>,
  store: <path d="M3 9l1.5-5h15L21 9M3 9h18M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8M10 20v-5h4v5" />,
  bag: <><path d="M5 7h14l-1 13H6L5 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  left: <path d="m15 5-7 7 7 7" />,
  right: <path d="m9 5 7 7-7 7" />,
  down: <path d="m6 9 6 6 6-6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  fb: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  box: <><path d="m21 8-9-5-9 5v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" /></>,
  wallet: <path d="M19 7V5a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-4a2 2 0 0 0 0 4h4v-4M3 6v13a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  note: <path d="M4 4h16v12l-4 4H4zM16 20v-4h4M8 9h8M8 13h5" />,
};

const GLYPH = {
  tag: "M4 24V7a3 3 0 0 1 3-3h17l20 20-20 20L4 24Zm11-11a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  flame: "M24 3c2 8 12 12 12 25a12 12 0 0 1-24 0c0-6 3-9 5-11 1 4 3 6 5 7-2-8 0-15 2-21Z",
  drum: "M30 6c7 0 12 5 12 12 0 8-7 13-14 13-2 0-3 1-4 2l-5 5a4 4 0 1 1-6 2 4 4 0 1 1 2-6l5-5c1-1 2-2 2-4C22 13 24 6 30 6Z",
  pizza: "M24 4C14 4 6 7 4 9l20 35L44 9c-2-2-10-5-20-5Zm-5 12a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-2 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
  burger: "M6 20C6 12 14 7 24 7s18 5 18 13H6Zm-1 5h38a2 2 0 0 1 0 5H5a2 2 0 0 1 0-5Zm2 9h34c0 4-3 7-7 7H14c-4 0-7-3-7-7Z",
  cup: "M8 16h26v12a12 12 0 0 1-12 12h-2A12 12 0 0 1 8 28V16Zm26 3h3a6 6 0 0 1 0 12h-4v-4h4a2 2 0 0 0 0-4h-3v-4ZM16 4c2 3-2 5 0 8h-3c-2-3 2-5 0-8h3Zm7 0c2 3-2 5 0 8h-3c-2-3 2-5 0-8h3Z",
  cake: "M8 22h32v18H8V22Zm-2-6h36v4H6v-4Zm16-9 2-3 2 3a2 2 0 1 1-4 0Zm-2 5h8v3h-8v-3Z",
  glass: "M10 6h28l-4 36H14L10 6Zm4 4 1 8h18l1-8H14Z M30 2h4l-4 8h-3z",
  fries: "M14 6h4v14h-4zM20 4h4v16h-4zM26 6h4v14h-4zM32 8h4v12h-4zM10 20h28l-3 24H13L10 20Z",
  plus: "M20 8h8v12h12v8H28v12h-8V28H8v-8h12z",
  fish: "M3 24C9 14 21 10 31 14l9-7v34l-9-7C21 38 9 34 3 24Zm9-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
};

export default function Icon({ name, className = "size-5", strokeWidth = 2 }) {
  if (GLYPH[name] && !LINE[name]) {
    return (
      <svg viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
        <path d={GLYPH[name]} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {LINE[name]}
    </svg>
  );
}

export function Glyph({ name, className }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <path d={GLYPH[name] || GLYPH.drum} />
    </svg>
  );
}
