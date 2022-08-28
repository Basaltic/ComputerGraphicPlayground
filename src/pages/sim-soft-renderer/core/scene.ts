import { Camera } from './camera';
import { Renderer } from './renderer';

/**
 * 场景
 * Scene contains the logic to present the world
 */
export class Scene {
  camera: Camera;
  renderer: Renderer;

  constructor(camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
  }

  update(delta: number) {}

  render() {
    this.renderer.draw_square_test(10, 10, 100, 100);
  }
}
