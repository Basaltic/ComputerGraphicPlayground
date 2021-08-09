import './App.css';

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/home/home.page';
import BasicRasterizationPage from './pages/examples/raster-basic/rasterization-basic.page';
import ShadingPage from './pages/examples/shading/shading.page';

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
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
