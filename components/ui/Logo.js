import Image from "next/image";
import { IMAGES } from "@/data/images";

// Round brand logo. Shows a "CX" badge until a logo path is set in data/images.js.
export default function Logo({ size = 68, className = "" }) {
  if (IMAGES.logo) {
    return <Image src={IMAGES.logo} alt="Chixee logo" width={size} height={size} className={`rounded-full ${className}`} priority />;
  }
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`grid flex-none place-items-center rounded-full bg-maroon font-display text-yellow ${className}`}
      aria-label="Chixee logo"
    >
      CX
    </span>
  );
}
