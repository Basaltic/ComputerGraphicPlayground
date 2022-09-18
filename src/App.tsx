import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import { SimSoftRendererPage } from './pages/rasterization/page';

import WebglPlaygroundPage2 from './pages/webgl/playground/playground2.page';
import WebglPlayground1Page1 from './pages/webgl/playground/playground1.page';
import WebglPlaygroundPage3 from './pages/webgl/playground/playground3/payground3.page';
import { RayTracing1 } from './pages/ray-tracing/ray-tracing-1/page';
import { RayTracing2 } from './pages/ray-tracing/ray-tracing-2/page';
import { RayTracing3 } from './pages/ray-tracing/ray-tracing-3/page';
import { RayTracing4 } from './pages/ray-tracing/ray-tracing-4/page';
import { RayTracing5 } from './pages/ray-tracing/ray-tracing-5/page';
import { RayTracing6 } from './pages/ray-tracing/ray-tracing-6/page';
import { RayTracing7 } from './pages/ray-tracing/ray-tracing-7/page';
import { RayTracing8 } from './pages/ray-tracing/ray-tracing-8/page';
import { TestPage } from './pages/test/test-page';

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
          <Route path="/ray-tracing-1" element={<RayTracing1 />} />
          <Route path="/ray-tracing-2" element={<RayTracing2 />} />
          <Route path="/ray-tracing-3" element={<RayTracing3 />} />
          <Route path="/ray-tracing-4" element={<RayTracing4 />} />
          <Route path="/ray-tracing-5" element={<RayTracing5 />} />
          <Route path="/ray-tracing-6" element={<RayTracing6 />} />
          <Route path="/ray-tracing-7" element={<RayTracing7 />} />
          <Route path="/ray-tracing-8" element={<RayTracing8 />} />

          {/* webgl */}
          <Route path="/webgl/playground1" element={<WebglPlayground1Page1 />} />
          <Route path="/webgl/playground2" element={<WebglPlaygroundPage2 />} />
          <Route path="/webgl/playground3" element={<WebglPlaygroundPage3 />} />

          {/* test page */}
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
