import { Vector3 } from '../../../../libs/math/vector3';
import { HitRecord, Hittable } from './hittable';
import { Ray } from './ray';

/**
 * 球体类，可与光线相交
 */
export class Sphere implements Hittable {
  /**
   * 球的中点
   */
  center: Vector3;
  /**
   * 球半径
   */
  radius: number;

  constructor(center: Vector3, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  /**
   *
   * @param ray
   * @param tMin
   * @param tMax
   * @param hitRecord
   */
  hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean {
    const oc = ray.origin.subtract(this.center);

    const a = ray.direction.getMagnitudeSquare();
    const halfB = oc.dot(ray.direction);
    const c = oc.getMagnitudeSquare() - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) return false;

    const sqrtd = Math.sqrt(discriminant);

    // 在可接受的范围内，寻找最近的相交点
    let root = (-halfB - sqrtd) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a;
      if (root < tMin || tMax > root) {
        return false;
      }
    }

    hitRecord.t = root;
    hitRecord.p = ray.at(hitRecord.t);
    const outwardNormal = hitRecord.p.subtract(this.center).divide(this.radius);
    hitRecord.setFaceNormal(ray, outwardNormal);

    return true;
  }
}
