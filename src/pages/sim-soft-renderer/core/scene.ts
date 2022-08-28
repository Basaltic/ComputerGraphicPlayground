import { Vector3 } from '../../../libs/math/vector3';
import { Triangle } from '../model/triangle';
import { Camera } from './camera';
import { Renderer } from './renderer';
import { Vertex } from './vertex';

/**
 * 场景
 * Scene contains the logic to present the world
 */
export class Scene {
  camera: Camera;
  renderer: Renderer;

  constructor(camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
  }

  update(delta: number) {}

  render() {
    // 构建一个三角形
    const v1 = Vector3.fromArray([2, 0, -2]);
    const v2 = Vector3.fromArray([0, 2, -2]);
    const v3 = Vector3.fromArray([-2, 0, -2]);
    const c1 = Vector3.fromArray([235, 64, 52]);
    const c2 = Vector3.fromArray([66, 135, 245]);
    const c3 = Vector3.fromArray([245, 221, 66]);

    const vx1 = new Vertex(v1, c1);
    const vx2 = new Vertex(v2, c2);
    const vx3 = new Vertex(v3, c3);

    const t1 = new Triangle([vx1, vx2, vx3], this.renderer);

    t1.render();
  }
}
