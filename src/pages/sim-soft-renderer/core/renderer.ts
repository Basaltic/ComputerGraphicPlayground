import { Vector3 } from '../../../libs/math/vector3';
import { get_model_matrix, get_projection_matrix, get_view_matrix } from '../util/common';
import { Bitmap } from './bitmap';
import { Camera } from './camera';
import { Color } from './color';
import { Vertex } from './vertex';

export type RendererConfigs = {
  width: number;
  height: number;
  camera: Camera;
};

/**
 * Draw to the screen
 */
export class Renderer {
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

  drawPoint(x: number, y: number) {}

  drawTriangle(v0: Vertex, v1: Vertex, v2: Vertex) {}

  drawSquareTest(x: number, y: number, w: number, h: number) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const p = new Vector3(x + i, y + j, 1);
        this.renderPixel(p, new Vector3(100, 100, 100));
      }
    }
  }

  renderPixel(p: Vector3, c: Vector3) {
    const oldZDepth = this.zDepthBuffer[p.x + p.y * this.width];
    if (oldZDepth === undefined || oldZDepth < p.z) {
      this.zDepthBuffer[p.x + p.y * this.width] = p.z;
      const colorHex = Color.convertRGBToHex(c);

      this.frameBuffer.set(p.x, p.y, colorHex);
    }
  }

  getMvp() {
    const { eye, fovy, aspect, zfar, znear } = this.camera;

    const view = get_view_matrix(eye);
    const model = get_model_matrix(0, 0, 0);
    const projection = get_projection_matrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    return mvp;
  }
}
