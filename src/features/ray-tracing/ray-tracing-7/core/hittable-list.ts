import { AABB } from './aabb';
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

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    let hitRecord: HitRecord | undefined;
    let closestSoFar = tMax;

    for (const hittableObj of this.hittableList) {
      const tempHitRecord = hittableObj.hit(ray, tMin, closestSoFar);
      if (tempHitRecord) {
        closestSoFar = tempHitRecord.t;
        hitRecord = tempHitRecord;
      }
    }

    return hitRecord;
  }

  boundingBox(time0: number, time1: number): AABB | undefined {
    if (this.hittableList.length <= 0) return;

    let tempBox: AABB | undefined = undefined;
    let outputBox: AABB | undefined = undefined;
    let firstBox = true;

    for (const hittableObj of this.hittableList) {
      tempBox = hittableObj.boundingBox(time0, time1);
      if (!tempBox) return;
      if (firstBox) {
        outputBox = tempBox;
      } else {
        if (outputBox) outputBox = AABB.surroundingBox(outputBox, tempBox);
      }
    }

    return outputBox;
  }
}
