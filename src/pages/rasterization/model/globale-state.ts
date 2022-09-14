import { Vector3 } from '../../../libs/math/vector3';

type State = {
  rotate: { rz: number; ry: number; rx: number };
  translate: { tx: number; ty: number; tz: number };
  scale: { sx: number; sy: number; sz: number };
  camera: {
    // 摄像机的位置
    eye: Vector3;
    // 看的方向
    target: Vector3;
    // 摄像机向上的方向
    up: Vector3;
    // aspect ratio
    // 显示比，比如 16：9
    aspect: number;
    // Vertical Field of view
    // 垂直方向的视域，就是一个角度
    fovy: number;
    // 近平面
    znear: number;
    // 远平面
    zfar: number;
  };
};

const eye = Vector3.fromArray([0, 0, 10]);
const target = Vector3.fromArray([0, 0, -1]);
const up = Vector3.fromArray([0, 1, 0]);
const fovy = 45;
const aspect = 1;
const znear = 5;
const zfar = -50;

export const state: State = {
  rotate: { rx: 0, ry: 0, rz: 0 },
  translate: { tx: 0, ty: 0, tz: 0 },
  scale: { sx: 0.1, sy: 0.11, sz: 0.1 },
  camera: { eye, target, up, aspect, fovy, znear, zfar }
};

export const getState = () => {
  return state;
};
