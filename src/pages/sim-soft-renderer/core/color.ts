import { Vector3 } from '../../../libs/math/vector3';

export class Color {
  r: number;
  g: number;
  b: number;
  a: number = 1;

  constructor(r: number, g: number, b: number, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toHex() {
    return (this.r << 16) | (this.g << 8) | this.b;
  }

  static fromVector3(v: Vector3) {
    return new Color(v.x, v.y, v.z);
  }

  /**
   * 10进制hex
   *
   * @param rgb
   * @returns
   */
  static convertRGBToHex(rgb: Vector3) {
    return (rgb.x << 16) | (rgb.y << 8) | rgb.z;
  }
}

export function randomRgba() {
  const round = Math.round;
  const rand = Math.random;
  const s = 255;
  // return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  const r = round(rand() * s);
  const g = round(rand() * s);
  const b = round(rand() * s);

  return new Vector3(r, g, b);
}
