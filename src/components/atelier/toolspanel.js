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

import ColorPicker from "./toolspanel_ColorPicker";

import {
  updateArtboards
} from '../handleLocalstorage'

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux'
const getState = state => state.json
const getArtboards = state => state.artboards


class ToolsPanel extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      color: null,
    }
  }

  render() {

    const { artboards, working, switchDarkmode,changeHex } = this.props


    return (
      <section className="section-toolspanel section-bottom">
        {(()=>{
          if(this.props.selectEl === 0){
            return (
              <span>
                <p title="Bring Forward" onClick={this.props.bringForward}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                <p title="Send Backward" style={{color: "lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
              </span>
            )
          } else if (this.props.selectEl === (this.props.length - 1)) {
            return (
              <span>
                <p title="Bring Forward" style={{color: "lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                <p title="Send Backward" onClick={this.props.sendBackward}><FontAwesomeIcon icon={faSortAmountDown} /></p>
              </span>
            )
          } else {
            return (
              <span>
                <p title="Bring Forward" onClick={this.props.bringForward}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                <p title="Send Backward" onClick={this.props.sendBackward}><FontAwesomeIcon icon={faSortAmountDown} /></p>
              </span>
            )
          }
        })()}
        <p><FontAwesomeIcon icon={faFont} /></p>
        <div className="color-scheme">
          <ColorPicker
             color={this.props.mainColor}
             method={(e) => {
               this.props.changeHexOfMain(e)

               if (artboards !== undefined &&  working !== undefined ) {
                 changeHex({artboards: artboards.artboards, id: working, hex: e, type: "mainColor"})
               }

             }}
          />
          <ColorPicker
             color={this.props.subColor}
             method={(e) => {
               this.props.changeHexOfSub(e)

               if (artboards !== undefined &&  working !== undefined ) {
                 changeHex({artboards: artboards.artboards, id: working, hex: e, type: "subColor"})
               }

             }}
          />
          <ColorPicker
            color={this.props.accentColor}
            method={(e) => {
              this.props.changeHexOfAccent(e)
              if (artboards !== undefined &&  working !== undefined ) {
                changeHex({artboards: artboards.artboards, id: working, hex: e, type: "accentColor"})
              }
            }}
          />
            {/*ref='CPSetting' />*/}
        </div>
        <p title="Undo"><FontAwesomeIcon icon={faLongArrowAltLeft} /></p>
        <p title="Redo"><FontAwesomeIcon icon={faLongArrowAltRight} /></p>

        <p style={{margin: "0",color:"gray"}}>BG</p>
        <ColorPicker
          color={this.props.backgroundColor}
          method={(e) => {
            this.props.changeHexOfBackground(e)
            if (artboards !== undefined &&  working !== undefined ) {
              changeHex({artboards: artboards.artboards, id: working, hex: e, type: "background"})
            }
          }}
        />

        <ToggleGrid/>



        <p onClick={(e) =>this.props.removeElement()} title="Remove Element"><FontAwesomeIcon icon={faTrashAlt} /></p>

      </section>
    );

  }
}

function ToggleGrid() {

  const json = useSelector(getState)
  const toggleState = useSelector(getState).grid
  const artboards = useSelector(getArtboards).artboards

  let artboard;

  for (var i = 0; i < artboards.length; i++) {
    if (artboards[i].artboard_id == json.working) {
      artboard = artboards[i];
    }
  }

  const gridScale = artboard.canvas.grid

  //updateArtboards = ({working, type, artboards,value})

  const dispatch = useDispatch()



  const toggleGrid = () => {
    if (toggleState) {
      dispatch({type: 'grid/switch', payload: false})
      document.getElementById('toggle').classList.remove("active")
    } else {
      dispatch({type: 'grid/switch', payload: true})
      document.getElementById('toggle').classList.add("active")
    }
  }

  const updateGrid = (e) => {

    const g = updateArtboards({
      working: json.working,
      artboards: artboards,
      type: "grid",
      value: e.target.value
    })

    dispatch({type: 'update/artboard', payload: g})
  }

  return (
    <div className="grid" style={{marginBottom: "30px"}}>
      <p style={{marginBottom: "0px", color:"gray"}}>Grid</p>
      <div id="toggle" onClick={toggleGrid} className="toggle">
        <div className="button"></div>
      </div>
      <div className="grid-customizer">
        <input type="range" min="0.05" max="3" value={gridScale} step="0.01" onChange={updateGrid}/>
      </div>
    </div>
  )
}


const mapStateToProps = state => ({
  artboards: state.artboards,
  working: state.json.working,
})

export default connect(
  mapStateToProps,
  dispatch => ({ changeHex: value => dispatch(actions.changeHex(value)) })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(ToolsPanel)
