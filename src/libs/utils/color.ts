import { Vector3 } from '../math/vector3';
import { clamp, randomNum } from './number';

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
export function convertRGBToHex(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b;
}

/**
 * 10进制hex 转换为 rgb
 *
 * @param hex
 * @returns
 */
export function convertHexToRGB(hex: number) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;

  return new Vector3(r, g, b);
}

export function writeColor(r: number, g: number, b: number, samplesPerPixel: number = 1) {
  r /= samplesPerPixel;
  g /= samplesPerPixel;
  b /= samplesPerPixel;

  // gamma校正，近似 gamma = 2.0，https://en.wikipedia.org/wiki/Gamma_correction
  r = Math.sqrt(r);
  g = Math.sqrt(g);
  b = Math.sqrt(b);

  r = clamp(r, 0, 0.999);
  g = clamp(g, 0, 0.999);
  b = clamp(b, 0, 0.999);

  r *= 256;
  g *= 256;
  b *= 256;
  return convertRGBToHex(r, g, b);
}
