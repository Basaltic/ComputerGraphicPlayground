import { DEG_TO_RAD } from '../../../../libs/math/const';
import { Vector3 } from '../../../../libs/math/vector3';
import { Ray } from './ray';

/**
 * 相机
 */
export class Camera {
  aspectRatio = 16 / 9;
  // 定义在原点的位置，视口（近平面）的大小
  viewportHeight = 2;
  viewportWidth = 2;
  // 相机和近平面的距离
  focalLength = 1;

  // 原点位置，也可以认为是相机的位置
  private origin = new Vector3(0, 0, 0);
  // 可视平面的水平中点
  private horizontal = new Vector3(0, 0, 0);
  // 可视平面的垂直中点
  private vertical = new Vector3(0, 0, 0);
  private lowerLeftCorner = new Vector3(0, 0, 0);

  /**
   *
   * @param lookFrom 相机的位置
   * @param lookAt 相机看向的方向
   * @param up 相机朝上的方向
   * @param vfov 视域角度(field-of-view)，从相机开始可视的垂直角度
   * @param aspectRatio
   */
  constructor(lookFrom: Vector3, lookAt: Vector3, up: Vector3, vfov: number, aspectRatio: number) {
    const theta = DEG_TO_RAD * vfov;
    const h = Math.tan(theta / 2);

    // 构建以相机位置为中心的正交坐标系
    const w = lookFrom.sub(lookAt).normalized();
    const u = up.cross(w).normalized();
    const v = w.cross(u);

    this.aspectRatio = aspectRatio;
    // 定义在原点的位置，视口（近平面）的大小
    this.viewportHeight = 2 * h;
    this.viewportWidth = this.aspectRatio * this.viewportHeight;
    // 相机和近平面的距离
    this.focalLength = 1;

    this.origin = lookFrom;
    this.horizontal = u.multiply(this.viewportWidth);
    this.vertical = v.multiply(this.viewportHeight);
    this.lowerLeftCorner = this.origin.sub(this.horizontal.divide(2)).sub(this.vertical.divide(2)).sub(w);
  }

  /**
   * 从相机处获取发射的光线
   */
  getRay(u: number, v: number): Ray {
    const rayOrigin = this.origin;
    const rayDirection = this.lowerLeftCorner.add(this.horizontal.multiply(u)).add(this.vertical.multiply(v)).sub(rayOrigin);
    const ray = new Ray(rayOrigin, rayDirection);
    return ray;
  }
}
