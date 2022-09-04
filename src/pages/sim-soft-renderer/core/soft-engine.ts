import { Canvas } from '../util/canvas';
import { Scene } from './scene';

export type SoftEngineConfig = {
  canvas: Canvas;
};

export class SoftEngine {
  canvas: Canvas;

  scene?: Scene;

  prevTime?: number;

  constructor(configs: SoftEngineConfig) {
    const { canvas } = configs;

    this.canvas = canvas;
  }

  /**
   * 加载场景世界
   */
  load(scene?: Scene) {
    if (!scene) return this;

    this.scene = scene;
    !scene.inited && scene.init();
    return this;
  }

  start(scene?: Scene) {
    this.load(scene);

    this.run();
  }

  update(delta: number) {
    this.scene?.update(delta);
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

    setTimeout(this.run.bind(this), 100);
  }

  render() {
    this.scene?.renderer.clear();

    this.scene?.render();

    console.log('render finished');

    const imageData = this.scene?.renderer.frameBuffer.toImageData();
    imageData && this.canvas.drawImage(imageData);
  }
}
