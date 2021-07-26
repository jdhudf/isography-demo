import React from 'react';
//import logo from './images/logo.svg';
import './styles/App.scss';

import { HashRouter, Route ,Switch } from 'react-router-dom';
import Atelier from './pages/atelier.js';
import Home from './pages/home.js';
import ErrorBoundary from './components/error.js';


function App() {

  return (
    <div className="App">
      <ErrorBoundary>
      <HashRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/atelier" exact component={Atelier} />
          </Switch>
      </HashRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
