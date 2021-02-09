import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faSortAmountUp,
  faSortAmountDown,
  faLongArrowAltRight,
  faLongArrowAltLeft ,
  faFont,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import '../../styles/toolspanel.scss';

import {
  removeArtboard
} from '../handleLocalstorage'

import ColorPicker from "./toolspanel_ColorPicker";

class ToolsPanel extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      color: null,
    }
  }

  render() {
    return (
      <section className="section-toolspanel section-bottom">
      {/*<ul>
        <li><FontAwesomeIcon icon={faSortAmountUp} /></li>
        <li><FontAwesomeIcon icon={faSortAmountDown} /></li>
      </ul>*/}
        <p><FontAwesomeIcon icon={faSortAmountUp} /></p>
        <p><FontAwesomeIcon icon={faSortAmountDown} /></p>
        <p><FontAwesomeIcon icon={faFont} /></p>
        <div className="color-scheme">
          <ColorPicker
             color={this.props.mainColor}
             method={(e) => this.props.changeHexOfMain(e)}
          />
          <ColorPicker
             color={this.props.subColor}
             method={(e) => this.props.changeHexOfSub(e)}
          />
          <ColorPicker
            color={this.props.accentColor}
            method={(e) => this.props.changeHexOfAccent(e)}
          />
            {/*ref='CPSetting' />*/}
        </div>
        <p title="Undo"><FontAwesomeIcon icon={faLongArrowAltLeft} /></p>
        <p title="Redo"><FontAwesomeIcon icon={faLongArrowAltRight} /></p>

        <p style={{margin: "0",color:"gray"}}>BG</p>
        <ColorPicker
          color={this.props.backgroundColor}
          method={(e) => this.props.changeHexOfBackground(e)}
        />

        <ToggleGrid/>



        <p onClick={(e) =>removeArtboard()} title="Remove Artboard"><FontAwesomeIcon icon={faTrashAlt} /></p>

      </section>
    );

  }
}

function ToggleGrid() {

  const [toggleState, changeStateToggle] = useState(false);

  const toggleGrid = () => {
    if (toggleState) {
      changeStateToggle(false)
      document.getElementById('toggle').classList.remove("active")
    } else {
      changeStateToggle(true)
      document.getElementById('toggle').classList.add("active")
    }
  }

  return (
    <div style={{marginBottom: "30px"}}>
      <p style={{marginBottom: "0px",color:"gray"}}>Grid</p>
      <div id="toggle" onClick={toggleGrid} className="toggle">
        <div className="button"></div>
      </div>
    </div>
  )
}

export default ToolsPanel;
