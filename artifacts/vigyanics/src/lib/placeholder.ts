/**
 * Placeholder utilities — generates static SVG data URIs.
 * Uses simple base64-encoded SVGs as fallback image sources.
 */

/** Generate a placeholder image URL (simple SVG dot pattern as base64 data URI) */
export function generatePlaceholderUrl(
  _name: string,
  color: string,
  _index?: number,
  _w?: number,
  _h?: number,
): string {
  return makeColorSvg(color);
}

export function generatePlaceholderThumbnails(
  name: string,
  color: string,
  count?: number,
): string[] {
  const url = generatePlaceholderUrl(name, color);
  return Array(count ?? 4).fill(url);
}

export function generateNoImageUrl(): string {
  return makeColorSvg("#94a3b8");
}

/** Error handler for <img> tags — falls back to gray SVG */
export function handleImageError(_color?: string) {
  let done = false;
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (done) return;
    done = true;
    e.currentTarget.src = generateNoImageUrl();
  };
}

// ─── Build a minimal SVG data URI ────────────────────────────────────────────

function makeColorSvg(color: string): string {
  const hex = color.replace("#", "").slice(0, 6);
  // Minimal valid SVG — no text, only shapes (safe for btoa)
  const xml =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">` +
    `<rect width="600" height="600" fill="#${hex}" opacity="0.08"/>` +
    `<circle cx="300" cy="300" r="120" fill="#${hex}" opacity="0.06"/>` +
    `<circle cx="300" cy="300" r="50" fill="none" stroke="#${hex}" stroke-width="2" opacity="0.2"/>` +
    `<circle cx="300" cy="300" r="20" fill="#${hex}" opacity="0.25"/>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${btoa(xml)}`;
}

