import { Vector3 } from '../../../libs/math/vector3';

/**
 * 摄像机
 */
export class Camera {
  // 摄像机的位置
  eye: Vector3;
  // 看的方向
  target: Vector3;
  // 摄像机向上的方向
  up: Vector3;
  // aspect ratio
  // 显示比，比如 16：9
  aspect: number = 1;
  // Vertical Field of view
  // 垂直方向的视域，就是一个角度
  fovy: number = 45;
  // 近平面
  znear: number = -1;
  // 远平面
  zfar: number = -50;

  constructor(
    eye: Vector3 = new Vector3(0, 0, 10),
    target: Vector3 = new Vector3(0, 0, -1),
    up: Vector3 = new Vector3(0, 1, 0),
    aspect: number = 1,
    fovy: number = 45,
    znear: number = -1,
    zfar: number = -50
  ) {
    this.eye = eye;
    this.target = target;
    this.up = up;
    this.aspect = aspect;
    this.fovy = fovy;
    this.zfar = zfar;
    this.znear = znear;
  }
}
