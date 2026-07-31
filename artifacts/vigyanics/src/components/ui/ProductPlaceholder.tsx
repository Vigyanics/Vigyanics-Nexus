/**
 * Pure CSS-based product placeholder — no images, no external deps, always works.
 * Uses styled divs with CSS gradients and icons instead of <img> tags.
 */

import { Zap } from "lucide-react";

// ─── Color helpers ───────────────────────────────────────────────────────────

function colorToBackground(color: string): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) || 0;
  const g = parseInt(hex.slice(2, 4), 16) || 0;
  const b = parseInt(hex.slice(4, 6), 16) || 0;
  const mix = (c: number) => Math.round(255 - (255 - c) * 0.08);
  return "rgb(" + mix(r) + "," + mix(g) + "," + mix(b) + ")";
}

function lighten(rgb: string, amount: number): string {
  const match = rgb.match(/\d+/g);
  if (!match) return rgb;
  const r = Math.min(255, Number(match[0]) + amount);
  const g = Math.min(255, Number(match[1]) + amount);
  const b = Math.min(255, Number(match[2]) + amount);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// ─── Components ──────────────────────────────────────────────────────────────

interface PlaceholderProps {
  color?: string;
  label?: string;
  className?: string;
}

/**
 * A pure CSS placeholder to show when a product image is missing.
 * No <img> tag — just styled divs with gradient backgrounds and a centered icon.
 */
export function ProductImagePlaceholder({
  color = "#00D4FF",
  label = "",
  className = "w-full h-full",
}: PlaceholderProps) {
  const bgColor = color;
  const bg = colorToBackground(color);
  const gridId = "grid-" + color.replace("#", "");

  return (
    <div
      className={"flex flex-col items-center justify-center relative overflow-hidden " + className}
      style={{
        background: "linear-gradient(135deg, " + bg + ", " + lighten(bg, 10) + ")",
      }}
    >
      {/* Subtle grid SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id={gridId} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={bgColor} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={"url(#" + gridId + ")"} />
      </svg>

      {/* Glow orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "60%",
          paddingBottom: "60%",
          background: "radial-gradient(circle, " + bgColor + "15, transparent 70%)",
        }}
      />

      {/* Circuit icon */}
      <div
        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: bgColor + "20",
          border: "2px solid " + bgColor + "30",
        }}
      >
        <Zap className="w-8 h-8" style={{ color: bgColor, opacity: 0.5 }} />
      </div>

      {/* Label */}
      {label ? (
        <span
          className="relative z-10 mt-2 text-xs font-semibold text-center px-2 leading-tight"
          style={{ color: bgColor + "99" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A thumbnail-sized placeholder for the gallery strip
 */
export function ThumbnailPlaceholder({
  color = "#00D4FF",
  isActive = false,
}: {
  color?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{
        background: color + (isActive ? "20" : "08"),
        border: isActive ? "2px solid " + color : "2px solid transparent",
      }}
    >
      <Zap className="w-6 h-6" style={{ color: color, opacity: isActive ? 1 : 0.4 }} />
    </div>
  );
}

