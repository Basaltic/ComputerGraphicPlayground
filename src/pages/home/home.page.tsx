import { Link } from 'react-router-dom';
<<<<<<< Updated upstream:src/pages/home/home.page.tsx
import styled from '@emotion/styled';
import { rasterRoutes, rayTracingsRoutes, webglRoutes, webgpuRoutes, RouteObjectAdvance } from '../../app-routes';
=======
import { rasterRoutes, rayTracingsRoutes, webglRoutes, webgpuRoutes, RouteObjectAdvance, pixiRoutes } from '../../app-routes';
>>>>>>> Stashed changes:src/features/home/home.page.tsx

export function HomePage() {
  return (
    <div className="p-8">
      <div className="prose">
        <h2>陈磊的图形学游乐场</h2>

<<<<<<< Updated upstream:src/pages/home/home.page.tsx
      <ListBlock title="光栅化（CPU模拟，基于Canvas2D的）" name="软光栅化渲染器" routes={rasterRoutes} />
      <ListBlock title="光线追踪（CPU模拟，基于Canvas2D的）" name="光线追踪渲染器" routes={rayTracingsRoutes} />
      <ListBlock title="WebGL" name="WebGL Fendemental" routes={webglRoutes} />
      <ListBlock title="WebGPU" name="WebGPU Fendemental" routes={webgpuRoutes} />
    </HomeContainer>
=======
        <ListBlock title="光栅化（CPU模拟，基于Canvas2D的）" name="软光栅化渲染器" routes={rasterRoutes} />
        <ListBlock title="光线追踪（CPU模拟，基于Canvas2D的）" name="软光线追踪渲染器" routes={rayTracingsRoutes} />
        <ListBlock title="WebGL" name="WebGL 游乐场" routes={webglRoutes} />
        <ListBlock title="WebGPU" name="WebGPU 游乐场" routes={webgpuRoutes} />
        <ListBlock title="Pixi" name="Pixi 游乐场" routes={pixiRoutes} />
      </div>
    </div>
>>>>>>> Stashed changes:src/features/home/home.page.tsx
  );
}

function ListBlock(props: { title: string; name: string; routes: RouteObjectAdvance[] }) {
  const { title, name, routes } = props;
  return (
    <>
      <h4>{title}</h4>
      <ul>
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
