import { Vector3 } from './vector3';

/**
 * 向量（4维）
 */
export class Vector4 {
  coord: number[];

  get x() {
    return this.coord[0];
  }

  get y() {
    return this.coord[1];
  }

  get z() {
    return this.coord[2];
  }

  get w() {
    return this.coord[3];
  }

  constructor(x: number, y: number, z: number, w: number) {
    this.coord = [x, y, z, w];
  }

  /**
   * 数组转换为向量
   *
   * @param v
   * @returns
   */
  public static fromArray(v: number[]) {
    return new Vector4(v[0], v[1], v[2], v[3]);
  }

  /**
   * 3位向量转换为4维向量
   * @param v
   */
  public static fromVec3(v: Vector3, w: number = 1) {
    return new Vector4(v.x, v.y, v.z, w);
  }

  toArray() {
    return [...this.coord];
  }

  toVec3() {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `${this.x},${this.y},${this.z},${this.w},`;
  }

  /**
   * 除一个数
   */
  public divide(v: number) {
    return new Vector4(this.x / v, this.y / v, this.z / v, this.w / v);
  }

  /**
   * 乘一个数
   */
  public multiply(v: number) {
    return new Vector4(this.x * v, this.y * v, this.z * v, this.w * v);
  }

  // /**
  //  * 叉乘
  //  *
  //  * @param b
  //  */
  // public cross(b: Vector3) {
  //   return new Vector3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
  // }

  // /**
  //  * 获取该向量的单位向量
  //  */
  // public normalized() {
  //   const n = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  //   return new Vector3(this.x / n, this.y / n, this.z / n);
  // }

  // /**
  //  * a - b
  //  * @param a
  //  * @param b
  //  */
  // public static subtract(a: Vector3, b: Vector3) {
  //   return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  // }

  // /**
  //  * 相加: a + b
  //  *
  //  * @param v
  //  * @returns
  //  */
  // public static add(a: Vector3, b: Vector3) {
  //   return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  // }

  // /**
  //  * 两个向量点乘: a * b
  //  *
  //  * @param a
  //  * @param b
  //  * @returns {number}
  //  */
  // public static dotProduct(a: Vector3, b: Vector3) {
  //   return a.x * b.x + a.y * b.y + a.z * b.z;
  // }

  // /**
  //  * 两个向量叉乘：a x b
  //  *
  //  * @param a
  //  * @param b
  //  * @returns {Vector3}
  //  */
  // public static crossProduct(a: Vector3, b: Vector3) {
  //   return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  // }
}
