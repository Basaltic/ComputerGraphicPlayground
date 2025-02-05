import { RayTracingControllerState } from '@/components/custom/ray-tracing-controller/controller';
import { Vector3 } from '../../../../libs/math/vector3';
import { Bitmap } from '../../../../libs/utils/bitmap';
import { Canvas } from '../../../../libs/utils/canvas';
import { RGBColor, convertRGBToHexWithGammaCorrection } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { Camera } from './camera';
import { Hittable } from './hittable';
import { Ray } from './ray';
import { cornellBoxWorld, earthSphereWorld, randomWorld, simpleLightWorld, twoPerlinSphereWorld, twoSphereWorld, World } from './world';

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

  /**
   * 入口
   */
  async render(state: RayTracingControllerState) {
    // 1. 屏幕定义，宽高，等其他参数定义
    const { width, height } = this.canvas;

    let aspectRatio = this.configs.aspectRatio;

    let samplesPerPixel = state.samplesPerPixel || 10;
    // 控制光线最大的折射次数
    const maxDepth = state.maxDepth || 50;

    const worldType: number = 0;

    let lf = new Vector3(13, 2, 3);
    let la = new Vector3(0, 0, 0);
    let up = new Vector3(0, 1, 0);
    let focusDistance = 10;
    let aperture = 0.1;
    let fov = 20;
    let world = new World();

    let background: RGBColor = new RGBColor(0, 0, 0);

    switch (worldType) {
      case 1:
        // 2. 世界场景
        world = randomWorld();

        // 3. 相机 camera
        lf = new Vector3(13, 2, 3);
        la = new Vector3(0, 0, 0);
        up = new Vector3(0, 1, 0);
        focusDistance = 10;
        aperture = 0.1;

        background = new RGBColor(0.7, 0.8, 1);
        break;
      case 2:
        world = twoSphereWorld();
        lf = new Vector3(13, 2, 3);
        la = new Vector3(0, 0, 0);

        background = new RGBColor(0.7, 0.8, 1);
        break;
      case 3:
        world = twoPerlinSphereWorld();
        lf = new Vector3(13, 2, 3);
        la = new Vector3(0, 0, 0);
        fov = 20;

        background = new RGBColor(0.7, 0.8, 1);
        break;
      case 4:
        world = await earthSphereWorld();
        lf = new Vector3(13, 2, 3);
        la = new Vector3(0, 0, 0);
        fov = 20;

        background = new RGBColor(0.7, 0.8, 1);
        break;
      case 5:
        world = await simpleLightWorld();
        background = new RGBColor(0, 0, 0);
        samplesPerPixel = 400;
        lf = new Vector3(26, 3, 6);
        la = new Vector3(0, 2, 0);
        fov = 20;
        break;
      case 6:
      default:
        world = cornellBoxWorld();
        aspectRatio = 1;
        samplesPerPixel = 20;
        background = new RGBColor(0, 0, 0);
        lf = new Vector3(278, 278, -800);
        la = new Vector3(278, 278, 0);
        fov = 40;
        break;
    }

    const camera: Camera = new Camera(lf, la, up, fov, aspectRatio, aperture, focusDistance, 0, 1);

    // 4. 真实绘制像素到屏幕中
    const start = performance.now();
    const bitmap = new Bitmap(width, height);
    for (let j = height - 1; j >= 0; j -= 1) {
      const cost = performance.now() - start;
      console.log(`remaining: ${j}，cost ${cost}`);
      for (let i = 0; i < width; i += 1) {
        // 每个像素再采样 n 次，射出随机的 n 条光线，然后做平均
        let color = new Vector3(0, 0, 0);
        for (let s = 0; s < samplesPerPixel; s += 1) {
          const u = (i + randomNum()) / (width - 1);
          const v = (j + randomNum()) / (height - 1);

          const ray = camera.getRay(u, v);
          const samplePixelColor = rayColor(ray, background, world, maxDepth);
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
function rayColor(ray: Ray, background: RGBColor, world: Hittable, depth: number): Vector3 {
  // 限制光线折射的次数
  if (depth <= 0) {
    return new RGBColor(0, 0, 0);
  }
  // 0.001 是为了浮点数精度的原因，会导致后续计算某些情况下 t < 0的情况出现导致结果不够精准
  let hitRecord = world.hit(ray, 0.001, Infinity);

  // 如果光线没有击中任何物体，那么返回背景色
  if (!hitRecord) {
    return background;
  }

  const { u, v, p } = hitRecord;
  let emitted = hitRecord.materialPtr.emitted(u, v, p);

  const [success, attenuation, scattered] = hitRecord.materialPtr.scatter(ray, hitRecord);
  if (!success) {
    return emitted;
  }

  const c = rayColor(scattered, background, world, depth - 1)
    .multiply(attenuation)
    .add(emitted);
  return c;

  // // 这里简单的生成逻辑，后续会改为通过相交物体的颜色来确定
  // const unitDir = ray.direction.normalized();

  // // 时间和光线的y轴有关
  // const t = 0.5 * (unitDir.y + 1);
  // const color = new Vector3(1, 1, 1).multiply(1 - t).add(new Vector3(0.5, 0.7, 1).multiply(t));
  // return color;
}
