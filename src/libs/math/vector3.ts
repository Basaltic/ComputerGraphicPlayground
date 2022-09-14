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
  multiply(v: number) {
    return new Vector3(this.x * v, this.y * v, this.z * v);
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
   * 两个向量相等
   */
  equals(v: Vector3) {
    return this.x === v.x && this.y === v.x && this.z === v.z;
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
   * 数组转换为向量
   *
   * @param v
   * @returns
   */
  static fromArray(v: number[]) {
    return new Vector3(v[0], v[1], v[2]);
  }
}
