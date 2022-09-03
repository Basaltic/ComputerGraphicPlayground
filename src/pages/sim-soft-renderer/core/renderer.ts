import { Vector3 } from '../../../libs/math/vector3';
import { Bitmap } from './bitmap';
import { Camera } from './camera';
import { Color } from './color';

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

  renderPixel(p: Vector3, c: Vector3) {
    const oldZDepth = this.zDepthBuffer[p.x + p.y * this.width];
    if (oldZDepth === undefined || oldZDepth < p.z) {
      this.zDepthBuffer[p.x + p.y * this.width] = p.z;
      const colorHex = Color.convertRGBToHex(c);

      this.frameBuffer.set(p.x, p.y, colorHex);
    }
  }

  clear() {
    this.frameBuffer = new Bitmap(this.width, this.height);
    this.zDepthBuffer = [];
  }
}
