import React from 'react';
//import { SketchPicker } from 'react-color';

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
//import { useSelector, useDispatch } from 'react-redux'
//import { ActionCreators } from 'redux-undo';

//const getWorking = state => state.json.working
//const getArtboards = state => state.artboards.present.artboards

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
      fontWeight: "normal",
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


    console.log(e.target.dataset.weight)

    this.setState({currentFont: li.dataset.font})

    fontSelected.classList.remove("font-family-selected");

    if (e.target.dataset.weight) {
      this.setState({fontWeight: e.target.dataset.weight})
    }

    if (e.target.dataset.font) {
      this.setState({currentFont: e.target.dataset.font})
    }

    if (!li.classList.contains("font-family-selected")) {
      li.classList.add('font-family-selected')
    }

    const svg = document.getElementById('svg'),
          g = svg.children[selected];

    if (g.dataset.type==="text") {
      g.style = `font-family:${e.target.dataset.font};font-weight:${e.target.dataset.weight};`
    }


  }

  toggleWeight = (e) => {
    const value = e.target.value
    console.log(value)
    this.setState({fontWeight: value})
  }

  radioTextAlign = (e) => {
    const value = e.target.value
    console.log(value)
  }

  render () {
    return (
      <div className="textEditor">
        <div className="font-family">
          <div className="current-font">{this.state.currentFont}</div>
          <div className="font-family-list">
            <ul>
              <li className="font-family-li font-family-selected" data-font="Tuffy" onClick={this.selectFont}>
                <span className="btn" onClick={this.toggle}>+</span>
                <div className="font-family-flex">
                 <div className="font-name" data-font="Tuffy">
                   Tuffy
                 </div>
                 <div className="font-preview tuffy">
                   Tuffy
                 </div>
                </div>
                <ul className="hide">
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
              </li>
              <li className="font-family-li" onClick={this.selectFont} data-font="Serif">
                <span className="btn" onClick={this.toggle}>+</span>
                <div className="font-family-flex">
                  <div className="font-name">
                    Serif
                  </div>
                  <div className="font-preview serif italic-bold">
                    Serif
                  </div>
                </div>
                <ul className="hide">
                  <li className={(this.state.fontWeight==="italic" && this.state.currentFont === "Serif")?"italic active":"italic"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="italic" data-font="Serif">
                        italic
                      </div>
                      <div className="font-preview serif italic-bold">
                        Serif
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="normal" && this.state.currentFont === "Serif")?"normal active":"normal"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="normal" data-font="Serif">
                        normal
                      </div>
                      <div className="font-preview serif regular">
                        Serif
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="bold" && this.state.currentFont === "Serif")?"bold active":"bold"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="bold" data-font="Serif">
                        bold
                      </div>
                      <div className="font-preview serif bold">
                        Serif
                      </div>
                    </div>
                  </li>
                  <li className={(this.state.fontWeight==="italic bold" && this.state.currentFont === "Serif")?"italic-bold active":"italic-bold"}>
                    <div className="font-family-flex">
                      <div className="font-name" data-weight="italic bold" data-font="Serif">
                        italic bold
                      </div>
                      <div className="font-preview serif italic-bold">
                        Serif
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <select className="font-weight" onChange={this.toggleWeight}>
          <option value="italic" selected={this.state.fontWeight==="italic"}>
                  Italic</option>
          <option value="normal" selected={this.state.fontWeight==="normal"}>
                  Normal</option>
          <option value="bold" selected={this.state.fontWeight==="bold"}>
                  Bold</option>
          <option value="italic bold" selected={this.state.fontWeight==="italic bold"}>
                  Italic bold</option>
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
