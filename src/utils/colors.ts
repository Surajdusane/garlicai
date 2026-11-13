// ── Hex color helpers ─────────────────────────────────────────────────────────

/**
 * Normalize a hex string: adds # if missing, expands 3-digit to 6-digit.
 * Returns null if the result is not a valid hex color.
 */
export function normalizeHex(input: string): string | null {
  let h = input.trim();

  if (!h.startsWith("#")) {
    h = "#" + h;
  }

  // Expand 3-digit shorthand
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h =
      "#" +
      h[1] +
      h[1] +
      h[2] +
      h[2] +
      h[3] +
      h[3];
  }

  if (/^#[0-9a-fA-F]{6}$/.test(h)) {
    return h.toUpperCase();
  }

  return null;
}

/**
 * Compute relative luminance (WCAG 2.x formula).
 * Returns a value 0 (black) – 1 (white).
 */
export function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number): number =>
    c <= 0.03928
      ? c / 12.92
      : ((c + 0.055) / 1.055) ** 2.4;

  return (
    0.2126 * toLinear(r) +
    0.7152 * toLinear(g) +
    0.0722 * toLinear(b)
  );
}

/**
 * Contrast ratio vs pure black (luminance = 0).
 * Minimum recommended: 4.5:1 for normal text.
 */
export function contrastOnBlack(hex: string): number {
  const L = relativeLuminance(hex);
  return (L + 0.05) / 0.05;
}