import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <h3>示例入口(CPU模拟)：</h3>
      <div>
        <Link to="/sim-soft-renderer">基于Canvas2D的软光栅化渲染器</Link>
      </div>
    </>
  );
}
