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
  faAlignRight
} from '@fortawesome/free-solid-svg-icons'


class TextEditor extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      showBar: true,
      fontStyle: "normal",
      fontSize: 14,
      textAlign: "left",
      currentFont: "Tuffy"
    };
  }

  appendText = () => {

    /*const { artboards, working  } = this.props

    const canvas = getCanvas({artboards: artboards, working: working}),
          svg_data = canvas.svg_data.slice()

    svg_data.push('<g transform="translate(20,35) scale(2.00,2.00)" data-type="el"><text x="0" y="0">Text</text></g>')

    const newData = updateArtboards({artboards: artboards, working: working, type: "svg_data", value: svg_data})*/

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

    const { selected } = this.props
    const fontSelected = document.getElementsByClassName('font-family-selected')[0]
    const li = e.target.closest("li.font-family-li")

    this.setState({currentFont: li.dataset.font})

    fontSelected.classList.remove("font-family-selected");

    if (e.target.dataset.weight) {
      this.setState({fontStyle: e.target.dataset.weight})
    }

    if (e.target.dataset.font) {
      this.setState({currentFont: e.target.dataset.font})
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

    const { updateArtboard, working, artboards, recordHistory } = this.props
    const canvas = getCanvas({artboards: artboards,working:working})

    console.log(canvas.svg_data[selected], g.outerHTML)

    canvas.svg_data[selected] = g.outerHTML

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: canvas.svg_data
    })

    updateArtboard(newData)
    recordHistory(canvas)


  }

  toggleStyle = (e) => {
    const value = e.target.value
    console.log(value)
    this.setState({fontStyle: value})
  }

  radioTextAlign = (e) => {
    const value = e.target.value
    console.log(value)
  }



  render () {

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

    return (
      <div className="textEditor">
        <div className="font-family">
          <div className="current-font">{this.state.currentFont}</div>
          <div className="font-family-list">
            <ul>
              {fontListDiv}
              {/*<li className="font-family-li font-family-selected" data-font="Tuffy" onClick={this.selectFont}>
                <span className="btn" onClick={this.toggle}>+</span>
                <div className="font-family-flex">
                 <div className="font-name" data-font="Tuffy">
                   Tuffy
                 </div>
                 <div className="font-preview tuffy">
                   Tuffy
                 </div>
                </div>
                <ul className="show">
                  <li className={(this.state.fontWeight==="italic" && this.state.currentFont === "Tuffy")?"italic active":"italic"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="italic" data-font="Tuffy">
                        italic
                      </div>
                      <div className="font-preview tuffy italic">
                        Tuffy
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="normal" && this.state.currentFont === "Tuffy")?"normal active":"normal"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="normal" data-font="Tuffy">
                        normal
                      </div>
                      <div className="font-preview tuffy normal">
                        Tuffy
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="bold" && this.state.currentFont === "Tuffy")?"bold active":"bold"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="bold" data-font="Tuffy">
                        bold
                      </div>
                      <div className="font-preview tuffy bold">
                        Tuffy
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="italic bold" && this.state.currentFont === "Tuffy")?"italic-bold active":"italic-bold"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="italic bold" data-font="Tuffy">
                        italic bold
                      </div>
                      <div className="font-preview tuffy italic-bold">
                        Tuffy
                      </div>
                    </div>
                  </li>
                </ul>
              </li>*/}
            </ul>
          </div>
        </div>
        <select className="font-style" onChange={this.toggleStyle}>
          <option value="normal" selected={this.state.fontStyle==="normal"}>
                  Normal</option>
          <option value="italic" selected={this.state.fontStyle==="italic"}>
                  Italic</option>
        </select>
        <input type="number" value="14" />
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
)(TextEditor)
