import React from 'react';
//import logo from './images/logo.svg';
import './styles/App.scss';

import { BrowserRouter as Router, Route ,Switch } from 'react-router-dom';
import Atelier from './pages/atelier.js';
import Home from './pages/home.js';

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path="/home" exact component={Home} />
            <Route path="/" exact component={Atelier} />
          </Switch>
      </Router>
    </div>
  );
}

//subscribe();

export default App;
