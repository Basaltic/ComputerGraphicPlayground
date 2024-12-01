import { Canvas } from '../../../libs/utils/canvas';
import { Scene } from './scene';

/**
 * 引擎 - 串联起所有的模块
 */
export class Engine {
  private canvas: Canvas;
  private scene!: Scene;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  load(scene: Scene) {
    this.scene = scene;
    return {
      start: () => this.start()
    };
  }

  private start() {
    this.init();
    this.run();
  }

  private init() {}

  private run() {
    this.render();
  }

  private render() {
    // - 清除场景内容
    this.scene.clear();

    // - 重新绘制
    this.scene.render();

    const buffer = this.scene.rasterier.frameBuffer;

    // - 真实的绘制到屏幕中
    this.canvas.drawImageFromBitmap(buffer);
  }
}
