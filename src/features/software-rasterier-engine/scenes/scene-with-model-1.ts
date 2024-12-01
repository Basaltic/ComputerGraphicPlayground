import { Scene } from '../core/scene';
import { Model } from '../model/model';

import obj from '../../../../public/models/cube/cube.obj';
// import obj from '../../../models/bunny/bunny.obj';

/**
 *
 */
export class TestSceneWithModel1 extends Scene {
  init() {
<<<<<<<< Updated upstream:src/pages/rasterization/scenes/scene-with-model-1.ts
    const model = Model.load(obj, this.renderer);

    this.meshes = model.triangles;
========
    const model = Model.load(obj, this.rasterier);
>>>>>>>> Stashed changes:src/features/software-rasterier-engine/scenes/scene-with-model-1.ts
  }

  update(delta: number): void {
    // state.translate.tx += 0.1;
    // state.translate.tz += 0.1;
    // state.scale = {
    //   sx: 1.5,
    //   sy: 1.5,
    //   sz: 1.5
    // };
    // state.rotate.ry += 5;
  }
}
