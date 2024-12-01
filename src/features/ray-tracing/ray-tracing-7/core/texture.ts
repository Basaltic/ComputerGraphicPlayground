import { Vector3 } from '../../../../libs/math/vector3';
import { RGBColor } from '../../../../libs/utils/color';

export interface Texture {
  value(u: number, v: number, p: Vector3): Vector3;
}

export class SolidColor implements Texture {
  color: RGBColor;

  constructor(rgb: Vector3) {
    this.color = rgb as RGBColor;
  }

  value(u: number, v: number, p: Vector3): Vector3 {
    return this.color;
  }
}

export class CheckerTexture implements Texture {
  odd!: Texture;
  even!: Texture;

  constructor(odd: Texture, even: Texture) {
    this.odd = odd;
    this.even = even;
  }

  value(u: number, v: number, p: Vector3): Vector3 {
    const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
    if (sines < 0) {
      return this.odd.value(u, v, p);
    } else {
      return this.even.value(u, v, p);
    }
  }
}
