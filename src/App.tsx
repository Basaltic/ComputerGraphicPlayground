import './App.css';

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import BasicRasterizationPage from './pages/examples/raster-basic/rasterization-basic.page';
import ShadingPage from './pages/examples/shading/shading.page';
import WebglPlaygroundPage from './pages/webgl/playground/playground.page';

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
          <Route path="/webgl/playground">
            <WebglPlaygroundPage />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
