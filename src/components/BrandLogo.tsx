import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  /** When true, logo sits on a light plate (for dark headers/footers) */
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
};

const heights = {
  sm: 44,
  md: 64,
  lg: 76,
};

export function BrandLogo({
  href = "/",
  className,
  onDark = false,
  size = "md",
}: Props) {
  const h = heights[size];

  const img = (
    <span
      className={cn(
        "inline-flex items-center transition duration-300 hover:scale-[1.02]",
        onDark && "rounded-xl bg-white px-2.5 py-1.5 shadow-sm",
        className,
      )}
    >
      <Image
        src="/Logo.png"
        alt="Tripzo Holidays"
        width={Math.round(h * 1.75)}
        height={h}
        className="h-auto w-auto object-contain"
        style={{ height: h, width: "auto" }}
        priority
      />
    </span>
  );

  if (!href) return img;
  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="Tripzo Holidays home">
      {img}
    </Link>
  );
}
