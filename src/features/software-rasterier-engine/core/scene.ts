import { Triangle } from './triangle';
import { Camera } from './camera';
import { Rasterier } from './rasterier';

/**
 * 场景，本质上就是一堆网格合集
 * Scene contains the logic to present the world
 */
export class Scene {
  width: number;
  height: number;

  triangles: Triangle[] = [];

  camera: Camera;
  rasterier: Rasterier;

  constructor(configs: { width: number; height: number }) {
    const { width, height } = configs;

    const camera = new Camera();
    const rasterier = new Rasterier({ width, height, camera });

    this.width = width;
    this.height = height;
    this.camera = camera;
    this.rasterier = rasterier;
  }

  clear() {
    this.rasterier.clear();
  }

  /**
   *
   * @param triangle
   */
  add(triangles: Triangle[]) {
    this.triangles.push(...triangles);
  }

  /**
   * 遍历所有网格并依次渲染
   */
  render() {
    this.rasterier.drawTriangles(this.triangles);
  }
}
