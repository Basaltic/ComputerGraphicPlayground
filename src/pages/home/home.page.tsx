import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const history = useHistory();

  return (
    <>
      <h3>示例入口：</h3>
      <div>
        <Link to="/raster-basic">光栅化三角形</Link>
      </div>
      <div style={{ marginTop: 10 }}>
        <Link to="/shading">着色</Link>
      </div>
    </>
  );
}
