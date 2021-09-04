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

    var str = 'user_1, user_2, user_3';

    // 正規表現に「g」フラグを追加
    var result = "font-family: " + name + ";font-weight:" + weight + ";font-style:" +style+ ";"

    //alert(result)

    if (g.dataset.type==="text") {
      g.style = result
      /*g.style = `
                font-family: ${ name };
                font-weight:${ weight };
                font-style:${ style };
                `*/

      g.dataset.name = name
      g.dataset.weight = weight
      g.dataset.style = style
    }

    //alert(g.outerHTML)
    console.log(g)

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

  updateArtboard = (data) => {

    const {
      updateArtboard,
      working,
      artboards,
      recordHistory,
      selected
    } = this.props

    const canvas = getCanvas({ artboards: artboards, working: working })

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data
    })

    updateArtboard(newData)
    recordHistory(canvas)

  }

  outline = () => {

    let font_a = document.createElement('path')
    let font_b = document.createElement('path')
    let font_c = document.createElement('path')
    let font_d = document.createElement('path')

    font_a.setAttribute('d', 'M12.382,0l11.972,28.7l-0.369,-0c-0.039,0.001 -0.078,-0.008 -0.113,-0.025c-0.039,-0.019 -0.071,-0.05 -0.096,-0.092c-0.016,-0.028 -0.028,-0.057 -0.037,-0.088l-3.997,-9.594l-15.129,-0l-3.998,9.594c-0.033,0.112 -0.104,0.178 -0.211,0.199c-0.025,0.004 -0.051,0.006 -0.076,0.006l-0.328,-0l11.972,-28.7l0.41,-0Zm-0.533,1.517l-7.072,16.974l14.801,-0l-7.073,-16.974c-0.033,-0.072 -0.065,-0.145 -0.095,-0.218c-0.028,-0.067 -0.054,-0.134 -0.079,-0.202c-0.025,-0.068 -0.05,-0.135 -0.075,-0.203c-0.026,-0.072 -0.053,-0.145 -0.079,-0.217c-0.055,0.15 -0.106,0.29 -0.154,0.42c-0.025,0.068 -0.051,0.135 -0.079,0.202c-0.03,0.073 -0.062,0.146 -0.095,0.218Z')
    font_b.setAttribute('d', 'M8.569,28.7l-8.569,0l0,-28.7l7.462,0c0.798,-0.003 1.595,0.045 2.387,0.145c1.875,0.248 3.351,0.81 4.426,1.687c0.001,0.001 0.002,0.002 0.003,0.003c1.497,1.224 2.245,2.99 2.245,5.299c0,0.846 -0.17,1.683 -0.502,2.46c-0.335,0.793 -0.793,1.504 -1.374,2.132c-0.567,0.61 -1.232,1.12 -1.968,1.509c-0.037,0.02 -0.075,0.04 -0.112,0.059c-0.807,0.418 -1.681,0.674 -2.624,0.769c0.635,0.048 1.266,0.141 1.888,0.277c0.476,0.105 0.945,0.242 1.402,0.41c0.977,0.362 1.811,0.847 2.501,1.455c0.69,0.609 1.22,1.33 1.589,2.163c0.276,0.633 0.45,1.305 0.514,1.992c0.026,0.265 0.039,0.53 0.039,0.796c0.003,0.578 -0.049,1.154 -0.156,1.722c-0.099,0.522 -0.256,1.031 -0.469,1.517c-0.405,0.927 -1.031,1.741 -1.825,2.368c-0.522,0.411 -1.096,0.751 -1.707,1.011c-0.398,0.172 -0.807,0.317 -1.224,0.434c-0.646,0.181 -1.305,0.309 -1.971,0.384c-0.649,0.074 -1.302,0.11 -1.955,0.108Zm0.041,-14.35l-8.118,0l-0,13.94l8.077,0c0.651,0.002 1.301,-0.035 1.948,-0.111c0.595,-0.069 1.184,-0.183 1.762,-0.34c0.521,-0.14 1.028,-0.328 1.515,-0.561c0.448,-0.214 0.871,-0.477 1.263,-0.782c0.759,-0.594 1.336,-1.338 1.733,-2.234c0.242,-0.555 0.409,-1.141 0.496,-1.741c0.067,-0.452 0.1,-0.908 0.098,-1.365c0.004,-0.589 -0.07,-1.175 -0.22,-1.745c-0.099,-0.37 -0.235,-0.73 -0.405,-1.074c-0.417,-0.84 -1.004,-1.557 -1.763,-2.152c-0.496,-0.384 -1.038,-0.704 -1.615,-0.951c-0.375,-0.162 -0.76,-0.299 -1.153,-0.412c-0.674,-0.192 -1.364,-0.324 -2.062,-0.394c-0.517,-0.053 -1.036,-0.079 -1.556,-0.078Zm-8.118,-13.94l-0,13.53l7.175,0c0.575,0.002 1.149,-0.031 1.719,-0.101c0.582,-0.072 1.12,-0.185 1.615,-0.337c0.19,-0.058 0.377,-0.124 0.561,-0.197c0.474,-0.186 0.932,-0.412 1.368,-0.675c0.448,-0.269 0.862,-0.589 1.235,-0.955c0.403,-0.394 0.752,-0.838 1.04,-1.323c0.163,-0.278 0.302,-0.569 0.416,-0.871c0.182,-0.477 0.312,-0.973 0.388,-1.479c0.042,-0.287 0.063,-0.577 0.063,-0.868c0.007,-0.713 -0.085,-1.425 -0.274,-2.113c-0.307,-1.117 -0.953,-2.112 -1.848,-2.848c-1.018,-0.846 -2.424,-1.387 -4.218,-1.624c-0.753,-0.096 -1.511,-0.142 -2.27,-0.139l-6.97,0Z')
    font_c.setAttribute('d', 'M23.309,25.215l0.184,0.164c-0.601,0.588 -1.249,1.126 -1.937,1.609c-0.697,0.488 -1.444,0.902 -2.227,1.235c-0.012,0.005 -0.025,0.011 -0.038,0.016c-0.82,0.349 -1.722,0.622 -2.706,0.82c-0.58,0.115 -1.168,0.195 -1.758,0.24c-0.5,0.039 -1.001,0.058 -1.502,0.057c-1.241,0.007 -2.479,-0.147 -3.681,-0.458c-0.562,-0.148 -1.112,-0.334 -1.649,-0.557c-1.626,-0.676 -3.033,-1.65 -4.223,-2.921c-1.188,-1.271 -2.114,-2.812 -2.778,-4.623c-0.415,-1.152 -0.698,-2.349 -0.842,-3.565c-0.103,-0.847 -0.154,-1.7 -0.152,-2.554c-0.005,-1.208 0.106,-2.413 0.332,-3.6c0.157,-0.812 0.378,-1.61 0.662,-2.386c0.431,-1.193 1.022,-2.322 1.755,-3.357c0.323,-0.451 0.675,-0.881 1.054,-1.286c1.21,-1.291 2.658,-2.289 4.346,-2.993c1.305,-0.537 2.685,-0.871 4.091,-0.99c0.497,-0.044 0.996,-0.066 1.495,-0.066c1.039,0 1.975,0.068 2.809,0.205c0.605,0.098 1.201,0.241 1.783,0.429c0.187,0.06 0.371,0.126 0.554,0.196c0.722,0.279 1.412,0.633 2.06,1.056c0.65,0.424 1.309,0.916 1.978,1.476l-0.061,0.103c-0.016,0.02 -0.034,0.038 -0.054,0.054c-0.026,0.021 -0.055,0.036 -0.085,0.043c-0.015,0.003 -0.03,0.005 -0.046,0.005c-0.036,-0.001 -0.073,-0.007 -0.107,-0.02c-0.064,-0.023 -0.138,-0.065 -0.222,-0.126c-0.038,-0.029 -0.076,-0.059 -0.112,-0.09c-0.049,-0.042 -0.099,-0.083 -0.15,-0.124c-0.161,-0.132 -0.357,-0.285 -0.588,-0.46c-0.235,-0.178 -0.512,-0.368 -0.832,-0.57c-0.101,-0.064 -0.203,-0.126 -0.306,-0.188c-0.42,-0.255 -0.918,-0.493 -1.494,-0.712c-0.041,-0.016 -0.083,-0.032 -0.125,-0.047c-0.323,-0.118 -0.651,-0.222 -0.983,-0.311c-0.327,-0.089 -0.674,-0.169 -1.042,-0.242c-0.052,-0.011 -0.105,-0.021 -0.158,-0.031c-0.436,-0.081 -0.877,-0.14 -1.32,-0.176c-0.471,-0.04 -0.971,-0.06 -1.499,-0.06c-1.161,-0.006 -2.32,0.125 -3.451,0.389c-0.644,0.153 -1.276,0.355 -1.889,0.605c-1.619,0.663 -3.013,1.613 -4.182,2.85c-0.934,0.997 -1.7,2.138 -2.27,3.38c-0.17,0.367 -0.326,0.741 -0.467,1.12c-0.656,1.763 -0.984,3.737 -0.984,5.924c-0.004,1.06 0.077,2.12 0.243,3.167c0.153,0.961 0.398,1.905 0.731,2.819c0.364,1.004 0.84,1.963 1.42,2.859c0.378,0.579 0.804,1.125 1.275,1.631c1.149,1.23 2.506,2.169 4.07,2.818c1.565,0.649 3.263,0.974 5.094,0.974c0.518,0.001 1.036,-0.017 1.553,-0.054c0.486,-0.035 0.946,-0.089 1.379,-0.16c0.062,-0.01 0.123,-0.021 0.184,-0.032c0.55,-0.097 1.093,-0.229 1.625,-0.395c0.3,-0.094 0.596,-0.202 0.886,-0.322c0.745,-0.307 1.453,-0.696 2.112,-1.159c0.503,-0.356 0.989,-0.736 1.455,-1.139c0.163,-0.141 0.324,-0.284 0.482,-0.429c0.014,-0.014 0.028,-0.027 0.043,-0.04c0.049,-0.041 0.089,-0.062 0.121,-0.062c0.055,0 0.103,0.02 0.144,0.061Z')
    font_d.setAttribute('d', 'M10.25,28.7l-10.25,0l0,-28.7l10.25,0c1.117,-0.005 2.232,0.109 3.325,0.34c0.705,0.151 1.396,0.36 2.066,0.624c1.587,0.616 3.019,1.575 4.193,2.808c0.897,0.953 1.637,2.043 2.191,3.229c0.198,0.419 0.377,0.846 0.535,1.281c0.649,1.777 0.974,3.8 0.974,6.068c-0,2.269 -0.325,4.292 -0.974,6.068c-0.363,1.011 -0.844,1.976 -1.431,2.876c-0.383,0.582 -0.816,1.129 -1.295,1.634c-1.169,1.23 -2.566,2.167 -4.192,2.809c-1.209,0.471 -2.479,0.77 -3.772,0.887c-0.538,0.051 -1.079,0.077 -1.62,0.076Zm0,-28.29l-9.758,0l-0,27.88l9.758,0c1.072,0.005 2.141,-0.104 3.19,-0.325c0.677,-0.145 1.341,-0.344 1.986,-0.597c1.528,-0.59 2.905,-1.515 4.029,-2.706c0.844,-0.904 1.541,-1.936 2.065,-3.057c0.204,-0.431 0.387,-0.871 0.548,-1.32c0.622,-1.728 0.933,-3.707 0.933,-5.935c0.004,-1.024 -0.069,-2.047 -0.219,-3.061c-0.144,-0.979 -0.383,-1.941 -0.714,-2.874c-0.343,-0.969 -0.796,-1.895 -1.35,-2.761c-0.371,-0.575 -0.794,-1.116 -1.263,-1.615c-1.121,-1.189 -2.464,-2.091 -4.029,-2.706c-1.189,-0.461 -2.437,-0.75 -3.707,-0.858c-0.488,-0.044 -0.979,-0.065 -1.469,-0.065Z')

    let gtag = document.createElement('g');

    gtag.setAttribute('transform', 'translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)');
    gtag.setAttribute('data-type', 'el');

    gtag.appendChild(font_a.cloneNode(true));
    gtag.appendChild(font_b.cloneNode(true));
    gtag.appendChild(font_c.cloneNode(true));
    gtag.appendChild(font_d.cloneNode(true));

    const {
      artboards,
      working,
    } = this.props,
          canvas =  getCanvas({ artboards: artboards, working: working }),
          svg_data = canvas.svg_data.slice();

    svg_data.push(gtag.outerHTML)

    this.updateArtboard(svg_data)



  }

  render () {

    const { font } = this.props

    const fontList = [
      {
        fontName: "Lato",
        fontClass: "lato",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 100, 300, 400, 700, 900]
      },
      {
        fontName: "JosefinSans",
        fontClass: "josefin_sans",
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
        fontName: 'JosefinSlab',
        fontClass: "josefin_slab",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 100, 200, 300, 400, 500, 600, 700]
      },
      {
        fontName: "EBGaramond",
        fontClass: "eb_garamond",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 400, 500, 600, 700, 800]
      },
      {
        fontName: "PlayfairDisplay",
        fontClass: "playfair_display",
        fontStyle: ["normal", "italic"],
        fontWeight: [ 400, 500, 600, 700, 800, 900]
      },
      /*{
        fontName: "Tuffy",
        fontClass: "tuffy",
        fontStyle: ["normal", "italic"],
        fontWeight: [400, 600]
      }*/
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
        <button onClick={this.outline}></button>
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
