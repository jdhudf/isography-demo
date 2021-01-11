import React from 'react';
import { Link } from 'react-router-dom'
//import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
//  Link
//} from "react-router-dom";

import MenuBar from '../components/menubar.js';
import Navigation from '../components/navigation.js';
import '../styles/home.scss';

//import GallaryPanel from '../components/gallarypanel.js';
//import ToolsPanel from '../components/toolspanel.js';
//import Artboard from '../components/artboard.js';

class Home extends React.Component {
  render() {

    return (
      <section className="section-home">
        <MenuBar />
        <div className="flexbox">
          <Navigation />
          <Dashboard />
        </div>
      </section>
    );

  }
}

const Dashboard = () => {
  return (
    <section className="section-dashboard">
      <div>
      <div className="section-new">
        <h2>Create A New Document</h2>
      </div>
      <div className="your-document">
        <h2>Your Documents</h2>
        <ul>
          <li>
            <Link to="/">Atelier</Link>
          </li>
        </ul>
      </div>
      </div>
    </section>
  );
}
export default Home;
