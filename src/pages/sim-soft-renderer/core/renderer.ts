import { Bitmap } from './bitmap';
import { Camera } from './camera';

export type RendererConfigs = {
  width: number;
  height: number;
  camera: Camera;
};

/**
 * Draw to the screen
 */
export class Renderer {
  pixels: Bitmap;
  zBuffer: Bitmap;

  constructor(configs: RendererConfigs) {
    const { width, height, camera } = configs;

    this.pixels = new Bitmap(width, height);
    this.zBuffer = new Bitmap(width, height);
  }
}
