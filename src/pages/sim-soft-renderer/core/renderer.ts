import { Vector3 } from '../../../libs/math/vector3';
import { Buffer } from './buffer';
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
  // frame buffer
  f_buffer: Buffer;
  // depth buffer
  z_buffer: Buffer;

  constructor(configs: RendererConfigs) {
    const { width, height, camera } = configs;

    this.f_buffer = new Buffer(width, height);
    this.z_buffer = new Buffer(width, height);
  }

  draw_point(x: number, y: number) {}

  draw_triangle() {}

  draw_square_test(x: number, y: number, w: number, h: number) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        const p = new Vector3(x + i, y + j, 1);
        this.render_pixel(p, 0xfcba03);
      }
    }
  }

  render_pixel(p: Vector3, c: number) {
    this.f_buffer.set(p.x, p.y, c);
  }
}
