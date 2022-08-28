/**
 * Limit value in a range [min, max]
 *
 * @param v
 * @param min
 * @param max
 * @returns
 */
export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
