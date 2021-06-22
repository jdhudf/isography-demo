import React from 'react';
//import { SketchPicker } from 'react-color';

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
//import { useSelector, useDispatch } from 'react-redux'
//import { ActionCreators } from 'redux-undo';

//const getWorking = state => state.json.working
//const getArtboards = state => state.artboards.present.artboards

import {
  getArtboardData,
  updateArtboards,
  getCanvas
} from '../handleLocalstorage'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faItalic,
  faBold
} from '@fortawesome/free-solid-svg-icons'


class TextEditor extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      showBar: true,
      fontSize: 14,
      textAlign: "left",
    };
  }

  toggle = (e) => {
    const li = e.target.closest("li")
    const ul = li.querySelector('ul')
    console.log(ul.classList.contains("show"))

    if (ul.classList.contains("show")) {
      ul.classList.add("hide");
      ul.classList.remove("show");
    } else {

      ul.classList.remove("hide");
      ul.classList.add("show");

    }
  }

  selectFont = (e) => {

    const { selected, font, changeFont } = this.props
    const fontSelected = document.getElementsByClassName('font-family-selected')[0]
    const li = e.target.closest("li.font-family-li")


    fontSelected.classList.remove("font-family-selected");

    if ( li.dataset.font ) {

      changeFont({
        name: li.dataset.font,
        weight: font.weight,
        style: font.style
      })

    }

    if (e.target.dataset.weight && e.target.dataset.font ) {

      changeFont({
        name: e.target.dataset.font,
        weight: e.target.dataset.weight,
        style: font.style
      })

    }

    if (!li.classList.contains("font-family-selected")) {
      li.classList.add('font-family-selected')
    }

    const svg = document.getElementById('svg'),
          g = svg.children[selected].cloneNode(true);

    if (g.dataset.type==="text") {
      g.style = `
                font-family:${e.target.dataset.font};
                font-weight:${e.target.dataset.weight};
                font-style:${e.target.dataset.style};
                `
    }

    this.changeFont({
      name: e.target.dataset.font,
      weight: e.target.dataset.weight,
      style: e.target.dataset.style
    })

  }

  toggleStyle = (e) => {

    const value = e.target.value

    const { font } = this.props

    this.changeFont({
      name: font.name,
      weight: font.weight,
      style: value
    })

  }

  toggleWeight = (e) => {

    const value = e.target.value
    const { font } = this.props

    this.changeFont({
      name: font.name,
      weight: value,
      style: font.style
    })

  }

  radioTextAlign = (e) => {
    const value = e.target.value
    console.log(value)
  }

  changeFont = ({ name, weight, style }) => {

    const {
      updateArtboard,
      working,
      artboards,
      recordHistory,
      selected,
      font,
      changeFont
    } = this.props

    const canvas = getCanvas({artboards: artboards, working:working})

    const svg = document.getElementById('svg'),
          g = svg.children[selected[0]].cloneNode(true);

    if (g.dataset.type==="text") {
      g.style = `
                font-family:${ name };
                font-weight:${ weight };
                font-style:${ style };
                `
      g.dataset.name = name
      g.dataset.weight = weight
      g.dataset.style = style
    }

    changeFont({
      name: name,
      weight: weight,
      style: style
    })

    canvas.svg_data[selected[0]] = g.outerHTML

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: canvas.svg_data
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }



  render () {

    const { font } = this.props

    const fontList = [
      {
        fontName: "Tuffy",
        fontClass: "tuffy",
        fontStyle: ["normal", "italic"],
        fontWeight: [400, 600]
      },
      {
        fontName: "Lato",
        fontClass: "lato",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 100, 300, 400, 700, 900]
      },
      {
        fontName: "Josefin Sans",
        fontClass: "josefin_sans",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 100, 200, 300, 400, 500, 600, 700]
      },
      {
        fontName: "Josefin Slab",
        fontClass: "josefin_slab",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 100, 200, 300, 400, 500, 600, 700]
      },
      {
        fontName: "Quicksand",
        fontClass: "quicksand",
        fontStyle: ["normal"],
        fontWeight: [ 300, 400, 500, 600, 700]
      },
      {
        fontName: "Oswald",
        fontClass: "oswald",
        fontStyle: ["normal"],
        fontWeight: [ 200, 300, 400, 500, 600, 700]
      },
      {
        fontName: "EB Garamond",
        fontClass: "eb_garamond",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 400, 500, 600, 700, 800]
      },
      {
        fontName: "Playfair Display",
        fontClass: "playfair_display",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 400, 500, 600, 700, 800, 900]
      }
    ]

    const fontListDiv = []

    if (fontList) {
      for (let i = 0; i < fontList.length; i++) {

        if (fontList[i]!== null) {
          fontListDiv.push(
            <li
               className={ i === 0 ? "font-family-li font-family-selected":"font-family-li"}
               data-font={fontList[i].fontName}
               onClick={this.selectFont}
            >
              <span className="btn" onClick={this.toggle}>+</span>
              <div className="font-family-flex">
               <div className="font-name" data-font={fontList[i].fontName}>
                 {fontList[i].fontName}
               </div>
               <div className={`font-preview  ${fontList[i].fontClass}`}>
                 {fontList[i].fontName}
               </div>
              </div>
              <ul className="hide">
                {(()=>{
                  const weight = fontList[i].fontWeight;
                  const style = fontList[i].fontStyle;

                  const weightListDiv = []

                  for (let j = 0; j < weight.length; j++) {

                    let weight_name;

                    if ( weight[j] === 100) {
                      weight_name = "Thin"
                    } else if ( weight[j] === 200) {
                      weight_name = "Extra Light"
                    } else if ( weight[j] === 300) {
                      weight_name = "Light"
                    } else if ( weight[j] === 400) {
                      weight_name = "Regular"
                    } else if ( weight[j] === 500) {
                      weight_name = "Medium"
                    } else if ( weight[j] === 600) {
                      weight_name = "Semi Bold"
                    } else if ( weight[j] === 700) {
                      weight_name = "Bold"
                    } else if ( weight[j] === 800) {
                      weight_name = "Extra Bold"
                    } else if ( weight[j] === 900) {
                      weight_name = "Black"
                    }

                    weightListDiv.push(
                      <li>
                        <div className="font-family-flex">
                          <div
                             className="font-name"
                             data-weight={weight[j]}
                             data-font={fontList[i].fontName}>
                            {weight_name}
                          </div>
                          <div className={`font-preview ${fontList[i].fontClass}`} style={{fontWeight: weight[j]}}>
                            {fontList[i].fontName}
                          </div>
                        </div>
                      </li>
                    )

                    /*for (let k = 0; k < style.length; k++) {

                      weightListDiv.push(
                        <li>
                          <div className="font-family-flex">
                            <div
                               className="font-name"
                               data-weight={weight[j]}
                               data-style={style[k]}
                               data-font={fontList[i].fontName}>
                              {style[k]}
                            </div>
                            <div className={`font-preview ${fontList[i].fontClass} ${style[k]} ${weight[j]}`}>
                              {fontList[i].fontName}
                            </div>
                          </div>
                        </li>
                      )

                    }*/

                  }

                  return weightListDiv

                })()}
              </ul>
            </li>
          )
        }
      }
    }

    const weightList = []
    const styleList = []

    for (let i = 0; i < fontList.length; i++) {

      if ( fontList[i].fontName === font.name ) {

        const fontWeight =  fontList[i].fontWeight
        const fontStyle =  fontList[i].fontStyle

        for (let j = 0; j < fontWeight.length; j++) {

          let weightName;

          if ( fontWeight[j] === 100 ) {
            weightName = "Thin"
          } else if ( fontWeight[j] === 200 ) {
            weightName = "Extra-Light"
          } else if ( fontWeight[j] === 300 ) {
            weightName = "Light"
          } else if ( fontWeight[j] === 400 ) {
            weightName = "Regular"
          } else if ( fontWeight[j] === 500 ) {
            weightName = "Meduim"
          } else if ( fontWeight[j] === 600 ) {
            weightName = "Semi-Bold"
          } else if ( fontWeight[j] === 700 ) {
            weightName = "Bold"
          } else if ( fontWeight[j] === 800 ) {
            weightName = "Extra-Bold"
          } else if ( fontWeight[j] === 900 ) {
            weightName = "Black"
          }

          weightList.push(
            <option value={fontWeight[j]}
                    selected={parseInt(font.weight)===fontWeight[j]}>
              {weightName}
            </option>
          )
        }

        for (let j = 0; j < fontStyle.length; j++) {

          styleList.push(
            <option value={fontStyle[j]}
                    selected={font.style===fontStyle[j]}>
              {fontStyle[j]}
            </option>
          )
        }

      }

    }




    return (
      <div className="textEditor">
        <div className="font-family">
          <div className="current-font">{font.name}</div>
          <div className="font-family-list">
            <ul>
              {fontListDiv}
            </ul>
          </div>
        </div>

        <div className="font-weight">
          <FontAwesomeIcon icon={faBold} size="xs"/>
          <select onChange={this.toggleWeight}>
            {weightList}
          </select>
        </div>

        <div className="font-style">
          <FontAwesomeIcon icon={faItalic} size="xs"/>
          <select onChange={this.toggleStyle}>
            {styleList}
          </select>
        </div>
        {/*<input type="number" value="14" />
        <datalist id="defaultNumbers">
          <option value="10045678" />
          <option value="103421" />
          <option value="11111111" />
          <option value="12345678" />
          <option value="12999922" />
        </datalist>
        <ul className="textAlign" onChange={this.radioTextAlign}>
          <li><input name="textAlign" type="radio" value="left" checked/>
          <label for="textAlign"><FontAwesomeIcon icon={faAlignLeft} value="left"/></label></li>
          <li><input name="textAlign" type="radio" value="center"/>
          <label for="textAlign"><FontAwesomeIcon icon={faAlignCenter} /></label></li>
          <li><input name="textAlign" type="radio" value="right"/>
          <label for="textAlign"><FontAwesomeIcon icon={faAlignRight} /></label></li>
        </ul>
        */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  artboards: state.artboards.present.artboards,
  working: state.json.working,
  past: state.history.past,
  future: state.history.future,
  present: state.history.present,
  selected: state.json.selected,
  darkmode: state.json.darkmode,
  font: state.json.font,
})

export default connect(
  mapStateToProps,
  dispatch => ({
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    recordHistory:  value => dispatch(actions.recordHistory(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    changeFont: value => dispatch(actions.changeFont(value)),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(TextEditor)
