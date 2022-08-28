import { Vector3 } from '../../../libs/math/vector3';
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

    const eye = Vector3.fromArray([0, 0, 5]);
    const target = Vector3.fromArray([0, 0, -1]);
    const up = Vector3.fromArray([0, 1, 0]);
    const fov = 45;
    const aspect = 1;
    const znear = -1;
    const zfar = -50;

    this.canvas = canvas;
    this.camera = new Camera(eye, target, up, aspect, fov, znear, zfar);
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

    const imageData = this.renderer.frameBuffer.toImageData();
    this.canvas.drawImage(imageData);
  }
}
