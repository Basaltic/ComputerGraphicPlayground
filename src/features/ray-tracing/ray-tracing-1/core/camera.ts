import { Vector3 } from '../../../../libs/math/vector3';
import { Ray } from './ray';

/**
 * 相机
 */
export class Camera {
  aspectRatio = 16 / 9;
  // 定义在原点的位置，视口（近平面）的大小
  viewportHeight = 2;
  viewportWidth = this.aspectRatio * this.viewportHeight;
  // 相机和近平面的距离
  focalLength = 1;

  private origin = new Vector3(0, 0, 0);
  private horizontal = new Vector3(0, 0, 0);
  private vertical = new Vector3(0, 0, 0);
  private lowerLeftCorner = new Vector3(0, 0, 0);

  constructor() {
    this.aspectRatio = 16 / 9;
    // 定义在原点的位置，视口（近平面）的大小
    this.viewportHeight = 2;
    this.viewportWidth = this.aspectRatio * this.viewportHeight;
    // 相机和近平面的距离
    this.focalLength = 1;

    this.origin = new Vector3(0, 0, 0);
    this.horizontal = new Vector3(this.viewportWidth, 0, 0);
    this.vertical = new Vector3(0, this.viewportHeight, 0);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.divide(2))
      .subtract(this.vertical.divide(2))
      .subtract(new Vector3(0, 0, this.focalLength));
  }

  /**
   * 从相机处获取发射的光线
   */
  getRay(u: number, v: number): Ray {
    const rayOrigin = this.origin;
    const rayDirection = this.lowerLeftCorner.add(this.horizontal.multiply(u)).add(this.vertical.multiply(v)).subtract(rayOrigin);
    const ray = new Ray(rayOrigin, rayDirection);
    return ray;
  }
}
