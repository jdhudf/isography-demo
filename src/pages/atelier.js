import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';
import {
  getMainColor,
  getSubColor,
  getAccentColor,
  getBackgroundColor,
  getSVGdata } from '../components/handleLocalstorage'

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
      background: getBackgroundColor('#ffffff'),
      willAddElementOfSvg: 1,
      test: false,
      data : getSVGdata([
        '<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
        '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
        '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>',
        '<g transform="translate(50,100) scale(-1,1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"></path><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"></path><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"></path></g>',
      ]),
      history: [
        {
          mainColor: null,
          subColor: null,
          accentColor: null,
          background: null,
          data: null
        },
        //{},
        //{},
      ],
    }
  }

  componentDidMount() {
    const el = document.querySelector('.section-atelier');

    el.addEventListener('onkeydown', this.keyPress , { passive: false });
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

  onMouseDown = (e) => {
    //this.setState({isMouseDown:true})

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;

    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      this.setState({isMouseDown:true})

      console.log(e.target.parentNode.outerHTML)

      document.querySelector('.section-gallalypanel').style.cursor = 'copy';
      document.querySelector('.section-artboard').style.cursor = 'copy';

      this.setState({willAddElementOfSvg:e.target.parentNode.outerHTML})

    } else {
      this.setState({isMouseDown:false})
    }

  }

  onMouseMove = (e) => {
    e.preventDefault();

    if (this.state.isMouseDown) {
      document.querySelector('.section-gallalypanel').style.cursor = 'copy';
      document.querySelector('.section-artboard').style.cursor = 'copy';
    } else {
      document.querySelector('.section-gallalypanel').style.cursor = 'default';
      document.querySelector('.section-artboard').style.cursor = 'default';
    }
  }

  onMouseUp = (e) => {
    this.setState({isMouseDown:false})
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';
  }

  onMouseLeave = (e) => {
    this.setState({isMouseDown:false})
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';
  }

  keyPress = (e) => {
    e.preventDefault();

    if (e.which === 83) {
      // Save artboard data but we don't need this function in demo version.
      alert('⌘ S')
    } else if (e.which === 90) {
      // undo
      alert('⌘ Z')
    } else if (e.which === 88) {
      // redo
      alert('⌘ X')
    } else if (e.which === 67) {
      // copy
      alert('⌘ C')
    } else if (e.which === 86) {
      // paste
      alert('⌘ V')
    } else if (e.which === 68) {
      //
      alert('⌘ D')
    } else if (e.which === 8) {
      // delete selected element
      alert('delete')
    } else if (e.which === 219) {
      // sendToBack
      alert('⌘ [')
    } else if (e.which === 221) {
      //
      alert('⌘ ]')
    } else {
      alert('⌘' + e.key + ' : ' + e.which)
    }
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
      <section className="section-atelier"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          onKeyDown={this.keyPress}
          tabIndex="0"
          >

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
          <TopBar
               data={this.state.data}
               background={this.state.background}
          />
          <ToolsPanel
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
               backgroundColor={this.state.background}
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
               changeHexOfBackground={(e) => {
                 this.setState({background:e})
                 localStorage.setItem('backgroundColor', e);
               }}
          />
          <div className="section-artboard">
          <Artboard
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
               background={this.state.background}
               updateState={(e) => {
                 this.setState({data:e})
               }}
               data={this.state.data}

               willAddElementOfSvg={this.state.willAddElementOfSvg}
               method={(e)=>{this.setState({test:false})}}
               test={this.state.test}
          />
          </div>
          <GallaryPanel
               method={(e) => {
                 this.setState({
                   willAddElementOfSvg:e,
                   test:true,
                 })
               }}
          />
      </section>
    );

  }
}

export default Atelier;
