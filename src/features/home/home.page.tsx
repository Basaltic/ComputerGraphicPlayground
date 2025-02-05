import { Link } from 'react-router-dom';

import { rasterRoutes, rayTracingsRoutes, webglRoutes, webgpuRoutes, RouteObjectAdvance, pixiRoutes, phaserRoutes } from '../../app-routes';

export function HomePage() {
  return (
    <div className="p-8">
      <div className="prose">
        <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">Computer Graphic Playground</h1>

        <ListBlock title="光栅化（CPU模拟，基于Canvas2D的）" name="软光栅化渲染器" routes={rasterRoutes} />
        <ListBlock title="光线追踪（CPU模拟，基于Canvas2D的）" name="软光线追踪渲染器" routes={rayTracingsRoutes} />
        <ListBlock title="WebGL" name="WebGL 游乐场" routes={webglRoutes} />
        <ListBlock title="WebGPU" name="WebGPU 游乐场" routes={webgpuRoutes} />
        <ListBlock title="Pixi" name="Pixi 游乐场" routes={pixiRoutes} />
        <ListBlock title="Phaser" name="Phaser Playground" routes={phaserRoutes} />
      </div>
    </div>
  );
}

function ListBlock(props: { title: string; name: string; routes: RouteObjectAdvance[] }) {
  const { title, name, routes } = props;
  return (
    <>
      <h4 className="text-xl font-semibold tracking-tight scroll-m-20">{title}</h4>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {routes.map((r, i) => (
          <li key={r.path}>
            <Link to={r.path || ''}>
              {name}
              {i + 1}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
