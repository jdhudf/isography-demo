import React, { Component } from 'react'

import Img_1 from '../../images/materials/test.inline.svg';
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
        <Img_1/>
        <Img_2/>
        <Img_3/>
        <Img_4/>
        <Img_1/>
        <Img_2/>
        <Img_3/>
        <Img_4/>
      </>
    );
  }
}
export default Myloop
