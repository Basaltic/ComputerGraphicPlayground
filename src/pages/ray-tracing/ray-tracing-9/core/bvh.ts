import { randomInt } from '../../../../libs/utils/number';
import { AABB } from './aabb';
import { HitRecord, Hittable } from './hittable';
import { Ray } from './ray';

/**
 * BVH(Bounding Volumes Hierarchies)
 * 一种类似二叉树的结构
 */
export class BVHNode implements Hittable {
  left!: Hittable;
  right!: Hittable;
  box!: AABB;

  constructor(hittableObjList: Hittable[], time0: number, time1: number) {
    this.build(hittableObjList, time0, time1);
  }

  /**
   * 构建BVH树
   *  - 随机选择一个轴
   *  - 排序
   *  - 左右分成两个子树
   * @param hittableList
   * @param start
   * @param end
   * @param time0
   * @param time1
   */
  private build(hittableObjList: Hittable[], time0: number, time1: number) {
    // 随机选择 x, y, z 轴
    // 0: x, 1: y, 2: z
    const axis = randomInt(0, 2);

    const boxCompare = (a: Hittable, b: Hittable) => boxCompareFunc(a, b, axis);

    // 剩余对象数量
    const objectSpan = hittableObjList.length;

    if (objectSpan === 1) {
      this.left = this.right = hittableObjList[0];
    } else if (objectSpan === 2) {
      if (boxCompare(hittableObjList[0], hittableObjList[1]) < 0) {
        this.left = hittableObjList[0];
        this.right = hittableObjList[1];
      } else {
        this.left = hittableObjList[1];
        this.right = hittableObjList[0];
      }
    } else {
      hittableObjList = hittableObjList.sort(boxCompare);

      const mid = Math.floor(hittableObjList.length / 2);

      this.left = new BVHNode(hittableObjList.slice(0, mid), time0, time1);
      this.right = new BVHNode(hittableObjList.slice(mid, hittableObjList.length), time0, time1);
    }

    const boxLeft = this.left.boundingBox(time0, time1);
    const boxRight = this.right.boundingBox(time0, time1);

    if (!boxLeft || !boxRight) {
      throw new Error('No bounding box in bvh node');
    }

    this.box = AABB.surroundingBox(boxLeft, boxRight);
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | undefined {
    const boxHitted = this.box.hit(ray, tMin, tMax);
    if (!boxHitted) {
      return;
    }

    const leftHitted = this.left.hit(ray, tMin, tMax);
    const rightHitted = this.right.hit(ray, tMin, leftHitted ? leftHitted.t : tMax);

    return leftHitted || rightHitted;
  }

  boundingBox(time0: number, time1: number): AABB | undefined {
    return this.box;
  }
}

function boxCompareFunc(a: Hittable, b: Hittable, axis: number): number {
  const boxA = a.boundingBox(0, 0);
  const boxB = b.boundingBox(0, 0);
  if (!boxA || !boxB) {
    throw new Error('No bounding box');
  }

  // return boxA.minimum.values[axis] - boxB.minimum.values[axis];
  return boxB.minimum.values[axis] - boxA.minimum.values[axis];
}
