// "Hot Deals" badge: a glowing flame with a red disc and a white % in the middle.
export default function HotBadge({ className = "size-14" }) {
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hb-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e3262d" />
          <stop offset=".45" stopColor="#ff7a1a" />
          <stop offset="1" stopColor="#ffd23f" />
        </linearGradient>
        <radialGradient id="hb-disc" cx=".4" cy=".35" r=".75">
          <stop offset="0" stopColor="#ff4a4f" />
          <stop offset="1" stopColor="#a3161b" />
        </radialGradient>
      </defs>
      {/* outer flame */}
      <path fill="url(#hb-flame)" d="M33 2c3 9 14 15 18 25 3 6 4 11 3 16 5-3 7-8 7-13 4 6 4 14 1 21-4 11-15 19-29 19S6 62 3 50C0 40 4 31 10 25c0 6 2 10 6 12-1-9 3-17 9-23 5-5 8-8 8-12Z" />
      {/* disc with % */}
      <circle cx="32" cy="46" r="19" fill="url(#hb-disc)" stroke="#ffc20e" strokeWidth="3" />
      <g fill="#fff">
        <circle cx="25.5" cy="39.5" r="4.2" />
        <circle cx="38.5" cy="52.5" r="4.2" />
        <path d="M38.6 35.4l3.2 2.6-16.4 19.6-3.2-2.6z" />
      </g>
    </svg>
  );
}
