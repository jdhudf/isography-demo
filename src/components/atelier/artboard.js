import React from 'react';
import '../../styles/atelier.scss';

import {
  getSVGdata,
  setSVGdata,
  getCanvasScale,
  artboardScale,
  artboardPosition
} from '../handleLocalstorage'

import { onWheel } from './features/pinch-gesture-wheel'

//====================================
//  We need below functions that
//  -[△] drag items
//  -[x] duplicate items
//  -[x] change items' color
//  -[ ] resize items
//  -[ ] reflect items
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
      // -- below is svg data
      data : getSVGdata([
      '<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move;z-index:1000000;"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>',
      '<g transform="translate(50,100) scale(-1,1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"></path><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"></path><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"></path></g>',
    ])
    };
  }

  // We need below code to make e.preventDefault(); valid on wheel events.
  componentDidMount(e) {
    const el = document.querySelector('.section-artboard');
    el.addEventListener('wheel', (e) => onWheel(e)  /*this.onWheel*/, { passive: false });
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });
    //el.addEventListener('onkeydown', this.keyPress , { passive: false });

  }


  //--- Choose which element we should edit ---//
  selectElement = (e) => {
    var array = this.state.data;
    let g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {


      this.setState({selectedElement: array.indexOf(g)});

    } else {
      this.setState({isMouseDown:false})
    }
  }

  //--- get initial translate of selected elements ---//
  getTranslate = (e) => {
    const g = e.target.parentNode.outerHTML;

    const regExp = /\d+/g;
    const translate = g.match(regExp)

    this.setState(
      {
        initialTranslate:[parseInt(translate[0]),parseInt(translate[1])]
      }
    );
  }

  selecterUpdate = () => {
    const elements = document.getElementById("svg");
    const selectedElement = elements.children[this.state.selectedElement]

    //alert(selectedElement.getBoundingClientRect().width);

    const client_w = selectedElement.getBoundingClientRect().width;
    const client_h = selectedElement.getBoundingClientRect().height;

    const client_left = selectedElement.getBoundingClientRect().left;
    const client_top = selectedElement.getBoundingClientRect().top;
    const client_right = selectedElement.getBoundingClientRect().right;
    const client_bottom = selectedElement.getBoundingClientRect().bottom;

    const selector = document.getElementById('selector');

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
  }

  onMouseDown = (e) => {
    this.setState({isMouseDown:true})

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;
    this.selectElement(e);



    //--------  scale --------//


    const el = e.target.parentNode//.outerHTML;
    const g = e.target.parentNode.outerHTML;
    //console.log("! " +  el.getBoundingClientRect().width)

    if (g.startsWith('<g transform="translate')) {

      const client_w = el.getBoundingClientRect().width;
      const client_h = el.getBoundingClientRect().height;

      const client_left = el.getBoundingClientRect().left;
      const client_top = el.getBoundingClientRect().top;
      const client_right = el.getBoundingClientRect().right;
      const client_bottom = el.getBoundingClientRect().bottom;

      const selector = document.getElementById('selector');

      const corners = document.getElementsByClassName('corner');

      //console.log(el.getBoundingClientRect());

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


      //console.log(el,client_w + 'px ' + client_h + 'px');

    }


    //  Set this.state of
    //  * initialTranslate
    //  * mouse clicked coordinate
    this.getTranslate(e);
    this.setState({initial:[mouseX,mouseY]});
    this.props.updateState(this.state.data);
  }

  onMouseMove = (e) => {

    if (this.state.isMouseDown) {

      //console.log('move!');

      //---  Calculate a gap  ---//
      const move = [e.pageX,e.pageY];
      const gap = [
        parseInt(move[0]) - parseInt(this.state.initial[0]),
        parseInt(move[1]) - parseInt(this.state.initial[1])
      ];

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

      if (g === this.state.data[this.state.selectedElement] && g.startsWith('<g transform="translate')) {
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

        const selector = document.getElementById('selector');

        const el = e.target.parentNode//.outerHTML;
        //console.log("! " +  el.getBoundingClientRect().width)

        const client_w = el.getBoundingClientRect().width;
        const client_h = el.getBoundingClientRect().height;

        const client_left = el.getBoundingClientRect().left;
        const client_top = el.getBoundingClientRect().top;

        selector.style.left = client_left + 'px';
        selector.style.top = client_top +  'px';

        // -- corner -- //


        const corners = document.getElementsByClassName('corner');

        corners[0].style.left = `${client_left - 5}px`;
        corners[0].style.top = `${client_top - 5}px`;

        corners[1].style.left = `${client_left + client_w - 5}px`;
        corners[1].style.top = `${client_top + client_h - 5}px`;

        corners[2].style.left = `${client_left + client_w - 5}px`;
        corners[2].style.top = `${client_top - 5}px`;

        corners[3].style.left = `${client_left - 5}px`;
        corners[3].style.top = `${client_top + client_h - 5}px`;


        //---  Update this.state.data  ---//

        const data_copy = this.state.data.slice();
        data_copy[this.state.selectedElement] = result;
        this.setState({data: data_copy});

      } else {
        this.setState({isMouseDown:false})
      }

    }
  }

  onMouseUp = (e) => {

    this.setState({isMouseDown:false})
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    setSVGdata(this.state.data)//localStorage.setItem('data', JSON.stringify(this.state.data));

    if(this.props.test) {

      this.addElementOfSVG(this.props.willAddElementOfSvg)

    }

    this.props.updateState(this.state.data);

  }

  onMouseLeave = (e) => {
    if(this.state.isMouseDown) {
      this.setState({isMouseDown:false})
      //console.log('mouseLeave: ' + e.target.outerHTML)
      this.props.updateState(this.state.data);
    }
  }


  onContextMenu = (e) => {
    //alert(e.target.parentNode.outerHTML);
    const g = e.target.parentNode.outerHTML;

    //console.log('same? ' + g);
    //console.log('same? ' + this.state.data[this.state.selectedElement]);


    // only when users click svg element, this event'll trigger.
    if (g.startsWith('<g transform="translate')) {

      this.setState({mouse:[e.pageX,,e.pageY]})

      this.selectElement(e);
      this.setState({displayContextMenu: true});
      e.preventDefault();
    }
  }

  addElementOfSVG = (e) => {
    const data_copy = this.state.data.slice();
    data_copy.push(e);
    this.setState({data: data_copy});
    this.props.method()


  }


  duplicate = (e) => {
    const el =  this.state.data[this.state.selectedElement];

    const data_copy = this.state.data.slice();
    data_copy.push(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)
    //ocalStorage.setItem('data', JSON.stringify(data_copy));
  }

  delete = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)//localStorage.setItem('data', JSON.stringify(data_copy));
  }

  reflect = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();


    const regExp = /-?\d+/g;
    const scale = el.match(regExp)

    //console.log(-scale[2]+','+scale[3])

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

    //console.log('result is '+  result)

    data_copy.splice(this.state.selectedElement,1);
    data_copy.push(result);

    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)//localStorage.setItem('data', JSON.stringify(data_copy));

  }

  bringToFront = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.push(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)////localStorage.setItem('data', JSON.stringify(data_copy));
  }

  bringForward = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.splice(this.state.selectedElement + 1 ,0,el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)//localStorage.setItem('data', JSON.stringify(data_copy));
  }

  sendBackward = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.splice(this.state.selectedElement - 1 ,0,el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)////localStorage.setItem('data', JSON.stringify(data_copy));
  }

  sendToBack = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.unshift(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })

    this.props.updateState(data_copy);
    setSVGdata(data_copy)//localStorage.setItem('data', JSON.stringify(data_copy));
  }


  handleClose = () => {
    this.setState({ displayContextMenu: false })
  }

  onWheel = (e) => {
    e.preventDefault();
    this.selecterUpdate();
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

      posX -= e.deltaX * 0.5;
      posY -= e.deltaY * 0.5;

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
    this.selecterUpdate();
    this.setState({artboardScale: this.state.gestureStartScale * e.scale})

    localStorage.setItem('artboardScale', this.state.gestureStartScale * e.scale);

    this.setState({artboardPosition:[e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]})

    localStorage.setItem('artboardPosition', JSON.stringify([e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]));
  }
  gestureEnd = (e) => {
    e.preventDefault();
  }

  getDistance =  (e) => {
    const elements = document.getElementById("svg");
    const selectedElement = elements.children[this.state.selectedElement]

    //alert(selectedElement.getBoundingClientRect().width);

    const client_w = selectedElement.getBoundingClientRect().width;
    const client_h = selectedElement.getBoundingClientRect().height;

    const client_left = selectedElement.getBoundingClientRect().left;
    const client_top = selectedElement.getBoundingClientRect().top;
    const client_right = selectedElement.getBoundingClientRect().right;
    const client_bottom = selectedElement.getBoundingClientRect().bottom;

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;

    const x = client_right - e.pageX
    const y = client_bottom - e.pageY

    //
    // [client_right,client_bottom]
    var z = Math.sqrt ( Math.pow(x, 2) + Math.pow(y, 2) );

    const scale = this.state.selectedScale;
    const initialAxis = this.state.selectedInitial;

    const init_x = client_right - initialAxis[0]
    const init_y = client_bottom - initialAxis[1]

    var init_z = Math.sqrt ( Math.pow(init_x, 2) + Math.pow(init_y, 2) );

    // -- code about scaling

    const scaling = this.state.selectedScale[0] * z / init_z

    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();

    //const regExp = /-?\d+/g;
    const regExp = /\(([^)]+)\)/g;
    const transform = el.match(regExp)

    if (scaling < 4){
      var i = 1;

      const result = el.replace(regExp,
        function(match) {
          if(i === 1) {
            i--;
            return transform[0];
          } else if (i === 0) {
            i--;
            return '(' + scaling +','+ scaling + ')';
          } else {
            return match;
          };
        }
      );

      data_copy[this.state.selectedElement] = result;

      this.setState({data: data_copy});
    }

    //  --- code about translating el while scaling

    const gap = [
      e.pageX - initialAxis[0],
      e.pageY - initialAxis[1]
    ];

    let translate = [
      parseInt(this.state.initialTranslate[0]) + parseInt(gap[0]),
      parseInt(this.state.initialTranslate[1]) + parseInt(gap[1])
    ];

    console.info('translate is ' +  translate)

    const g = selectedElement.outerHTML;//e.target.parentNode.outerHTML;

    console.info('g tag is... ' + selectedElement.outerHTML);

    if (g === this.state.data[this.state.selectedElement] && g.startsWith('<g transform="translate')) {

      const regExp = /-?\d+/g;
      var n = 1;

      console.info('g tag is ' + g);

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
    }


    //  --- code about selecter


    const selector = document.getElementById('selector');

    const corners = document.getElementsByClassName('corner');

    selector.style.width = x + 'px';
    selector.style.height = y +  'px';

    selector.style.left = e.pageX + 'px';
    selector.style.top = e.pageY +  'px';

    //x2+y2＝z2

    const d = e.pageX - 5;
    const o =  e.pageY - 5;

    corners[0].style.left = d + 'px';
    corners[0].style.top = o +  'px';
    corners[0].style.cursor = 'nwse-resize';

    const gg = e.pageX + client_w - 5;
    const q = e.pageY + client_h - 5;

    //corners[1].style.left = gg + 'px';
    //corners[1].style.top = q + 'px';
    corners[1].style.cursor = 'nwse-resize';

    const nn = e.pageX + client_w -5;
    const m = e.pageY - 5;

    //corners[2].style.left = nn + 'px';
    corners[2].style.top = m + 'px';
    corners[2].style.cursor = 'nesw-resize';

    const v = e.pageX - 5;
    const p = e.pageY + client_h - 5;

    corners[3].style.left = v + 'px';
    //corners[3].style.top = p + 'px';
    corners[3].style.cursor = 'nesw-resize';

  }


  onScaleDown = (e) => {

    console.log("scale down");
    this.setState({
      isMouseDown:true,
      selectedInitial: [e.pageX,e.pageY],
    })

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;
    this.setState({initial:[mouseX,mouseY]});

    const el = this.state.data[this.state.selectedElement];

    //const regExp = /-?\d+/g;
    const regExp = /\(([^)]+)\)/g;
    const scale = el.match(regExp)

    const regExp_2 = /-?\d+\.\d+/g;
    const scale_2 = scale[1].match(regExp_2)

    this.setState({selectedScale: scale_2});
    this.getTranslate(e);

  }

  onScaleMove = (e) => {

    if (this.state.isMouseDown) {
      console.log("scale move");

      this.getDistance(e);

      const move = [e.pageX,e.pageY];
      const gap = [
        parseInt(move[0]) - parseInt(this.state.initial[0]),
        parseInt(move[1]) - parseInt(this.state.initial[1])
      ];

      const el = this.state.data[this.state.selectedElement];
      const data_copy = this.state.data.slice();

      const regExp = /-?\d+/g;
      const scale = el.match(regExp)

      //console.log(-scale[2]+','+scale[3])

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
            return scale[2];
          } else if (n === 0) {
            n--;
            return scale[3];
          } else {
            return match;
          };
        }
      );


    }

  }
  onScaleUp = (e) => {
    this.setState({isMouseDown:false})
    console.log("scale up");
  }
  onScaleLeave = (e) => {
    this.setState({isMouseDown:false})
    console.log("scale leave");
  }



  /*
  keyPress = (e) => {
    alert('⌘' + e.key)
  }*/

  render() {

    const styles = {
      artboard: {
        position: "relative",
        transform: `translate(${this.state.artboardPosition[0]}px,${this.state.artboardPosition[1]}px) scale(${this.state.artboardScale})`,
      },
      style: {
        background: this.props.background,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: "-1",
      },
      selector: {
        border: "solid 1px deepskyblue",
        display: "none",
        pointerEvents: "none",
      },
      corner: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#fff",
        border: "solid 1px deepskyblue",
        position: "fixed",
        pointerEvents: "auto",
      },
      box: {
        background: "#000",
        color: "#fff",
        display: "inline-block",
        width :"190px",
        padding: "10px 0",
        lineHeight: "2",
        textAlign: "left",
        textIndent: "0.5em",
        zIndex: "1",
        position: "absolute",
        top:`${this.state.mouse[0]}px`,
        left: `${this.state.mouse[1]}px`,
        transform: `scale(${2 - this.state.artboardScale})`
      },
      span: {
        color: "gray",
        fontSize: "10px",
        textAlign: "right",
        marginRight: "5px"
      },
      li: {
        display:"flex",
        alignItems: "center",
        justifyContent:"space-between",
        marginRight: "20px",
        //background: "rgba(225,225,225,0.2)",
        width: "90%",
        margin: "0 auto"
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
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
           onKeyPress={this.keyPress}
           tabIndex='0'
           className="onContextMenu">
        <ul>
          <li style={styles.li} onClick={this.duplicate}>Duplicate <span style={styles.span}>⌘V</span></li>
          <li style={styles.li} onClick={this.delete}>Delete <span style={styles.span}>⌘D</span></li>
          <li style={styles.li} onClick={this.reflect}>Reflect <span style={styles.span}>⌘R</span></li>
          <li style={{color:"gray", textIndent:"1.2em"}}>
            Arrange
            <ul style={{textIndent:"1.5em",color:"#fff"}}>
              <li style={styles.li} onClick={this.bringToFront}>Bring to Front <span style={styles.span}>⇧⌘]</span></li>
              <li style={styles.li} onClick={this.bringForward}>Bring Forward <span style={styles.span}>⌘]</span></li>
              <li style={styles.li} onClick={this.sendBackward}>Send Backward <span style={styles.span}>⌘[</span></li>
              <li style={styles.li} onClick={this.sendToBack}>Send to Back <span style={styles.span}>⇧⌘[</span></li>
            </ul>
          </li>
        </ul>
      </div>
    )

    const se = {
      border:"solid 2px skyblue",
      width:"100px",
      height: "100px"
    }

    const selector = (
      <div style={styles.selector}
           id="selector"
           >
        <div style={styles.corner}
             className="corner"
             onMouseDown={this.onScaleDown}
             onMouseUp={this.onScaleUp}
             onMouseMove={this.onScaleMove}
             onMouseLeave={this.onScaleLeave}>
        </div>
        <div style={styles.corner} className="corner"></div>
        <div style={styles.corner} className="corner"></div>
        <div style={styles.corner} className="corner"></div>
      </div>
    )

    return (
      <div style={{position: "relative"}}>
      {selector}
      <section style={styles.artboard}
               className="section-artboard section-bottom"

               gestureStart={this.gestureStart}
               gestureChange={this.gestureChange}
               gestureEnd={this.gestureEnd}
               onWheel={
                 this.onWheel
                 /*(e) => {
                 if (e.ctrlKey) {
                   this.setState({artboardScale:onWheel(e)})
                 } else {

                   let posX = onWheel(e)[0]
                   let posY = onWheel(e)[1]

                   this.setState({
                     artboardPosition: [ onWheel(e)[0] ,onWheel(e)[1]]
                   })
                 }
               }*/}
               >

      { this.state.displayContextMenu ?
        <div>
          <div style={styles.cover} onClick={ this.handleClose }/>
          {menu}
        </div> : null }

        {/*<div className="blue-wrapper" style={se}><span></span></div>*/}

      <svg
          style={styles.style}
          id="svg"
          version="1.1"
          viewBox={`0 0 ${getCanvasScale()[0]} ${getCanvasScale()[1]}`}
          width={getCanvasScale[0]}
          height={getCanvasScale[1]}
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{__html: this.state.data.join('') }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
      >
      </svg>

      </section>


      <ul style={styles.bottompanel}>
        <li style={styles.bottompanellist}>{parseInt(this.state.artboardScale*100, 10)}%</li>
      </ul>


      </div>
    );
  }
}

export default Artboard;
