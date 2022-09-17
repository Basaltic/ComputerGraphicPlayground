import { HitRecord, Hittable } from './hittable';
import { Ray } from './ray';

export class HittableList implements Hittable {
  hittableList: Hittable[] = [];

  constructor(hittableList: Hittable[] = []) {
    this.hittableList = hittableList;
  }

  clear() {
    this.hittableList = [];
  }

  add(hittableObj: Hittable) {
    this.hittableList.push(hittableObj);
  }

  hit(ray: Ray, tMin: number, tMax: number, hitRecord: HitRecord): boolean {
    const tempHitRecord = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;

    for (const hittableObj of this.hittableList) {
      if (hittableObj.hit(ray, tMin, tMax, tempHitRecord)) {
        hitAnything = true;
        closestSoFar = tempHitRecord.t;
        hitRecord.setAll(tempHitRecord);
      }
    }

    return hitAnything;
  }
}
