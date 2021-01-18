import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';
import { getMainColor,getSubColor,getAccentColor } from '../components/handleLocalstorage'

import '../styles/atelier.scss';

//====================================
//  We manage data such as
//  * mainColor's Hex
//  * subCoolor's Hex
//  * accentColor's Hex
//  in this file as state of this component.
//
//  Each SVG items' colors are effected
//  from style jsx in this file.
//  If those state are changed,
//  lower component's props are effected.
//====================================

class Atelier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainColor: getMainColor('#B21313'),//"#B21313",
      subColor: getSubColor('#111184'),
      accentColor: getAccentColor('#C7B136'),
      background: "#ffffff",
      data : this.getDataFromLocalStorage(),
    }
  }

  componentDidMount() {
    this.isLocalStorageAvlbl()

    setTimeout(function () {
        document.getElementById('welcomescreen').style.display='none';
    }, 3000);

  }

  isLocalStorageAvlbl = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('dummy', '1');
        if (localStorage.getItem('dummy') === '1') {
          localStorage.removeItem('dummy');
          return true;
        } else {
          return false;
        }
      } catch(e) {
        return false;
      }
    } else {
      return false;
    }
  }

  getDataFromLocalStorage = () => {
    return localStorage.getItem('data')//this.setState({data:localStorage.getItem('data')})
  }

  render() {

    const welcomescreen = {
      background: '#000',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minWidth: '100vw',
      minHeight: '100vh',
      zIndex: '100000',
      display: 'none',
    }

    return (
      <section className="section-atelier">

          <div style={welcomescreen} id="welcomescreen">
            <img className="icon" src={icon} alt="Icon" />
            <h2 style={{color: '#fff',}}>Welcome to Isography</h2>
          </div>

          <style jsx>{`
            .main {
              fill: ${this.state.mainColor};
            }
            .sub {
              fill: ${this.state.subColor};
            }
            .accent {
              fill: ${this.state.accentColor};
            }
          `}</style>
          <TopBar data={this.state.data}/>
          <ToolsPanel
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
               changeHexOfMain={(e) => {
                 this.setState({mainColor:e})
                 localStorage.setItem('mainColor', e);
               }}
               changeHexOfSub={(e) => {
                 this.setState({subColor:e})
                 localStorage.setItem('subColor', e);
               }}
               changeHexOfAccent={(e) => {
                 this.setState({accentColor:e})
                 localStorage.setItem('accentColor', e);
               }}
               changeHexOfBackground={(e) => this.setState({background:e})}
          />
          <div className="section-artboard">
          <Artboard
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
               background={this.state.background}
          />
          </div>
          <GallaryPanel />
      </section>
    );

  }
}

export default Atelier;
