import Image from "next/image";
import { IMAGES } from "@/data/images";

// Round brand logo. Shows a "CX" badge if no logo path is set in data/images.js.
export default function Logo({ size = 68, className = "", priority = false }) {
  if (IMAGES.logo) {
    return <Image src={IMAGES.logo} alt="Chixee logo" width={size} height={size} style={{ width: size, height: size }} className={`flex-none rounded-full object-cover ${className}`} priority={priority} />;
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
