import { List, Title } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const HomeContainer = styled.div`
  padding: 12px;
`;

export default function HomePage() {
  return (
    <HomeContainer>
      <Title order={2}>图形学游乐场（CPU模拟，基于Canvas2D的）</Title>

      <Title order={4}>光栅化</Title>
      <List>
        <List.Item>
          <Link to="/rasterization">软光栅化渲染器</Link>
        </List.Item>
      </List>
      <Title order={4}>光线追踪</Title>
      <List>
        <List.Item>
          <Link to="/ray-tracing-1">光线追踪渲染器1</Link>
        </List.Item>
        <List.Item>
          <Link to="/ray-tracing-2">光线追踪渲染器2</Link>
        </List.Item>
        <List.Item>
          <Link to="/ray-tracing-3">光线追踪渲染器3</Link>
        </List.Item>
        <List.Item>
          <Link to="/ray-tracing-4">光线追踪渲染器4</Link>
        </List.Item>
      </List>
    </HomeContainer>
  );
}
