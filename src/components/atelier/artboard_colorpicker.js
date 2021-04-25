import React, { useState }  from 'react';
import { SketchPicker } from 'react-color';

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
//import { useSelector, useDispatch } from 'react-redux'
//import { ActionCreators } from 'redux-undo';

//const getWorking = state => state.json.working
//const getArtboards = state => state.artboards.present.artboards


class GradientPicker extends React.Component {

  render() {

    return (
      <div>
        <Gradient color={this.props.color} method={this.props.method}/>
      </div>
    );

  }
}


/*function TextEditer() {

  const [ showBar, toggleBar] = useState(false)

  const artboards = useSelector(getArtboards)
  const working = useSelector(getWorking)
  const dispatch = useDispatch()

  const appendText = () => {

    const canvas = getCanvas({artboards: artboards, working: working}),
          svg_data = canvas.svg_data.slice()

    svg_data.push('<g transform="translate(20,35) scale(2.00,2.00)" data-type="el"><text x="0" y="0">Text</text></g>')
    console.log(svg_data)

    const newData = updateArtboards({artboards: artboards, working: working, type: "svg_data", value: svg_data})

    dispatch({type: 'update/artboard', payload: newData})
  }

  return (
    <p onClick={appendText}><FontAwesomeIcon icon={faFont} /></p>
  )
}*/

function Gradient(props) {

  /*const canvas = getCanvas({artboards: artboards,working:working}),
        artboard_size = canvas.artboard_size,
        color_scheme = canvas.color_scheme,
        artboard_name = getArtboardData({artboards:artboards, working: working, type: "artboard_name"});*/

  const [ modal, toggleModal] = useState(false)
  const [ picker, changePicker] = useState("solid")
  const color = props.color

  const [ solid, changeSolid] = useState("#5A7A7C")
  const [ linear, changeLinear] = useState(
    {
      deg: "90",
      color_set: [
        {
          color: "#e66465",
          percent: 0,
        },
        {
            color: "#9198e5",
            percent: 100,
        }
      ]
    }
  )
  const [ radial, changeRadial] = useState(
    {
      deg: "90",
      color_set: [
        {
          color: "#e66465",
          percent: 0,
        },
        {
            color: "#9198e5",
            percent: 100,
        }
      ]
    }
  )

  const [iLinear, switchLinear] = useState(0)
  const [iRadial, switchRadial] = useState(0)

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
      zIndex: '-1'
    },
    linearGradientHandler: {
      background: `linear-gradient(90deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`
    }
  }

  const handler = []

  for (let i = 0; i < linear.color_set.length; i++) {
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
              background: linear.color_set[i].color,
              left: `${linear.color_set[i].percent}%`
            }} />
    )
  }

  const handlerRadial = []

  for (let i = 0; i < radial.color_set.length; i++) {
    handlerRadial.push(
      <span class={(()=>{
               if ( i === iRadial) {
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
              () => switchRadial(i)
            }
            style={{
              background: radial.color_set[i].color,
              left: `${radial.color_set[i].percent}%`
            }} />
    )
  }

  const update = (e) => {
    props.method(e)
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
            <div style={ styles.cover } onClick={ () => toggleModal(false) }/>
            <select name=""
                    id="picker-selector"
                    onChange={(e)=>{
                      changePicker(e.target.value)
                      if (e.target.value === "solid") {

                        update(solid)

                      } else if(e.target.value === "linear") {

                        const i = `linear-gradient(
                          ${linear.deg}deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`

                        update(i)

                      } else if (e.target.value === "radial") {

                        const i = `radial-gradient(
                          ${radial.color_set[0].color}, ${radial.color_set[1].color})`

                        update(i)
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
              <option value="mesh"
                      selected={picker === "mesh"}>
                      Mesh</option>
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
                    <div className="degree-handler">
                      <span className="degree-circle"/>
                      <span className="degree-subtraction"
                      onClick={()=>{
                        const copy = JSON.parse(JSON.stringify(linear))
                        copy.deg = copy.deg - 1
                        changeLinear(copy)

                        const i = `linear-gradient(
                          ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                        update(i)
                      }}></span>
                      <input type="number"
                             min="0" max="360"
                             value={linear.deg}
                             onChange={(e)=>{
                               const copy = JSON.parse(JSON.stringify(linear))
                               copy.deg = e.target.value
                               changeLinear(copy)

                               const i = `linear-gradient(
                                 ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                               update(i)
                             }}/>
                      <span className="degree-addition"
                        onClick={()=>{
                        const copy = JSON.parse(JSON.stringify(linear))
                        copy.deg = copy.deg + 1
                        changeLinear(copy)

                        const i = `linear-gradient(
                          ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                        update(i)
                      }}></span>
                    </div>
                    <div class="linear-gradient-handler" style={styles.linearGradientHandler}>
                    </div>
                    <div class="handlers">
                      {handler}
                    </div>
                    <SketchPicker
                       color={linear.color_set[iLinear].color}
                       onChange={
                         (e) => {
                           const copy = JSON.parse(JSON.stringify(linear))
                           copy.color_set[iLinear].color = e.hex
                           changeLinear(copy)

                           const i = `linear-gradient(
                             ${linear.deg}deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`

                           update(i)
                         }
                       } />
                  </div>
                )
              } else if ( picker === "radial") {
                return (
                  <div>
                    <div class="linear-gradient-handler" style={styles.linearGradientHandler}>
                    </div>
                    <div class="handlers">
                      {handlerRadial}
                    </div>
                    <SketchPicker
                       color={radial.color_set[iRadial].color}
                       onChange={
                         (e) => {
                           const copy = JSON.parse(JSON.stringify(radial))
                           copy.color_set[iRadial].color = e.hex
                           changeRadial(copy)

                           const i = `radial-gradient(
                             ${radial.color_set[0].color}, ${radial.color_set[1].color})`

                           update(i)
                         }
                       } />
                  </div>
                )
              } else if (picker === "mesh") {
                return (
                  <div style={{
                          width: "200px",
                          height: "200px",
                          background: `
                          radial-gradient(ellipse at top, #e66465, transparent),
                          radial-gradient(ellipse at bottom, #4d9f0c, transparent),
                          linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
                          linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)`
                        }}>
                  </div>
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
)(GradientPicker)
