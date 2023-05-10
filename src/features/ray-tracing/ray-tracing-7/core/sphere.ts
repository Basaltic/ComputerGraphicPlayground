import { Vector3 } from '../../../../libs/math/vector3';
import { AABB } from './aabb';
import { HitRecord, Hittable } from './hittable';
import { Material } from './material';
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

  /**
   * 球体的材质属性
   */
  materialPtr: Material;

  constructor(center: Vector3, radius: number, materialPtr: Material) {
    this.center = center;
    this.radius = radius;
    this.materialPtr = materialPtr;
  }

  /**
   *
   * @param ray
   * @param tMin
   * @param tMax
   */
  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const oc = ray.origin.subtract(this.center);

    const a = ray.direction.getMagnitudeSquare();
    const halfB = oc.dot(ray.direction);
    const c = oc.getMagnitudeSquare() - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) return;

    const sqrtd = Math.sqrt(discriminant);

    // 在可接受的范围内，寻找最近的相交点
    let root = (-halfB - sqrtd) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a;
      if (root < tMin || tMax > root) {
        return;
      }
    }

    const hitRecord = new HitRecord();

    hitRecord.t = root;
    hitRecord.p = ray.at(hitRecord.t);
    const outwardNormal = hitRecord.p.subtract(this.center).divide(this.radius);
    hitRecord.setFaceNormal(ray, outwardNormal);
    hitRecord.materialPtr = this.materialPtr;

    const { u, v } = Sphere.getSphereUV(outwardNormal);
    hitRecord.u = u;
    hitRecord.v = v;

    return hitRecord;
  }

  boundingBox(time0: number, time1: number): AABB {
    const outputBox = new AABB(
      this.center.subtract(new Vector3(this.radius, this.radius, this.radius)),
      this.center.add(new Vector3(this.radius, this.radius, this.radius))
    );

    return outputBox;
  }

  /**
   * 获取在球面的纹理坐标
   *
   * @param p 球体表面的一个点
   * @return 返回 uv 是球体表面的纹理坐标
   */
  static getSphereUV(p: Vector3) {
    const theta = Math.acos(-p.y);
    const phi = Math.atan2(-p.z, p.x) + Math.PI;

    return {
      u: phi / (2 * Math.PI),
      v: theta / Math.PI
    };
  }
}

export class MovingSphere implements Hittable {
  /** 通过设置球体运动开始和结束的位置和时间，来模拟运动过程 */
  center0: Vector3;
  center1: Vector3;
  time0: number;
  time1: number;
  /**
   * 球半径
   */
  radius: number;
  /**
   * 球体的材质属性
   */
  materialPtr: Material;

  constructor(center0: Vector3, center1: Vector3, time0: number, time1: number, radius: number, materialPtr: Material) {
    this.center0 = center0;
    this.center1 = center1;
    this.time0 = time0;
    this.time1 = time1;
    this.radius = radius;
    this.materialPtr = materialPtr;
  }

  center(time: number) {
    const timex = (time - this.time0) / (this.time1 - this.time0);
    const cc = this.center1.subtract(this.center0).multiply(timex);
    return this.center0.add(cc);
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const oc = ray.origin.subtract(this.center(ray.time));

    const a = ray.direction.getMagnitudeSquare();
    const halfB = oc.dot(ray.direction);
    const c = oc.getMagnitudeSquare() - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) return undefined;

    const sqrtd = Math.sqrt(discriminant);

    // 在可接受的范围内，寻找最近的相交点
    let root = (-halfB - sqrtd) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a;
      if (root < tMin || tMax > root) {
        return undefined;
      }
    }

    const hitRecord = new HitRecord();
    hitRecord.t = root;
    hitRecord.p = ray.at(hitRecord.t);
    const outwardNormal = hitRecord.p.subtract(this.center(ray.time)).divide(this.radius);
    hitRecord.setFaceNormal(ray, outwardNormal);
    hitRecord.materialPtr = this.materialPtr;

    return hitRecord;
  }

  boundingBox(time0: number, time1: number): AABB {
    const box0 = new AABB(
      this.center(time0).subtract(new Vector3(this.radius, this.radius, this.radius)),
      this.center(time0).add(new Vector3(this.radius, this.radius, this.radius))
    );

    const box1 = new AABB(
      this.center(time1).subtract(new Vector3(this.radius, this.radius, this.radius)),
      this.center(time1).add(new Vector3(this.radius, this.radius, this.radius))
    );

    const outputBox = AABB.surroundingBox(box0, box1);

    return outputBox;
  }
}
