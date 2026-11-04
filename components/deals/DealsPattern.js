import { BadgePercent, Coffee, Cookie, CupSoda, Drumstick, Fish, Flame, Gift, Hamburger, IceCreamCone, Percent, Pizza, Sandwich, Sparkles, Star, Tag, Ticket } from "lucide-react";

// Decorative background for the home "Hot Deals" band: food and offer icons scattered at angles.
// Fixed positions (in %) so it looks the same on every load; the `wide` ones only show from tablets up.
// [Icon, left %, top %, size px, rotate deg, tone, wide-only]
const SPOTS = [
  [Pizza, 2, 8, 46, -18, "m"], [Percent, 9, 62, 34, 12, "r"], [Drumstick, 16, 22, 40, 24, "m", 1], [Tag, 22, 78, 30, -10, "y"],
  [CupSoda, 29, 6, 36, 8, "m", 1], [Sparkles, 34, 48, 26, 0, "y", 1], [Hamburger, 40, 84, 42, -6, "m"], [BadgePercent, 46, 10, 40, -14, "r"],
  [Cookie, 52, 60, 32, 18, "m", 1], [Gift, 58, 18, 34, 10, "y", 1], [Fish, 63, 80, 42, -20, "m"], [Flame, 69, 4, 30, 14, "r", 1],
  [Coffee, 74, 50, 36, -8, "m", 1], [Ticket, 80, 14, 34, -24, "y"], [Sandwich, 85, 72, 40, 16, "m", 1], [Percent, 91, 34, 30, -12, "r"],
  [IceCreamCone, 96, 82, 34, 20, "m"], [Star, 97, 4, 24, 0, "y"], [Pizza, 56, 92, 30, 30, "m", 1], [Tag, 5, 92, 28, 22, "r"],
];
// Tuned for the red Hot Deals band: faint white and gold outlines.
const TONES = { m: "text-white/[.07]", r: "text-yellow/[.12]", y: "text-yellow/[.2]" };

export default function DealsPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPOTS.map(([I, x, y, s, r, tone, wide], i) => (
        <I
          key={i}
          strokeWidth={1.6}
          className={`absolute ${TONES[tone]} ${wide ? "hidden sm:block" : ""}`}
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, transform: `translate(-50%,-50%) rotate(${r}deg)` }}
        />
      ))}
    </div>
  );
}
