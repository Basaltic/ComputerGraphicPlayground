import { Vector3 } from '../../../../libs/math/vector3';
import { RGBColor } from '../../../../libs/utils/color';
import { randomNum } from '../../../../libs/utils/number';
import { HitRecord } from './hittable';
import { Ray } from './ray';

/**
 * 材质
 */
export interface Material {
  /**
   *
   * @param rayIn
   * @param hitRecord
   * @param attenuation 衰减
   * @param scattered
   */
  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, RGBColor, Ray];
}

/**
 * 漫反射材质
 */
export class Lambertian implements Material {
  albedo: RGBColor;

  constructor(c: RGBColor) {
    this.albedo = c;
  }
  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, RGBColor, Ray] {
    let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector3());

    if (scatterDirection.nearZero()) {
      scatterDirection = hitRecord.normal;
    }

    const scattered = new Ray(hitRecord.p, scatterDirection);
    const attenuation = this.albedo;
    return [true, attenuation, scattered];
  }
}

/**
 * 金属材质
 */
export class Metal implements Material {
  albedo: RGBColor;
  /**
   * 模糊度
   */
  fuzz: number;

  constructor(c: RGBColor, fuzz: number = 1) {
    this.albedo = c;
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }

  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, RGBColor, Ray] {
    let reflected = Vector3.reflect(rayIn.direction.normalized(), hitRecord.normal);
    // 给反射光线添加一定的随机的偏移，这样就不是全反射了
    reflected = reflected.add(Vector3.randomInUnitSphere().multiply(this.fuzz));
    const scattered = new Ray(hitRecord.p, reflected);
    const attenuation = this.albedo;

    // 保证在同一个半球面
    const success = scattered.direction.dot(hitRecord.normal) > 0;
    return [success, attenuation, scattered];
  }
}

/**
 * 镜面材质
 */
export class Mirror implements Material {
  albedo: RGBColor;

  constructor(c: RGBColor) {
    this.albedo = c;
  }

  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, RGBColor, Ray] {
    let reflected = Vector3.reflect(rayIn.direction.normalized(), hitRecord.normal);
    const scattered = new Ray(hitRecord.p, reflected);
    const attenuation = this.albedo;

    // 保证在同一个半球面
    const success = scattered.direction.dot(hitRecord.normal) > 0;
    return [success, attenuation, scattered];
  }
}

/**
 * 电解质材质
 * - 玻璃材质，透明、半透明材质
 * - 处理光线的反射和折射
 */
export class Dielectric implements Material {
  /**
   * 折射率
   * index of refraction
   */
  ir: number;

  constructor(ir: number) {
    this.ir = ir;
  }

  scatter(rayIn: Ray, hitRecord: HitRecord): [boolean, RGBColor, Ray] {
    const attenuation = new RGBColor(1, 1, 1);

    const refractionRatio = hitRecord.frontFace ? 1 / this.ir : this.ir;

    const unitDir = rayIn.direction.normalized();

    const cosTheta = Math.min(Vector3.dotProduct(unitDir.reserve(), hitRecord.normal), 1);
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

    // 如果折射率 * sin theta > 1表示无法折射，而是反射
    const cannotRefract = refractionRatio * sinTheta > 1;

    // 通过设置随机的反射失效，来模拟透明材质中的反射
    const randomCannotRefract = this.reflectance(cosTheta, refractionRatio) > randomNum();

    let dir: Vector3;

    if (cannotRefract || randomCannotRefract) {
      dir = Vector3.reflect(unitDir, hitRecord.normal);
    } else {
      dir = Vector3.refract(unitDir, hitRecord.normal, refractionRatio);
    }

    const scattered = new Ray(hitRecord.p, dir);

    return [true, attenuation, scattered];
  }

  /**
   * Use Schlick's approximation for reflectance
   *
   * @param cosine
   * @param refractIndice
   */
  private reflectance(cosine: number, refractIndice: number) {
    let r0 = (1 - refractIndice) / (1 + refractIndice);
    r0 = r0 * r0;

    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
}
