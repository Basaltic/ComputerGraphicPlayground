import { List, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { rasterRoutes, rayTracingsRoutes, webglRoutes, webgpuRoutes, RouteObjectAdvance, pixiRoutes } from '../../app-routes';

const HomeContainer = styled.div`
  padding: 12px;
`;

export default function HomePage() {
  return (
    <HomeContainer>
      <Title order={2}>Computer Graphic Playground</Title>

      <ListBlock title="光栅化（CPU模拟，基于Canvas2D的）" name="软光栅化渲染器" routes={rasterRoutes} />
      <ListBlock title="光线追踪（CPU模拟，基于Canvas2D的）" name="光线追踪渲染器" routes={rayTracingsRoutes} />
      <ListBlock title="WebGL" name="WebGL 游乐场" routes={webglRoutes} />
      <ListBlock title="WebGPU" name="WebGPU 游乐场" routes={webgpuRoutes} />
      <ListBlock title="Pixi" name="Pixi 游乐场" routes={pixiRoutes} />
    </HomeContainer>
  );
}

function ListBlock(props: { title: string; name: string; routes: RouteObjectAdvance[] }) {
  const { title, name, routes } = props;
  return (
    <>
      <Title order={4}>{title}</Title>
      <List>
        {routes.map((r, i) => (
          <List.Item>
            <Link to={r.path || ''}>
              {name}
              {i + 1}
            </Link>
          </List.Item>
        ))}
      </List>
    </>
  );
}
