import React, { Component } from 'react'

import Img_1 from '../../images/materials/box.inline.svg';
import Img_2 from '../../images/materials/monstera.inline.svg';
import Img_3 from '../../images/materials/standing_man.inline.svg';
import Img_4 from '../../images/materials/standing_woman.inline.svg';

class Myloop extends Component {

  render() {

    const styles = {
      i: {
        border: "solid 1px #E7E7E7",
        flexBasis: "47%",
        marginTop: "5px",
        marginBottom: "0px",
        width: "100%",
        background: "#F0F0F0",
        display:"block"
      }
    }

    return (
      <>
        <div className="item"><Img_1/></div>
        <div className="item"><Img_2/></div>
        <div className="item"><Img_3/></div>
        <div className="item"><Img_4/></div>
        <div className="item"><Img_1/></div>
        <div className="item"><Img_2/></div>
        <div className="item"><Img_3/></div>
        <div className="item"><Img_4/></div>
        <div className="item"><Img_1/></div>
        <div className="item"><Img_2/></div>
        <div className="item"><Img_3/></div>
        <div className="item"><Img_4/></div>
        <div className="item"><Img_1/></div>
        <div className="item"><Img_2/></div>
        <div className="item"><Img_3/></div>
        <div className="item"><Img_4/></div>
        <div className="item"><Img_1/></div>
        <div className="item"><Img_2/></div>
      </>
    );
  }
}
export default Myloop
