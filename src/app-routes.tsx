import { RouteObject, useRoutes } from 'react-router-dom';
import { HomePage } from './features/home/home.page';

import { WebglPlaygroundPage1 } from './features/webgl/playground/playground1.page';
import { WebglPlaygroundPage2 } from './features/webgl/playground/playground2.page';
import { WebglPlaygroundPage3 } from './features/webgl/playground/playground3/payground3.page';
import { RayTracing1 } from './features/ray-tracing/ray-tracing-1/page';
import { RayTracing2 } from './features/ray-tracing/ray-tracing-2/page';
import { RayTracing3 } from './features/ray-tracing/ray-tracing-3/page';
import { RayTracing4 } from './features/ray-tracing/ray-tracing-4/page';
import { RayTracing5 } from './features/ray-tracing/ray-tracing-5/page';
import { RayTracing6 } from './features/ray-tracing/ray-tracing-6/page';
import { RayTracing7 } from './features/ray-tracing/ray-tracing-7/page';
import { RayTracing8 } from './features/ray-tracing/ray-tracing-8/page';
import { RayTracing9 } from './features/ray-tracing/ray-tracing-9/page';
import { WebGPUFundemental1DrawBasicTrianlge } from './features/webgpu/rendering/basic-triangle';
import { WebGPUFundemental1SimpleComputationInGPU } from './features/webgpu/computation/basic-computation';

import { SimSoftRendererPage1 } from './features/software-renderer/raster-page-1';
import { SimSoftRendererPage2 } from './features/software-renderer/raster-page-2';
import { SimSoftRendererPage3 } from './features/software-renderer/raster-page-3';
import { PixiBasic1Page } from './features/pixjs/features/basic/basic-1.page';

export type RouteObjectAdvance = { name?: string } & RouteObject;

const home: RouteObjectAdvance = { path: '/', Component: HomePage };
const raster: RouteObjectAdvance = { path: '/rasterization', Component: SimSoftRendererPage1 };
const raster2: RouteObjectAdvance = { path: '/rasterization/2', Component: SimSoftRendererPage2 };
const raster3: RouteObjectAdvance = { path: '/rasterization/3', Component: SimSoftRendererPage3 };

const ray1: RouteObjectAdvance = { path: '/ray-tracing/1', Component: RayTracing1 };
const ray2: RouteObjectAdvance = { path: '/ray-tracing/2', Component: RayTracing2 };
const ray3: RouteObjectAdvance = { path: '/ray-tracing/3', Component: RayTracing3 };
const ray4: RouteObjectAdvance = { path: '/ray-tracing/4', Component: RayTracing4 };
const ray5: RouteObjectAdvance = { path: '/ray-tracing/5', Component: RayTracing5 };
const ray6: RouteObjectAdvance = { path: '/ray-tracing/6', Component: RayTracing6 };
const ray7: RouteObjectAdvance = { path: '/ray-tracing/7', Component: RayTracing7 };
const ray8: RouteObjectAdvance = { path: '/ray-tracing/8', Component: RayTracing8 };
const ray9: RouteObjectAdvance = { path: '/ray-tracing/9', Component: RayTracing9 };

const webgl1: RouteObjectAdvance = { path: '/webgl/1', Component: WebglPlaygroundPage1 };
const webgl2: RouteObjectAdvance = { path: '/webgl/2', Component: WebglPlaygroundPage2 };
const webgl3: RouteObjectAdvance = { path: '/webgl/3', Component: WebglPlaygroundPage3 };

const webgpu1: RouteObjectAdvance = { path: '/webgpu/1', Component: WebGPUFundemental1DrawBasicTrianlge };
const webgpu2: RouteObjectAdvance = { path: '/webgpu/2', Component: WebGPUFundemental1SimpleComputationInGPU };

const pixi1: RouteObjectAdvance = { path: '/pixi/1', Component: PixiBasic1Page };

export const rasterRoutes = [raster, raster2, raster3];
export const rayTracingsRoutes = [ray1, ray2, ray3, ray4, ray5, ray6, ray7, ray8, ray9];
export const webglRoutes = [webgl1, webgl2, webgl3];
export const webgpuRoutes = [webgpu1, webgpu2];
export const pixiRoutes = [pixi1];

export const routes: RouteObject[] = [home, ...rasterRoutes, ...rayTracingsRoutes, ...webglRoutes, ...webgpuRoutes, ...pixiRoutes];

export const AppRouter = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
