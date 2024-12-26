import { Canvas } from '../../../libs/utils/canvas';
import { HEIGHT, WIDTH } from '../util/constants';
import { Rasterier } from './rasterier';
import { Scene } from './scene';

export interface EngineOption {
  width?: number;
  height?: number;
  pixelSize?: number;
}

/**
 * 引擎 - 串联起所有的模块
 */
export class Engine {
  private canvas: Canvas;
  private pixelSize: number = 1;
  private rasterier!: Rasterier;
  private width: number = 0;
  private height: number = 0;

  scene!: Scene;

  constructor(canvas: Canvas, option?: EngineOption) {
    this.pixelSize = option?.pixelSize ?? 1;
    this.width = WIDTH / this.pixelSize;
    this.height = WIDTH / this.pixelSize;

    this.canvas = canvas;
    this.scene = new Scene();
    this.rasterier = new Rasterier({
      width: this.width,
      height: this.height,
      camera: this.scene.camera
    });
  }

  run() {
    this.render();

    // requestAnimationFrame(this.run.bind(this));
  }

  render() {
    // - 清除场景内容
    this.rasterier.clear();

    // - 重新绘制
    for (const mesh of this.scene.meshs) {
      this.rasterier.drawTriangles(mesh.triangles);
    }

    const buffer = this.rasterier.frameBuffer;

    // - 真实的绘制到屏幕中
    this.canvas.drawImageFromBitmap(buffer, this.pixelSize);

    console.log('完成渲染 ==> ', buffer, this.scene, this.rasterier);
  }

  changePixelSize(size: number) {
    this.pixelSize = size;
    this.width = WIDTH / size;
    this.height = HEIGHT / size;
  }
}
