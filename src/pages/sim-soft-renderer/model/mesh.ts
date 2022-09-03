import { Renderer } from '../core/renderer';
import { Vertex } from './vertex';

export interface IMesh {
  vs: Vertex[];

  render(): void;

  clone(): IMesh;

  toString(): string;
}

export interface MeshRenderOptions {}
