import { Renderer } from '../core/renderer';

export interface IMesh {
  render(renderer: Renderer): void;
}

export interface MeshRenderOptions {}
