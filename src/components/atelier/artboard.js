import React from 'react';
import '../../styles/atelier.scss';

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
      artboardPosition: [0,0],
      artboardScale: 1,
      gestureStartScale: 0,
      startCoordinate: [0,0],
      // -- below is svg data
      data : [
      '<g transform="translate(50,50) scale(1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>',
      '<g transform="translate(50,100) scale(1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"></path><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"></path><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"></path></g>',
      '<g transform="translate(50,50) scale(1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"/><clipPath id="_clip1"><path d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"/></clipPath><g clip-path="url(#_clip1)"><use xlink:href="#_Image2" x="99.571" y="59.401" width="69.632px" height="122.329px" transform="matrix(0.994742,-1.10439e-16,-6.12938e-33,0.994549,3.55271e-15,-3.55271e-15)"/></g><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"/><clipPath id="_clip3"><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z"/></clipPath><g clip-path="url(#_clip3)"><use xlink:href="#_Image4" x="27.559" y="18.394" width="141.263px" height="81.559px" transform="matrix(0.994813,0,-1.10425e-16,0.994616,1.42109e-14,0)"/></g><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"/><clipPath id="_clip5"><path d="M98.054,99.857l-70.66,-40.795l0,81.548l70.66,40.796l0,-81.549Z"/></clipPath><g clip-path="url(#_clip5)"><use xlink:href="#_Image6" x="28.526" y="59.379" width="69.665px" height="122.344px" transform="matrix(0.995207,1.1049e-16,0,0.994666,0,0)"/></g><defs><image id="_Image2" width="70px" height="123px" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAB7CAYAAADJyvb3AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAD/ElEQVR4nO2cT0iTcRjH35lFFItGRiPDRSOjkeEiy2hk4EHYQfAgePAg7CB48CB4EHbwIHgQdvAgeBA8eBh4EDwIHiwWo4xRFosRi1EWixGLRSMW4zfp0hvTfs98t/3+ve/7fE7y+r6/5+HD93k23sMcGqJpmqY5nc7HhBBHpVLRCCGOVtkNyaatre1RpVJxEEIOXbetmPb29gBNiE6L4H6UwOPxPDzuHlslprOz80GtlFRjCzFdXV33jQrRsfwo+f3+e408Z9nE9Pb23q03JdVYTkxfX9+dZoToWEbMwMBANyGkaSE6ltgxwWCwm/WZpk7M0NDQbRZjQ8OUYkZGRm7xEqJjKjFjY2M+lnukFqbZMaFQ6KbIesonZmJi4gbvsaGhrJipqanrosaGhnJiZmZmvPoLI5kotWPC4fA12T3oKJGYubm5qzLHhoZUMQsLCx2EkBbZY0ND2ihFIpEOWbWNIDwxS0tLV1QbGxrCxKysrFxW4dPGKNzFrK2tuc0kRIfrjolGo5d4ns8TLonZ2Ni4aMaUVMNUzNbW1gWzC9FhImZnZ8dlFSE6Te+YWCx2nkUjqtFwYnZ3d8+p+q2VBXWL2dvbc1ptbGgYFpNKpc7KeGEkC0M7Jp1On+HdiGrUTMz+/v5pO4wNDaqYXC53yk5jQ+O/Ucrn8ydlNKIa/xJTLBZP2HVsaLSWy2WH3ceGhlIvw1UCxQCgGAAUA4BiAFAMAIoBQDEAKAYAxQCgGAAUA4BiAFAMAIoBQDEAKAYAxQCgGAAUA4BiAFAMAIoBQDEAKAYAxQCgGAAUA4BiAFAMAIoBQDEAKAYAxQCgGAAUA4BiAFAMAIoBQDEAKAYAxQCgGAAUA4BiAFAMhYODgydK/OKQKpRKpaf63yhG07RCoRA7es32o5TP55/Rrts2MdlsNl7r/7YTk8lknhu5z1ajlE6nXxi91xaJSSaTL+t9xtJiEolEotFnLSkmHo+/avYMy+2YWCz2msU5lknM9vb2G5bnmV7M5ubmWx7nmlbM+vp6kuf5ptwx0Wj0He8apkrM6upqSlQtU4hZXl5+L7qm0mIWFxfTsmoru2MikcgHmfWVS8z8/HxGdg+appCY2dnZj7J7qEaJUQqHw59k93AUqYmZnp7+LLN+LaSImZyc/CKjbj0IFTM+Pp4VWa8ZhO2YUCj0VVQtFnBPzOjoaI53DR5wEzM8PPyN19kiYC5mcHAwz/pMGTDdMcFg8DvL82TCJDH9/f0FFueoRFNiAoHAD1aNqEZDYnp6en6ybkQ16t4xfr+/yKMR1TCcGJ/P94tnI6pxrBiv11sS0Yhq1Bwlj8fzW1QjqkFNjNvtLotuRDUOiXG5XPjD4X/5A72wUJhP1C9gAAAAAElFTkSuQmCC"/><image id="_Image4" width="142px" height="82px" xlink:href="data:image/png;base64,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"/><image id="_Image6" width="70px" height="123px" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAB7CAYAAADJyvb3AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEsUlEQVR4nO3dP2yiZRzA8R9EUdRXDw8VReXuOF8tHvY45eQ8lIGBhIGEgYSBgYSBhIGBhIGEoQNJhyYdOjTpQNKhQ5MOTTqQdOjQpENjExlqOjRpItFq1Z7VO//iizo95vXk95bS532fB/h9lvb48zy/fPO+b+Fdztbtdm29Xs+maZpNUZQeEAAAsOv/cXZ29sTp6emTooaRib3fgycnJ47j42OH1cPIpG8YptPpPGXVILIxDAMAcHR09PTh4aHTimFkcm4Y5uDg4Jn9/f1nzRxGJgOHYdrt9nNmDCKbC4cBANjb21N2d3cV3sPIZKgwzM7OzvPb29sv8BpGJpcKw2xtbV3Z3Nx08VhLFlzCMK1W60We64nENQwAwMbGxtX19fWrvNe1GvcwzNramnt1dfUls9Y3m2lhmJWVlZeXl5dfMXsf3kwPwzSbTY9Ve/FgWRgAgKWlpVcXFxdfs3LPYVkahllYWPDOz897Rew9KCFhmLm5uddnZ2ffEDkDRmgYptFovCl6hsdJEQYAYGZmxlev16+JnoORJgxTq9WuV6vVG6LnkC4MU6lUhMaRNgwAQLlc9pdKpZsi9pY6DFMsFt8qFAqqlXuORBgmn8+/ncvl3rFir5EKw2Sz2Smz9xjJMAAAmUxmKp1OB8xaf2TDMKlU6t1kMnmL97ojH4ZJJBLBeDz+Hq/1xiYME4vFpnmsM3ZhAACi0eh0JBK5fZk1xjIMEw6HQ6FQ6M4w7x3rMEwwGHz/ou+ZiDAAAIFA4ANVVcODvn5iwjB+vz/s8/nunve6iQvDeL3eDz0eTwR7fmLDMG63+16/xyc+DACAy+X6SFGU+/rHKIyO0+mMOhyOjwEoTF92u/0TCoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg6AwCAqDoDAICoOgMAgKg7A7HI6/nU7nX6IHkc2/R4yiKD2Xy6WJHEYm/zuV3G73nyIGkU3fa4zH4+l6vd6u1cPIxPDi6/P5/vD7/b9bNYxMBvqrpKrqb4FA4Fezh5HJhf5cB4PBX8waRDYX/hwTCoV+DofDj8wYRiZDf8CLRCKPotHoQ57DyOTSn3xjsdhPPAaRDZevBPF4/MdEInHGYy1ZcP2ulEwmf0ilUg94rimKKV8i0+n0g0wmc2rG2lYx9dt1Npv93sz1zWT6bYdcLvddPp//1ux9eLPsfkyhUDgpFovfWLXfZVl+o6pUKn1dLpePrd73ooTdwatUKlLHEXprs1qtflWr1b4UOQPGJnoAvXq9fo39n5W9Xg80TWO//+en/vlBnnvsdeeta9M0zSbVzfBGo/GF6BkYqY4YvUqlckPkESNtGKZUKt2kMAYKhYI6sdcYI81m89DK/UbmiNHLZrNTdCoZSKfTAQpjIJlM3prYa4yRVqv1Oe81x+KI0YvFYtN0KhmIRCK3KYyBUCh0Z2KvMUba7fZnw7xv7I8YPVVVw3QqGfD5fHcn/lTqp9PpfHreaybyiNFzu9336FQyoCjKfX2YfwAxEsJ3re74gQAAAABJRU5ErkJggg=="/></defs></g>'
    ],
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

  handleClose = () => {
    this.setState({ displayContextMenu: false })
  }

  onWheel = (e) => {
    e.preventDefault();


    if (e.ctrlKey) {
      let scale = this.state.artboardScale;
      scale -= e.deltaY * 0.01;
      this.setState({ artboardScale: scale })
      console.log(scale);

    } else {
      let posX = this.state.artboardPosition[0];
      let posY = this.state.artboardPosition[1];

      posX -= e.deltaX * 0.5;
      posY -= e.deltaY * 0.5;

      this.setState({ artboardPosition: [ posX ,posY] })
      console.log(e.deltaX +','+e.deltaY);
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

    this.setState({artboardPosition:[e.pageX - this.state.startCoordinate[0],e.pageY - this.state.startCoordinate[1]]})
  }
  gestureEnd = (e) => {
    e.preventDefault();
  }

  render() {

    const style = {
      background: "#fff",
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: "-1",
    }

    const box = {
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
      top:`${this.state.mouse[1]}px`,
      left: `${this.state.mouse[0]}px`,
    }

    const span = {
      color: "gray",
      fontSize: "10px",
      textAlign: "right",
      marginRight: "5px"
    }

    const li = {
      display:"flex",
      alignItems: "center",
      justifyContent:"space-between",
      marginRight: "20px",
      //background: "rgba(225,225,225,0.2)",
      width: "90%",
      margin: "0 auto"
    }

    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }

    const menu = (
      <div style={box} className="onContextMenu">
        <ul>
          <li style={li} onClick={this.duplicate}>Duplicate <span style={span}>⌘V</span></li>
          <li style={li} onClick={this.delete}>Delete <span style={span}>⌘D</span></li>
          <li style={li}>Reflect <span style={span}>⌘R</span></li>
          <li style={{color:"gray", textIndent:"1.2em"}}>
            Arrange
            <ul style={{textIndent:"1.5em",color:"#fff"}}>
              <li style={li}>Bring to Front <span style={span}>⇧⌘]</span></li>
              <li style={li}>Bring Forward <span style={span}>⌘]</span></li>
              <li style={li}>Send Backward <span style={span}>⌘[</span></li>
              <li style={li}>Send to Back <span style={span}>⇧⌘[</span></li>
            </ul>
          </li>
        </ul>
      </div>
    )

    const artboard = {
      position: "absolute",
      transform: `translate(${this.state.artboardPosition[0]}px,${this.state.artboardPosition[1]}px) scale(${this.state.artboardScale})`,
    }

    const se = {
      border:"solid 2px skyblue",
      width:"100px",
      height: "100px"
    }

    return (
      <section style={artboard} className="section-artboard section-bottom" gestureStart={this.gestureStart} gestureChange={this.gestureChange} gestureEnd={this.gestureEnd} onWheel={/*(e) => onWheel(e)*/this.onWheel}>

      { this.state.displayContextMenu ?
        <div>
          <div style={cover} onClick={ this.handleClose }/>
          {menu}
        </div> : null }

        {/*<div className="blue-wrapper" style={se}><span></span></div>*/}

      <svg
          style={style}
          id="svg"
          version="1.1"
          width="500"
          height="400"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          dangerouslySetInnerHTML={{__html: this.state.data.join('') }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onContextMenu={this.onContextMenu}
      >
      </svg>
      {/*<DraggableItem
          mainColor={this.props.mainColor}
          subColor={this.props.subColor}
          accentColor={this.props.accentColor}
      />*/}
      </section>
    );
  }
}

export default Artboard;
