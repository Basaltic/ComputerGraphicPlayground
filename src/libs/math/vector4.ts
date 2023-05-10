import { Vector3 } from './vector3';

/**
 * 向量（4维）
 */
export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
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
  public static fromVector3(v: Vector3, w: number = 1) {
    return new Vector4(v.x, v.y, v.z, w);
  }

  public toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  public toString() {
    return `${this.x},${this.y},${this.z},${this.w},`;
  }

  public toVector3() {
    return new Vector3(this.x, this.y, this.z);
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

  public clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }
}
