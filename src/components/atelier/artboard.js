import React from 'react';
import '../../styles/atelier.scss';
import '../../styles/artboard.scss';

import {
  getArtboardData,
  setArtboardData,
  artboardScale,
  artboardPosition,
  updateArtboards
} from '../handleLocalstorage'

import { onWheel } from './features/pinch-gesture-wheel'

import { connect } from 'react-redux'
import { switchDarkmode, actions } from '../../redux/actions';

//import { useSelector, useDispatch } from 'react-redux'

//====================================
//  We need below functions that
//  -[x] drag items
//  -[x] duplicate items
//  -[x] change items' color
//  -[x] resize items
//  -[x] reflect items
//  -[x] delete items
//  -[ ] group items
//  -[x] pinch-in & pinch-out
//====================================
// maybe helpful! -> https://github.com/daybrush/moveable
// https://medium.com/@auchenberg/detecting-multi-touch-trackpad-gestures-in-javascript-a2505babb10e

class Artboard extends React.Component {

  //====================================
  //  To drag elements of SVG
  //====================================
  //
  //  1. Calculate gap of (1) and (2)
  //     (1) Get a mouse coordinate when clicked
  //     initial
  //     (2) Get a mouse coodinate when moved
  //     moved
  //  2. Get element's translate(x,y) by Regax
  //  3. Add a gap to element translate(x,y) by Regax
  //
  //  draft...
  //  * make it clear which el of data should be edited
  //
  //====================================

  //--- Choose which el we should edit ---//

  constructor(props) {
    super(props);
    this.state = {
      isMouseDown : false,
      propsOrState: false,
      initialTranslate: [0,0], // to change translate(x,y)
      initial: [0,0], // to calculate a gap
      selectedElement: 0, // to make it clear which el should edit
      displayContextMenu: false,
      // -- below is artboard resize and pinch
      mouse: [0,0],
      artboardPosition: artboardPosition([0,0]),
      artboardScale: artboardScale(1),
      gestureStartScale: 0,
      startCoordinate: [0,0],
      // -- below is scaling data
      selectedScale: 1,
      selectedInitial: [0,0],
      isScaleMouseDown: false,
      // -- below is svg data
      data : this.svg_dataInRedux()/*getArtboardData({
        artboards: this.props.artboards.artboards,
        working:this.props.json.working,
        type:"svg_data"
      })//this.props.data,*/
    };
  }

