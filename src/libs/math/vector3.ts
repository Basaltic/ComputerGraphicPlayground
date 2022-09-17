import { randomNum } from '../utils/number';
import { Vector4 } from './vector4';

/**
 * 向量（3维）
 */
export class Vector3 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w?: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w || 1;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  copyFrom(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
  }

  /**
   * 长度平方
   * @returns
   */
  getMagnitudeSquare() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 获取长度
   */
  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * 获取该向量的单位向量
   */
  normalized() {
    const n = this.getMagnitude();
    return new Vector3(this.x / n, this.y / n, this.z / n);
  }

  /**
   * 获取相反的向量
   */
  reserve() {
    return this.clone().multiply(-1);
  }

  /**
   * 点乘
   */
  dot(b: Vector3) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }

  /**
   * 叉乘
   */
  cross(b: Vector3) {
    return new Vector3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
  }

  /**
   * 除一个数
   */
  divide(v: number) {
    return new Vector3(this.x / v, this.y / v, this.z / v);
  }

  /**
   * 乘一个数
   */
  multiply(v: number | Vector3) {
    if (v instanceof Vector3) {
      return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    } else {
      return new Vector3(this.x * v, this.y * v, this.z * v);
    }
  }

  /**
   * 加向量
   */
  add(v: Vector3) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * 减向量
   * @param v
   */
  sub(v: Vector3) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * 反射
   */
  reflect(n: Vector3) {
    return this.sub(n.multiply(2 * this.dot(n)));
  }

  /**
   * 两个向量相等
   */
  equals(v: Vector3) {
    return this.x === v.x && this.y === v.x && this.z === v.z;
  }

  /**
   * 是否接近0
   */
  nearZero(): boolean {
    const s = 0.000000001;
    return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
  }

  /**
   * 转换为齐次坐标4阶向量
   */
  toHomoVec4() {
    return Vector4.fromArray([this.x, this.y, this.z, 1]);
  }

  /**
   * 转换成4阶向量
   */
  toVector4(): Vector4 {
    return Vector4.fromArray([this.x, this.y, this.z, 1]);
  }

  /**
   * 转换为数组
   */
  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  toString(): string {
    return `${this.x}, ${this.y}, ${this.z}`;
  }

  /**
   * a - b
   * @param a
   * @param b
   */
  static subtract(a: Vector3, b: Vector3) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * 相加: a + b
   *
   * @param v
   * @returns
   */
  static add(a: Vector3, b: Vector3) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * 两个向量点乘: a * b
   *
   * @param a
   * @param b
   * @returns {number}
   */
  static dotProduct(a: Vector3, b: Vector3) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * 两个向量叉乘：a x b
   *
   * @param a
   * @param b
   * @returns {Vector3}
   */
  static crossProduct(a: Vector3, b: Vector3) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  /**
   * 反射
   *
   * @param v 入射
   * @param n 法线
   */
  static reflect(v: Vector3, n: Vector3) {
    return v.sub(n.multiply(2 * v.dot(n)));
  }

  /**
   * 折射，snell law
   *
   * @param uv 入射向量
   * @param n 法线
   * @param etaiOverEtat 折射率，是一个比值
   */
  static refract(uv: Vector3, n: Vector3, etaiOverEtat: number) {
    const cosTheta = Math.min(Vector3.dotProduct(uv.multiply(-1), n), 1);
    // etaiOverEtat * (uv + cosTheta * n)
    // 折射光分解为两个向量
    //  - 垂直于法线和平行于法线
    const rOutPerp = uv.add(n.multiply(cosTheta)).multiply(etaiOverEtat);
    const rOutParallel = n.multiply(-Math.sqrt(Math.abs(1 - rOutPerp.getMagnitudeSquare())));
    return rOutPerp.add(rOutParallel);
  }

  /**
   * 数组转换为向量
   *
   * @param v
   * @returns
   */
  static fromArray(v: number[]) {
    return new Vector3(v[0], v[1], v[2]);
  }

  /**
   * 随机生成一个向量
   *
   * @param min
   * @param max
   */
  static random(min?: number, max?: number) {
    if (min && max) {
      new Vector3(randomNum(min, max), randomNum(min, max), randomNum(min, max));
    }
    return new Vector3(randomNum(), randomNum(), randomNum());
  }

  /**
   * 随机获取一个在单位球体上一点的向量
   */
  static randomInUnitSphere() {
    while (true) {
      const p = Vector3.random(-1, 1);
      if (p.getMagnitudeSquare() >= 1) continue;
      return p;
    }
  }

  /**
   * 获取一个随机的单位向量
   */
  static randomUnitVector3() {
    return this.randomInUnitSphere().normalized();
  }

  /**
   * 随机获取一个在半球体上一点的向量
   */
  static randomInHemisphere(normal: Vector3) {
    const inUnitSphere = Vector3.randomInUnitSphere();
    // 大于 0 表示相差【0，180】度之间，也就是在同一个半球面，直接使用该向量
    // 其他情况的话，表示在相反的半球面，取反到同一个半球面，提高采样效率
    if (inUnitSphere.dot(normal) > 0) {
      return inUnitSphere;
    } else {
      return inUnitSphere.multiply(-1);
    }
  }

  /**
   * 随机在一个单位圆盘上获取一个点
   */
  static randomInUnitDisk() {
    while (true) {
      const p = new Vector3(randomNum(-1, 1), randomNum(-1, 1), 0);
      if (p.getMagnitudeSquare() > 1) continue;

      return p;
    }
  }
}
