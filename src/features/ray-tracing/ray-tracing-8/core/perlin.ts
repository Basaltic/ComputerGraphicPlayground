import { Vector3 } from '../../../../libs/math/vector3';
import * as noise from '../../../../libs/third-party/perlin';

/**
 * 柏林噪声
 */
export class Perlin {
  noise(p: Vector3) {
    const value = noise.simplex3(p.x, p.y, p.z);
    return value;
  }
}
