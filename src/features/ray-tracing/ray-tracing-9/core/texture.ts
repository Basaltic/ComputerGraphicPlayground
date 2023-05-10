import { Vector3 } from '../../../../libs/math/vector3';
import { Bitmap } from '../../../../libs/utils/bitmap';
import { Color, convertHexToRGB } from '../../../../libs/utils/color';
import { clamp } from '../../../../libs/utils/number';
import { Perlin } from './perlin';

export interface Texture {
  value(u: number, v: number, p: Vector3): Vector3;
}

/**
 * 单色
 */
export class SolidColor implements Texture {
  color: Color;

  constructor(rgb: Vector3) {
    this.color = rgb as Color;
  }

  value(u: number, v: number, p: Vector3): Vector3 {
    return this.color;
  }
}

/**
 * 格子纹理
 */
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

/**
 * 随机噪声
 */
export class NoiseTexture implements Texture {
  noise: Perlin;

  constructor() {
    this.noise = new Perlin();
  }

  value(u: number, v: number, p: Vector3): Vector3 {
    return new Color(1, 1, 1).multiply(this.noise.noise(p));
  }
}

/**
 * 图片 纹理
 */
export class ImageTexture implements Texture {
  bitmap: Bitmap;

  constructor(bitmap: Bitmap) {
    this.bitmap = bitmap;
  }

  get width() {
    return this.bitmap.w;
  }

  get height() {
    return this.bitmap.h;
  }

  value(u: number, v: number, p: Vector3): Vector3 {
    if (!this.bitmap) return new Color(0, 1, 1);

    // 保证 uv 在 [0, 1] 的范围
    u = clamp(u, 0, 1);
    v = 1 - clamp(v, 0, 1); // TODO: check later

    // 把uv 映射到 图片的宽高
    let i = Math.floor(u * this.width);
    let j = Math.floor(v * this.height);

    if (i >= this.width) i = this.width - 1;
    if (j >= this.height) j = this.height - 1;

    const hexColor = this.bitmap.get(i, j);
    const rgbColor = convertHexToRGB(hexColor).multiply(1 / 255);
    // console.log(rgbColor);
    return rgbColor;
  }

  static async fromImageUrl(url: string) {
    const pro = new Promise<Bitmap>((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.crossOrigin = 'Anonymous';

      image.onload = function (ev) {
        const bitmap = Bitmap.fromImage(image);
        resolve(bitmap);
      };
      image.onerror = function () {
        reject();
      };
    });

    const bitmap = await pro;
    console.log(bitmap);
    return new ImageTexture(bitmap);
  }
}
