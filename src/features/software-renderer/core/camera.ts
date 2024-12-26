import { Vector3 } from '../../../libs/math/vector3';
import { TransformState } from './types';

/**
 *
 */
export class Camera {
  // 摄像机的位置
  lookFrom: Vector3;
  // 看的方向
  lookAt: Vector3;
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

  state: TransformState;

  constructor(
    lookFrom: Vector3 = new Vector3(0, 0, 10),
    lookAt: Vector3 = new Vector3(0, 0, -1),
    up: Vector3 = new Vector3(0, 1, 0),
    aspect: number = 1,
    fovy: number = 45,
    znear: number = -1,
    zfar: number = -50,
    state: TransformState = {
      rotate: { rx: 0, ry: 0, rz: 0 },
      translate: { tx: 0, ty: 0, tz: 0 },
      scale: { sx: 1, sy: 1, sz: 1 }
    }
  ) {
    this.lookFrom = lookFrom;
    this.lookAt = lookAt;
    this.up = up;
    this.aspect = aspect;
    this.fovy = fovy;
    this.zfar = zfar;
    this.znear = znear;
    this.state = state;
  }

  scale(deltaX?: number, deltay?: number, deltaZ?: number) {
    this.state.scale.sx += deltaX || 0;
    this.state.scale.sy += deltay || 0;
    this.state.scale.sz += deltaZ || 0;
  }

  rotate(deltaX?: number, deltay?: number, deltaZ?: number) {
    this.state.rotate.rx += deltaX || 0;
    this.state.rotate.ry += deltay || 0;
    this.state.rotate.rz += deltaZ || 0;
  }

  translate(deltaX?: number, deltay?: number, deltaZ?: number) {
    this.state.translate.tx += deltaX || 0;
    this.state.translate.ty += deltay || 0;
    this.state.translate.tz += deltaZ || 0;
  }
}
