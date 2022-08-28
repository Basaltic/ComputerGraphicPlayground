import { Canvas } from '../util/canvas';
import { Camera } from './camera';
import { Renderer } from './renderer';
import { Scene } from './scene';

export type SoftEngineConfig = {
  canvas: Canvas;
  width: number;
  height: number;
};

export class SoftEngine {
  canvas: Canvas;

  camera: Camera;
  renderer: Renderer;
  scene: Scene;

  prevTime?: number;

  constructor(configs: SoftEngineConfig) {
    const { width, height, canvas } = configs;

    this.canvas = canvas;
    this.camera = new Camera();
    this.renderer = new Renderer({ width, height, camera: this.camera });

    this.scene = new Scene(this.camera, this.renderer);
  }

  start() {
    this.init();
    this.run();
  }

  init() {}

  update(delta: number) {
    this.scene.update(delta);
  }

  run() {
    const now = performance.now();

    let delta = 1.0;
    if (this.prevTime) {
      delta = now - this.prevTime;
      this.prevTime = now;
    }

    this.update(delta);

    this.render();

    // requestAnimationFrame(this.run.bind(this));
  }

  render() {
    this.scene.render();

    const imageData = this.renderer.f_buffer.toImageData();
    this.canvas.drawImage(imageData);
  }
}
