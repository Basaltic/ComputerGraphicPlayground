import { Vector3 } from '../../../../libs/math/vector3';
import { AABB } from './aabb';
import { XYRect, XZRect, YZRect } from './aarect';
import { HitRecord, Hittable } from './hittable';
import { HittableList } from './hittable-list';
import { Material } from './material';
import { Ray } from './ray';

export class Box implements Hittable {
  mat: Material;
  boxMin: Vector3;
  boxMax: Vector3;
  sides: HittableList;

  constructor(p0: Vector3, p1: Vector3, mat: Material) {
    this.mat = mat;
    this.boxMin = p0;
    this.boxMax = p1;
    this.sides = new HittableList();

    this.sides.add(new XYRect(p0.x, p1.x, p0.y, p1.y, p1.z, mat));
    this.sides.add(new XYRect(p0.x, p1.x, p0.y, p1.y, p0.z, mat));

    this.sides.add(new XZRect(p0.x, p1.x, p0.z, p1.z, p1.y, mat));
    this.sides.add(new XZRect(p0.x, p1.x, p0.z, p1.z, p0.y, mat));

    this.sides.add(new YZRect(p0.y, p1.y, p0.z, p1.z, p1.x, mat));
    this.sides.add(new YZRect(p0.y, p1.y, p0.z, p1.z, p0.x, mat));
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    return this.sides.hit(ray, tMin, tMax);
  }
  boundingBox(time0: number, time1: number): AABB | undefined {
    return new AABB(this.boxMin, this.boxMax);
  }
}
