import { Matrix4 } from '../../../libs/math/matrix4';
import { Vector3 } from '../../../libs/math/vector3';
import { Bitmap } from '../../../libs/utils/bitmap';
import { Canvas } from '../../../libs/utils/canvas';
import { Camera } from './camera';
import { Color } from './color';
import { Triangle } from './triangle';

export type RendererConfigs = {
  width: number;
  height: number;
  camera: Camera;
};

/**
 * Draw to the screen
 */
export class Rasterier {
  canvas: Canvas;

  width: number;
  height: number;

  // frame buffer
  frameBuffer: Bitmap;
  // depth buffer
  zDepthBuffer: number[];

  constructor(canvas: Canvas, configs: RendererConfigs) {
    const { width, height } = configs;

    this.width = width;
    this.height = height;

    this.frameBuffer = new Bitmap(width, height);
    this.zDepthBuffer = [];

    this.canvas = canvas;
  }

  clear() {
    this.frameBuffer = new Bitmap(this.width, this.height);
    this.zDepthBuffer = [];
  }

  draw(triangles: Triangle[], mvp: Matrix4, zfar: number, znear: number) {
    this.clear();

    for (const triangle of triangles) {
      this.transformMvp(triangle, mvp);
      this.transfromViewport(triangle, zfar, znear);

      // 真实的逐像素绘制到画布中
      const { minX, maxX, minY, maxY } = triangle.getBoundingBox();
      for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
          this.renderTriangle(triangle, i, j);
        }
      }
    }

    // 绘制到画布上
    const imageData = this.frameBuffer.toImageData();
    imageData && this.canvas.drawImage(imageData);
  }

  /**
   *
   * @param t
   * @param i
   * @param j
   */
  renderTriangle = (t: Triangle, i: number, j: number) => {
    if (t.isInside(i, j)) {
      const [alpha, beta, gamma] = t.computeBarycentric2D(i, j);

      const x = i;
      const y = this.height - j;

      const { v0, v1, v2 } = t;

      const zDepth = alpha * v0.pos.z + beta * v1.pos.z + gamma * v2.pos.z;

      const r = alpha * v0.color.x + beta * v1.color.x + gamma * t.v2.color.x;
      const g = alpha * v0.color.y + beta * v1.color.y + gamma * v2.color.y;
      const b = alpha * v0.color.z + beta * v1.color.z + gamma * v2.color.z;

      const color = new Vector3(r, g, b);

      this.renderPixel(new Vector3(x, y, zDepth), color);
    }
  };

  renderPixel(p: Vector3, c: Vector3) {
    const oldZDepth = this.zDepthBuffer[p.x + p.y * this.width];
    if (oldZDepth === undefined || oldZDepth < p.z) {
      this.zDepthBuffer[p.x + p.y * this.width] = p.z;
      const colorHex = Color.convertRGBToHex(c);

      this.frameBuffer.set(p.x, p.y, colorHex);
    }
  }

  /**
   * MVP 变换
   */
  transformMvp(t: Triangle, mvp: Matrix4) {
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
  transfromViewport(t: Triangle, zfar: number, znear: number) {
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
}
