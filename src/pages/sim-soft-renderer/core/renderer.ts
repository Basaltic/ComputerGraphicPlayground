import { Vector3 } from '../../../libs/math/vector3';
import { getModelMatrix, getProjectionMatrix, getViewMatrix } from '../util/common';
import { Bitmap } from './bitmap';
import { Camera } from './camera';
import { Color } from './color';

export type RendererConfigs = {
  width: number;
  height: number;
  camera: Camera;
};

let angle = 5;

export function changeAngle() {
  angle += 20;
}

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

  clear() {
    this.frameBuffer = new Bitmap(this.width, this.height);
    this.zDepthBuffer = [];
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

    const view = getViewMatrix(eye);
    const model = getModelMatrix(0, 0, 0);
    const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    return mvp;
  }
}
