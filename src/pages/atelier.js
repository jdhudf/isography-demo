import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';

import {
  //getArtboardData,
  updateArtboards,
  getCanvas,
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
      command: false,
      shift: false,
    }
  }

  componentDidMount(e) {

    const el = document.querySelector('.section-artboard');
    /*el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });*/

    el.addEventListener('onkeydown', this.keyPress , { passive: false });

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

  handleElement = (action) => {

    const {
      selected, working,
      artboards,
      updateArtboard,
      switchSelected,
      recordHistory,
      redo, undo,
      future, past, present
    } = this.props

    const canvas = getCanvas({ artboards: artboards, working: working }),
          el = canvas.svg_data[selected];
    let data_copy = canvas.svg_data.slice();

    console.log(selected, el, data_copy)

    switch (action){
      case 'Duplicate':
        console.log('duplicate');
        data_copy.push(el);
        break;
      case 'Delete':
        console.log('delete');
        data_copy.splice(selected,1);
        switchSelected(null)
        break;
      case 'Reflect':
        const regExp = /-?\d+/g;
        const scale = el.match(regExp)

        var n = 3;

        const result = el.replace(regExp,
          function(match) {
            if(n === 3) {
              n--;
              return scale[0];
            } else if (n === 2) {
              n--;
              return scale[1];
            } else if (n === 1) {
              n--;
              return -scale[2];
            } else if (n === 0) {
              n--;
              return scale[3];
            } else {
              return match;
            };
          }
        );

        data_copy.splice(selected,1);
        data_copy.push(result);
        break;
      case 'bringToFront':
        if ( data_copy.length > 1 ) {
          console.log('bringToFront');
          data_copy.splice(selected,1);
          data_copy.push(el);

          if (data_copy.length !== selected) {
            switchSelected(data_copy.length - 1)
          }
        }

        break;

      case 'bringForward':

        if ( data_copy.length > 1 ) {
          console.log('bringForward');
          data_copy.splice(selected,1);
          data_copy.splice(selected + 1 ,0,el);
          if (data_copy.length !== selected) {
            switchSelected(selected + 1)
          }
        }

        break;
      case 'sendBackward':
        if ( data_copy.length > 1 ) {
          if (selected === (data_copy.length - 1)) {
            console.log('sendBackward');
            data_copy.splice(selected,1);
            data_copy.splice(selected - 1 ,0,el);
            if (data_copy.length !== selected) {
              switchSelected(selected - 1)
            }
          }
        }
        break;
      case 'sendToBack':
        console.log('sendToBack');
        data_copy.splice(selected,1);
        data_copy.unshift(el);
        if (data_copy.length !== selected) {
          switchSelected(0)
        }
        break;
      case 'Redo':
        if (future.length !== 0) {
          redo()
          data_copy = future[0].svg_data.slice();
        }
        break;
      case 'Undo':
        if (past.length !== 0) {
          undo(canvas)
          data_copy = past[past.length-1].svg_data.slice();
        }
        break;
      default:
        break;
    }

    // update artboard with redux

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)
    recordHistory(JSON.parse(JSON.stringify(canvas)))

  }

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

    //alert(e.which)
    console.log(this.state.command, this.state.shift)

    if (e.which === 91) {
      // command
      this.setState({ command: true })

    } else if ( e.which === 16 ) {
      // shift
      this.setState({ shift: true })

    } else if ( this.state.command && e.which === 82 ) {
      // Reflect ('⌘ R')
      this.handleElement("Reflect")

    } else if ( this.state.command && e.which === 88 ) {
      // undo ('⌘ X')
      this.handleElement("Undo")
    } else if ( this.state.command && e.which === 90 ) {
      // redo ('⌘ Z')
      this.handleElement("Redo")

    } else if ( this.state.command && e.which === 68 ) {
      //Duplicate
      this.handleElement('Duplicate')

    } else if ( this.state.command && e.which === 219) {
      // sendBackward
      this.handleElement('sendBackward')

    } else if ( this.state.shift && this.state.command && e.which === 219) {
      // sendToBack
      this.handleElement('sendToBack')

    } else if ( this.state.shift && e.which === 221) {
      // bringForward
      this.handleElement('bringForward')

    } else if ( this.state.shift && this.state.command && e.which === 221) {
      // bringToFront
      this.handleElement('bringToFront')

    } else if ( e.which === 8 ) {
      // delete selected element
      this.handleElement('Delete')

    } else if (e.which === 67) {
      // copy
      alert('⌘ C')
    } else if (e.which === 86) {
      // paste
      alert('⌘ V')

    } else {
      //alert('⌘' + e.key + ' : ' + e.which)
    }
  }

  keyUp = (e) => {
    if (e.which === 91) {
      this.setState({ command: false })
    } else if (e.which === 16) {
      this.setState({ shift: false })
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
          className={ darkmode ? "section-atelier dark-mode": "section-atelier" }
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
          //onKeyDown={this.keyPress}
          //onKeyUp= {this.keyUp}}
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
  selected: state.json.selected,
  past: state.history.past,
  future: state.history.future,
  present: state.history.present,
})


export default connect(
  mapStateToProps,
  //dispatch => ({ switchDarkmode: value => dispatch(actions.switchDarkmode(value)) })
  dispatch => ({
    switchDarkmode: value => dispatch(actions.switchDarkmode(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    recordHistory: value => dispatch(actions.recordHistory(value)),
    undo:           value => dispatch(actions.undo(value)),
    redo:           value => dispatch(actions.redo(value)),
  })
)(Atelier)
