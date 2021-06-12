import React from 'react';
import Myloop from '../components/atelier/images.js';

import '../styles/allitems.scss';


class IsoItems extends React.Component {

  state = {
    displayItems: false,
    data: [],
  };


  handleClick = () => {
    this.setState({ displayItems: !this.state.displayItems })
    //this.appendSVG()
  };

  handleClose = () => {
    this.setState({ displayItems: false })
  };

  appendSVG = () => {
    const items = document.getElementsByClassName('item')

    let translateX = 0;
    let translateY = 0;

    const array = this.state.data.slice()

    for (let i = 0; i < items.length; i++) {
      const children_svg = items[i].children

      let gtag = document.createElement('g');
      gtag.setAttribute('transform', `translate(${translateX},${translateY}) scale(0.50,0.50)`);

      if (translateX === 700) {
        translateY += 100;
        translateX = 0;
      } else {
        translateX += 100;
      }

      for (let j = 0; j < children_svg.length; j++) {

        const children_els = children_svg[j].children

        for (let k = 0; k < children_els.length; k++) {
          gtag.appendChild(children_els[k].cloneNode(true));
        }

        array.push(gtag.outerHTML)

      }

    }
    this.setState({data:array})
    console.log(this.state.data)
  }

  render() {

    const styles = {
      background : {
        background: "rgba(0,0,0,0.3)",
        minWidth: "100vw",
        minHeight: "100vh",
        position: "absolute",
        top: "0",
        left: "0",
      },
    }

    return (
      <div style={{display: "inline"}}>
        <div className="allItems" style={{display: `${this.state.displayItems?"block": "none"}`}}>
          <div
            className="allItems_background"
            style={styles.background}
            onClick={this.handleClose} />
          <div
            className="allItems_contents"
            style={styles.contents} >
            {/*<svg
              id="svg_preview"
              version="1.1"
              width="100%"
              height="auto"
              viewBox={`0 0 810 456`}
              xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{__html:this.state.data}}>
            </svg>*/}
            <Myloop />
          </div>
        </div>
        <p onClick={this.handleClick}>Click!</p>
      </div>
    );
  }
}


export default IsoItems;
