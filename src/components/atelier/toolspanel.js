import React from 'react';
//import reactCSS from 'reactcss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faSortAmountUp,
  faSortAmountDown,
  faLongArrowAltRight,
  faLongArrowAltLeft ,
  faFont,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

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
          <ColorPicker
            color={this.props.backgroundColor}
            method={(e) => this.props.changeHexOfBackground(e)}
          />
            {/*ref='CPSetting' />*/}
        </div>
        <p title="Undo"><FontAwesomeIcon icon={faLongArrowAltLeft} /></p>
        <p title="Redo"><FontAwesomeIcon icon={faLongArrowAltRight} /></p>

        <p onClick={(e) =>removeArtboard()} title="Remove Artboard"><FontAwesomeIcon icon={faTrashAlt} /></p>

      </section>
    );

  }
}


export default ToolsPanel;
