import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';

import {
  //getArtboardData,
  getCanvas
} from '../components/handleLocalstorage'

import '../styles/atelier.scss';

import { connect } from 'react-redux'
import { actions } from '../redux/actions';


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
      willAddElementOfSvg: null,
      test: false,
    }
  }

  componentDidMount(e) {

    /*const el = document.querySelector('.section-artboard');
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });*/

    //el.addEventListener('onkeydown', this.keyPress , { passive: false });

  }


  /*isLocalStorageAvlbl = () => {
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
  }*/

  /*getDataFromLocalStorage = () => {
    return localStorage.getItem('data')//this.setState({data:localStorage.getItem('data')})
  }*/

  onMouseDown = (e) => {

    if (this.state.test) {
      this.moveSVG(e)
    }

  }

  onMouseMove = (e) => {
    e.preventDefault();

    if (this.state.test) {
      this.moveSVG(e)
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

  createSVG = (e) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("id", "pointer")
    svg.setAttribute("width", "200")
    svg.setAttribute("height", "200");
    svg.setAttribute("viewbox", "0 0 200 200");

    svg.style.transform = "scale(0.55)"
    svg.style.position = "absolute"
    svg.style.display = "none"
    svg.style.pointerEvents = "none"
    svg.style.zIndex = "10000"

    const c = document.getElementsByClassName('section-atelier')[0]

    svg.innerHTML = e;

    c.appendChild( svg );

    svg.style.top = e.pageY - 100
    svg.style.left = e.pageX - 100

  }

  removeSVG = () => {

    const pointer = document.getElementById('pointer')

    if (pointer) {
      const c = document.getElementsByClassName('section-atelier')[0]
      c.removeChild(pointer);
    }
  }

  moveSVG = (e) => {
    const pointer = document.getElementById('pointer')
    pointer.style.display = "block"
    pointer.style.top = e.pageY - 100
    pointer.style.left = e.pageX - 100
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

    const { darkmode, switchDarkmode, working, artboards } = this.props

    const canvas = getCanvas({artboards:artboards,working:working});

    const mainColor = canvas.color_scheme["mainColor"],
          subColor = canvas.color_scheme["subColor"],
          accentColor = canvas.color_scheme["accentColor"],
          background = canvas.color_scheme["background"];

    return (
      <section
          className={darkmode? "section-atelier dark-mode": "section-atelier"}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          //onKeyDown={this.keyPress}
          tabIndex="0"
          >

          <div style={welcomescreen} id="welcomescreen">
            <img className="icon" src={icon} alt="Icon" />
            <h2 style={{color: '#fff',}}>Welcome to Isography</h2>
            <button onClick={()=> {
              switchDarkmode(!darkmode)
            }}> Mode is {darkmode? "true":"false"} </button>
          </div>

          <style jsx>{`
            .main {
              fill: ${mainColor};
            }
            .sub {
              fill: ${subColor};
            }
            .accent {
              fill: ${accentColor};
            }
            .section-atelier .section-gallalypanel .item {
              cursor: ${ (this.state.test && this.state.willAddElementOfSvg) ? "grabbing" : "grab"};
            }
            .section-atelier .board, .section-atelier .section-artboard, .section-atelier .section-gallalypanel, .drawer {
              cursor: ${ (this.state.test && this.state.willAddElementOfSvg) ? "grabbing" : "default"};
            }
          `}</style>
          <TopBar
               background={background}
          />
          <ToolsPanel
               selectEl={this.state.selectEl}
          />
          <div className="section-artboard">
          <Artboard
               mainColor={mainColor}
               subColor={subColor}
               accentColor={accentColor}
               background={background}
               updateState={(e) => {
                 this.setState({data:e})
               }}

               willAddElementOfSvg={this.state.willAddElementOfSvg}
               method={()=>{
                 this.setState({
                   test:false,
                   willAddElementOfSvg:null
                 })
                 this.removeSVG()
               }}
               test={this.state.test}
          />
          </div>
          <GallaryPanel
               method={(e) => {
                 this.setState({
                   willAddElementOfSvg:e,
                   test:true,
                 })

                 this.createSVG(e)
               }}
               me={()=>{
                 this.setState({ test:false,willAddElementOfSvg:null })
                 this.removeSVG()
               }}
          />
      </section>
    );

  }
}


const mapStateToProps = state => ({
  darkmode: state.json.darkmode,
  working: state.json.working,
  artboards: state.artboards.present.artboards,
})


export default connect(
  mapStateToProps,
  //dispatch => ({ switchDarkmode: value => dispatch(actions.switchDarkmode(value)) })
  dispatch => ({
    switchDarkmode: value => dispatch(actions.switchDarkmode(value)),
    //updateArtboard: value => dispatch(actions.updateArtboard(value))
  })
)(Atelier)
