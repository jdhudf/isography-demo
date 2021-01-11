import React from 'react';
//import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import TopBar from '../components/atelier/topbar.js';
import GallaryPanel from '../components/atelier/gallarypanel.js';
import ToolsPanel from '../components/atelier/toolspanel.js';
import Artboard from '../components/atelier/artboard.js';

import '../styles/atelier.scss';

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
      mainColor: "#B21313",
      subColor: "#111184",
      accentColor: "#C7B136",
      data : [
      '<g transform="translate(50,50) scale(1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>',
      '<g transform="translate(50,100) scale(1)" style="cursor:move"><path class="main" d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"></path><path d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z" class="sub"></path><path d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z" class="accent"></path></g>'
      ],
    }
  }

  render() {

    return (
      <section className="section-atelier">
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
          <TopBar data={this.state.data}/>
          <ToolsPanel
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
               changeHexOfMain={(e) => this.setState({mainColor:e})}
               changeHexOfSub={(e) => this.setState({subColor:e})}
               changeHexOfAccent={(e) => this.setState({accentColor:e})}
          />
          <div className="section-artboard">
          <Artboard
               mainColor={this.state.mainColor}
               subColor={this.state.subColor}
               accentColor={this.state.accentColor}
          />
          {/*<TransformWrapper
             defaultScale={1}
             defaultPositionX={200}
             defaultPositionY={100}
             wheel={{step:1.5}}
             >
            <TransformComponent>
            <div className="section-artboard" style={{minWidth:"65vw",width:"100%",height:"100vh"}}>
            <Artboard
                 mainColor={this.state.mainColor}
                 subColor={this.state.subColor}
                 accentColor={this.state.accentColor}
            />
            </div>

            </TransformComponent>
          </TransformWrapper>*/}
          </div>
          <GallaryPanel />
      </section>
    );

  }
}

export default Atelier;
