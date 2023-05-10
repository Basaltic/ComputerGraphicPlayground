import { Vector3 } from '../../../../libs/math/vector3';
import { Ray } from './ray';

/**
 * AABBs (Axis-Aligned Bounding Boxes)
 */
export class AABB {
  minimum: Vector3;
  maximum: Vector3;

  constructor(a: Vector3, b: Vector3) {
    this.minimum = a;
    this.maximum = b;
  }

  /**
   * 检测光线是否击中aabb
   *
   * @param ray
   * @param tMin
   * @param tMax
   * @returns
   */
  hit(ray: Ray, tMin: number, tMax: number): boolean {
    for (let i = 0; i < 3; i += 1) {
      const t0 = Math.min(
        (this.minimum.values[i] - ray.origin.values[i]) / ray.direction.values[i],
        (this.maximum.values[i] - ray.origin.values[i]) / ray.direction.values[i]
      );

      const t1 = Math.max(
        (this.minimum.values[i] - ray.origin.values[i]) / ray.direction.values[i],
        (this.maximum.values[i] - ray.origin.values[i]) / ray.direction.values[i]
      );

      tMin = Math.max(t0, tMin);
      tMax = Math.min(t1, tMax);

      if (tMax <= tMin) {
        return false;
      }
    }

    return true;
  }

  /**
   * 计算两个box的aabb
   * @param box0
   * @param box1
   */
  static surroundingBox(box0: AABB, box1: AABB) {
    const small = new Vector3(
      Math.min(box0.minimum.x, box1.minimum.x),
      Math.min(box0.minimum.y, box1.minimum.y),
      Math.min(box0.minimum.z, box1.minimum.z)
    );
    const big = new Vector3(
      Math.max(box0.maximum.x, box1.maximum.x),
      Math.max(box0.maximum.y, box1.maximum.y),
      Math.max(box0.maximum.z, box1.maximum.z)
    );

    return new AABB(small, big);
  }
}
