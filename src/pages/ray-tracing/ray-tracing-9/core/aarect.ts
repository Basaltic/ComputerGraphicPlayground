import { Vector3 } from '../../../../libs/math/vector3';
import { AABB } from './aabb';
import { HitRecord, Hittable } from './hittable';
import { Material } from './material';
import { Ray } from './ray';

/**
 * xy平面的 方形
 */
export class XYRect implements Hittable {
  /**
   *
   *
   * @param x0
   * @param x1
   * @param y0
   * @param y1
   * @param k
   */
  constructor(public x0: number, public x1: number, public y0: number, public y1: number, public k: number, public mat: Material) {}

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const t = (this.k - ray.origin.z) / ray.direction.z;
    if (t < tMin || t > tMax) {
      return;
    }

    const x = ray.origin.x + t * ray.direction.x;
    const y = ray.origin.y + t * ray.direction.y;
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
      return undefined;
    }

    const rec = new HitRecord();

    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;
    const outwardNormal = new Vector3(0, 0, 1);
    rec.setFaceNormal(ray, outwardNormal);
    rec.materialPtr = this.mat;
    rec.p = ray.at(t);
    return rec;
  }

  boundingBox(time0: number, time1: number): AABB | undefined {
    // 添加一点厚度，相当于是一个很薄的立方体
    const box = new AABB(new Vector3(this.x0, this.y0, this.k - 0.0001), new Vector3(this.x1, this.y1, this.k + 0.0001));
    return box;
  }
}

/**
 * xz平面的 方形
 */
export class XZRect implements Hittable {
  /**
   *
   * @param x0
   * @param x1
   * @param z0
   * @param z1
   * @param k
   */
  constructor(public x0: number, public x1: number, public z0: number, public z1: number, public k: number, public mat: Material) {}

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const t = (this.k - ray.origin.y) / ray.direction.y;
    if (t < tMin || t > tMax) {
      return;
    }

    const x = ray.origin.x + t * ray.direction.x;
    const z = ray.origin.z + t * ray.direction.z;
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
      return undefined;
    }

    const rec = new HitRecord();

    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = new Vector3(0, 1, 0);
    rec.setFaceNormal(ray, outwardNormal);
    rec.materialPtr = this.mat;
    rec.p = ray.at(t);
    return rec;
  }

  boundingBox(time0: number, time1: number): AABB | undefined {
    // 添加一点厚度，相当于是一个很薄的立方体
    const box = new AABB(new Vector3(this.x0, this.k - 0.0001, this.z0), new Vector3(this.x1, this.k + 0.0001, this.z1));
    return box;
  }
}

/**
 * yz平面的 方形
 */
export class YZRect implements Hittable {
  /**
   *
   *
   * @param y0
   * @param y1
   * @param z0
   * @param z1
   * @param k
   */
  constructor(public y0: number, public y1: number, public z0: number, public z1: number, public k: number, public mat: Material) {}

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const t = (this.k - ray.origin.x) / ray.direction.x;
    if (t < tMin || t > tMax) {
      return;
    }

    const y = ray.origin.y + t * ray.direction.y;
    const z = ray.origin.z + t * ray.direction.z;

    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
      return undefined;
    }

    const rec = new HitRecord();

    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = new Vector3(1, 0, 0);
    rec.setFaceNormal(ray, outwardNormal);
    rec.materialPtr = this.mat;
    rec.p = ray.at(t);
    return rec;
  }

  boundingBox(time0: number, time1: number): AABB | undefined {
    // 添加一点厚度，相当于是一个很薄的立方体
    const box = new AABB(new Vector3(this.k - 0.0001, this.y0, this.z0), new Vector3(this.k + 0.0001, this.y1, this.z1));
    return box;
  }
}
