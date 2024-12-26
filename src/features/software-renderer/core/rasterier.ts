import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector3 } from '../../../libs/math/vector3';
import { Bitmap } from '../../../libs/utils/bitmap';
import { RGBColor } from '../../../libs/utils/color';
import { Camera } from './camera';
import { Triangle } from './triangle';
import { getModelMatrix, getProjectionMatrix, getViewMatrix } from '../util/common';

export type RendererConfigs = {
  width: number;
  height: number;
  camera: Camera;
};

/**
 * 光栅化渲染器 - 真正把像素绘制到屏幕中
 * Draw to the screen
 */
export class Rasterier {
  width: number;
  height: number;

  // frame buffer
  frameBuffer: Bitmap;
  // depth buffer
  zDepthBuffer: number[];

  camera: Camera;

  constructor(configs: RendererConfigs) {
    const { width, height, camera } = configs;

    this.width = width;
    this.height = height;

    this.frameBuffer = new Bitmap(width, height);
    this.zDepthBuffer = [];

    this.camera = camera;
  }

  clear() {
    this.frameBuffer = new Bitmap(this.width, this.height);
    this.zDepthBuffer = [];
  }

  drawLine() {}

  drawSphere() {}

  drawTriangles(triangles: Triangle[]) {
    this.clear();

    const mvp = this.getMvp();
    const { zfar, znear } = this.camera;

    for (const triangle of triangles) {
      const clonedTriangle = triangle.clone();
      this.transformMvp(clonedTriangle, mvp);
      this.transfromViewport(clonedTriangle, zfar, znear);

      // 真实的逐像素绘制到画布中
      // TODO: MSAA
      const { minX, maxX, minY, maxY } = clonedTriangle.getBoundingBox();
      for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
          this.renderTrianglePixel(clonedTriangle, i, j);
        }
      }
    }
  }

  /**
   * 把三角形绘制到buffer中
   *
   * @param t
   * @param i
   * @param j
   */
  private renderTrianglePixel = (t: Triangle, i: number, j: number) => {
    if (t.isInside(i, j)) {
      const [alpha, beta, gamma] = t.computeBarycentric2D(i, j);

      const x = i;
      const y = this.height - j;

      const { v0, v1, v2 } = t;

      const zDepth = alpha * v0.pos.z + beta * v1.pos.z + gamma * v2.pos.z;

      const r = alpha * v0.color.x + beta * v1.color.x + gamma * v2.color.x;
      const g = alpha * v0.color.y + beta * v1.color.y + gamma * v2.color.y;
      const b = alpha * v0.color.z + beta * v1.color.z + gamma * v2.color.z;

      const color = new RGBColor(Math.ceil(r), Math.ceil(g), Math.ceil(b));

      this.renderPixelToBuffer(new Vector3(x, y, zDepth), color);
    }
  };

  /**
   *
   * @param p
   * @param c
   */
  private renderPixelToBuffer(p: Vector3, c: RGBColor) {
    const oldZDepth = this.zDepthBuffer[p.x + p.y * this.width];
    if (oldZDepth === undefined || oldZDepth < p.z) {
      this.zDepthBuffer[p.x + p.y * this.width] = p.z;

      const colorHex = c.toHex();
      // console.log(colorHex);
      this.frameBuffer.set(p.x, p.y, colorHex);
    }
  }

  /**
   * MVP 变换
   */
  private transformMvp(t: Triangle, mvp: Matrix4) {
    // 普通的点转换为齐次坐标的点
    const v0 = t.v0.pos.toVector4(1);
    const v1 = t.v1.pos.toVector4(1);
    const v2 = t.v2.pos.toVector4(1);

    // mvp变换
    let v00 = mvp.multiplyVector(v0);
    let v11 = mvp.multiplyVector(v1);
    let v22 = mvp.multiplyVector(v2);

    // 齐次坐标归一
    v00 = v00.divide(v00.w);
    v11 = v11.divide(v11.w);
    v22 = v22.divide(v22.w);

    t.v0.pos = v00.toVector3();
    t.v1.pos = v11.toVector3();
    t.v2.pos = v22.toVector3();
  }

  /**
   * 视口变换
   */
  private transfromViewport(t: Triangle, zfar: number, znear: number) {
    const { width, height } = this;
    const f1 = (Math.abs(zfar) - Math.abs(znear)) / 2;
    const f2 = (Math.abs(zfar) + Math.abs(znear)) / 2;

    for (let i = 0; i < t.vs.length; i += 1) {
      const vertex = t.vs[i];
      const v = vertex.pos;

      const x = 0.5 * width * (v.x + 1);
      const y = 0.5 * height * (v.y + 1);
      const z = v.z * f1 + f2;

      vertex.pos = new Vector3(x, y, z);
    }
  }

  /**
   * Model-View-Projection 矩阵
   */
  private getMvp() {
    const { lookFrom: eye, fovy, aspect, zfar, znear, state } = this.camera;

    const { rotate, scale, translate } = state;
    const { rx, ry, rz } = rotate;
    const { tx, ty, tz } = translate;
    const { sx, sy, sz } = scale;

    const view = getViewMatrix(eye);
    const model = getModelMatrix({ zRotationAngle: rz, yRotationAngle: ry, xRotationAngle: rx }, { tx, ty, tz }, { sx, sy, sz });
    const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    return mvp;
  }
}
