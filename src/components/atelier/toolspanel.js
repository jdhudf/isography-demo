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
  //removeArtboard
} from '../handleLocalstorage'

import ColorPicker from "./toolspanel_ColorPicker";

function ToolsPanel (props) {
//class ToolsPanel extends React.Component {

  return (
    <section className="section-toolspanel section-bottom">
      {(()=>{
        if(props.selectEl === 0){
          return (
            <span>
              <p title="Bring Forward" onClick={props.bringForward}><FontAwesomeIcon icon={faSortAmountUp} /></p>
              <p title="Send Backward" style={{color: "lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
            </span>
          )
        } else if (props.selectEl === (props.length - 1)) {
          return (
            <span>
              <p title="Bring Forward" style={{color: "lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
              <p title="Send Backward" onClick={props.sendBackward}><FontAwesomeIcon icon={faSortAmountDown} /></p>
            </span>
          )
        } else {
          return (
            <span>
              <p title="Bring Forward" onClick={props.bringForward}><FontAwesomeIcon icon={faSortAmountUp} /></p>
              <p title="Send Backward" onClick={props.sendBackward}><FontAwesomeIcon icon={faSortAmountDown} /></p>
            </span>
          )
        }
      })()}
      <p><FontAwesomeIcon icon={faFont} /></p>
      <div className="color-scheme">
        <ColorPicker
           color={props.mainColor}
           method={(e) => props.changeHexOfMain(e)}
        />
        <ColorPicker
           color={props.subColor}
           method={(e) => props.changeHexOfSub(e)}
        />
        <ColorPicker
          color={props.accentColor}
          method={(e) => props.changeHexOfAccent(e)}
        />
          {/*ref='CPSetting' />*/}
      </div>
      <p title="Undo"><FontAwesomeIcon icon={faLongArrowAltLeft} /></p>
      <p title="Redo"><FontAwesomeIcon icon={faLongArrowAltRight} /></p>

      <p style={{margin: "0",color:"gray"}}>BG</p>
      <ColorPicker
        color={props.backgroundColor}
        method={(e) => props.changeHexOfBackground(e)}
      />

      <ToggleGrid/>



      <p onClick={(e) =>props.removeElement()} title="Remove Element"><FontAwesomeIcon icon={faTrashAlt} /></p>

    </section>
  );
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
