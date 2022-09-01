import { Vector3 } from '../../libs/math/vector3';
import { Scene } from './core/scene';
import { Vertex } from './model/vertex';
import { Triangle } from './model/triangle';
import obj from '../../models/cube/cube.obj';
import { Model } from './model/model';
import { IMesh } from './model/mesh';

/**
 *
 */
export class TestScene extends Scene {
  meshes: IMesh[] = [];

  init() {
    // 构建一个三角形
    const v1 = Vector3.fromArray([1, 1, -5]);
    const v2 = Vector3.fromArray([-1, -1, -5]);
    const v3 = Vector3.fromArray([1, -1, -5]);

    const c1 = Vector3.fromArray([235, 64, 52]);
    const c2 = Vector3.fromArray([66, 135, 245]);
    const c3 = Vector3.fromArray([245, 221, 66]);

    const vx1 = new Vertex(v1, c1);
    const vx2 = new Vertex(v2, c2);
    const vx3 = new Vertex(v3, c3);

    const t1 = new Triangle([vx1, vx2, vx3], this.renderer);

    this.meshes.push(t1);
  }

  update(delta: number): void {}

  render(): void {
    console.log(this.meshes);

    for (const mesh of this.meshes) {
      mesh.render();
    }

    // Model.load(obj, this.renderer).render();
  }
}
