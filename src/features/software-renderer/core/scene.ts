import { Camera } from './camera';
import { Mesh } from './mesh';

export interface SceneOption {
  width: number;
  height: number;
}

/**
 * 场景，本质上就是一堆网格合集
 * Scene contains the logic to present the world
 */
export class Scene {
  meshs: Mesh[] = [];

  camera: Camera;

  constructor() {
    const camera = new Camera();

    this.camera = camera;
  }

  init() {}

  clear() {
    this.meshs = [];
  }

  add(...meshs: Mesh[]) {
    this.meshs.push(...meshs);
  }
}
