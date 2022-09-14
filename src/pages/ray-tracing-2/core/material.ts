import { Vector3 } from '../../../libs/math/vector3';
import { Color } from '../../../libs/utils/color';
import { HitRecord } from './hittable';
import { Ray } from './ray';

/**
 * 材质
 */
export interface Material {
  /**
   *
   * @param rayIn
   * @param hitRecord
   * @param attenuation 衰减
   * @param scattered
   */
  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, Color, Ray];
}

/**
 * 漫反射材质
 */
export class Lambertian implements Material {
  albedo: Color;

  constructor(c: Color) {
    this.albedo = c;
  }
  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, Color, Ray] {
    let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector3());

    if (scatterDirection.nearZero()) {
      scatterDirection = hitRecord.normal;
    }

    const scattered = new Ray(hitRecord.p, scatterDirection);
    const attenuation = this.albedo;
    return [true, attenuation, scattered];
  }
}

/**
 * 金属材质
 */
export class Metal implements Material {
  albedo: Color;

  constructor(c: Color) {
    this.albedo = c;
  }

  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, Color, Ray] {
    const reflected = Vector3.refect(rayIn.direction.normalized(), hitRecord.normal);
    const scattered = new Ray(hitRecord.p, reflected);
    const attenuation = this.albedo;

    // 保证在同一个半球面
    const success = scattered.direction.dot(hitRecord.normal) > 0;
    return [success, attenuation, scattered];
  }
}
