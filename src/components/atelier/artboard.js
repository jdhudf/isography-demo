import React from 'react';
import '../../styles/atelier.scss';
import '../../styles/artboard.scss';

import {
  //getSVGdata,
  setSVGdata,
  getCanvasScale,
  artboardScale,
  artboardPosition,
  setLastModified,
} from '../handleLocalstorage'

import { onWheel } from './features/pinch-gesture-wheel'

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
      data : this.props.data,
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

    setLastModified(new Date())

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

    if (this.props.data !== this.state.data) {
      this.setState({data:this.props.data})
    }

    this.setState({isMouseDown:true})

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
    this.props.updateState(this.state.data);

  }

  onMouseMove = (e) => {

    if (this.state.isMouseDown) {

      const selected = this.selectElement(e);//this.state.selectedElement


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

        const data_copy = this.state.data.slice();
        data_copy[selected] = result;
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

    this.updateSelecter();

    this.props.updateState(this.state.data);

  }

  onMouseLeave = (e) => {
    if(this.state.isMouseDown) {
      this.setState({isMouseDown:false})
      //console.log('mouseLeave: ' + e.target.outerHTML)
      this.props.updateState(this.state.data);
    }
  }

  //--- Below is functions triggered in the artboard ---//
  onContextMenu = (e) => {

    const g = e.target.parentNode.outerHTML;

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
    setSVGdata(data_copy)

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
        top:`${this.state.mouse[0]}px`,
        left: `${this.state.mouse[1]}px`,
        transform: `scale(${2 - this.state.artboardScale})`
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

    return (
      <div style={{position: "relative"}}>
      {selector}
      <section style={styles.artboard}
               className="section-artboard section-bottom"

               gestureStart={this.gestureStart}
               gestureChange={this.gestureChange}
               gestureEnd={this.gestureEnd}
               onWheel={this.onWheel}>

      { this.state.displayContextMenu ?
        <div>
          <div style={styles.cover}
               onClick={ ()=> this.setState({ displayContextMenu: false }) }/>
          {menu}
        </div> : null }

      <svg
          style={styles.style}
          id="svg"
          version="1.1"
          viewBox={`0 0 ${getCanvasScale()[0]} ${getCanvasScale()[1]}`}
          width={getCanvasScale[0]}
          height={getCanvasScale[1]}
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={
            // we should display state while updating state cuz we update props in realtime, the performance will be bad.
            //
            (()=>{
              const data = this.props.data.join('')
              if (this.state.isMouseDown) {
                return {__html: this.state.data.join('') }
              } else {

                return {__html: this.state.data.join('')}

                setTimeout(function(){
                  return {__html: data}
                }, 2000);

              }
            })()
          }
          //dangerouslySetInnerHTML={{__html: this.props.data.join('') }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
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


export default Artboard;
