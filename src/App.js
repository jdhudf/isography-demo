import React from 'react';
//import logo from './images/logo.svg';
import './styles/App.scss';

import { BrowserRouter as Router, Route ,Switch } from 'react-router-dom';
import Login from './pages/login.js';
import Atelier from './pages/atelier.js';
import SignUp from './pages/signup.js';
import Home from './pages/home.js';
import Setting from './pages/setting.js';

import Profile from './pages/profile.js';

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path="/home" exact component={Home} />
            <Route path="/setting" exact component={Setting} />
            <Route path="/" exact component={Atelier} />
            <Route path="/login"  component={Login} />
            <Route path="/signup"  component={SignUp} />
            <Route path="/profile"  component={Profile} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
