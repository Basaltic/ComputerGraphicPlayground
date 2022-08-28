import { Vector3 } from '../../../libs/math/vector3';

export class Color {
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
