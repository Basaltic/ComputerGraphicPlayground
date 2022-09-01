import { Vector3 } from '../../../libs/math/vector3';
import { getViewMatrix, getModelMatrix, getProjectionMatrix } from '../util/common';

/**
 *
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

  constructor(eye: Vector3, target: Vector3, up: Vector3, aspect: number = 1, fovy: number = 45, znear: number = -1, zfar: number = -50) {
    this.eye = eye;
    this.target = target;
    this.up = up;
    this.aspect = aspect;
    this.fovy = fovy;
    this.zfar = zfar;
    this.znear = znear;
  }

  getMvp() {
    const { eye, fovy, aspect, zfar, znear } = this;

    const view = getViewMatrix(eye);
    const model = getModelMatrix(0, 0, 0);
    const projection = getProjectionMatrix(fovy, aspect, znear, zfar);
    const mvp = projection.multiply(view).multiply(model);

    return mvp;
  }
}
