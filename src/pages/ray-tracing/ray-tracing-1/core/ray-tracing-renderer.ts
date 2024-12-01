import { Vector3 } from '../../../../libs/math/vector3';
import { Bitmap } from '../../../../libs/utils/bitmap';
import { Canvas } from '../../../../libs/utils/canvas';
import { convertRGBToHex, convertRGBToHexWithGammaCorrection } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { Camera } from './camera';
import { HitRecord, Hittable } from './hittable';
import { HittableList } from './hittable-list';
import { Ray } from './ray';
import { Sphere } from './sphere';

export class RayTracingRenderer {
  canvas: Canvas;

  constructor(ele: HTMLCanvasElement) {
    this.canvas = new Canvas(ele);
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
    // 屏幕定义，宽高
    const { width, height } = this.canvas;
    const samplesPerPixel = 10;

    // 世界场景
    const world = new HittableList();
    world.add(new Sphere(new Vector3(0, -100.5, -1), 100));
    world.add(new Sphere(new Vector3(0, 0, -1), 0.5));

    // 相机 camera
    const camera: Camera = new Camera();

    // 真实绘制像素到屏幕中
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
          const samplePixelColor = rayColor(ray, world);
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
function rayColor(ray: Ray, world: Hittable): Vector3 {
  let hitRecord: HitRecord = new HitRecord();

  if (world.hit(ray, 0, Infinity, hitRecord)) {
    return hitRecord.normal.add(new Vector3(1, 1, 1)).multiply(0.5);
  }

  // 这里简单的生成逻辑，后续会改为通过相交物体的颜色来确定
  const unitDir = ray.direction.normalized();

  // 时间和光线的y轴有关
  const t = 0.5 * (unitDir.y + 1);
  const color = new Vector3(1, 1, 1).multiply(1 - t).add(new Vector3(0.5 * 1, 0.7 * 1, 1).multiply(t));
  return color;
}
