import React from 'react';
import '../../styles/atelier.scss';
import '../../styles/artboard.scss';

import {
  getArtboardData,
  updateArtboards,
  getCanvas
} from '../handleLocalstorage'

//import { onWheel } from './features/pinch-gesture-wheel'

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
import ColorPicker from "./toolspanel_ColorPicker";
//import GradientPicker from "./artboard_colorpicker";

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
      isMouseDownMobile : false,
      stateOrProps: false,
      initialTranslate: [0,0], // to change translate(x,y)
      initialScale: [1.00, 1.00], // attention!!! it's used for both of translating and scaling
      initialRotate: 0,
      initialSkew: 0,
      initial: [0,0], // to calculate a gap
      displayContextMenu: false,
      selectedElement: 0,
      // -- below is artboard resize and pinch
      mouse: [0,0],
      artboardPosition: this.props.artboard_position,
      artboardScale: this.props.artboard_scale,
      gestureStartScale: 0,
      startCoordinate: [0,0],
      // -- below is scaling data
      isScaleMouseDown: false,
      selectedTranslate: [0,0],
      initialForScale: [0,0],
      selectedInitial: [0,0],
      center: [0,0],
      // -- below is svg data
      data : getCanvas({artboards:this.props.artboards,working:this.props.working}).svg_data,
      colors: [],
      test: "no",
      item: null,
      dataCopy: getCanvas({artboards:this.props.artboards,working:this.props.working}).svg_data,
      editable: false,
    };
  }

  // We need below code to make  e.preventDefault();  valid on wheel events.
  componentDidMount(e) {

    const el = document.querySelector('.section-artboard');
    el.addEventListener('wheel', this.onWheel/*(e) => onWheel(e)*/  /*this.onWheel*/, { passive: false });
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });

    el.addEventListener('onTouchEnd', this.onTouchEnd , { passive: false });

    window.addEventListener('resize', this.updateSelecter);

    const { artboards, working, resetHistory, updateArtboard } = this.props

    const canvas = getCanvas({artboards: artboards,working:working});

    const newData = updateArtboards({working:working, type:"last_modified", artboards: artboards,value: new Date()})

    updateArtboard(newData)
    resetHistory(canvas)

    //this.getAttribute()

  }

  componentDidUpdate() {
    this.updateSelecter()
  }

  //--- Choose which element we should edit &  send it to parent component ---//
  getColors = (e,s) => {

    //const { artboards, working } =  this.props
    //const canvas = getCanvas({ artboards: artboards, working: working })
    //const g = canvas.svg_data[e]

    const {
            //selected,
            changeColorSet,
            //colors
          } = this.props,
          svg = document.getElementById('svg'),
          g = svg.children[s];
          //data_copy = this.state.data.slice();

    const array = []


    if (g) {

      for ( let i = 0; i < g.children.length ; i++ ) {

        const c = g.children[i].getAttribute("fill")

        array.push(c)

      }

    }

    function uniq(array) {
      const knownElements = {};
      const uniquedArray = [];
      for (let i = 0, maxi = array.length; i < maxi; i++) {
        if (array[i] in knownElements)
          continue;
        uniquedArray.push(array[i]);
        knownElements[array[i]] = true;
      }
      return uniquedArray;
    };

    changeColorSet(uniq(array))

  }

  selectElement = (e) => {

    const { switchSelected, artboards, working,  switchTextEditor } =  this.props
    const canvas = getCanvas({ artboards: artboards, working: working })
    var array = canvas.svg_data;

    if ( e ) {

      if ( e.target.closest("[data-type]") ) {

        let g = e.target.closest("[data-type]").outerHTML;//e.target.parentNode.outerHTML;

        this.setState({ selectedElement: array.indexOf(g) });
        switchSelected( array.indexOf(g) )

        const el = e.target.closest("[data-type]");
        const dimention = document.getElementById('dimention')
        const fill = "#fff"

        if (el.dataset.dimention === undefined || el.dataset.dimention === 'none') {

          dimention.children[0].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[1].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[2].style = "fill:"+fill +";border:solid 1px gray;"
        } else if (el.dataset.dimention === 'top') {
          dimention.children[0].style = "fill:deepskyblue;border:solid 1px gray;"
          dimention.children[1].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[2].style = "fill:"+fill +";border:solid 1px gray;"
        } else if (el.dataset.dimention === 'left') {
          dimention.children[0].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[1].style = "fill:deepskyblue;border:solid 1px gray;"
          dimention.children[2].style = "fill:"+fill +";border:solid 1px gray;"
        } else if (el.dataset.dimention === 'right') {
          dimention.children[0].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[1].style = "fill:"+fill +";border:solid 1px gray;"
          dimention.children[2].style = "fill:deepskyblue;border:solid 1px gray;"
        }

        if (e.target.closest("[data-type]").dataset.type ===  "text") {
          switchTextEditor(true)
        } else {
          switchTextEditor(false)
        }

        return array.indexOf(g)

      } else {

        this.setState({ isMouseDown:false, isMouseDownMobile: false })
        switchSelected( null )

      }

    }

  }

  updateSelecter = () => {

    const { selected } = this.props

    // Selector is lightblue line.
    const elements = document.getElementById("svg");

    if ( elements ) {

      const selectedElement = elements.children[selected],
            selector = document.getElementById('selector'),
            colorset = document.getElementById('color-set'),
            textCursor = document.getElementById('textCurcor');

      if ( selectedElement ){

        const client_w = selectedElement.getBoundingClientRect().width,
              client_h = selectedElement.getBoundingClientRect().height,
              client_left = selectedElement.getBoundingClientRect().left,
              client_top = selectedElement.getBoundingClientRect().top;

        const corners = document.getElementsByClassName('corner'),
              ajastment = 7;

        selector.style.display = "block"

        selector.style.width = client_w + 'px';
        selector.style.height = client_h +  'px';

        selector.style.position = 'fixed';
        selector.style.left = client_left - 1 + 'px';
        selector.style.top = client_top - 1 + 'px';
        selector.style.zIndex = 1000;

        const d = client_left - ajastment;
        const e =  client_top -ajastment;

        corners[0].style.left = d + 'px';
        corners[0].style.top = e +  'px';
        corners[0].style.cursor = 'nwse-resize';

        const x = client_left + client_w - ajastment;
        const y = client_top + client_h - ajastment;

        corners[1].style.left = x + 'px';
        corners[1].style.top = y + 'px';
        corners[1].style.cursor = 'nwse-resize';

        const n = client_left + client_w - ajastment;
        const m = client_top - ajastment;

        corners[2].style.left = n + 'px';
        corners[2].style.top = m + 'px';
        corners[2].style.cursor = 'nesw-resize';

        const o = client_left - ajastment;
        const p = client_top + client_h - ajastment;

        corners[3].style.left = o + 'px';
        corners[3].style.top = p + 'px';
        corners[3].style.cursor = 'nesw-resize';

        colorset.style.top = client_top + client_h - 40 + 'px';
        colorset.style.left = client_left - 55 + 'px';
        colorset.style.zIndex = "1000"

        textCursor.style.transform = `scale(${this.state.initialScale})`
        textCursor.style.top = - client_h - client_h + 'px';
        textCursor.style.left = client_w + 'px';


        colorset.style.display = "flex"

      } else {

        if( selector !== null ) {
          selector.style.display = "none"
          colorset.style.display = "none"
        }

      }
    }

  }

  //--- get initial translate of selected elements ---//

  /*setInitialTransform = (e) => {

    const { selected } = this.props,
          svg = document.getElementById('svg'),
          g = svg.children[selected].outerHTML;

    const regExp = /-?\d+(\.\d+)?/g,
          transform = g.match(regExp)

    switch (e) {
      case "translate":

        return [transform[0],transform[1]]

        break;

      case "scale":

        return [transform[2],transform[3]]

        break;
      default:
        return [1,1]

    }
  }*/

  getAttribute = (e,s) => {

    if (s) {

      const { artboards, working } =  this.props
      const canvas = getCanvas({ artboards: artboards, working: working })

      const g = canvas.svg_data[parseInt(s)]

      if (g) {

        const regExp = /-?\d+(\.\d+)?/g,
              translate = g.match(regExp)

        this.setState(
          {
            initialTranslate:[ parseInt(translate[0]), parseInt(translate[1]) ],
            initialScale: [parseFloat(translate[2]), parseFloat(translate[3])],
            initialSkew: translate[4],
            initialRotate: translate[5],
          }
        );
      }


    } else {

      const { selected } =  this.props

      if ( selected ) {

        const g = this.state.data[selected]
        const regExp = /-?\d+(\.\d+)?/g,
              translate = g.match(regExp)

        this.setState(
          {
            initialTranslate:[ parseInt(translate[0]), parseInt(translate[1]) ],
            initialScale: [parseFloat(translate[2]),parseFloat(translate[3])],
          }
        );

      }

    }


  }

  onMouseDown = (e) => {

    this.selectElement(e);

    this.getColors(e, JSON.stringify(this.selectElement(e)));

    this.getAttribute(e, JSON.stringify(this.selectElement(e)));

    this.setState({
      isMouseDown: true,
      stateOrProps: true,
      initial:[ e.pageX, e.pageY ]
    })

    const { artboards, working, textEditor, updateArtboard } = this.props,
          canvas =  getCanvas({ artboards: artboards, working: working }),
          svg_data = canvas.svg_data.slice();

    if ( textEditor ) {

      svg_data.push('<g transform="translate(20,35) scale(2.00,2.00)" data-type="text"><text x="0" y="0" style="fill:#fff">Text</text></g>')
      //console.log(svg_data)

      const newData = updateArtboards({artboards: artboards, working: working, type: "svg_data", value: svg_data})

      updateArtboard(newData)
      //switchTextEditor()


    }

    if ( this.state.data !== svg_data ) {

      this.setState({ data: svg_data });

    }

  }

  onMouseMove = (e) => {

    if (this.state.isMouseDown && this.props.selected !== null) {
      //console.log(this.state.initialScale)

      //---  Calculate a gap  ---//
      const { selected } =  this.props,
            svg = document.getElementById('svg'),
            g = svg.children[selected],
            data_copy = this.state.data.slice(),
            move = [e.pageX, e.pageY],
            artboardScale =  this.state.artboardScale;

      const gap = [
        ( parseFloat(move[0]) - parseFloat(this.state.initial[0]) ) / artboardScale,
        ( parseFloat(move[1]) - parseFloat(this.state.initial[1]) ) / artboardScale
      ];

      //---  Calculate a translate(x,y)  ---//
      const translate = [
        parseFloat(this.state.initialTranslate[0]) + parseFloat(gap[0]),
        parseFloat(this.state.initialTranslate[1]) + parseFloat(gap[1])
      ];

      g.setAttribute("transform", `translate(`+ translate[0] +`,`+ translate[1] +`) scale(`+ this.state.initialScale[0] +`,`+ this.state.initialScale[1] +`) skewY(`+ this.state.initialSkew +`) rotate(`+ this.state.initialRotate +`)`);

      data_copy[selected] = g.outerHTML

      this.setState({
        data: data_copy
      });

    }

  }

  onMouseUp = (e) => {


    if ( this.state.isMouseDown ) {

      const { updateArtboard, working, artboards, recordHistory, selected } = this.props

      const canvas = getCanvas({ artboards: artboards, working: working })

      const svg = document.getElementById('svg'),
            g = svg.children[selected];



      if (g) {
        //console.log(g.outerHTML)
        const transform = g.getAttribute("transform")

        //console.log(transform)
        const regExp = /-?\d+(\.\d+)?/g,
              value = transform.match(regExp)

        //console.log(value)

        this.setState({
          initialTranslate: [value[0],value[1]],
          initialScale: [value[2],[value[3]]]
        })

      }
      this.setState({
        isMouseDown:false,
        stateOrProps:false,
      })

      if (this.state.data !== canvas.svg_data) {

        const newData = updateArtboards({
          working: working,
          type: "svg_data",
          artboards: artboards,
          value: this.state.data
        })

        updateArtboard(newData)

        recordHistory(canvas)
      }

      this.getAttribute(e, JSON.stringify(selected));


    }

    if( this.props.test ) {

      this.addElementOfSVG(this.props.willAddElementOfSvg)

    }

  }

  onMouseLeave = (e) => {

    if(this.state.isMouseDown) {
      this.setState({isMouseDown:false})


      const { updateArtboard, working, artboards, recordHistory } = this.props

      const canvas = getCanvas({artboards: artboards,working:working})


      const newData = updateArtboards({
        working: working,
        type: "svg_data",
        artboards: artboards,
        value: this.state.data
      })

      updateArtboard(newData)
      recordHistory(canvas)

    }
  }

  //-- for mobile

  onTouchStart = (e) => {

    console.log("start")

    const touchObject = e.changedTouches[0] ;

    const x = touchObject.pageX ;
    const y = touchObject.pageY ;

    this.getColors(touchObject , JSON.stringify(this.selectElement(touchObject)));

    this.getAttribute(touchObject , JSON.stringify(this.selectElement(touchObject)));

    this.setState({
      isMouseDownMobile: true,
      stateOrProps: true,
      initial:[ x, y ]
    })

    const { artboards, working } = this.props,
          canvas =  getCanvas({ artboards: artboards, working: working }),
          svg_data = canvas.svg_data;

    if ( this.state.data !== svg_data ) {

      this.setState({ data: svg_data, dataCopy: svg_data });

    }

  }

  onTouchMove = (e) => {

    var touchObject = e.changedTouches[0] ;

    var x = touchObject.pageX ;
	  var y = touchObject.pageY ;

    if (this.state.isMouseDownMobile && this.props.selected !== null) {

      //---  Calculate a gap  ---//
      const { selected } =  this.props,
            svg = document.getElementById('svg'),
            g = svg.children[selected],
            data_copy = this.state.data.slice(),
            move = [x, y],
            artboardScale =  this.state.artboardScale;

      const gap = [
        ( parseInt(move[0]) - parseInt(this.state.initial[0]) ) / artboardScale,
        ( parseInt(move[1]) - parseInt(this.state.initial[1]) ) / artboardScale
      ];

      //---  Calculate a translate(x,y)  ---//
      const translate = [
        parseInt(this.state.initialTranslate[0]) + parseInt(gap[0]),
        parseInt(this.state.initialTranslate[1]) + parseInt(gap[1])
      ];

      this.setState({test: translate})

      if (g) {

        g.setAttribute("transform", `translate(`+ translate[0] +`,`+ translate[1] +`) scale(`+ this.state.initialScale[0] +`,`+ this.state.initialScale[1] +`)`);

        data_copy[selected] = g.outerHTML

        this.setState({dataCopy: data_copy});

      }

    }

  }

  onTouchEnd = (e) => {

    e.preventDefault();

    console.log("end")

    if ( this.state.isMouseDownMobile ) {

      const { updateArtboard, working, artboards, recordHistory } = this.props

      const canvas = getCanvas({ artboards: artboards, working: working })

      this.setState({
        isMouseDownMobile:false,
        stateOrProps: false,
      })

      const newData = updateArtboards({
        working: working,
        type: "svg_data",
        artboards: artboards,
        value: this.state.dataCopy
      })

      if (this.state.dataCopy !== canvas.svg_data) {
        updateArtboard(newData)
        recordHistory(canvas)
      }


    }

  }

  //--- Below is functions triggered in the artboard ---//
  onContextMenu = (e) => {

    const g = e.target.parentNode.outerHTML;

    // only when users click svg element, this event'll trigger.
    if (g.startsWith('<g transform="translate')) {

      this.setState({mouse:[e.pageX,e.pageY]})
      this.setState({displayContextMenu: true});

      this.selectElement(e);

      e.preventDefault();
    }

  }

  addElementOfSVG = (e) => {

    const { updateArtboard, working, artboards, recordHistory } = this.props

    const canvas = getCanvas({artboards: artboards,working:working})

    const data_copy = canvas.svg_data.slice();
    data_copy.push(e);
    this.setState({data: data_copy});

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)

    recordHistory(JSON.parse(JSON.stringify(canvas)))

    this.props.method()

  }

  handleElement = (action) => {

    const { selected, artboards, working, updateArtboard, switchSelected } = this.props

    const el = this.state.data[selected];
    const data_copy = this.state.data.slice();

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
        console.log('bringToFront');
        data_copy.splice(selected,1);
        data_copy.push(el);

        if (data_copy.length !== selected) {
          switchSelected(data_copy.length - 1)
        }

        break;
      case 'bringForward':
        console.log('bringForward');
        data_copy.splice(selected,1);
        data_copy.splice(selected + 1 ,0,el);
        if (data_copy.length !== selected) {
          switchSelected(selected + 1)
        }
        break;
      case 'sendBackward':
        console.log('sendBackward');
        data_copy.splice(selected,1);
        data_copy.splice(selected - 1 ,0,el);
        if (data_copy.length !== selected) {
          switchSelected(selected - 1)
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
      default:
        break;
    }

    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    // update artboard with redux

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)

  }

  //--- Below is code about handling artboard position and scale ---//

  onWheel = (e) => {
    e.preventDefault();
    //this.updateSelecter();
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
    //this.updateSelecter();
    this.setState({artboardScale: this.state.gestureStartScale * e.scale})

    localStorage.setItem('artboardScale', this.state.gestureStartScale * e.scale);

    this.setState({artboardPosition:[e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]})

    localStorage.setItem('artboardPosition', JSON.stringify([e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]));
  }
  gestureEnd = (e) => {
    e.preventDefault();
  }

  //--- Below is code about scaling elements ---//

  getDistance = (e) => {

    const { selected } = this.props,
          elements = document.getElementById("svg"),
          selectedElement = elements.children[selected],
          artboardScale =  this.state.artboardScale,
          data_copy = this.state.data.slice();

    //const client_w = selectedElement.getBoundingClientRect().width,
          //client_h = selectedElement.getBoundingClientRect().height,
          //client_right = selectedElement.getBoundingClientRect().right,
          //client_bottom = selectedElement.getBoundingClientRect().bottom;
         //client_left = selectedElement.getBoundingClientRect().left,
         //client_top = selectedElement.getBoundingClientRect().top;


    //--  Return Scale() of Selected Elements  --//

    const x = this.state.center[0] - e.pageX,//client_right - e.pageX,
          y = this.state.center[1] - e.pageY,//client_bottom - e.pageY,
          z = Math.sqrt ( Math.pow(x, 2) + Math.pow(y, 2) );

    const initialAxis = this.state.selectedInitial;

    const init_x = this.state.center[0] - initialAxis[0],//client_right - initialAxis[0],
          init_y = this.state.center[1] - initialAxis[1],//client_bottom - initialAxis[1],
          init_z = Math.sqrt ( Math.pow(init_x, 2) + Math.pow(init_y, 2) );

    const scaling = [
                      this.state.initialScale[0] * z / init_z,
                      this.state.initialScale[1] * z / init_z,
                    ]
    console.log(scaling[0])
    //--  Return Translate() of Selected Elements  --//

    const gap = [
      ( e.pageX - initialAxis[0] ) / artboardScale,
      ( e.pageY - initialAxis[1] ) / artboardScale
    ];

    let translate = [
      parseFloat(this.state.selectedTranslate[0]) + parseFloat(gap[0]),
      parseFloat(this.state.selectedTranslate[1]) + parseFloat(gap[1])
    ];

    //--  Change Transform() of Selected Element  --//

    selectedElement.setAttribute("transform",
    `translate(`+ translate[0] +`,`+ translate[1] +`)
     scale(`+ scaling[0] +`,`+ scaling[1] +`) skewY(`+ this.state.initialSkew+`) rotate(`+this.state.initialRotate+`)`);

    data_copy[selected] = selectedElement.outerHTML

    this.setState({data: data_copy, dataCopy: data_copy});

  }

  onScaleDown = (e, corner) => {

    // set value as Below
    // * where mouse down
    // * get selected element

    const cur = document.getElementById('scale-cover');

    switch (corner) {
      case "topLeft":
        cur.style.cursor = "nwse-resize"
        break;
      case "bottomRight":
        cur.style.cursor = "nesw-resize"
        break;
      case "topRight":
        cur.style.cursor = "nwse-resize"
        break;
      case "bottomLeft":
        cur.style.cursor = "nesw-resize"
        break;
      default:

    }

    //--  get scale() of selected element with regEpx  --//

    const { selected } = this.props,
          elements = document.getElementById("svg"),
          selectedElement = elements.children[selected];

    const regExp = /\(([^)]+)\)/g,
          transform = selectedElement.outerHTML.match(regExp),// ex.["(342,147)","(1,1)"]
          regExp_2 = /-?\d+(\.\d+)?/g,// /-?\d+\.\d+/g; // if (1.00,1.00)
          translate =  transform[0].match(regExp_2),
          scale = transform[1].match(regExp_2)

    const client_right = selectedElement.getBoundingClientRect().right,
          client_bottom = selectedElement.getBoundingClientRect().bottom,
          client_w = selectedElement.getBoundingClientRect().width,
          client_h = selectedElement.getBoundingClientRect().height;

    const center = [
                    client_right - client_w / 2,
                    client_bottom - client_h / 2
                   ]
    /*const centerDiv = document.getElementById('center')
    centerDiv.style.left = this.state.center[0] + "px"
    centerDiv.style.top = this.state.center[1] + "px"
    centerDiv.style.zIndex = "100000"*/

    this.setState({
      isScaleMouseDown: true,
      selectedInitial: [ e.pageX , e.pageY ],
      selectedTranslate: translate,
      initialScale: [parseFloat(scale[0]), parseFloat(scale[1])],
      stateOrProps: true,
      center: [ center[0], center[1] ]
    })

  }

  onScaleMove = (e) => {

    if (this.state.isScaleMouseDown) {

      this.getDistance(e);

    }

  }

  onScaleUp = (e, position) => {


    this.setState({
      isScaleMouseDown:false,
      stateOrProps:false
    })

    const { updateArtboard, working, artboards, recordHistory, selected } = this.props
    const canvas = getCanvas({artboards: artboards,working:working})

    const g = this.state.data[selected]//selectedEl.outerHTML;

    const regExp = /-?\d+(\.\d+)?/g,
          translate = g.match(regExp)

    this.setState({
      //initialTranslate: [translate[0],translate[1]],
      initialScale: [translate[2],translate[3]]
    })

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: this.state.data
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }

  onScaleLeave = (e, position) => {

    this.setState({
      isScaleMouseDown:false,
      stateOrProps:false
    })

    const { updateArtboard, working, artboards, recordHistory, selected } = this.props
    const canvas = getCanvas({ artboards: artboards, working:working })

    const g = this.state.data[selected]

    const regExp = /-?\d+(\.\d+)?/g,
          translate = g.match(regExp)

    this.setState({
      initialScale: [translate[2], translate[3]]
    })

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: this.state.data
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }


  onTouchScaleStart = (e, corner) => {

    console.log("Touch Scale");

    const cur = document.getElementById('scale-cover');

    const touchObject = e.changedTouches[0];

    switch (corner) {
      case "topLeft":
        cur.style.cursor = "nwse-resize"
        break;
      case "bottomRight":
        cur.style.cursor = "nesw-resize"
        break;
      case "topRight":
        cur.style.cursor = "nwse-resize"
        break;
      case "bottomLeft":
        cur.style.cursor = "nesw-resize"
        break;
      default:

    }

    //--  get scale() of selected element with regEpx  --//

    const { selected } = this.props,
          elements = document.getElementById("svg"),
          selectedElement = elements.children[selected];

    const regExp = /\(([^)]+)\)/g,
          transform = selectedElement.outerHTML.match(regExp),// ex.["(342,147)","(1,1)"]
          regExp_2 = /-?\d+(\.\d+)?/g,// /-?\d+\.\d+/g; // if (1.00,1.00)
          translate =  transform[0].match(regExp_2),
          scale = transform[1].match(regExp_2)

    const client_right = selectedElement.getBoundingClientRect().right,
          client_bottom = selectedElement.getBoundingClientRect().bottom,
          client_w = selectedElement.getBoundingClientRect().width,
          client_h = selectedElement.getBoundingClientRect().height;

    const center = [
                    client_right - client_w / 2,
                    client_bottom - client_h / 2
                   ]
    /*const centerDiv = document.getElementById('center')
    centerDiv.style.left = this.state.center[0] + "px"
    centerDiv.style.top = this.state.center[1] + "px"
    centerDiv.style.zIndex = "100000"*/

    this.setState({
      isScaleMouseDown: true,
      selectedInitial: [ touchObject.pageX , touchObject.pageY ],
      selectedTranslate: translate,
      initialScale: [parseFloat(scale[0]), parseFloat(scale[1])],
      stateOrProps: true,
      center: [ center[0], center[1] ]
    })


    this.setState({test: "Scale Start"})
  }

  onTouchScaleMove = (e) => {

    if (this.state.isScaleMouseDown) {

      console.log("Touch Scale Move");
      this.setState({test: "Scaling Move"})

      this.getDistance(e.changedTouches[0]);

    }

  }

  onTouchScaleEnd = (e) => {

    console.log("Touch Scale End");
    this.setState({test: "Scaling End"})

    this.setState({
      isScaleMouseDown:false,
      stateOrProps:false
    })

    const { updateArtboard, working, artboards, recordHistory, selected } = this.props
    const canvas = getCanvas({artboards: artboards,working:working})

    const g = this.state.data[selected]//selectedEl.outerHTML;

    const regExp = /-?\d+(\.\d+)?/g,
          translate = g.match(regExp)

    this.setState({
      initialScale: [translate[2],translate[3]]
    })

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: this.state.dataCopy
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }

  dimensions = (e) => {

    const { selected,
            updateArtboard,
            working,
            artboards,
            recordHistory } =  this.props,
          svg = document.getElementById('svg'),
          g = svg.children[selected],
          data_copy = this.state.data.slice(),
          canvas = getCanvas({ artboards: artboards, working: working }),
          dimention = document.getElementById('dimention'),
          disactive = "fill:#fff;border:solid 1px gray",
          active = "fill:deepskyblue;border:solid 1px gray",
          translate = this.state.initialTranslate,
          //scale = this.state.initialScale,
          test = g.getBoundingClientRect();


    switch (e) {
      case "top":

        if (g.getAttribute('data-dimention') !== 'top') {



          const x = translate[0] - ( test.width * 0.2 )
          const y = translate[1] + (test.height / 0.9 )

          //console.log("translate : " + translate[0] + " : " + translate[1]);
          //console.log("translate : " + x + " : " + y);
          //console.log(x,y)

          g.setAttribute("transform", `translate(`+ x +`,`+ y +`) scale(`+ 1.00 * this.state.initialScale[0] +`,`+  0.580 * this.state.initialScale[0] +`) skewY(0) rotate(-45)`);
          g.setAttribute('data-dimention', 'top');

          dimention.children[0].style = active
          dimention.children[1].style = disactive
          dimention.children[2].style = disactive

        } else {

          const x = translate[0]
          const y = translate[1]

          g.setAttribute('data-dimention', 'none');
          g.setAttribute("transform", `translate(`+ x +`,`+ y +`) scale(`+ 1.00 * this.state.initialScale[0] +`,`+  1.00 * this.state.initialScale[0] +`) skewY(0) rotate(0)`);

          dimention.children[0].style = disactive
          dimention.children[1].style = disactive
          dimention.children[2].style = disactive

        }

        break;
      case "left":

        if (g.getAttribute('data-dimention') !== 'left') {

          const x = translate[0]// - test.width
          const y = translate[1]// + (test.height / 1)

          g.setAttribute("transform", `translate(`+ x +`,`+ y +`) scale(`+ 0.7071 * this.state.initialScale[0] +`,`+ 0.865 * this.state.initialScale[0] +`) skewY(25) rotate(0)`);
          g.setAttribute('data-dimention', 'left');

          dimention.children[0].style = disactive
          dimention.children[1].style = active
          dimention.children[2].style = disactive

        } else {

          g.setAttribute('data-dimention', 'none');
          g.setAttribute("transform", `translate(`+ translate[0] +`,`+ translate[1] +`) scale(`+ this.state.initialScale[0] +`,`+  this.state.initialScale[0] +`) skewY(0) rotate(0)`);

          dimention.children[0].style = disactive
          dimention.children[1].style = disactive
          dimention.children[2].style = disactive

        }

        break;
      case "right":

        if (g.getAttribute('data-dimention') !== 'right') {

          const x = translate[0] + (test.width * 0.2)
          const y = translate[1] + (test.height / 1.3)

          g.setAttribute("transform", `translate(`+ x +`,`+ y +`) scale(`+ 0.7071 * this.state.initialScale[0] +`,`+ 0.865 * this.state.initialScale[0] +`) skewY(-25) rotate(0)`);

          g.setAttribute('data-dimention', 'right');

          dimention.children[0].style = disactive
          dimention.children[1].style = disactive
          dimention.children[2].style = active

        } else {

          g.setAttribute('data-dimention', 'none');
          g.setAttribute("transform", `translate(`+ this.state.initialTranslate[0] +`,`+ this.state.initialTranslate[1] +`) scale(`+ this.state.initialScale[0] +`,`+  this.state.initialScale[0] +`) skewY(0) rotate(0)`);

          dimention.children[0].style = disactive
          dimention.children[1].style = disactive
          dimention.children[2].style = disactive

        }

        break;
      default:

    }

    data_copy[selected] = g.outerHTML

    this.setState({data: data_copy});

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)

    recordHistory(canvas)
  }

  editable = (e) => {

    const el = e.target.closest('g')

    if (el) {
      if (el.dataset.type === "text") {
        //const content = el.children[0].textContent
        //const text = document.createTextNode(content)

        //const svg = document.getElementById('svg')

        this.setState({editable: !this.state.editable})
        //

        /*const { updateArtboard, working, artboards, recordHistory } = this.props,
              canvas = getCanvas({artboards: artboards,working:working}),
              data_copy = canvas.svg_data.slice();

        let gtag = document.createElement('g');

        gtag.setAttribute('transform', 'translate(50,50) scale(1.00,1.00) skewY(0) rotate(0)');
        gtag.setAttribute('data-type', 'el');

        gtag.appendChild(editable)

        data_copy.push(gtag.outerHTML);

        const newData = updateArtboards({
          working: working,
          type: "svg_data",
          artboards: artboards,
          value: data_copy
        })

        updateArtboard(newData)

        recordHistory(JSON.parse(JSON.stringify(canvas)))

        */

      }
    }
  }

  onKeyDown = (e) => {

    /*if (this.state.editable) {
      const { selected } = this.props
      const svg = document.getElementById('svg')
      let el = svg.children[selected].cloneNode(true)

      if (el.dataset.type === "text") {

        let text = el.children[0].textContent

        if (e.key === "Backspace" ) {
          text = text.slice( 0, -1 ) ;
        } else if( e.key === "Shift" ) {

        } else {
          text += e.key
        }

        console.log(text)

        el.children[0].textContent = text

        const { updateArtboard, working, artboards, recordHistory } = this.props,
              canvas = getCanvas({artboards: artboards,working:working}),
              data_copy = canvas.svg_data.slice();

        console.log(el.children[0].outerHTML)
        data_copy[selected] = el.outerHTML

        const newData = updateArtboards({
          working: working,
          type: "svg_data",
          artboards: artboards,
          value: data_copy
        })

        updateArtboard(newData)

        recordHistory(JSON.parse(JSON.stringify(canvas)))



      }

    }*/

  }

  render() {

    const {
       colors,
       artboards,
       working, grid, selected,
       //recordHistory,
       changeColorSet,
       updateArtboard
     } = this.props
    const canvas = getCanvas({ artboards: artboards, working: working});
          //svg_data = canvas.svg_data.slice()

    const artboardSize = canvas.artboard_size,
          gridScale = getArtboardData({artboards:artboards,working:working,type:"grid"})

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
        top: `${(()=>{
          if ( this.state.mouse[1] < 244) {
            return this.state.mouse[1] + "px"
          } else {
            return "auto"
          }
        })()}`,
        bottom: `${(()=>{
          if ( this.state.mouse[1] < 244) {
            return  "auto"
          } else {
            return "5px"
          }
        })()}`,
        left: `${this.state.mouse[0] + 20}px`,
        //top: 0,
        //left: 0,
        //transform: `scale(${this.state.artboardScale}) translate(-50%,-50%)`,
        zIndex: "10000",
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

    const colorsDiv = []

    if (colors) {
      for (let i = 0; i < colors.length; i++) {

        if (colors[i]!== null) {
          colorsDiv.push(
            /*<GradientPicker
              color={colors[i]}
              method={

                (e) => {
                const newColors = colors.slice()
                newColors[i] = e;

                const newCanvas = JSON.parse(JSON.stringify(canvas))
                const str = newCanvas.svg_data[selected]
                const reg =  colors[i]

                var result = str.replace(new RegExp(reg,'g'), e);
                console.log(result,e)

                newCanvas.svg_data[selected] = result

                const newData = updateArtboards({
                  working: working,
                  type: "svg_data",
                  artboards: artboards,
                  value: newCanvas.svg_data
                })
                updateArtboard(newData)


                //updateArtboard(newData)
                changeColorSet(newColors)


                //recordHistory(JSON.parse(JSON.stringify(canvas)))

              }}/>*/
            <ColorPicker
               color={colors[i]}
               method={(e) => {
                 const newColors = colors.slice()
                 newColors[i] = e;

                 const newCanvas = JSON.parse(JSON.stringify(canvas))
                 const str = newCanvas.svg_data[selected]
                 const reg =  colors[i]

                 var result = str.replace(new RegExp(reg,'g'), e);
                 console.log(result,e)

                 newCanvas.svg_data[selected] = result

                 const newData = updateArtboards({
                   working: working,
                   type: "svg_data",
                   artboards: artboards,
                   value: newCanvas.svg_data
                 })
                 updateArtboard(newData)


                 //updateArtboard(newData)
                 changeColorSet(newColors)


                 //recordHistory(JSON.parse(JSON.stringify(canvas)))

               }}
            />
          )
        }
      }
    }

    const selector = (
      <div>
        <div id="scale-cover"
             onMouseMove={(e) => this.onScaleMove(e)}
             onMouseUp={this.onScaleUp}
             onMouseLeave={this.onScaleLeave}

             onTouchMove={(e) => this.onTouchScaleMove(e)}
             onTouchEnd={this.onTouchScaleEnd}
             style={{ display: this.state.isScaleMouseDown ? "block" : "none" }}>
        </div>
        <div id="selector">
          {(()=>{
            const corners = ["topLeft","topRight","bottomRight","bottomLeft"]

            const cornersDiv = corners.map((corner)=>

              <div className="corner"
                   onMouseDown={(e)=>{
                     this.onScaleDown(e, corner)
                   }}
                   onTouchStart={(e)=>{
                     this.onTouchScaleStart(e, corner)
                   }}
                   onTouchMove={(e) => this.onTouchScaleMove(e)}
                   onTouchEnd={this.onTouchScaleEnd}
                   />
            )
            return cornersDiv
          })()}
        </div>
      </div>
    )

    return (
      <div id="board" //style={{position: "relative"}}
           onMouseUp={() => {
             this.props.method()
           }}
           onTouchEnd={(e)=>{
             e.preventDefault()
           }}
           tabIndex="0"
           style={{position:"relative"}}
           onKeyDown={this.onKeyDown}
           >

      <svg id="dimention" style={{position: "absolute",zIndex: "10000", height: "50px", top: "0px", right: "20px", display: (this.props.selected !== null ) ? "block": "none"}} width="45" height="100%" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M102.601,9.337c-2.181,-1.259 -5.485,-1.396 -7.373,-0.306l-72.178,41.672c-1.889,1.091 -1.652,2.998 0.529,4.257l71.119,41.061c2.181,1.259 5.485,1.396 7.373,0.306l72.178,-41.672c1.889,-1.091 1.652,-2.998 -0.529,-4.257l-71.119,-41.061Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('top')}/><path d="M96.439,107.74c-0,-2.518 -1.533,-5.448 -3.422,-6.538l-72.178,-41.672c-1.888,-1.09 -3.422,0.069 -3.422,2.587l0,82.121c0,2.518 1.534,5.448 3.422,6.538l72.178,41.672c1.889,1.091 3.422,-0.068 3.422,-2.586l-0,-82.122Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('left')}/><path d="M180.412,61.673c0,-2.518 -1.533,-3.678 -3.421,-2.587l-72.178,41.672c-1.889,1.09 -3.422,4.02 -3.422,6.538l-0,82.121c-0,2.518 1.533,3.677 3.422,2.587l72.178,-41.672c1.888,-1.09 3.421,-4.02 3.421,-6.538l0,-82.121Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('right')}/></svg>
      {selector}
      <div id="color-set">
           {colorsDiv}
           <p id="textCurcor" style={{position: "absolute", left: "50px", top: "50px",color: "deepskyblue", display: this.state.editable ? "block": "none"}}>|</p>
      </div>

      <div style={{
        border:"solid 1px blue",
        position: "fixed",
        display:  this.state.displayContextMenu ? "block" : "none",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
      }}>
        <div style={styles.cover}
             onClick={ ()=> this.setState({ displayContextMenu: false }) }/>
        {menu}
      </div>
      {/*<div id="center" style={{
                               width:"5px",
                               height:"5px",
                               background:"deepskyblue",
                               position: "absolute"
                             }}></div>*/}

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
              <pattern id="Pattern" x="0" y="0" width="100" height="57.7" patternUnits="userSpaceOnUse" patternTransform={`scale(${gridScale})`}>
             <g>

               <path d="M-0.049,57.701l99.94,-57.7" style={{fill:"none",stroke:"deepskyblue",strokeWidth:"1.5px"}}/>
               <path d="M-0.049,0.001l99.94,57.7" style={{fill:"none",stroke:"deepskyblue",strokeWidth:"1.5px"}}/>
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
          dangerouslySetInnerHTML={{__html: (() => {
                if (!this.state.stateOrProps) {
                  return getCanvas({artboards:artboards,working:working}).svg_data.join('')
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

          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onDoubleClick={this.editable}
      >
      </svg>

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
  artboards: state.artboards.present.artboards,
  working: state.json.working,
  grid: state.json.grid,
  selected: state.json.selected,
  colors: state.json.colors,
  artboard_scale: state.json.artboardScale,
  artboard_position: state.json.artboardPosition,
  textEditor: state.json.textEditor,
  editable: state.json.editable
})

export default connect(
  mapStateToProps,
  dispatch => ({
    switchDarkmode: value => dispatch(actions.switchDarkmode(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    recordHistory: value => dispatch(actions.recordHistory(value)),
    resetHistory: value => dispatch(actions.resetHistory(value)),
    changeColorSet: value => dispatch(actions.changeColorSet(value)),
    artboardScale: value => dispatch(actions.artboardScale(value)),
    artboardPosition: value => dispatch(actions.artboardPosition(value)),
    switchTextEditor: value => dispatch(actions.switchTextEditor(value)),
    switchEditable: value => dispatch(actions.switchEditable(value)),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(Artboard)
