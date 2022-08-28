import { Canvas } from '../util/canvas';
import { Renderer } from './renderer';

export interface IGame {
  update(): void;
  render(): void;
}

export class SoftEngine {
  renderer: Renderer;

  constructor(configs: { canvas: Canvas }) {
    this.renderer = new Renderer({});
  }

  start() {}

  init() {}

  run() {
    requestAnimationFrame(this.run.bind(this));
  }
}
