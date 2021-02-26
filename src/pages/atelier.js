import React from 'react';

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import icon from '../images/logo.svg';

import {
  getArtboardData,
  setArtboardData,
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
      mainColor: getArtboardData('color_scheme')['mainColor'],//getColor('#B21313','mainColor'),//"#B21313",
      subColor: getArtboardData('color_scheme')['subColor'],//getColor('#111184','subColor'),
      accentColor: getArtboardData('color_scheme')['accentColor'],//getColor('#C7B136','accentColor'),
      background: getArtboardData('color_scheme')['background'],//getColor('#C7B136','background'),
      willAddElementOfSvg: 1,
      selectEl:null,
      test: false,
      data : getArtboardData('svg_data'),
      history: [
        {
          mainColor: null,
          subColor: null,
          accentColor: null,
          background: null,
          data: [],
        },
        //{},
        //{},
      ],
    }
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

  removeElement = (e) => {

    const data_copy = this.state.data.slice();

    data_copy.splice(this.state.selectEl,1);

    this.setState({data: data_copy});

    setArtboardData({
      type: 'svg_data',
      value: data_copy,
    })
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

  bringForward = (e) => {
    const el = this.state.data[this.state.selectEl];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectEl,1);
    data_copy.splice(this.state.selectEl + 1 ,0,el);
    this.setState({data: data_copy});

    setArtboardData({
      type: 'svg_data',
      value: data_copy,
    })
  }

  sendBackward = (e) => {
    const el = this.state.data[this.state.selectEl];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectEl,1);
    data_copy.splice(this.state.selectEl - 1 ,0,el);
    this.setState({data: data_copy});

    setArtboardData({
      type: 'svg_data',
      value: data_copy,
    })
  }

  immute = () => {
    const hisJson = {
      mainColor: this.state.mainColor,
      subColor: this.state.subColor,
      accentColor: this.state.accentColor,
      background: this.state.background,
      data: this.state.data
    }

    const history_copy = this.state.data.slice();
    history_copy.push(hisJson);
    this.setState({history: history_copy});

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

    const { json, switchDarkmode } = this.props

    const darkmode = json.json.darkmode

    const artboard_array = json.json.json.data

    const working = json.json.json.working

    for (var i=0;i<artboard_array.length;i++){
      if (working === artboard_array[i].artboard_id) {

        //console.log(artboard_array[i],artboard_array[i].color_scheme)
      } else {
        //console.log(working,artboard_array[i].artboard_id)
      }
    }

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
              if (darkmode) {
                switchDarkmode(false)
              } else {
                switchDarkmode(true)
              }
            }}> Mode is {darkmode? "true":"false"} </button>
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
                 setArtboardData({
                   type: 'mainColor',
                   value: e,
                 })
               }}
               changeHexOfSub={(e) => {
                 this.setState({subColor:e})
                 setArtboardData({
                   type: 'subColor',
                   value: e,
                 })
               }}
               changeHexOfAccent={(e) => {
                 this.setState({accentColor:e})
                 setArtboardData({
                   type: 'accentColor',
                   value: e,
                 })
               }}
               changeHexOfBackground={(e) => {
                 this.setState({background:e})
                 setArtboardData({
                   type: 'background',
                   value: e,
                 })
               }}
               removeElement={this.removeElement}
               selectEl={this.state.selectEl}
               length={this.state.data.length}
               bringForward={this.bringForward}
               sendBackward={this.sendBackward}
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
               sendSelectEl={(e) => {
                 this.setState({selectEl:e})
               }}
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


const mapStateToProps = state => ({
  json: state,
})


export default connect(
  mapStateToProps,
  dispatch => ({ switchDarkmode: value => dispatch(actions.switchDarkmode(value)) })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(Atelier)
