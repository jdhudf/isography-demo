import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';

import {
  getArtboardData,
  getCanvas
} from '../components/handleLocalstorage'

import '../styles/atelier.scss';

import { connect } from 'react-redux'
import { switchDarkmode,actions } from '../redux/actions';


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
      willAddElementOfSvg: 1,
      test: false,
    }
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
    //this.setState({isMouseDown:true})

    //const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    //const mouseY = e.pageY;

    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      this.setState({isMouseDown:true})

      //console.log(e.target.parentNode.outerHTML)

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

    const { darkmode, switchDarkmode, working, artboards } = this.props

    const canvas = getCanvas({artboards:artboards,working:working});

    const mainColor = canvas.color_scheme["mainColor"],
          subColor = canvas.color_scheme["subColor"],
          accentColor = canvas.color_scheme["accentColor"],
          background = canvas.color_scheme["background"];

    return (
      <section className={darkmode? "section-atelier dark-mode": "section-atelier"}
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
          `}</style>
          <TopBar
               background={background}
          />
          <ToolsPanel
               selectEl={this.state.selectEl}
               //length={artboard.canvas.svg_data.length}//{this.state.data.length}
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

                 console.log("true")
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
