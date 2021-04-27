import React from 'react';
//import logo from './images/logo.svg';
import './styles/App.scss';

import { HashRouter, Route ,Switch } from 'react-router-dom';
import Atelier from './pages/atelier.js';
import Home from './pages/home.js';

function App() {
  return (
    <div className="App">
      <HashRouter>
          <Switch>
            <Route path="/home" exact component={Home} />
            <Route path="/" exact component={Atelier} />
          </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
