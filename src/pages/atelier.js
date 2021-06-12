import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import TextEditor from '../components/atelier/textEditor.js';

import {
  //getArtboardData,
  updateArtboards,
  getCanvas,
} from '../components/handleLocalstorage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faFont,
} from '@fortawesome/free-solid-svg-icons'

import '../styles/atelier.scss';
import '../styles/textEditor.scss';

import { connect } from 'react-redux'
import { actions } from '../redux/actions';

import cursor from '../images/addtextcursor.svg'
import cursorpng from '../images/cursor_resize.png'

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

    el.addEventListener('onTouchStart', this.onTouchStart , { passive: false });
    //el.addEventListener('onTouchEnd', this.onTouchEnd , { passive: false });

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
      future, past//, present
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

    const {addText} = this.props

    if (this.state.test) {
      this.moveSVG(e)
    }

    if (addText) {

      const font = document.getElementById('font')
      const x = e.pageX + 3 + "px",
            y = e.pageY - 13 + "px"
      font.style.display = "block"
      font.style.position = "absolute"
      font.style.color = "deepskyblue"
      font.style.top = y
      font.style.left = x
      font.style.zIndex = "10000"

    }

  }

  onMouseUp = (e) => {
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';

    const {addText} = this.props

    if (addText) {
      const font = document.getElementById('font')
      const x = e.pageX + 3 + "px",
            y = e.pageY - 13 + "px"
      font.style.display = "block"
      font.style.color = "#fff"
      font.style.position = "absolute"
      font.style.top = y
      font.style.left = x
    }

  }

  onMouseLeave = (e) => {
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';
  }

  onTouchStart = (e) => {

    if (this.state.test) {
      this.moveSVG(e.changedTouches[0])
    }

  }

  onTouchMove = (e) => {

    if (this.state.test) {
      this.moveSVG(e.changedTouches[0])
    }

  }

  onTouchEnd = (e) => {

    //e.preventDefault();

    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';

    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY

    var elm = document.elementFromPoint(x, y);

    if (this.state.test && elm.id === "svg") {

      const { updateArtboard, working, artboards, recordHistory } = this.props,
            canvas = getCanvas({artboards: artboards,working:working}),
            data_copy = canvas.svg_data.slice();

      data_copy.push(this.state.willAddElementOfSvg);

      const newData = updateArtboards({
        working: working,
        type: "svg_data",
        artboards: artboards,
        value: data_copy
      })

      updateArtboard(newData)

      recordHistory(JSON.parse(JSON.stringify(canvas)))

      this.setState({
        test: false,
        willAddElementOfSvg:null
      })
      this.removeSVG()
    }

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
    svg.style.pointerEvents= "none"

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

    const { darkmode, working, artboards, textEditor, editable, addText } = this.props

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

          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          //onKeyDown={this.keyPress}
          //onKeyUp= {this.keyUp}}
          tabIndex="0"
          style={{position: "relative"}}
          >

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
              cursor: ${ (this.state.test && this.state.willAddElementOfSvg) ? "grabbing" : addText ? "crosshair": editable ? "text" : "default" }
            }
          `}</style>
          <TopBar
               background={background}
          />
          <ToolsPanel
               selectEl={this.state.selectEl}
          />
          <div className="section-artboard">

          {textEditor ? <TextEditor/>: null}

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
                   willAddElementOfSvg: e,
                   test:true,
                 })

                 this.createSVG(e)
               }}
               me={()=>{
                 this.setState({ test:false,willAddElementOfSvg:null })
                 this.removeSVG()
               }}
          />
          <p style={{display: addText ? "block" : "none",position: "absolute", color: "#fff", fontSize: "15px", zIndex: "10000"}} id="font"><FontAwesomeIcon icon={faFont} /></p>
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
  textEditor: state.json.textEditor,
  editable: state.json.editable,
  addText: state.json.addText
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
