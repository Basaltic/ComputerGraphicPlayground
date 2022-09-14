import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import { SimSoftRendererPage } from './pages/rasterization/page';

import WebglPlaygroundPage2 from './pages/webgl/playground/playground2.page';
import WebglPlayground1Page1 from './pages/webgl/playground/playground1.page';
import WebglPlaygroundPage3 from './pages/webgl/playground/playground3/payground3.page';
import { RayTracingOnePage } from './pages/ray-tracing-1/page';
import { RayTracingTwoPage } from './pages/ray-tracing-2/page';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 示例入口 */}
          <Route path="/" element={<HomePage />} />
          {/* 软光栅化 */}
          <Route path="/rasterization" element={<SimSoftRendererPage />} />
          {/* 光线追踪 */}
          <Route path="/ray-tracing-1" element={<RayTracingOnePage />} />
          <Route path="/ray-tracing-2" element={<RayTracingTwoPage />} />

          {/* webgl */}
          <Route path="/webgl/playground1" element={<WebglPlayground1Page1 />} />
          <Route path="/webgl/playground2" element={<WebglPlaygroundPage2 />} />
          <Route path="/webgl/playground3" element={<WebglPlaygroundPage3 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
