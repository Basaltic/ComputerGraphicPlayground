import { Vector3 } from '../math/vector3';
import { clamp } from './number';

/**
 * 颜色类，其实就是向量的alias
 */
export class Color extends Vector3 {
  get r() {
    return this.x;
  }

  get g() {
    return this.y;
  }

  get b() {
    return this.z;
  }
}

/**
 * 10进制hex
 *
 * @param
 * @returns
 */
export function convertRGBToHex(r: number, g: number, b: number, samplesPerPixel: number = 1) {
  r /= samplesPerPixel;
  g /= samplesPerPixel;
  b /= samplesPerPixel;

  r = clamp(r, 0, 0.999);
  g = clamp(g, 0, 0.999);
  b = clamp(b, 0, 0.999);

  r *= 255.999;
  g *= 255.999;
  b *= 255.999;

  return (r << 16) | (g << 8) | b;
}
