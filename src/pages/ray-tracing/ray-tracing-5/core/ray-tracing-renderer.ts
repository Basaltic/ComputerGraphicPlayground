import { Vector3 } from '../../../../libs/math/vector3';
import { Bitmap } from '../../../../libs/utils/bitmap';
import { Canvas } from '../../../../libs/utils/canvas';
import { RGBColor, convertRGBToHexWithGammaCorrection } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { Camera } from './camera';
import { HitRecord, Hittable } from './hittable';
import { Ray } from './ray';
import { randomWorld } from './world';

export interface RendererConfig {
  aspectRatio: number;
}

export class RayTracingRenderer {
  canvas: Canvas;

  configs: RendererConfig;

  constructor(ele: HTMLCanvasElement, configs: RendererConfig) {
    this.canvas = new Canvas(ele);
    this.configs = configs;
  }

  /**
   * 开始绘制
   */
  render() {
    this.run();
  }

  /**
   * 入口
   */
  run() {
    // 1. 屏幕定义，宽高，等其他参数定义
    const { width, height } = this.canvas;

    const aspectRatio = this.configs.aspectRatio;

    const samplesPerPixel = 10;
    // 控制光线最大的折射次数
    const maxDepth = 50;

    // 2. 世界场景
    const world = randomWorld();

    // 3. 相机 camera
    const lf = new Vector3(13, 2, 3);
    const la = new Vector3(0, 0, 0);
    const up = new Vector3(0, 1, 0);
    const focusDistance = 10;
    const aperture = 0.1;
    const camera: Camera = new Camera(lf, la, up, 20, aspectRatio, aperture, focusDistance);

    // 4. 真实绘制像素到屏幕中
    const bitmap = new Bitmap(width, height);
    for (let j = height - 1; j >= 0; j -= 1) {
      console.log(`remaining: ${j}`);
      for (let i = 0; i < width; i += 1) {
        // 每个像素再采样 n 次，射出随机的 n 条光线，然后做平均
        let color = new Vector3(0, 0, 0);
        for (let s = 0; s < samplesPerPixel; s += 1) {
          const u = (i + randomNum()) / (width - 1);
          const v = (j + randomNum()) / (height - 1);

          const ray = camera.getRay(u, v);
          const samplePixelColor = rayColor(ray, world, maxDepth);
          color = color.add(samplePixelColor);
        }

        const colorHex = convertRGBToHexWithGammaCorrection(color.x, color.y, color.z, samplesPerPixel);
        bitmap.set(i, height - j - 1, colorHex);
      }
    }

    this.canvas.drawImageFromBitmap(bitmap);
    console.log('Render Finished!!');
  }
}

/**
 * 通过光线求交来获取颜色
 */
function rayColor(ray: Ray, world: Hittable, depth: number): Vector3 {
  let hitRecord: HitRecord = new HitRecord();

  // 限制光线折射的次数
  if (depth <= 0) {
    return new RGBColor(0, 0, 0);
  }

  // 0.001 是为了浮点数精度的原因，会导致后续计算某些情况下 t < 0的情况出现导致结果不够精准
  if (world.hit(ray, 0.001, Infinity, hitRecord)) {
    const [success, attenuation, scattered] = hitRecord.materialPtr.scatter(ray, hitRecord);
    if (success) {
      const c = rayColor(scattered, world, depth - 1).multiply(attenuation);
      return c;
    }

    return new RGBColor(0, 0, 0);
  }

  // 这里简单的生成逻辑，后续会改为通过相交物体的颜色来确定
  const unitDir = ray.direction.normalized();

  // 时间和光线的y轴有关
  const t = 0.5 * (unitDir.y + 1);
  const color = new Vector3(1, 1, 1).multiply(1 - t).add(new Vector3(0.5, 0.7, 1).multiply(t));
  return color;
}
