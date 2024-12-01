import { Vector3 } from '../../../../libs/math/vector3';
import { RGBColor } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { XYRect, XZRect, YZRect } from './aarect';
import { Box } from './box';
import { BVHNode } from './bvh';
import { HittableList } from './hittable-list';
import { Dielectric, DiffuseLight, Lambertian, Metal } from './material';
import { MovingSphere, Sphere } from './sphere';
import { CheckerTexture, ImageTexture, NoiseTexture, SolidColor } from './texture';

export class World extends HittableList {}

/**
 * 生成随机的场景
 */
export function randomWorld(): World {
  const world = new World();

  const checker = new CheckerTexture(new SolidColor(new Vector3(0.2, 0.3, 0.1)), new SolidColor(new Vector3(0.9, 0.9, 0.9)));

  const groundMat = Lambertian.fromTexture(checker);
  const groundSph = new Sphere(new Vector3(0, -1000, 0), 1000, groundMat);
  world.add(groundSph);

  for (let a = -11; a < 11; a += 1) {
    for (let b = -11; b < 11; b += 1) {
      const chooseMat = randomNum();
      const center = new Vector3(a + 0.9 * randomNum(), 0.2, b + 0.9 * randomNum());

      const limitRadius = center.subtract(new Vector3(4, 0.2, 0)).getMagnitude();
      if (limitRadius > 0.9) {
        if (chooseMat < 0.8) {
          // 漫反射材质 diffuse
          const albedo = RGBColor.random().multiply(RGBColor.random()) as RGBColor;
          const mat = Lambertian.fromColor(albedo);
          const center2 = center.add(new Vector3(0, randomNum(0, 0.5), 0));

          const sphere = new MovingSphere(center, center2, 0, 1, 0.2, mat);
          world.add(sphere);
        } else if (chooseMat < 0.95) {
          // 金属材质 metal
          const albedo = RGBColor.random(0.5, 1) as RGBColor;
          const fuzz = randomNum(0, 0.5);
          const mat = new Metal(albedo, fuzz);
          const sphere = new Sphere(center, 0.2, mat);
          world.add(sphere);
        } else {
          // 玻璃材质 glass
          const mat = new Dielectric(1.5);
          const sphere = new Sphere(center, 0.2, mat);
          world.add(sphere);
        }
      }
    }
  }

  const mat1 = new Dielectric(1.5);
  const sph1 = new Sphere(new Vector3(0, 1, 0), 1, mat1);

  const mat2 = Lambertian.fromColor(new RGBColor(0.4, 0.2, 0, 1));
  const sph2 = new Sphere(new Vector3(-4, 1, 0), 1, mat2);

  const mat3 = new Metal(new RGBColor(0.7, 0.6, 0.5), 0);
  const sph3 = new Sphere(new Vector3(4, 1, 0), 1, mat3);

  world.add(sph1);
  world.add(sph2);
  world.add(sph3);

  // return world;
  const bvh = new BVHNode(world.hittableList, 0, 1);
  return new World([bvh]);
}

export function twoSphereWorld() {
  const world = new World();

  const checkerTexture = new CheckerTexture(new SolidColor(new Vector3(0.2, 0.3, 0.1)), new SolidColor(new Vector3(0.9, 0.9, 0.9)));

  const s1 = new Sphere(new Vector3(0, -10, 0), 10, Lambertian.fromTexture(checkerTexture));
  const s2 = new Sphere(new Vector3(0, 10, 0), 10, Lambertian.fromTexture(checkerTexture));

  world.add(s1);
  world.add(s2);

  return world;
}

export function twoPerlinSphereWorld() {
  const world = new World();

  const perlinTexture = new NoiseTexture();

  const s1 = new Sphere(new Vector3(0, -1000, 0), 1000, Lambertian.fromTexture(perlinTexture));
  const s2 = new Sphere(new Vector3(0, 2, 0), 2, Lambertian.fromTexture(perlinTexture));

  world.add(s1);
  world.add(s2);

  return world;
}

export async function earthSphereWorld() {
  const world = new World();

  const earthTexture = await ImageTexture.fromImageUrl('http://127.0.0.1:5173/images/earthmap.png');
  const earthSurface = Lambertian.fromTexture(earthTexture);

  const earth = new Sphere(new Vector3(0, 0, 0), 2, earthSurface);

  world.add(earth);

  return world;
}

export function simpleLightWorld() {
  const world = new World();

  const perlinTexture = new NoiseTexture();

  const s1 = new Sphere(new Vector3(0, -1000, 0), 1000, Lambertian.fromTexture(perlinTexture));
  const s2 = new Sphere(new Vector3(0, 2, 0), 2, Lambertian.fromTexture(perlinTexture));

  world.add(s1);
  world.add(s2);

  const diffLight = new DiffuseLight(new RGBColor(4, 4, 4));
  const xyrect = new XYRect(3, 5, 1, 3, -2, diffLight);

  world.add(xyrect);

  return world;
}

export function cornellBoxWorld() {
  const world = new World();

  const red = Lambertian.fromColor(new RGBColor(0.65, 0.05, 0.05));
  const white = Lambertian.fromColor(new RGBColor(0.73, 0.73, 0.73));
  const green = Lambertian.fromColor(new RGBColor(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new RGBColor(15, 15, 15));

  world.add(new YZRect(0, 555, 0, 555, 555, green));
  world.add(new YZRect(0, 555, 0, 555, 0, green));
  world.add(new XZRect(213, 343, 227, 332, 554, light));
  world.add(new XZRect(0, 555, 0, 555, 0, white));
  world.add(new XZRect(0, 555, 0, 555, 555, white));
  world.add(new XYRect(0, 555, 0, 555, 555, white));

  world.add(new Box(new Vector3(130, 0, 65), new Vector3(295, 165, 230), white));
  world.add(new Box(new Vector3(265, 0, 295), new Vector3(430, 330, 460), white));

  return world;
}
