import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SketchPicker } from 'react-color';

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
  getArtboardData,
  updateArtboards,
  setCanvas,
  getCanvas
} from '../handleLocalstorage'

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux'
//import { ActionCreators } from 'redux-undo';

const getWorking = state => state.json.working
const getArtboards = state => state.artboards.present.artboards
const getGrid = state => state.json.grid
const getDarkmode = state => state.json.darkmode



class ToolsPanel extends React.Component {


  handleElement = (action) => {

    const {
      working,
      updateArtboard,
      artboards,
      selected,
      switchSelected,
      recordHistory
    } = this.props

    const canvas = getCanvas({ working: working, artboards:artboards });

    let el = canvas.svg_data[selected],
        data_copy = canvas.svg_data.slice();

    switch (action){
      case 'Duplicate':
        console.log('duplicate');
        data_copy.push(el);
        break;
      case 'Delete':
        console.log('delete');
        data_copy.splice(selected,1);
        switchSelected(null)
        break;
      case 'Reflect':
        const regExp = /-?\d+/g;
        const scale = el.match(regExp)

        var n = 3;

        const result = el.replace(regExp,
          function(match) {
            if(n === 3) {
              n--;
              return scale[0];
            } else if (n === 2) {
              n--;
              return scale[1];
            } else if (n === 1) {
              n--;
              return -scale[2];
            } else if (n === 0) {
              n--;
              return scale[3];
            } else {
              return match;
            };
          }
        );

        data_copy.splice(this.state.selectedElement,1);
        data_copy.push(result);
        break;
      case 'bringToFront':
        console.log('bringToFront');
        data_copy.splice(selected,1);
        data_copy.push(el);
        break;
      case 'bringForward':
        console.log('bringForward');

        data_copy.splice(selected,1);
        data_copy.splice(selected + 1 ,0,el);

        if (data_copy.length !== selected) {
          switchSelected(selected + 1)
        }

        break;
      case 'sendBackward':
        console.log('sendBackward');
        data_copy.splice(selected,1);
        data_copy.splice(selected - 1 ,0,el);

        if (data_copy.length !== selected) {
          switchSelected(selected - 1)
        }
        break;
      case 'sendToBack':
        console.log('sendToBack');
        data_copy.splice(selected,1);
        data_copy.unshift(el);
        break;
      default:
        break;
    }

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)
    recordHistory(JSON.parse(JSON.stringify(canvas)))

  }

  removeElement = (props) => {

    const { working, updateArtboard, selected,artboards,recordHistory } = this.props

    const canvas = getCanvas({working:working,artboards:artboards}),
          data_copy = canvas.svg_data.slice();


    console.log(data_copy)

    data_copy.splice(selected,1);

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data_copy
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }

  render() {

    const { working, changeHex, undo, recordHistory,redo,updateArtboard,past,future,artboards,selected,darkmode } = this.props

    const canvas = getCanvas({artboards: artboards, working: working})
    const mainColor = canvas.color_scheme['mainColor'],
          subColor = canvas.color_scheme['subColor'],
          accentColor = canvas.color_scheme['accentColor'],
          background = canvas.color_scheme['background'],
          svg_data = canvas.svg_data;

    return (
      <section className="section-toolspanel section-bottom">
        {(()=>{
          if ( svg_data.length > 1 ) {
            if( selected === 0 ){
              return (
                <span>
                  <p title="Bring Forward" onClick={()=>this.handleElement("bringForward")}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            } else if (selected === (svg_data.length - 1)) {
              return (
                <span>
                  <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" onClick={()=>this.handleElement("sendBackward")}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            } else if ( selected === null ) {

              return (
                <span>
                  <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )

            } else {
              return (
                <span>
                  <p title="Bring Forward" onClick={()=>this.handleElement("bringForward")}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" onClick={()=>this.handleElement("sendBackward")}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            }
          } else {

            return (
              <span>
                <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
              </span>
            )

          }
        })()}
        <p><FontAwesomeIcon icon={faFont} /></p>
        <div className="color-scheme">
          <ColorPicker
             color={mainColor}
             method={(e) => {

               if (artboards !== undefined &&  working !== undefined ) {
                 changeHex({artboards: artboards, id: working, hex: e, type: "mainColor"})
               }

               recordHistory(JSON.parse(JSON.stringify(canvas)))

             }}
          />
          <ColorPicker
             color={subColor}
             method={(e) => {

               if (artboards !== undefined &&  working !== undefined ) {
                 changeHex({artboards: artboards, id: working, hex: e, type: "subColor"})
               }

               recordHistory(JSON.parse(JSON.stringify(canvas)))

             }}
          />
          <ColorPicker
            color={accentColor}
            method={(e) => {
              if (artboards !== undefined &&  working !== undefined ) {
                changeHex({artboards: artboards, id: working, hex: e, type: "accentColor"})
              }

              recordHistory(JSON.parse(JSON.stringify(canvas)))

            }}
          />
        </div>
        {(()=>{
          if (past.length === 0) {
            return (
              <p title="Undo" style={{color: darkmode ? "#444855":"lightgray" }}>
                <FontAwesomeIcon icon={faLongArrowAltLeft} />
              </p>
            )
          } else {
            return (
              <p title="Undo" onClick={()=>{
                undo(canvas)
                const newData = setCanvas({ working: working, artboards: artboards, value: past[past.length-1] })
                updateArtboard(newData)
              }}>
                <FontAwesomeIcon icon={faLongArrowAltLeft} />
              </p>
            )
          }
        })()}
        {(()=>{
          if (future.length === 0) {
            return (
              <p title="Redo" style={{color: darkmode ? "#444855":"lightgray"}}>
                <FontAwesomeIcon icon={faLongArrowAltRight} />
              </p>
            )
          } else {
            return (
              <p title="Redo" onClick={()=>{
                redo()
                const newData = setCanvas({working:working, artboards: artboards, value: future[0] })
                updateArtboard(newData)
              }}>
                <FontAwesomeIcon icon={faLongArrowAltRight} />
              </p>
            )
          }
        })()}

        <p style={{margin: "0",color:darkmode ? "#9EA3B2":"gray"}}>BG</p>
        <ColorPicker
          color={background}
          method={(e) => {
            if (artboards !== undefined &&  working !== undefined ) {
              changeHex({artboards: artboards, id: working, hex: e, type: "background"})
            }

            recordHistory(JSON.parse(JSON.stringify(canvas)))
          }}
        />
        <Gradient />

        <ToggleGrid/>

        {(()=>{
          if ( selected !== null ) {

            return (
              <p onClick={this.removeElement} title="Remove Element"><FontAwesomeIcon icon={faTrashAlt} /></p>
            )

          } else {

            return (
              <p title="Remove Element" style={{color: darkmode ? "#444855":"lightgray" }}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </p>
            )

          }
        })()}

      </section>
    );

  }
}

function ToggleGrid() {

  const working = useSelector(getWorking)
  const artboards = useSelector(getArtboards)
  const toggleState = useSelector(getGrid)
  const darkmode = useSelector(getDarkmode)

  const [gridScale, setGridScale] = useState(getArtboardData({artboards:artboards,working:working,type:"grid"}));

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

    setGridScale(e.target.value)

    const g = updateArtboards({
      working: working,
      artboards: artboards,
      type: "grid",
      value: e.target.value
    })

    dispatch({type: 'update/artboard', payload: g})
  }

  return (
    <div className="grid" style={{marginBottom: "30px"}}>
      <p style={{marginBottom: "0px", color:darkmode ? "#9EA3B2":"gray"}}>Grid</p>
      <div id="toggle" onClick={toggleGrid} className="toggle">
        <div className="button"></div>
      </div>
      <div className="grid-customizer">
        <input type="range" min="0.05" max="3" value={gridScale} step="0.01" onChange={updateGrid}/>
      </div>
    </div>
  )
}

function Gradient() {

  const artboards = useSelector(getArtboards)
  const working = useSelector(getWorking)
  const dispatch = useDispatch()

  /*const canvas = getCanvas({artboards: artboards,working:working}),
        artboard_size = canvas.artboard_size,
        color_scheme = canvas.color_scheme,
        artboard_name = getArtboardData({artboards:artboards, working: working, type: "artboard_name"});*/

  const [ modal, toggleModal] = useState(false)
  const [ picker, changePicker] = useState("linear")
  const color = getCanvas({artboards: artboards, working: working}).color_scheme["background"]
  const [ solid, changeSolid] = useState("#cccccc")
  const [ linear, changeLinear] = useState(
    [
      {
        color: "#e66465",
        percent: 0,
      },
      {
          color: "#9198e5",
          percent: 100,
      }
    ]
  )

  const [iLinear, switchLinear] = useState(0)

  const styles = {
    color: {
      width: '25px',
      height: '25px',
      borderRadius: '2px',
      background: color,
    },
    swatch: {
      padding: '3px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
      marginTop: '1px',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
      marginLeft: '60px',
      marginTop: '-160px',
      background: '#ffffff',
      borderRadius: '2px',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px;'
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
    linearGradientHandler: {
      background: `linear-gradient(90deg, ${linear[0].color}, ${linear[1].color})`
    }
  }

  const handler = []

  for (let i = 0; i < linear.length; i++) {
    handler.push(
      <span class={(()=>{
               if ( i === iLinear) {
                 return (
                   "handler active"
                 )
               } else {
                 return (
                   "handler"
                 )
               }
            })()}
            onClick={
              () => switchLinear(i)
            }
            style={{
              background: linear[i].color,
              left: `${linear[i].percent}%`
            }} />
    )
  }

  const update = (e) => {
    if (artboards !== undefined &&  working !== undefined ) {

      const newData = updateArtboards({
        working: working,
        type: "background",
        artboards: artboards,
        value: e
      })

      dispatch({type: 'hex/update', payload: newData})

    }
  }

  return (
    <div>
      <div className="color-picker">

        <div style={ styles.swatch } onClick={ () => toggleModal(true) }>
          <div style={ styles.color } />
        </div>
        {/*
          Conditional operator = condition ? true : false
          */}
        { modal ?
          <div style={ styles.popover }>
            {/*<div style={ styles.cover } onClick={ () => toggleModal(false) }/>*/}
            <select name=""
                    id="picker-selector"
                    onChange={(e)=>{
                      changePicker(e.target.value)
                      if (e.target.value === "solid") {

                        update(solid)

                      } else if(e.target.value === "linear") {

                        const i = `linear-gradient(90deg, ${linear[0].color}, ${linear[1].color})`

                        update(i)

                      } else if (e.target.value === "radial") {
                        update("#cccccc")
                      }
                    }}>
              <option value="solid"
                      selected={picker === "solid"}>
                      Solid</option>
              <option value="linear"
                      selected={picker === "linear"}>
                      Linear</option>
              <option value="radial"
                      selected={picker === "radial"}>
                      Radial</option>
            </select>
            {(() => {
              if ( picker === "solid" ) {
                return (
                  <SketchPicker
                     color={solid}
                     onChange={(e) => {
                       changeSolid(e.hex)

                       update(e.hex)

                       //recordHistory(JSON.parse(JSON.stringify(canvas)))
                     }} />
                )
              } else if ( picker === "linear") {
                return (
                  <div>
                    <div class="linear-gradient-handler" style={styles.linearGradientHandler}>
                    </div>
                    <div class="handlers">
                      {handler}
                    </div>
                    <SketchPicker
                       color={linear[iLinear].color}
                       onChange={
                         (e) => {
                           const copy = JSON.parse(JSON.stringify(linear))
                           copy[iLinear].color = e.hex
                           changeLinear(copy)

                           const i = `linear-gradient(90deg, ${linear[0].color}, ${linear[1].color})`

                           update(i)
                         }
                       } />
                  </div>
                )
              } else if ( picker === "radial") {
                return (
                  <SketchPicker color={color} onChange={ (e) => changeLinear(e.hex) } />
                )
              }
            })()}
          </div>
        : null }

      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  artboards: state.artboards.present.artboards,
  working: state.json.working,
  past: state.history.past,
  future: state.history.future,
  present: state.history.present,
  selected: state.json.selected,
  darkmode: state.json.darkmode
})

export default connect(
  mapStateToProps,
  dispatch => ({
    changeHex:    value => dispatch(actions.changeHex(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    recordHistory:  value => dispatch(actions.recordHistory(value)),
    undo:           value => dispatch(actions.undo(value)),//value => dispatch(actions.undo(value)),
    redo:           value => dispatch(actions.redo(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(ToolsPanel)
