import React from 'react';
import '../../styles/atelier.scss';

import { getSVGdata,artboardScale,artboardPoosition } from '../handleLocalstorage'

//import { onWheel } from './features/pinch-gesture-wheel'

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
      artboardPosition: artboardPoosition([0,0]),
      artboardScale: artboardScale(1),
      gestureStartScale: 0,
      startCoordinate: [0,0],
      // -- below is svg data
      data : getSVGdata([
      '<g transform="translate(50,50) scale(1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>',
      '<g transform="translate(50,100) scale(1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"></path><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"></path><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"></path></g>',
    ])
    };
  }

  // We need below code to make e.preventDefault(); valid on wheel events.
  componentDidMount(e) {
    const el = document.querySelector('.section-artboard');
    el.addEventListener('wheel', /*(e) => onWheel(e)*/  this.onWheel, { passive: false });
    el.addEventListener('gesturestart', this.gestureStart, { passive: false });
    el.addEventListener('gesturechange', this.gestureChange, { passive: false });
    el.addEventListener('gestureend', this.gestureEnd, { passive: false });
  }


  //--- Choose which element we should edit ---//
  selectElement = (e) => {
    var array = this.state.data;
    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      //console.log(array[3]);
      //console.log(g);

      this.setState(
        {
          selectedElement: array.indexOf(g)
        }
      );

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

  onMouseDown = (e) => {
    this.setState({isMouseDown:true})

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;
    this.selectElement(e);

    //  Set this.state of
    //  * initialTranslate
    //  * mouse clicked coordinate
    this.getTranslate(e);
    this.setState({initial:[mouseX,mouseY]});
  }

  onMouseMove = (e) => {
    if (this.state.isMouseDown) {
      //console.log(this.state.selectedElement);

      //---  Calculate a gap  ---//
      const move = [e.pageX,e.pageY];
      const gap = [
        move[0] - parseInt(this.state.initial[0]),
        move[1] - parseInt(this.state.initial[1])
      ];

      //console.log('gap ok : ' +  gap);


      //---  Calculate a translate(x,y)  ---//
      let translate = [
        parseInt(this.state.initialTranslate[0] + gap[0]),
        parseInt(this.state.initialTranslate[1] + gap[1])
      ];

      //console.log('translate ok ' + translate);

      const g = e.target.parentNode.outerHTML;

      //console.log('same? ' + g);
      //console.log('same? ' + this.state.data[this.state.selectedElement]);

      if (g === this.state.data[this.state.selectedElement] && g.startsWith('<g transform="translate')) {
        //console.log('initialTranslate('+this.state.initialTranslate[0]+','+this.state.initialTranslate[1]+')');

        //---  let a string have a proper translate(x,y)  ---//
        const regExp = /\d+/g;
        var n = 1;

        const result = g.replace(regExp,
          function(match) {
            if(n === 1) {
              n--;
              return parseInt(translate[0]);
            } else if (n === 0) {
              n--;
              return parseInt(translate[1]);
            } else {
              return match;
            };
          }
        );

        //console.log('g tag is ' + result)

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
    localStorage.setItem('data', JSON.stringify(this.state.data));
    this.props.updateState(this.state.data)
  }

  onMouseLeave = (e) => {
    if(this.state.isMouseDown) {
      this.setState({isMouseDown:false})
      //console.log('mouseLeave: ' + e.target.outerHTML)
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

  duplicate = (e) => {
    const el =  this.state.data[this.state.selectedElement];

    const data_copy = this.state.data.slice();
    data_copy.push(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  delete = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  bringToFront = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.push(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  bringForward = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.splice(this.state.selectedElement + 1 ,0,el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  sendBackward = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.splice(this.state.selectedElement - 1 ,0,el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  sendToBack = (e) => {
    const el = this.state.data[this.state.selectedElement];
    const data_copy = this.state.data.slice();
    data_copy.splice(this.state.selectedElement,1);
    data_copy.unshift(el);
    this.setState({data: data_copy});
    this.setState({ displayContextMenu: false })
  }

  handleClose = () => {
    this.setState({ displayContextMenu: false })
  }

  onWheel = (e) => {
    e.preventDefault();


    if (e.ctrlKey) {
      let scale = this.state.artboardScale;
      scale -= e.deltaY * 0.01;
      this.setState({ artboardScale: scale })

      localStorage.setItem('artboardScale', scale);
      //console.log(scale);

    } else {
      let posX = this.state.artboardPosition[0];
      let posY = this.state.artboardPosition[1];

      posX -= e.deltaX * 0.5;
      posY -= e.deltaY * 0.5;

      this.setState({ artboardPosition: [ posX ,posY] })
      localStorage.setItem('artboardPoosition', JSON.stringify([ posX ,posY]));
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
    this.setState({artboardScale: this.state.gestureStartScale * e.scale})
    localStorage.setItem('artboardScale', this.state.gestureStartScale * e.scale);

    this.setState({artboardPosition:[e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]})

    localStorage.setItem('artboardPoosition', JSON.stringify([e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]));
  }
  gestureEnd = (e) => {
    e.preventDefault();
  }

  render() {

    const styles = {
      artboard: {
        position: "absolute",
        transform: `translate(${this.state.artboardPosition[0]}px,${this.state.artboardPosition[1]}px) scale(${this.state.artboardScale})`,
      },
      style: {
        background: this.props.background,
        position: "relative",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: "-1",
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
        position: "fixed",
        top:`${this.state.mouse[1]}px`,
        left: `${this.state.mouse[0]}px`,
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
      }
    }

    const menu = (
      <div style={styles.box} className="onContextMenu">
        <ul>
          <li style={styles.li} onClick={this.duplicate}>Duplicate <span style={styles.span}>⌘V</span></li>
          <li style={styles.li} onClick={this.delete}>Delete <span style={styles.span}>⌘D</span></li>
          <li style={styles.li}>Reflect <span style={styles.span}>⌘R</span></li>
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

    return (
      <section style={styles.artboard} className="section-artboard section-bottom" gestureStart={this.gestureStart} gestureChange={this.gestureChange} gestureEnd={this.gestureEnd} onWheel={/*(e) => onWheel(e)*/this.onWheel}>

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
          width="500"
          height="400"
          xmlns="http://www.w3.org/2000/svg"
          fill={this.props.background}
          dangerouslySetInnerHTML={{__html: this.state.data.join('') }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
      >
      </svg>
      </section>
    );
  }
}

export default Artboard;
