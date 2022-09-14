import { Vector3 } from '../../../libs/math/vector3';
import { Ray } from './ray';

/**
 * 交点记录
 */
export class HitRecord {
  p!: Vector3;
  t!: number;
  normal!: Vector3;
  /**
   * 是否面朝外
   */
  frontFace!: boolean;

  /**
   * 根据面向不同，设置不同的法线。
   * 比如，如果光线在球体内部，那么法线应该是朝内的
   */
  setFaceNormal(ray: Ray, outwardNormal: Vector3) {
    this.frontFace = ray.direction.dot(outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : outwardNormal.multiply(-1);
  }

  setAll(rec: HitRecord) {
    this.p = rec.p;
    this.t = rec.t;
    this.normal = rec.normal;
    this.frontFace = rec.frontFace;
  }
}

/**
 * 可求交
 */
export interface Hittable {
  hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean;
}
