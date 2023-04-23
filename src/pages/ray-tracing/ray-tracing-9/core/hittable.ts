import { Vector3 } from '../../../../libs/math/vector3';
import { AABB } from './aabb';
import { Material } from './material';
import { Ray } from './ray';

/**
 * 交点记录
 */
export class HitRecord {
  p!: Vector3;
  t!: number;
  // uv 是集中点的纹理的坐标
  u!: number;
  v!: number;

  normal!: Vector3;
  /**
   * 是否面朝外
   */
  frontFace!: boolean;
  /**
   * PTR材质，光线相交点
   */
  materialPtr!: Material;

  /**
   * 根据面向不同，设置不同的法线。
   * 比如，如果光线在球体内部，那么法线应该是朝内的
   */
  setFaceNormal(ray: Ray, outwardNormal: Vector3) {
    this.frontFace = ray.direction.dot(outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : outwardNormal.multiply(-1);
  }
}

/**
 * 可求交
 */
export interface Hittable {
  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined;
  /**
   * 计算AABB
   *
   * @param time0
   * @param time1
   * @param outputBox
   */
  boundingBox(time0: number, time1: number): AABB | undefined;
}

export class Translate implements Hittable {}
