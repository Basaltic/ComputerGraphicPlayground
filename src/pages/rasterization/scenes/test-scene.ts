import { Vector3 } from '../../../libs/math/vector3';
import { Scene } from '../core/scene';
import { Vertex } from '../model/vertex';
import { Triangle } from '../model/triangle';
import obj from '../../models/cube/cube.obj';
import { Model } from '../model/model';
import { IMesh } from '../model/mesh';
import { getState } from '../model/globale-state';

/**
 *
 */
export class TestScene extends Scene {
  init() {
    // 构建一个三角形
    const v1 = Vector3.fromArray([-1, 1, -1]);
    const v2 = Vector3.fromArray([1, -1, -1]);
    const v3 = Vector3.fromArray([-1, -1, -1]);

    const c1 = Vector3.fromArray([235, 64, 52]);
    // const c2 = Vector3.fromArray([66, 135, 245]);
    // const c3 = Vector3.fromArray([245, 221, 66]);

    const vx1 = new Vertex(v1, c1);
    const vx2 = new Vertex(v2, c1);
    const vx3 = new Vertex(v3, c1);

    const t1 = new Triangle([vx1, vx2, vx3], this.renderer);

    this.meshes = [t1];

    this.inited = true;
  }

  update(delta: number): void {
    const state = getState();
    // state.rotate.ry += 5;
    // state.translate.tx += -10;

    state.scale = {
      sx: 1.5,
      sy: 1.5,
      sz: 1.5
    };

    state.rotate.rz += 5;
    state.rotate.rx += 5;
  }
}
