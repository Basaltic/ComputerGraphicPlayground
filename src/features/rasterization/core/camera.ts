import { Vector3 } from '../../../libs/math/vector3';

export type CameraState = {
  rotate: { rz: number; ry: number; rx: number };
  translate: { tx: number; ty: number; tz: number };
  scale: { sx: number; sy: number; sz: number };
};

const DEFAULT_CAMERA_STATE = {
  rotate: { rx: 0, ry: 0, rz: 0 },
  translate: { tx: 0, ty: 0, tz: 0 },
  scale: { sx: 1, sy: 1, sz: 1 }
};

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
  state: CameraState;

  constructor(
    eye: Vector3 = new Vector3(0, 0, 10),
    target: Vector3 = new Vector3(0, 0, -1),
    up: Vector3 = new Vector3(0, 1, 0),
    aspect: number = 1,
    fovy: number = 45,
    znear: number = -1,
    zfar: number = -50,
    state: CameraState = DEFAULT_CAMERA_STATE
  ) {
    this.eye = eye;
    this.target = target;
    this.up = up;
    this.aspect = aspect;
    this.fovy = fovy;
    this.zfar = zfar;
    this.znear = znear;
    this.state = state;
  }
}
