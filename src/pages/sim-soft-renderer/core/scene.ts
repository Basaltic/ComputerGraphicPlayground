import { Vector3 } from '../../../libs/math/vector3';
import { getState } from '../model/globale-state';
import { IMesh } from '../model/mesh';
import { Triangle } from '../model/triangle';
import { Camera } from './camera';
import { Renderer } from './renderer';

/**
 * 场景
 * Scene contains the logic to present the world
 */
export abstract class Scene {
  meshes: Triangle[] = [];
  camera: Camera;
  renderer: Renderer;

  inited: boolean = false;

  constructor(configs: { width: number; height: number }) {
    const { width, height } = configs;

    const camera = getState().camera;
    const renderer = new Renderer({ width, height, camera });

    this.camera = camera;
    this.renderer = renderer;
  }

  abstract init(): void;

  abstract update(delta: number): void;

  render() {
    for (const mesh of this.meshes) {
      const m = mesh.clone();
      m.render();
    }
  }
}
