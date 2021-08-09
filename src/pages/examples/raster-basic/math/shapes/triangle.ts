import { Vector3 } from '../vector3';

/**
 * 三角形
 */
export class Triangle {
  v: Vector3[];
  colors: Vector3[];

  // 法线
  normal: Vector3;

  get v0() {
    return this.v[0];
  }
  get v1() {
    return this.v[1];
  }
  get v2() {
    return this.v[2];
  }

  constructor(v: Vector3[], colors: Vector3[]) {
    this.v = v;
    this.colors = colors;

    const v0 = this.v[0];
    const v1 = this.v[1];
    const v2 = this.v[2];

    // v2->v0, v1->v0 两条边向量，叉乘为其法向量
    const e1 = Vector3.subtract(v2, v0);
    const e2 = Vector3.subtract(v1, v0);

    this.normal = Vector3.crossProduct(e1, e2);
  }

  /**
   * 判断点 p(x,y) 是否在三角形内
   * - 判断点 p 和三个点组成的向量 和对应的边向量的差乘结果是否是同方向
   * @param x
   * @param y
   */
  isInside(x: number, y: number) {
    const a = new Vector3(this.v[0].x, this.v[0].y, 0);
    const b = new Vector3(this.v[1].x, this.v[1].y, 0);
    const c = new Vector3(this.v[2].x, this.v[2].y, 0);
    const p = new Vector3(x, y, 0);

    const ab = Vector3.subtract(b, a);
    const bc = Vector3.subtract(c, b);
    const ca = Vector3.subtract(a, c);

    const ap = Vector3.subtract(p, a);
    const bp = Vector3.subtract(p, b);
    const cp = Vector3.subtract(p, c);

    const v1 = ab.cross(ap).normalized();
    const v2 = bc.cross(bp).normalized();
    const v3 = ca.cross(cp).normalized();

    const v12 = v1.dot(v2);
    const v23 = v2.dot(v3);
    const v31 = v3.dot(v1);

    if (v12 == v23 && v23 == v31) {
      return true;
    }

    return false;
  }
}
