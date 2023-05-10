import { Triangle } from './triangle';
import { Camera } from './camera';
import { Rasterier } from './canvas-rasterier';
import { getModelMatrix, getProjectionMatrix, getViewMatrix } from '../util/common';
import { Canvas } from '../../../libs/utils/canvas';

type State = {
  rotate: { rz: number; ry: number; rx: number };
  translate: { tx: number; ty: number; tz: number };
  scale: { sx: number; sy: number; sz: number };
};

/**
 * 场景，本质上就是一堆网格合集
 * Scene contains the logic to present the world
 */
export class Scene {
  triangles: Triangle[] = [];
  camera: Camera;
  width: number;
  height: number;
  rasterier: Rasterier;

  globalState: State = {
    rotate: { rx: 0, ry: 0, rz: 0 },
    translate: { tx: 0, ty: 0, tz: 0 },
    scale: { sx: 1, sy: 1, sz: 1 }
  };

  constructor(canvas: Canvas, private configs: { width: number; height: number }) {
    const { width, height } = configs;

    const camera = new Camera();
    const renderer = new Rasterier(canvas, { width, height, camera });

    this.width = width;
    this.height = height;
    this.camera = camera;
    this.rasterier = renderer;
  }

  /**
   *
   * @param triangle
   */
  add(triangle: Triangle) {
    this.triangles.push(triangle);
  }

  /**
   * 遍历所有网格并依次渲染
   */
  render() {
    const { zfar, znear } = this.camera;

    const mvp = this.getMvp();

    this.rasterier.draw(this.triangles, mvp, zfar, znear);
  }

  /**
   * Model-View-Projection 矩阵
   */
  private getMvp() {
    const { eye, fovy, aspect, zfar, znear } = this.camera;

    const { rotate, scale, translate } = this.globalState;
    const { rx, ry, rz } = rotate;
    const { tx, ty, tz } = translate;
    const { sx, sy, sz } = scale;

    const view = getViewMatrix(eye);
    const model = getModelMatrix({ zRotationAngle: rz, yRotationAngle: ry, xRotationAngle: rx }, { tx, ty, tz }, { sx, sy, sz });
    const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    return mvp;
  }

  // /**
  //  * @param triangle
  //  * @param antiAliasN
  //  * @param vw
  //  * @param vh
  //  * @param i
  //  * @param j
  //  * @returns
  //  */
  // private doRenderPixelWithMsaa = (
  //   triangle: Triangle,
  //   antiAliasN: number,
  //   vw: number,
  //   vh: number,
  //   i: number,
  //   j: number,
  //   frameBuffer: number[][],
  //   zBuffer: number[][]
  // ) => {
  //   const ysqrt = antiAliasN * antiAliasN;

  //   const gap = 1 / (antiAliasN * 2);
  //   const ind = i + (vh - j) * vw;

  //   let count = 0;
  //   for (let x = 1; x <= ysqrt; x++) {
  //     const row = Math.ceil(x / antiAliasN);
  //     const col = x % antiAliasN;

  //     const xx = i + (col * 2 - 1) * gap;
  //     const yy = j + (row * 2 - 1) * gap;

  //     const is_inside_triangle = triangle.isInside(xx, yy);
  //     if (is_inside_triangle === true) {
  //       const [alpha, beta, gamma] = this.computeBarycentric2D(xx, yy);

  //       const w = 1 / (alpha + beta + gamma);
  //       let z_interpolated = alpha * triangle.v0.pos.z + beta * triangle.v1.pos.z + gamma * triangle.v2.pos.z;

  //       z_interpolated *= w;
  //       const z_depth = z_interpolated;

  //       if (!zBuffer[ind]) zBuffer[ind] = [];

  //       const old_z_depth = zBuffer[ind][x - 1];

  //       if (old_z_depth === undefined || old_z_depth < z_depth) {
  //         zBuffer[ind][x - 1] = z_depth;
  //         count += 1;
  //       }
  //     }
  //   }

  //   let frame_color = Vector3.fromArray(frameBuffer[ind] || [255, 255, 255]).multiply((ysqrt - count) / ysqrt);
  //   let current_color = triangle.v0.color.multiply(count / ysqrt);

  //   frameBuffer[ind] = frame_color.add(current_color).toArray();
  // };
}
