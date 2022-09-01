import { Vector3 } from '../../../libs/math/vector3';
import { Camera } from './camera';
import { Renderer } from './renderer';

const eye = Vector3.fromArray([0, 0, 5]);
const target = Vector3.fromArray([0, 0, -1]);
const up = Vector3.fromArray([0, 1, 0]);
const fov = 45;
const aspect = 1;
const znear = -1;
const zfar = -50;

/**
 * 场景
 * Scene contains the logic to present the world
 */
export class Scene {
  camera: Camera;
  renderer: Renderer;

  constructor(configs: { width: number; height: number }) {
    const { width, height } = configs;

    const camera = new Camera(eye, target, up, aspect, fov, znear, zfar);
    const renderer = new Renderer({ width, height, camera });

    this.camera = camera;
    this.renderer = renderer;
  }

  init() {}

  update(delta: number) {}

  render() {}
}