  // We need below code to make  e.preventDefault();  valid on wheel events.
  componentDidMount(e) {

    const el = document.querySelector('.section-artboard');
    el.addEventListener('wheel', (e) => onWheel(e)  /*this.onWheel*/, { passive: false });
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });

    //el.addEventListener('onkeydown', this.keyPress , { passive: false });

    window.addEventListener('resize', this.updateSelecter);

    setArtboardData({
      type: 'last_modified',
      value: new Date(),
    })

  }


  //--- Choose which element we should edit &  send it to parent component ---//
  selectElement = (e) => {

    var array = this.state.data;

    let g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      this.setState({selectedElement: array.indexOf(g)});
      this.props.sendSelectEl(array.indexOf(g));

      return array.indexOf(g)

    } else {

      this.setState({isMouseDown:false})

    }
  }

  updateSelecter = () => {

    // Selector is lightblue line.
    const elements = document.getElementById("svg");
    const selectedElement = elements.children[this.state.selectedElement]
    const selector = document.getElementById('selector');


    if ( selectedElement ){
      const client_w = selectedElement.getBoundingClientRect().width;
      const client_h = selectedElement.getBoundingClientRect().height;

      const client_left = selectedElement.getBoundingClientRect().left;
      const client_top = selectedElement.getBoundingClientRect().top;
      //const client_right = selectedElement.getBoundingClientRect().right;
      //const client_bottom = selectedElement.getBoundingClientRect().bottom;


      const corners = document.getElementsByClassName('corner');

      selector.style.display = "block"

      selector.style.width = client_w + 'px';
      selector.style.height = client_h +  'px';

      selector.style.position = 'fixed';
      selector.style.left = client_left + 'px';
      selector.style.top = client_top +  'px';
      selector.style.zIndex = 1000;

      const d = client_left - 5;
      const e =  client_top - 5;

      corners[0].style.left = d + 'px';
      corners[0].style.top = e +  'px';
      corners[0].style.cursor = 'nwse-resize';

      const x = client_left + client_w - 5;
      const y = client_top + client_h - 5;

      corners[1].style.left = x + 'px';
      corners[1].style.top = y + 'px';
      corners[1].style.cursor = 'nwse-resize';

      const n = client_left + client_w -5;
      const m = client_top - 5;

      corners[2].style.left = n + 'px';
      corners[2].style.top = m + 'px';
      corners[2].style.cursor = 'nesw-resize';

      const o = client_left - 5;
      const p = client_top + client_h - 5;

      corners[3].style.left = o + 'px';
      corners[3].style.top = p + 'px';
      corners[3].style.cursor = 'nesw-resize';
    } else {
      selector.style.display = "none"
    }


  }

  //--- get initial translate of selected elements ---//
  getTranslate = (e) => {
    //const g = e.target.parentNode.outerHTML;

    const elements = document.getElementById("svg");
    const selectedElement = elements.children[this.selectElement(e)]

    if ( selectedElement ){
      const g = selectedElement.outerHTML;

      const regExp = /\d+/g;
      const translate = g.match(regExp)

      this.setState(
        {
          initialTranslate:[parseInt(translate[0]),parseInt(translate[1])]
        }
      );
    }
  }

  onMouseDown = (e) => {

    if (this.svg_dataInRedux !== this.state.data) {
      this.setState({data:this.svg_dataInRedux()})
    }

    this.setState({isMouseDown:true})
    this.setState({propsOrState:true})

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;

    //const el = e.target.parentNode;
    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      //this.selectElement(e);

    }


    //  Set this.state of
    //  * initialTranslate
    //  * mouse clicked coordinate
    this.getTranslate(e);
    this.setState({initial:[mouseX,mouseY]});

  }

  onMouseMove = (e) => {

    if (this.state.isMouseDown) {

      const selected = this.selectElement(e);//this.state.selectedElement

      const artboardScale =  this.state.artboardScale;

      //console.log(artboardScale)

      //---  Calculate a gap  ---//
      const move = [e.pageX,e.pageY];
      const gap = [
        (parseInt(move[0]) - parseInt(this.state.initial[0]))/artboardScale,
        (parseInt(move[1]) - parseInt(this.state.initial[1]))/artboardScale
      ];
      /*const gap = [
        parseInt(move[0]) - parseInt(this.state.initial[0]),
        parseInt(move[1]) - parseInt(this.state.initial[1])
      ];*/

      //console.log('gap ok : ' +  gap);

      //---  Calculate a translate(x,y)  ---//
      let translate = [
        parseInt(this.state.initialTranslate[0]) + parseInt(gap[0]),
        parseInt(this.state.initialTranslate[1]) + parseInt(gap[1])
      ];

      //console.log('translate ok ' + translate);

      const g = e.target.parentNode.outerHTML;

      //console.log('same? ' + g);
      //console.log('same? ' + this.state.data[this.state.selectedElement]);

      if (g === this.state.data[selected] && g.startsWith('<g transform="translate')) {
        //console.log('initialTranslate('+this.state.initialTranslate[0]+','+this.state.initialTranslate[1]+')');

        //---  let a string have a proper translate(x,y)  ---//
        const regExp = /-?\d+/g;
        var n = 1;

        const result = g.replace(regExp,
          function(match) {
            if(n === 1) {
              n--;
              return translate[0];
            } else if (n === 0) {
              n--;
              return translate[1];
            } else {
              return match;
            };
          }
        );


        //--- Move Selector Position ---//

        this.updateSelecter();


        //---  Update this.state.data  ---//

        const data_copy = this.state.data.slice()//this.svg_dataInRedux().slice();
        data_copy[selected] = result;
        this.setState({data: data_copy});



      } else {
        //this.setState({isMouseDown:false})
      }

    } else {
    }
  }

  onMouseUp = (e) => {

    const working = this.props.json.working
    const artboards = this.props.artboards

    const { updateArtboard } = this.props

    this.setState({isMouseDown:false})
    this.setState({propsOrState:false})

    if(this.props.test) {

      this.addElementOfSVG(this.props.willAddElementOfSvg)

    }

    this.updateSelecter();

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards.artboards,
      value: this.state.data
    })

    updateArtboard(newData)

  }

  onMouseLeave = (e) => {

    if(this.state.isMouseDown) {
      this.setState({isMouseDown:false})


      const working = this.props.json.working
      const artboards = this.props.artboards

      const { updateArtboard } = this.props

      const newData = updateArtboards({
        working: working,
        type: "svg_data",
        artboards: artboards.artboards,
        value: this.state.data
      })

      updateArtboard(newData)
    }
  }

  //--- Below is functions triggered in the artboard ---//
  onContextMenu = (e) => {

    const g = e.target.parentNode.outerHTML;

    console.log(g)

    // only when users click svg element, this event'll trigger.
    if (g.startsWith('<g transform="translate')) {



      this.setState({mouse:[e.pageX,e.pageY]})
      this.setState({displayContextMenu: true});
      //this.setState({mouse:[e.offsetX,e.offsetY]})
      //this.setState({mouse:[e.clientX,e.clientY]})

      this.selectElement(e);
      console.log("FFF")
      const contextMenu = document.getElementById('onContextMenu')
      console.log( contextMenu )

      if (contextMenu) {
        //contextMenu.style.position = 'fixed';
        //contextMenu.style.top = e.pageY + 'px';
        //contextMenu.style.left = e.pageX + 'px';
        //contextMenu.style.transform = e.pageX + 'px';
      }

      //contextMenu.style.top = e.pageY + 'px';
      //contextMenu.style.left = e.pageX + 'px';


      e.preventDefault();
    }

  }

  addElementOfSVG = (e) => {

    const data_copy = this.state.data.slice();
    data_copy.push(e);
    this.setState({data: data_copy});
    this.props.method()
    this.props.updateState(data_copy)

  }

  handleElement = (action) => {

    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();

    switch (action){
      case 'Duplicate':
        console.log('duplicate');
        data_copy.push(el);
        break;
      case 'Delete':
        console.log('delete');
        data_copy.splice(this.state.selectedElement,1);
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

        data_copy.splice(this.state.selectedElement,1);
        data_copy.push(result);
        break;
      case 'bringToFront':
        console.log('bringToFront');
        data_copy.splice(this.state.selectedElement,1);
        data_copy.push(el);
        break;
      case 'bringForward':
        console.log('bringForward');
        data_copy.splice(this.state.selectedElement,1);
        data_copy.splice(this.state.selectedElement + 1 ,0,el);
        break;
      case 'sendBackward':
        console.log('sendBackward');
        data_copy.splice(this.state.selectedElement,1);
        data_copy.splice(this.state.selectedElement - 1 ,0,el);
        break;
      case 'sendToBack':
        console.log('sendToBack');
        data_copy.splice(this.state.selectedElement,1);
        data_copy.unshift(el);
        break;
      default:
        break;
    }

    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);

    setArtboardData({
      type: 'svg_data',
      value: data_copy,
    })

  }

  //--- Below is code about handling artboard position and scale ---//

  onWheel = (e) => {
    e.preventDefault();
    this.updateSelecter();
    if (e.ctrlKey) {

      if (0.5 < this.state.artboardScale < 1.5) {

        let scale = this.state.artboardScale;
        scale -= e.deltaY * 0.01;
        this.setState({ artboardScale: scale })

        localStorage.setItem('artboardScale', scale);

      }

    } else {
      let posX = this.state.artboardPosition[0];
      let posY = this.state.artboardPosition[1];

      posX -= e.deltaX * 1;
      posY -= e.deltaY * 1;

      this.setState({ artboardPosition: [ posX ,posY] })
      localStorage.setItem('artboardPosition', JSON.stringify([ posX ,posY]));
      //console.log(e.deltaX +','+e.deltaY);
    }

  }

  gestureStart = (e) => {
    e.preventDefault();

    this.setState(
      {
        startCoordinate:
            [e.pageX - this.state.artboardPosition[0],
            e.pageY - this.state.artboardPosition[1]]
      }
    )

    this.setState({gestureStartScale:this.state.artboardScale});

  }
  gestureChange = (e) => {
    e.preventDefault();
    this.updateSelecter();
    this.setState({artboardScale: this.state.gestureStartScale * e.scale})

    localStorage.setItem('artboardScale', this.state.gestureStartScale * e.scale);

    this.setState({artboardPosition:[e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]})

    localStorage.setItem('artboardPosition', JSON.stringify([e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]));
  }
  gestureEnd = (e) => {
    e.preventDefault();
  }

  //--- Below is code about scaling elements ---//

  getDistance =  (e) => {
    const elements = document.getElementById("svg");
    const selectedElement = elements.children[this.state.selectedElement]

    //alert(selectedElement.getBoundingClientRect().width);

    //const client_w = selectedElement.getBoundingClientRect().width;
    //const client_h = selectedElement.getBoundingClientRect().height;

    //const client_left = selectedElement.getBoundingClientRect().left;
    //const client_top = selectedElement.getBoundingClientRect().top;
    const client_right = selectedElement.getBoundingClientRect().right;
    const client_bottom = selectedElement.getBoundingClientRect().bottom;

    //const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    //const mouseY = e.pageY;

    const x = client_right - e.pageX
    const y = client_bottom - e.pageY


    // [client_right,client_bottom]
    var z = Math.sqrt ( Math.pow(x, 2) + Math.pow(y, 2) );

    //const scale = this.state.selectedScale;
    const initialAxis = this.state.selectedInitial;

    const init_x = client_right - initialAxis[0]
    const init_y = client_bottom - initialAxis[1]

    var init_z = Math.sqrt ( Math.pow(init_x, 2) + Math.pow(init_y, 2) );

    // -- code about scaling & code about translating el while scaling

    const scaling = this.state.selectedScale * z / init_z

    console.log(this.state.selectedScale,this.state.selectedInitial);
    console.log(this.state.selectedScale,scaling,z,init_z)

    //const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();

    //const regExp = /-?\d+/g;
    //const regExp = /\(([^)]+)\)/g;
    //const transform = el.match(regExp)

    const gap = [
      e.pageX - initialAxis[0],
      e.pageY - initialAxis[1]
    ];

    let translate = [
      parseInt(this.state.initialTranslate[0]) + parseInt(gap[0]),
      parseInt(this.state.initialTranslate[1]) + parseInt(gap[1])
    ];

    //console.info('translate is ' +  translate)

    const g = selectedElement.outerHTML;//e.target.parentNode.outerHTML;

    console.info('g tag is... ' + selectedElement.outerHTML);

    if (g === this.state.data[this.state.selectedElement] && g.startsWith('<g transform="translate') && scaling < 4) {

      console.info('translate is ' + translate);

      const regExp = /\(([^)]+)\)/g;
      var n = 1;

      const result = g.replace(regExp,
        function(match) {
          if(n === 1) {
            n--;
            return '(' + translate[0] +','+ translate[1] + ')';
          } else if (n === 0) {
            n--;
            return '(' + scaling +','+ scaling + ')';
          } else {
            return match;
          };
        }
      );

      data_copy[this.state.selectedElement] = result;

      this.setState({data: data_copy});
    }

  }

  onScaleDown = (e) => {

    // set value as Below
    // * where mouse down
    // * get selected element

    // pageX and pageY is mouse's axis in one element.
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    const el = this.state.data[this.state.selectedElement];

    const getValueOfTransformScale = () => {

      const regExp = /\(([^)]+)\)/g;
      const transform = el.match(regExp)// ex.["(342,147)","(1,1)"]

      const regExp_2 = /-?\d+\.\d+/g; // if (1.00,1.00)
      let scale = transform[1].match(regExp_2)

      if (JSON.stringify(scale) === "null") {
        const regExp_3 = /-?\d+/g;
        scale = transform[1].match(regExp_3)
      }

      return scale[0]

    }

    this.setState({
      isScaleMouseDown:true,
      selectedInitial: [mouseX,mouseY],
      initial: [mouseX,mouseY],
      selectedScale: getValueOfTransformScale(),
    })

  }

  onScaleMove = (e, position) => {

    if (this.state.isScaleMouseDown) {

      this.getDistance(e);
      this.updateSelecter()

      switch (position){
        case 'topLeft':
          console.log('topLeft');
          break;
        case 'topRight':
          console.log('topRight');
          break;
        case 'bottomRight':
          console.log('bottomRight');
          break;
        case 'bottomLeft':
          console.log('bottomLeft');
          break;
        default:
          break;
      }

    }

  }

  onScaleUp = (e, position) => {
    this.setState({isScaleMouseDown:false})
    this.props.updateState(this.state.data);
  }

  onScaleLeave = (e, position) => {
    this.setState({isScaleMouseDown:false})
    this.props.updateState(this.state.data);
  }

  svg_dataInRedux = (props) => {
    const json = this.props.json
    const artboards = this.props.artboards.artboards
    const grid = json.grid

    let artboard,artboardSize,gridScale,svg_data;

    for (var i = 0; i < artboards.length; i++) {
      if (artboards[i].artboard_id == json.working) {
        artboard = artboards[i];
      }
    }

    if (artboard) {
      artboardSize = artboard.canvas.artboard_size;
      gridScale = artboard.canvas.grid;
      svg_data = artboard.canvas.svg_data
    } else {
      artboardSize = [800,600];
      gridScale = 1;
      svg_data = []//this.state.data
    }

    return svg_data//.join('')
  }

  render() {

    const styles = {
      artboard: {
        position: "relative",
        transform: `translate(
                      ${this.state.artboardPosition[0]}px,
                      ${this.state.artboardPosition[1]}px
                    )
                    scale(${this.state.artboardScale})`,
      },
      style: {
        background: this.props.background,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: "-1",
      },
      box: {
        //position: "absolute",
        position: "fixed",
        top:`${this.state.mouse[1]}px`,
        left: `${this.state.mouse[0]}px`,
        //top: 0,
        //left: 0,
        //transform: `scale(${this.state.artboardScale}) translate(-50%,-50%)`,
        zIndex: "10000"
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        zIndex: "10000!important"
      },
      bottompanel: {
        width: "150px",
        textAlign: "center",
        position: "absolute",
        padding: "5px 0",
        bottom: "-10px",
        left: "35px",
        transform: "translate(-50%,-50%)"
      },
      bottompanellist: {
        display: "inline-block",
        background: "#fff",
        padding: "3px 7px",
        marginRight: "5px",
        width: "30px"
      }
    }

    const menu = (
      <div style={styles.box}
           id="onContextMenu"
           className="onContextMenu">
        <ul>
          <li onClick={()=>this.handleElement("Duplicate")}>Duplicate <span>⌘V</span></li>
          <li onClick={()=>this.handleElement("Delete")}>Delete <span>⌘D</span></li>
          <li onClick={()=>this.handleElement("Reflect")}>Reflect <span>⌘R</span></li>
          <li>
            Arrange
            <ul>
              <li onClick={()=>this.handleElement("bringToFront")}>Bring to Front <span>⇧⌘]</span></li>
              <li onClick={()=>this.handleElement("bringForward")}>Bring Forward <span>⌘]</span></li>
              <li onClick={()=>this.handleElement("sendBackward")}>Send Backward <span>⌘[</span></li>
              <li onClick={()=>this.handleElement("sendToBack")}>Send to Back <span>⇧⌘[</span></li>
            </ul>
          </li>
        </ul>
      </div>
    )

    const selector = (

      <div id="selector">
        {(()=>{
          const corners = ["topLeft","topRight","bottomRight","bottomLeft"]

          const cornersDiv = corners.map((corner)=>

            <div className="corner"
                 onMouseDown={this.onScaleDown}
                 onMouseMove={(e) => this.onScaleMove(e,corner)}
                 onMouseUp={this.onScaleUp}
                 onMouseLeave={this.onScaleLeave}
                 />
          )
          return cornersDiv
        })()}
      </div>
    )

    const json = this.props.json
    const artboards = this.props.artboards.artboards
    const grid = json.grid

    let artboard,artboardSize,gridScale,svg_data;

    for (var i = 0; i < artboards.length; i++) {
      if (artboards[i].artboard_id == json.working) {
        artboard = artboards[i];
      }
    }

    if (artboard) {
      artboardSize = artboard.canvas.artboard_size;
      gridScale = artboard.canvas.grid;
      svg_data = artboard.canvas.svg_data
    } else {
      artboardSize = [800,600];
      gridScale = 1;
      //svg_data = this.state.data
    }

    return (
      <div style={{position: "relative"}}>
      {selector}

      { this.state.displayContextMenu ?
        <div style={{
          border:"solid 1px blue",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
        }}>
          <div style={styles.cover}
               onClick={ ()=> this.setState({ displayContextMenu: false }) }/>
          {menu}
        </div> : null }

      <section style={styles.artboard}
               className="section-artboard section-bottom"

               gestureStart={this.gestureStart}
               gestureChange={this.gestureChange}
               gestureEnd={this.gestureEnd}
               onWheel={this.onWheel}>

      {
        grid ?
        <svg
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          id="grid"
          viewBox={`0 0 ${artboardSize[0]} ${artboardSize[1]}`}
          width={artboardSize[0]}
          height={artboardSize[1]}
          version="1.1">
            <defs>
              <pattern id="Pattern" x="0" y="0" width="90" height="49.5" patternUnits="userSpaceOnUse" patternTransform={`scale(${gridScale})`}>
              <g transform="matrix(1.52177,0,0,1.53768,-0.32241,-18.278)">
                 <g transform="matrix(-1.07699,-0.588628,0.621799,-1.01953,53.1328,61.2278)">
                     <path d="M2.967,15.069L57.826,15.069" style={{fill:"none",stroke:"deepskyblue",strokeWidth:"0.55px"}}/>
                 </g>
                 <g transform="matrix(-1.07699,0.588628,-0.621799,-1.01953,71.8727,25.4431)">
                     <path d="M2.967,15.069L57.826,15.069" style={{fill:"none",stroke:"deepskyblue",strokeWidth:"0.55px"}}/>
                 </g>
             </g>
              </pattern>
            </defs>
            <rect fill="url(#Pattern)" width={artboardSize[0]}
            height={artboardSize[1]}/>
        </svg>
        : null
      }

      <svg
          style={styles.style}
          id="svg"
          version="1.1"
          viewBox={`0 0 ${artboardSize[0]} ${artboardSize[1]}`}
          width={artboardSize[0]}
          height={artboardSize[1]}
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML=/*{{__html: this.state.data.join('') }}*//*{{__html:

            //this.state.data.join('')

            this.svg_dataInRedux().join('')

            //svg_data.join('')

          }}*//*{{__html: ()=>{
                    console.log('resresr')
                    return this.svg_dataInRedux().join('')
                   }
                 }}*/
           {{__html: (() => {
                if (!this.state.propsOrState) {
                  return this.svg_dataInRedux().join('')
                } else {
                  return this.state.data.join('')
                }
              })()
           }}
            // we should display state while updating state, cuz we update props in realtime, the performance will be bad.
            //

          //dangerouslySetInnerHTML={{__html: this.props.data.join('') }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
      >
      </svg>
      {/*<Svg background={this.props.background} data={this.props.data}/>*/}

      </section>

      <ul style={styles.bottompanel}>
        <li style={styles.bottompanellist}>
          {parseInt(this.state.artboardScale*100, 10)}%
        </li>
      </ul>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  json: state.json,
  artboards: state.artboards
})

export default connect(
  mapStateToProps,
  dispatch => (
    { switchDarkmode: value => dispatch(actions.switchDarkmode(value)) },
    { updateArtboard: value => dispatch(actions.updateArtboard(value)) }
  )
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(Artboard)
