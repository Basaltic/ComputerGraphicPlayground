import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector3 } from '../../../libs/math/vector3';
import { Vector4 } from '../../../libs/math/vector4';
import { Renderer } from '../core/renderer';
import { Vertex } from './vertex';
import { IMesh } from './mesh';
import { getViewMatrix, getModelMatrix, getProjectionMatrix } from '../util/common';
import { getState } from './globale-state';

/**
 * 三角形
 */
export class Triangle implements IMesh {
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

  constructor(vs: Vertex[], private renderer: Renderer) {
    this.vs = vs;
  }

  clone(): IMesh {
    return new Triangle([this.v0.clone(), this.v1.clone(), this.v2.clone()], this.renderer);
  }

  /**
   * 获取包围盒
   */
  getBoundingBox() {
    const minX = Math.floor(Math.min(this.v0.pos.x, this.v1.pos.x, this.v2.pos.x));
    const maxX = Math.ceil(Math.max(this.v0.pos.x, this.v1.pos.x, this.v2.pos.x));
    const minY = Math.floor(Math.min(this.v0.pos.y, this.v1.pos.y, this.v2.pos.y));
    const maxY = Math.ceil(Math.max(this.v0.pos.y, this.v1.pos.y, this.v2.pos.y));

    return {
      minX,
      maxX,
      minY,
      maxY
    };
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

    const [alpha, beta, gamma] = this.computeBarycentric2D(x, y);

    if (alpha > 0 && beta > 0 && gamma > 0) {
      return true;
    }

    return false;
  }

  getMvp() {
    const { eye, fovy, aspect, zfar, znear } = this.renderer.camera;

    const { rotate, scale, translate } = getState();
    const { rx, ry, rz } = rotate;
    const { tx, ty, tz } = translate;
    const { sx, sy, sz } = scale;

    const view = getViewMatrix(eye);
    const model = getModelMatrix({ zRotationAngle: rz, yRotationAngle: ry, xRotationAngle: rx }, { tx, ty, tz }, { sx, sy, sz });
    const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    console.log(model.values);

    return mvp;
  }

  /**
   * mvp变换
   */
  transformMVP(mvp: Matrix4) {
    // console.log(this.v0.pos.toString());

    const tm = Matrix4.createBy2dArray([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);

    // 普通的点转换为齐次坐标的点
    const v0 = this.v0.pos.toVector4();
    const v1 = this.v1.pos.toVector4();
    const v2 = this.v2.pos.toVector4();

    // mvp变换
    let v00 = tm.multiplyByVector4(v0);
    let v11 = tm.multiplyByVector4(v1);
    let v22 = tm.multiplyByVector4(v2);

    console.log(tm.values, v0.toString(), v00.toString());

    v00 = mvp.multiplyByVector4(v00);
    v11 = mvp.multiplyByVector4(v11);
    v22 = mvp.multiplyByVector4(v22);

    // 齐次坐标归一
    v00 = v00.divide(v00.w);
    v11 = v11.divide(v11.w);
    v22 = v22.divide(v22.w);

    console.log(mvp.values, v00.toString(), this.v0.pos.toString(), v00.w);

    this.v0.pos = v00.toVec3();
    this.v1.pos = v11.toVec3();
    this.v2.pos = v22.toVec3();
  }

  /**
   * 视口变换
   */
  transfromViewport() {
    const { width, height, camera } = this.renderer;
    const { zfar, znear } = camera;
    const f1 = (Math.abs(zfar) - Math.abs(znear)) / 2;
    const f2 = (Math.abs(zfar) + Math.abs(znear)) / 2;

    for (let i = 0; i < this.vs.length; i += 1) {
      const vertex = this.vs[i];
      const v = vertex.pos;

      const x = 0.5 * width * (v.x + 1);
      const y = 0.5 * height * (v.y + 1);
      const z = v.z * f1 + f2;

      vertex.pos = new Vector3(x, y, z);
    }

    // console.log(this.v0.pos.toString());
  }

  render() {
    const mvp = this.getMvp();
    this.transformMVP(mvp);
    this.transfromViewport();

    const { minX, maxX, minY, maxY } = this.getBoundingBox();

    for (let i = minX; i < maxX; i++) {
      for (let j = minY; j < maxY; j++) {
        // 没有抗锯齿
        this.doRenderPixel(i, j);
      }
    }
  }

  /**
   *
   * @param triangle
   * @param antiAliasN
   * @param vw
   * @param vh
   * @param i
   * @param j
   * @returns
   */
  private doRenderPixelWithMsaa = (
    triangle: Triangle,
    antiAliasN: number,
    vw: number,
    vh: number,
    i: number,
    j: number,
    frameBuffer: number[][],
    zBuffer: number[][]
  ) => {
    const ysqrt = antiAliasN * antiAliasN;

    const gap = 1 / (antiAliasN * 2);
    const ind = i + (vh - j) * vw;

    let count = 0;
    for (let x = 1; x <= ysqrt; x++) {
      const row = Math.ceil(x / antiAliasN);
      const col = x % antiAliasN;

      const xx = i + (col * 2 - 1) * gap;
      const yy = j + (row * 2 - 1) * gap;

      const is_inside_triangle = triangle.isInside(xx, yy);
      if (is_inside_triangle === true) {
        const [alpha, beta, gamma] = this.computeBarycentric2D(xx, yy);

        const w = 1 / (alpha + beta + gamma);
        let z_interpolated = alpha * triangle.v0.pos.z + beta * triangle.v1.pos.z + gamma * triangle.v2.pos.z;

        z_interpolated *= w;
        const z_depth = z_interpolated;

        if (!zBuffer[ind]) zBuffer[ind] = [];

        const old_z_depth = zBuffer[ind][x - 1];

        if (old_z_depth === undefined || old_z_depth < z_depth) {
          zBuffer[ind][x - 1] = z_depth;
          count += 1;
        }
      }
    }

    let frame_color = Vector3.fromArray(frameBuffer[ind] || [255, 255, 255]).multiply((ysqrt - count) / ysqrt);
    let current_color = triangle.v0.color.multiply(count / ysqrt);

    frameBuffer[ind] = frame_color.add(current_color).toArray();
  };

  /**
   *
   * @param triangle
   * @param vw
   * @param vh
   * @param i
   * @param j
   */
  private doRenderPixel = (i: number, j: number) => {
    if (this.isInside(i, j)) {
      const [alpha, beta, gamma] = this.computeBarycentric2D(i, j);

      const x = i;
      const y = this.renderer.height - j;

      const zDepth = alpha * this.v0.pos.z + beta * this.v1.pos.z + gamma * this.v2.pos.z;

      const r = alpha * this.v0.color.x + beta * this.v1.color.x + gamma * this.v2.color.x;
      const g = alpha * this.v0.color.y + beta * this.v1.color.y + gamma * this.v2.color.y;
      const b = alpha * this.v0.color.z + beta * this.v1.color.z + gamma * this.v2.color.z;

      const color = new Vector3(r, g, b);

      this.renderer.renderPixel(new Vector3(x, y, zDepth), color);
    }
  };

  /**
   * 计算重心坐标的三个参数
   *
   * @param x
   * @param y
   * @returns
   */
  private computeBarycentric2D = (x: number, y: number) => {
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

  toString() {
    return ``;
  }
}
