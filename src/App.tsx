import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import BasicRasterizationPage from './pages/examples/raster-basic/rasterization-basic.page';
import ShadingPage from './pages/examples/shading/shading.page';
import WebglPlaygroundPage2 from './pages/webgl/playground/playground2.page';
import WebglPlayground1Page1 from './pages/webgl/playground/playground1.page';
import WebglPlaygroundPage3 from './pages/webgl/playground/playground3/payground3.page';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 软光栅化 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/raster-basic" element={<BasicRasterizationPage />} />
          <Route path="/shading" element={<ShadingPage />} />

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
