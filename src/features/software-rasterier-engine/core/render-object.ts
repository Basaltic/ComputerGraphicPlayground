import { Rasterier } from './rasterier';

export interface Rasterable {
  draw(raster: Rasterier): void;
}

export abstract class RenderObject {
  draw(raster: Rasterier) {}
}
