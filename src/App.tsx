import './App.css';

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import BasicRasterizationPage from './pages/examples/raster-basic/rasterization-basic.page';
import ShadingPage from './pages/examples/shading/shading.page';
import WebglPlaygroundPage2 from './pages/webgl/playground/playground2.page';
import WebglPlayground1Page1 from './pages/webgl/playground/playground1.page';
import WebglPlaygroundPage3 from './pages/webgl/playground/playground3/payground3.page';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/raster-basic">
            <BasicRasterizationPage />
          </Route>
          <Route path="/shading">
            <ShadingPage />
          </Route>

          {/* webgl */}
          <Route path="/webgl/playground1">
            <WebglPlayground1Page1 />
          </Route>
          <Route path="/webgl/playground2">
            <WebglPlaygroundPage2 />
          </Route>

          <Route path="/webgl/playground3">
            <WebglPlaygroundPage3 />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
