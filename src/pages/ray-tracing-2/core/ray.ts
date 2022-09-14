import { Vector3 } from '../../../libs/math/vector3';

/**
 * 光线
 */
export class Ray {
  // 光线的起点，3D空间中的一个位置
  // origin of the light
  origin!: Vector3;
  // 光线的方向
  direction!: Vector3;

  constructor(o: Vector3, d: Vector3) {
    this.origin = o;
    this.direction = d;
  }

  copyFrom(ray: Ray) {
    this.origin = ray.origin;
    this.direction = ray.direction;
  }

  /**
   * 光线在t时刻传播的位置
   *
   * @param t
   */
  at(t: number) {
    return Vector3.add(this.origin, this.direction.multiply(t));
  }
}
