import { Triangle } from './triangle';
import { Camera } from './camera';
import { Rasterier } from './rasterier';

/**
 * 场景，本质上就是一堆网格合集
 * Scene contains the logic to present the world
 */
export class Scene {
  width: number;
  height: number;

  triangles: Triangle[] = [];

  camera: Camera;
  rasterier: Rasterier;

  constructor(configs: { width: number; height: number }) {
    const { width, height } = configs;

    const camera = new Camera();
    const rasterier = new Rasterier({ width, height, camera });

    this.width = width;
    this.height = height;
    this.camera = camera;
    this.rasterier = rasterier;
  }

  clear() {
    this.rasterier.clear();
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
    this.rasterier.drawTriangles(this.triangles);
  }

  /**
   * Model-View-Projection 矩阵
   */
  // private getMvp() {
  //   const { eye, fovy, aspect, zfar, znear } = this.camera;

  //   const { rotate, scale, translate } = this.globalState;
  //   const { rx, ry, rz } = rotate;
  //   const { tx, ty, tz } = translate;
  //   const { sx, sy, sz } = scale;

  //   const view = getViewMatrix(eye);
  //   const model = getModelMatrix({ zRotationAngle: rz, yRotationAngle: ry, xRotationAngle: rx }, { tx, ty, tz }, { sx, sy, sz });
  //   const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
  //   const mvp = projection.multiply(view).multiply(model);

  //   return mvp;
  // }

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
