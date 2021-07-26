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
      initialTransform: [],
      initialTransformScaling: [],
      initialTranslate: [0,0],
      initialScale: [1.00, 1.00],
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
      hasSpace: false,
      Shift: false,
    };
  }

  // We need below code to make  e.preventDefault();  valid on wheel events.
  componentDidMount(e) {

    const el = document.querySelector('.section-artboard');

    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });

    el.addEventListener('onTouchEnd', this.onTouchEnd , { passive: false });
    el.addEventListener('onTouchStart', this.onTouchStart , { passive: false });
    el.addEventListener('onTouchMove', this.onTouchMove , { passive: false });

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

    const {
      switchSelected,
      selected,
      artboards,
      working,
      switchTextEditor,
      switchEditable
    } =  this.props

    const canvas = getCanvas({ artboards: artboards, working: working })

    var array = canvas.svg_data;

    if ( e.target.closest("[data-type]") ) {

      const group = e.target.closest("[data-type='group']")
      let g;

      if (group) {

        g = group.outerHTML;

      } else {

        g = e.target.closest("[data-type]").outerHTML;

      }

      const text = e.target.closest("[data-type='text']")

      if (text) {


        const { changeFont, font } = this.props

        console.log("switch font : " +  font.name)

        const newfont = {
          name: text.dataset.name,
          weight: text.dataset.weight,
          style: text.dataset.style
        }

        changeFont(newfont)

      }

      let newSelected;

      if (!this.state.Shift) {

        if (!selected.includes(array.indexOf(g))) {

          newSelected = []
          newSelected.push(array.indexOf(g))

        } else {

          newSelected = selected

        }

        switchSelected( newSelected )

      } else {

        newSelected = selected.slice()

        if ( newSelected.includes( array.indexOf(g) ) ) {
          newSelected.shift(array.indexOf(g), 1)
        } else {
          newSelected.push(array.indexOf(g))
        }

        switchSelected( newSelected )

      }

      /** dimentions **/

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

      /****/

      if (e.target.closest("[data-type]").dataset.type ===  "text") {
        switchTextEditor(true)
      } else {
        switchTextEditor(false)
        switchEditable(false)
      }

      switchSelected( newSelected )

      return newSelected//array.indexOf(g)

    } else {

      this.setState({ isMouseDown:false, isMouseDownMobile: false })
      switchSelected( [] )
      switchTextEditor(false)
      switchEditable(false)

    }

  }

  updateSelecter = () => {

    const {
      selected,
      switchEditable,
      editable
    } = this.props

    const svg = document.getElementById("svg"),
          selector = document.getElementById('selector'),
          colorset = document.getElementById('color-set'),
          textCursor = document.getElementById('textCursor'),
          corners =  document.getElementsByClassName('corner');

    let selectedElement;

    if ( svg ) {

      if ( selected ) {

        let array = [ ]


        for ( let i = 0; i < selected.length; i++ ) {

          selectedElement = svg.children[ selected[i] ];

          if ( selectedElement ) {

            const client_right = selectedElement.getBoundingClientRect().right,
                  client_bottom = selectedElement.getBoundingClientRect().bottom,
                  client_w = selectedElement.getBoundingClientRect().width,
                  client_h = selectedElement.getBoundingClientRect().height,
                  client_left = selectedElement.getBoundingClientRect().left,
                  client_top = selectedElement.getBoundingClientRect().top;

            const arr = {
              left: client_left,
              top: client_top,
              w: client_w,
              h: client_h,
              right: client_right,
              bottom: client_bottom
            }

            array.push(arr)

            ////
            if (selectedElement.dataset.type === "text" && editable) {



              console.log(textCursor)
              const asf = selectedElement.getAttribute("transform")
              const ajast = 8
              const regExp = /-?\d+(\.\d+)?/g,
                    scale = asf.match(regExp);

              textCursor.style.height = client_h + 'px';
              textCursor.style.width = 10 + 'px';

              /*corners[2].style.left  = client_left - ajast + 'px';
              corners[2].style.top  = client_top + client_h - ajast + 'px';

              corners[3].style.left  = client_left + client_w - ajast + 'px';
              corners[3].style.top  = client_top + client_h - ajast + 'px';*/

              textCursor.style.left = "100px";// + client_w / parseFloat(scale[2])*2 / this.state.artboardScale + "px";//client_w + 'px';
              textCursor.style.top = "100px";//- (client_h / this.state.artboardScale/parseFloat(scale[2]))*2 - client_h + 7 + 'px';
              textCursor.style.zIndex = '10000';
              textCursor.style.display= 'block';
              textCursor.style.position = "absolute"

            } else {
              textCursor.style.display= 'none';
            }
            ////

          }

        }

        //console.log(array)

        const aryMax = function (a, b) {return Math.max(a, b);}
        const aryMin = function (a, b) {return Math.min(a, b);}

        let left = []
        let top = []
        let width = []
        let height = []
        let right = []
        let bottom = []

        for (let i = 0; i < array.length; i++ ) {
          left.push(array[i].left)
          top.push(array[i].top)
          width.push(array[i].width)
          height.push(array[i].height)
          right.push(array[i].right)
          bottom.push(array[i].bottom)
        }

        if (right[0]) {

          const client_w = right.reduce(aryMax) - left.reduce(aryMin),
                client_h = bottom.reduce(aryMax) - top.reduce(aryMin),
                client_left = left.reduce(aryMin),
                client_top = top.reduce(aryMin);

          let ajast = 8

          selector.style.display = "block";
          selector.style.position = "fixed";
          selector.style.zIndex = "100000";
          selector.style.width = client_w + 'px';
          selector.style.height = client_h +  'px';
          selector.style.left = client_left - 1 + 'px';
          selector.style.top = client_top - 1 + 'px';

          corners[0].style.left  = client_left - ajast + 'px';
          corners[0].style.top  = client_top - ajast + 'px';

          corners[1].style.left  = client_left + client_w - ajast + 'px';
          corners[1].style.top  = client_top - ajast + 'px';

          corners[2].style.left  = client_left - ajast + 'px';
          corners[2].style.top  = client_top + client_h - ajast + 'px';

          corners[3].style.left  = client_left + client_w - ajast + 'px';
          corners[3].style.top  = client_top + client_h - ajast + 'px';

        } else {

          selector.style.display = "none";

        }

      }


    }

  }

  updateArtboard = (data) => {
    const { updateArtboard, working, artboards, recordHistory, selected } = this.props

    const canvas = getCanvas({ artboards: artboards, working: working })

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data
    })

    updateArtboard(newData)

    recordHistory(canvas)
  }

  group = () => {

    const {
      selected,
      switchSelected,
    } = this.props
    //const svg = document.getElementById('svg').cloneNode(true)
    //const children = svg.children

    let data_copy = this.state.data.slice()
    let selectedArray = [];

    for (let i = 0; i<selected.length;i++) {

      //data_copy.splice( i, 1 );

      selectedArray.push( this.state.data[ selected[i] ] )


      //`<g transform="translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)" data-type="group">`
      //`</g>`

    }
    data_copy = data_copy.filter(function(v){
      return ! selectedArray.includes(v);
    });

    selectedArray.unshift(`<g transform="translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)" data-type="group">`)
    selectedArray.push(`</g>`)
    const group = selectedArray.join('')

    data_copy.push(group)

    //console.log(group)
    console.log(data_copy)
    this.setState({data: data_copy})


    switchSelected([])
    this.updateArtboard(data_copy)

  }

  ungroup = () => {

    const { selected } = this.props
    const svg = document.getElementById('svg')
    const data_copy = this.state.data.slice();


    for (let i = 0; i < selected.length; i++) {

        const group = svg.children[ selected[i] ]
        data_copy.shift( selected[i], 1 )

        for (let j = 0; j < group.children.length; j++) {

          data_copy.push(group.children[j].outerHTML)
        }

    }

    //console.log(data_copy)

    this.updateArtboard(data_copy)

  }

  //--- get initial translate of selected elements ---//

  getAttribute = (e,s) => {

    if (s) {

      const { artboards, working } =  this.props
      const canvas = getCanvas({ artboards: artboards, working: working })


      let transforms = [];

      for (let i = 0; i < s.length; i++) {

        const g = canvas.svg_data[parseInt(s[i])]

        if (g) {

          const regExp = /-?\d+(\.\d+)?/g,
                translate = g.match(regExp)

          const arr = {
            number: parseInt(s[i]),
            translate: [ parseInt(translate[0]), parseInt(translate[1]) ],
            scale: [parseFloat(translate[2]), parseFloat(translate[3])],
            skew: translate[4],
            rotate: translate[5]
          }

          transforms.push(arr)


        }

      }

      this.setState({initialTransform: transforms})

    }

  }

  onMouseDown = (e) => {

    this.selectElement(e);

    this.getAttribute(e, JSON.stringify(this.selectElement(e)));

    this.setState({
      isMouseDown: true,
      stateOrProps: true,
      initial: [ e.pageX, e.pageY ]
    })

    const {
      artboards,
      working,
      textEditor,
      updateArtboard,
      addText,
      switchAddText,
      artboard_scale
    } = this.props,
          canvas =  getCanvas({ artboards: artboards, working: working }),
          svg_data = canvas.svg_data.slice();

    if ( addText ) {

      const svg = document.getElementById('svg'),
            el = svg.getBoundingClientRect(),
            artboard_scale = this.state.artboardScale,
            x = Math.round(e.clientX-el.left) / artboard_scale,
            y = Math.round(e.clientY-el.top) / artboard_scale + 30;

      const name = "Lato",
            weight = 400,
            style = "normal";

      svg_data.push(`<g transform="translate(${x},${y}) scale(2.00,2.00) skewY(0) rotate(0)" data-type="text" data-name="${name}" data-style="${style}" data-weight="${weight}" style="font-family: '${name}'; font-weight: ${weight}; font-style: ${style};"><text x="0" y="0" style="fill:#fff" fill="#fff">Text</text></g>`)
      //console.log(svg_data)

      const newData = updateArtboards({artboards: artboards, working: working, type: "svg_data", value: svg_data})

      updateArtboard(newData)
      switchAddText(false)


    }

    if ( this.state.data !== svg_data ) {

      this.setState({ data: svg_data });

    }

  }

  onMouseMove = (e) => {

    if (this.state.isMouseDown) {

      //---  Calculate a gap  ---//
      const { selected } =  this.props,
            svg = document.getElementById('svg'),
            data_copy = this.state.data.slice(),
            move = [e.pageX, e.pageY],
            artboardScale =  this.state.artboardScale;
      let g; // <- this variable is <g> tag

      for (let i = 0; i < selected.length; i++) {

        g = svg.children[ selected[i] ]

        if (g.dataset.type ===  "group") {
          const els = g.children

          for (var j = 0; j < els.length; j++) {

            if ( els[j].dataset.type === "el" || els[j].dataset.type === "text") {
              console.log(els[j].getAttribute("transform"))
            }
          }
        }

        const gap = [
          ( parseFloat(move[0]) - parseFloat(this.state.initial[0]) ) / artboardScale,
          ( parseFloat(move[1]) - parseFloat(this.state.initial[1]) ) / artboardScale
        ];

        //---  Calculate a translate(x,y)  ---//

        const i_translate = this.state.initialTransform[ i ].translate,
              i_scale = this.state.initialTransform[ i ].scale,
              i_skew = this.state.initialTransform[ i ].skew,
              i_rotate = this.state.initialTransform[ i ].rotate;

        const translate = [
          parseFloat(i_translate[0]) + parseFloat(gap[0]),
          parseFloat(i_translate[1]) + parseFloat(gap[1])
        ];

        if (g) {

          g.setAttribute("transform", `translate(`+ translate[0] +`,`+ translate[1] +`) scale(`+ i_scale[0] +`,`+ i_scale[1] +`) skewY(`+ i_skew +`) rotate(`+ i_rotate +`)`);

          data_copy[ selected[i] ] = g.outerHTML

        }

      }

      this.setState({
        data: data_copy
      });

    }

  }

  onMouseUp = (e) => {

    if ( this.state.isMouseDown ) {

      const {
        updateArtboard,
        working,
        artboards,
        recordHistory,
        selected
      } = this.props

      const canvas = getCanvas({ artboards: artboards, working: working }),
           svg = document.getElementById('svg');
      let g;

      for (let i = 0; i < selected.length; i++) {
        g = svg.children[ selected[i] ]

        if (g) {

          const transform = g.getAttribute("transform")

          const regExp = /-?\d+(\.\d+)?/g,
                value = transform.match(regExp)

          this.setState({
            initialScale: [value[2],[value[3]]]
          })

        }
      }

      this.setState({
        isMouseDown:false,
        stateOrProps:false,
      })

      if (this.state.data !== canvas.svg_data) {

        this.updateArtboard(this.state.data)

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

    const {
      selected,
      artboards,
      working,
      updateArtboard,
      switchSelected
    } = this.props

    const data_copy = this.state.data.slice();

    for (var i = 0; i < selected.length; i++) {

      const el = this.state.data[ selected[i] ];

      switch (action){
        case 'Duplicate':
          console.log('duplicate');
          data_copy.push(el);
          break;
        case 'Delete':
          console.log('delete');
          data_copy.splice(selected[i],1);
          switchSelected(null)
          break;
        case 'Reflect':
          const regExp = /-?\d+/g;
          const scale = el.match(regExp)

          let n = 3;

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

          data_copy.splice(selected[i],1);
          data_copy.push(result);
          break;
        case 'bringToFront':
          console.log('bringToFront');
          data_copy.splice(selected[i],1);
          data_copy.push(el);

          if (data_copy.length !== selected) {
            switchSelected(data_copy.length - 1)
          }

          break;
        case 'bringForward':
          console.log('bringForward');
          data_copy.splice(selected[i],1);
          data_copy.splice(selected[i] + 1 ,0,el);
          if (data_copy.length !== selected[i]) {
            switchSelected(selected[i] + 1)
          }
          break;
        case 'sendBackward':
          console.log('sendBackward');
          data_copy.splice(selected[i],1);
          data_copy.splice(selected[i] - 1 ,0,el);
          if (data_copy.length !== selected[i]) {
            switchSelected(selected[i] - 1)
          }
          break;
        case 'sendToBack':
          console.log('sendToBack');
          data_copy.splice(selected[i],1);
          data_copy.unshift(el);
          if (data_copy.length !== selected[i]) {
            switchSelected(0)
          }
          break;
        default:
          break;
      }

    }

    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.updateArtboard(data_copy)

  }

  //--- Below is code about handling artboard position and scale ---//

  onWheel = (e) => {
    e.preventDefault();

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
          svg = document.getElementById("svg"),
          artboardScale =  this.state.artboardScale,
          data_copy = this.state.data.slice();
    let selectedElement;

    //--  Return Scale() of Selected Elements  --//


    const x = this.state.center[0] - e.pageX,//client_right - e.pageX,
          y = this.state.center[1] - e.pageY,//client_bottom - e.pageY,
          z = Math.sqrt ( Math.pow(x, 2) + Math.pow(y, 2) );

    const initialAxis = this.state.selectedInitial;

    const init_x = this.state.center[0] - initialAxis[0],//client_right - initialAxis[0],
          init_y = this.state.center[1] - initialAxis[1],//client_bottom - initialAxis[1],
          init_z = Math.sqrt ( Math.pow(init_x, 2) + Math.pow(init_y, 2) );

    //--  Return Translate() of Selected Elements  --//

    const gap = [
      ( e.pageX - initialAxis[0] ) / artboardScale,
      ( e.pageY - initialAxis[1] ) / artboardScale
    ];


    //--  Change Transform() of Selected Element  --//

    console.log( selected  )

    for (let i = 0; i < selected.length; i++) {

      console.log(this.state.initialTransformScaling)

      const transforms = this.state.initialTransformScaling

      for (var j = 0; j < transforms.length; j++) {
        if ( selected[i] === transforms[j].number ) {

          const transform = transforms[j]

          const translate = [
            parseFloat(transform.translate[0]) + parseFloat(gap[0]),
            parseFloat(transform.translate[1]) + parseFloat(gap[1])
          ];

          const scaling = [
                            transform.scale[0] * z / init_z,
                            transform.scale[1] * z / init_z,
          ];

          selectedElement = svg.children[selected[i]]

          selectedElement.setAttribute("transform",
          `translate(`+ translate[0] +`,`+ translate[1] +`)
           scale(`+ scaling[0] +`,`+ scaling[1] +`) skewY(`+ transform.skew+`) rotate(`+transform.rotate+`)`);

          data_copy[selected[i]] = selectedElement.outerHTML


        }
      }


    }

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
          elements = document.getElementById("svg");

    let selectedElement, center;

    const selector = document.getElementById('selector'),
          sel_w = selector.getBoundingClientRect().width,
          sel_top = selector.getBoundingClientRect().top,
          sel_left = selector.getBoundingClientRect().left,
          sel_h = selector.getBoundingClientRect().height;

    center = [ sel_left +  sel_w / 2, sel_top + sel_h / 2]

    ////////////////////////////////////

    const { artboards, working } =  this.props
    const canvas = getCanvas({ artboards: artboards, working: working })


    let transforms = [];

    for (let i = 0; i < selected.length; i++) {

      const g = canvas.svg_data[parseInt(selected[i])]

      if (g) {

        const regExp = /-?\d+(\.\d+)?/g,
              translate = g.match(regExp)

        const arr = {
          number: parseInt(selected[i]),
          translate: [ parseInt(translate[0]), parseInt(translate[1]) ],
          scale: [parseFloat(translate[2]), parseFloat(translate[3])],
          skew: translate[4],
          rotate: translate[5]
        }

        transforms.push(arr)


      }

    }

    this.setState({initialTransformScaling: transforms})

    ////////////////////////////////////


    this.setState({
      isScaleMouseDown: true,
      selectedInitial: [ e.pageX , e.pageY ],
      //initialScale: [parseFloat(scale[0]), parseFloat(scale[1])],
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

    this.updateArtboard(this.state.data)

  }

  onScaleLeave = (e, position) => {

    this.setState({
      isScaleMouseDown:false,
      stateOrProps:false
    })

    this.updateArtboard(this.state.data)

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

        const { switchEditable, editable } =this.props

        switchEditable(!editable)
        console.log(editable)
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

    const { editable } = this.props

    if (editable) {

      const { selected } = this.props
      const svg = document.getElementById('svg')
      let el = svg.children[selected].cloneNode(true)

      this.setState({hasSpace: false})

      if (el.dataset.type === "text") {

        let text = el.children[0].textContent

        if (e.key === "Backspace" ) {

          text = text.slice( 0, -1 ) ;

        } else if ( e.key === "a" || e.key === "b" || e.key === "c" || e.key === "d" || e.key === "e" || e.key === "f" || e.key === "g" || e.key === "h" || e.key === "i" || e.key === "j" || e.key === "k" || e.key === "l" || e.key === "m" || e.key === "n" || e.key === "o" || e.key === "p" || e.key === "q" || e.key === "r" || e.key === "s" || e.key === "t" || e.key === "u" || e.key === "v" || e.key === "w" || e.key === "x" || e.key === "y" || e.key === "z" || e.key === "0" || e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5" || e.key === "6" || e.key === "7" || e.key === "8" || e.key === "9" || e.key === "A" || e.key === "B" || e.key === "C" || e.key === "D" || e.key === "E" || e.key === "F" || e.key === "G" || e.key === "H" || e.key === "I" || e.key === "J" || e.key === "K" || e.key === "L" || e.key === "M" || e.key === "N" || e.key === "O" || e.key === "P" || e.key === "Q" || e.key === "R" || e.key === "S" || e.key === "T" || e.key === "U" || e.key === "V" || e.key === "W" || e.key === "X" || e.key === "Y" || e.key === "Z") {
          text += e.key
        } else if (e.key === " ") {

          text += " "
          this.setState({hasSpace: true})


        } else if (e.key === "Enter") {

          var tbreak = document.createElementNS('http://www.w3.org/2000/svg', 'tbreak');

          console.log(el.children[0].cloneNode(true))

          el.children[0].appendChild(tbreak);

          text += "\n"

        }

        console.log(e.keycode,e.key)

        el.children[0].textContent = text

        const { updateArtboard, working, artboards, recordHistory } = this.props,
              canvas = getCanvas({artboards: artboards,working:working}),
              data_copy = canvas.svg_data.slice();

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

    }

    if (e.key === "Shift") {
      this.setState({ Shift: true })
    }

  }

  onKeyUp = (e) => {

    if (e.key === "Shift") {
      this.setState({ Shift: false})
    }

  }

  render() {

    const {
       colors,
       artboards,
       working, grid, selected,
       //recordHistory,
       changeColorSet,
       updateArtboard, textEditor,
       editable
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
        zIndex: "01",
      },
      style: {
        background: this.props.background,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
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
          {(()=>{
            const { selected } = this.props
            const svg = document.getElementById('svg')

            if (selected.length === 1) {
              const g = svg.children[selected[0]]
              if (g.dataset.type === "group") {
                return (
                  <li onClick={this.ungroup}>Ungroup <span>⌘G</span></li>
                )
              }
            }
            if (selected.length > 1) {
              return (
                <li onClick={this.group}>Group <span>⌘G</span></li>
              )
            }
          })()}
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
           onKeyUp={this.onKeyUp}
           >

      <svg id="dimention" style={{position: "absolute",zIndex: "10000", height: "50px", top: textEditor ? "50px": "0px", right: "20px", display: (this.props.selected !== null ) ? "block": "none"}} width="45" height="100%" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M102.601,9.337c-2.181,-1.259 -5.485,-1.396 -7.373,-0.306l-72.178,41.672c-1.889,1.091 -1.652,2.998 0.529,4.257l71.119,41.061c2.181,1.259 5.485,1.396 7.373,0.306l72.178,-41.672c1.889,-1.091 1.652,-2.998 -0.529,-4.257l-71.119,-41.061Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('top')}/><path d="M96.439,107.74c-0,-2.518 -1.533,-5.448 -3.422,-6.538l-72.178,-41.672c-1.888,-1.09 -3.422,0.069 -3.422,2.587l0,82.121c0,2.518 1.534,5.448 3.422,6.538l72.178,41.672c1.889,1.091 3.422,-0.068 3.422,-2.586l-0,-82.122Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('left')}/><path d="M180.412,61.673c0,-2.518 -1.533,-3.678 -3.421,-2.587l-72.178,41.672c-1.889,1.09 -3.422,4.02 -3.422,6.538l-0,82.121c-0,2.518 1.533,3.677 3.422,2.587l72.178,-41.672c1.888,-1.09 3.421,-4.02 3.421,-6.538l0,-82.121Z" style={{fill:"#fff",border:"solid 1px gray"}} onClick={()=>this.dimensions('right')}/></svg>
      {selector}
      <div id="color-set">
           {colorsDiv}
           <p id="textCursor" style={{position: "absolute", left: "50px", top: "50px",fontSize: "20px",color: "deepskyblue", display: editable ? "block": "none"}}>
           </p>
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
  editable: state.json.editable,
  addText: state.json.addText,
  font: state.json.font,
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
    switchAddText: value => dispatch(actions.switchAddText(value)),
    changeFont: value => dispatch(actions.changeFont(value)),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(Artboard)
