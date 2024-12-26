import { Vector3 } from '../../../libs/math/vector3';
import { Vertex } from './vertex';

/**
 * 三角形
 */
export class Triangle {
  /**
   * 三个顶点
   */
  vs: Vertex[];

  get v0() {
    return this.vs[0];
  }
  get v1() {
    return this.vs[1];
  }
  get v2() {
    return this.vs[2];
  }

  // 法线
  get normal() {
    // v2->v0, v1->v0 两条边向量，叉乘为其法向量
    const e1 = Vector3.subtract(this.v2.pos, this.v0.pos);
    const e2 = Vector3.subtract(this.v1.pos, this.v0.pos);

    return Vector3.crossProduct(e1, e2);
  }

  constructor(vs: Vertex[]) {
    this.vs = vs;
  }

  clone(): Triangle {
    return new Triangle([this.v0.clone(), this.v1.clone(), this.v2.clone()]);
  }

  /**
   * 获取包围盒
   */
  getBoundingBox() {
    let minX = Math.floor(Math.min(this.v0.pos.x, this.v1.pos.x, this.v2.pos.x));
    let maxX = Math.ceil(Math.max(this.v0.pos.x, this.v1.pos.x, this.v2.pos.x));
    let minY = Math.floor(Math.min(this.v0.pos.y, this.v1.pos.y, this.v2.pos.y));
    let maxY = Math.ceil(Math.max(this.v0.pos.y, this.v1.pos.y, this.v2.pos.y));

    return { minX, maxX, minY, maxY };
  }

  /**
   * 判断点 p(x,y) 是否在三角形内
   * 方法1 - 判断点 p 和三个点组成的向量 和对应的边向量的差乘结果是否是同方向
   *
   * 方法2 - 计算Q点的重心坐标，如果计算出的值存在负数，表示在三角形外，反之则在三角形内。
   *
   * @param x
   * @param y
   */
  isInside(x: number, y: number) {
    // 方法1 - 判断点 p 和三个点组成的向量 和对应的边向量的差乘结果是否是同方向
    // const a = new Vector3(this.v0.pos.x, this.v0.pos.y, 1);
    // const b = new Vector3(this.v1.pos.x, this.v1.pos.y, 1);
    // const c = new Vector3(this.v2.pos.x, this.v2.pos.y, 1);
    // const p = new Vector3(x, y, 1);

    // const ab = Vector3.subtract(b, a);
    // const bc = Vector3.subtract(c, b);
    // const ca = Vector3.subtract(a, c);

    // const ap = Vector3.subtract(p, a);
    // const bp = Vector3.subtract(p, b);
    // const cp = Vector3.subtract(p, c);

    // const v1 = ab.cross(ap).normalized();
    // const v2 = bc.cross(bp).normalized();
    // const v3 = ca.cross(cp).normalized();

    // const v12 = v1.dot(v2);
    // const v23 = v2.dot(v3);
    // const v31 = v3.dot(v1);

    // if (v12 == v23 && v23 == v31 && v1.z > 0) {
    //   return true;
    // }
    // return false;

    // 方法2 - 计算Q点的重心坐标，如果计算出的值存在负数，表示在三角形外，反之则在三角形内。
    const [alpha, beta, gamma] = this.computeBarycentric2D(x, y);
    if (alpha > 0 && beta > 0 && gamma > 0) {
      return true;
    }

    return false;
  }

  /**
   * 计算重心坐标的三个参数
   *
   * @param x
   * @param y
   * @returns
   */
  computeBarycentric2D = (x: number, y: number) => {
    const v = this.vs;

    const c1 =
      (x * (v[1].pos.y - v[2].pos.y) + (v[2].pos.x - v[1].pos.x) * y + v[1].pos.x * v[2].pos.y - v[2].pos.x * v[1].pos.y) /
      (v[0].pos.x * (v[1].pos.y - v[2].pos.y) + (v[2].pos.x - v[1].pos.x) * v[0].pos.y + v[1].pos.x * v[2].pos.y - v[2].pos.x * v[1].pos.y);

    const c2 =
      (x * (v[2].pos.y - v[0].pos.y) + (v[0].pos.x - v[2].pos.x) * y + v[2].pos.x * v[0].pos.y - v[0].pos.x * v[2].pos.y) /
      (v[1].pos.x * (v[2].pos.y - v[0].pos.y) + (v[0].pos.x - v[2].pos.x) * v[1].pos.y + v[2].pos.x * v[0].pos.y - v[0].pos.x * v[2].pos.y);
    const c3 =
      (x * (v[0].pos.y - v[1].pos.y) + (v[1].pos.x - v[0].pos.x) * y + v[0].pos.x * v[1].pos.y - v[1].pos.x * v[0].pos.y) /
      (v[2].pos.x * (v[0].pos.y - v[1].pos.y) + (v[1].pos.x - v[0].pos.x) * v[2].pos.y + v[0].pos.x * v[1].pos.y - v[1].pos.x * v[0].pos.y);

    return [c1, c2, c3];
  };
}
