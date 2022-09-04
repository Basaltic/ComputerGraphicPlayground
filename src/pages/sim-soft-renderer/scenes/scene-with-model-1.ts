import { Scene } from '../core/scene';
import { Model } from '../model/model';

import obj from '../../../models/cube/cube.obj';
// import obj from '../../../models/bunny/bunny.obj';
import { getState } from '../model/globale-state';

/**
 *
 */
export class TestSceneWithModel1 extends Scene {
  init() {
    const model = Model.load(obj, this.renderer);

    this.meshes = model.triangles;
  }

  update(delta: number): void {
    const state = getState();

    // state.translate.tx += 0.1;
    // state.translate.tz += 0.1;
    state.scale = {
      sx: 1.5,
      sy: 1.5,
      sz: 1.5
    };
    // state.rotate.ry += 5;
  }
}
