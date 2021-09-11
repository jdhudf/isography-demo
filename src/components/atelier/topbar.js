import React, { useState }  from 'react';
import { Link,Redirect } from 'react-router-dom'
import '../../styles/topbar.scss';
//import icon from '../../images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';


import {
  //faChevronDown,
  //faAdjust,
  faHome
} from '@fortawesome/free-solid-svg-icons'

import {
  getArtboardData,
  //removeArtboard,
  addNewArtboard,
  updateArtboards,
  getCanvas,
} from '../handleLocalstorage'

import {
  downloadImages
} from './download'
/*
import {
  lato_Regular, lato_Regular_Italic,
  lato_Bold, lato_Bold_Italic,
  lato_Black, lato_Black_Italic,
  lato_Light, lato_Light_Italic,
  lato_Thin, lato_Thin_Italic,
  oswald_Regular, oswald_Bold, oswald_Semibold,
  oswald_Medium, oswald_Light, oswald_Extralight,
  quicksand_Regular, quicksand_Bold, quicksand_Semibold,
  quicksand_Medium, quicksand_Light,
  josefinSans_Regular, josefinSans_Regular_Italic,
  josefinSans_Bold, josefinSans_Bold_Italic,
  josefinSans_Semibold, josefinSans_Semibold_Italic,
  josefinSans_Medium, josefinSans_Medium_Italic,
  josefinSans_Light, josefinSans_Light_Italic,
  josefinSans_Extralight_Italic, josefinSans_Extralight,
  josefinSans_Thin_Italic, josefinSans_Thin,
  josefinSlab_Regular, josefinSlab_Regular_Italic,
  josefinSlab_Bold, josefinSlab_Bold_Italic,
  josefinSlab_Semibold, josefinSlab_Semibold_Italic,
  josefinSlab_Medium, josefinSlab_Medium_Italic,
  josefinSlab_Light, josefinSlab_Light_Italic,
  josefinSlab_Extralight_Italic, josefinSlab_Extralight,
  josefinSlab_Thin_Italic, josefinSlab_Thin,
  playfairDisplay_Regular, playfairDisplay_Regular_Italic,
  playfairDisplay_Black, playfairDisplay_Black_Italic,
  playfairDisplay_Extrabold, playfairDisplay_Extrabold_Italic,
  playfairDisplay_Bold, playfairDisplay_Bold_Italic,
  playfairDisplay_Semibold, playfairDisplay_Semibold_Italic,
  playfairDisplay_Medium, playfairDisplay_Medium_Italic,
  ebGaramond_Regular, ebGaramond_Regular_Italic,
  ebGaramond_Extrabold, ebGaramond_Extrabold_Italic,
  ebGaramond_Bold, ebGaramond_Bold_Italic,
  ebGaramond_Semibold, ebGaramond_Semibold_Italic,
  ebGaramond_Medium, ebGaramond_Medium_Italic,
} from "./fontFace.js"*/

import { useSelector, useDispatch } from 'react-redux'

const selectArtboards = state => state.artboards.present.artboards
const selectWorking = state => state.json.working

class TopBar extends React.Component {

  // React Modal -- Start
  constructor () {
    super();
    this.state = {
      showModal: false,
      showExportPanel: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }
  // React Modal -- End

  openExportPanel = () => {
    this.setState({ showExportPanel: true });
  }

  closeExportPanel = () => {
    this.setState({ showExportPanel: false });
  }

  changeArtboardName = (e) => {
    this.setState({artboardName: e.target.value});
  }

  submitArtboardName = (e) => {

    this.setState({ showModal: false })
    e.preventDefault();
  }


  render() {

    const { artboards, working } = this.props

    const canvas = getCanvas({artboards:artboards,working:working}),
          svg_data = canvas.svg_data,
          background = canvas.color_scheme['background']

    return (
      <section className="section-topbar">
        <div>
          <Link to="/" aria-label="Home" title="Home"><FontAwesomeIcon icon={faHome}/></Link>
        </div>
        <div>
          <ArtboardSetting />
          <ExportComponent data={svg_data} background={background}/>
        </div>
        <div>

          <div className="topbar__artboardName"><p>{(()=>{
            const e = getArtboardData({
                                   artboards:artboards,
                                   working:working,
                                   type:"artboard_name"
                                 })
            return e
          })()}</p></div>

        </div>
        <div>
          <p style={{fontWeight: "600",fontSize:"12px"}}>FREE DEMO</p>
        </div>

        {/*<div className="mode-change"><FontAwesomeIcon icon={faAdjust} /></div>*/}
      </section>
    );

  }
}

function ArtboardSetting (props) {

  const artboards = useSelector(selectArtboards)
  const working = useSelector(selectWorking)
  const dispatch = useDispatch()
  //
  let artboard;
  let array_num;

  for (var i = 0; i < artboards.length; i++) {
    if (artboards[i].artboard_id === parseInt(working)) {
      array_num = i;
      artboard = artboards[i];
    }
  }

  let artboard_size,artboard_name;

  if (artboard){
    artboard_size = artboard.canvas.artboard_size;
    artboard_name = artboard.artboard_name;
  } else {
    artboard_size = [800,600];
    artboard_name = "Unknown";
  }

  const [artboardSize, changeArtboardSize] = useState(artboard_size);
  const [artboardName, changeArtboardName] = useState(artboard_name);

  const [showRatioWindow, changeStateRatio] = useState(false);
  const [showRenameWindow, changeStateRename] = useState(false);
  const [showDuplicateWindow, changeStateDuplicate] = useState(false);
  const [showDeleteWindow, changeStateDelete] = useState(false);
  const [redirect, changeStateRedirect] = useState(false);


  const ratioSetting = (e) => {
    changeStateRatio(true)

    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "100";

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[0].classList.add("active");
      },[300]
    )
  }

  const renameSetting = (e) => {
    changeStateRename(true)

    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "100";

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[1].classList.add("active");
      },[300]
    )
  }

  const duplicateSetting = (e) => {
    changeStateDuplicate(true)

    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "100";

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[2].classList.add("active");
      },[300]
    )
  }

  const deleteSetting = (e) => {
    changeStateDelete(true)

    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "100";

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[3].classList.add("active");
      },[300]
    )
  }

  const styles = {
    noActive: {
      display: "none"
    },
    noActiveRename: {
      display: "none"
    },
    noActiveDuplicate: {
      display: "none"
    },
    noActiveDelete: {
      display: "none"
    }
  }

  return (
    <div>
      <p>Artboard</p>
      <div className="artboardSettingWindow">
        <ul>
          <li onClick={ratioSetting}>Ratio setting</li>
          <li onClick={renameSetting}>Rename artboard</li>
          <li onClick={duplicateSetting}>Duplicate artboard</li>
          <li onClick={deleteSetting}>Delete artboard</li>
        </ul>
      </div>

      {/* artboard ratio setting */}
      <div
         className="artboardSettingsBackground"
         style={showRatioWindow ? null:styles.noActive
         }
      >
        <div className="artboardSettings">
          <p>Change the artboard ratio</p>
          <form action="">
            <label htmlFor="">Width:<input type="number" max="3000" value={artboardSize[0]} onChange={(e)=>{
              changeArtboardSize([parseInt(e.target.value),artboardSize[1]])
            }}/>px</label>
            <label htmlFor="">Height:<input type="number" max="3000" value={artboardSize[1]} onChange={(e)=>{
              changeArtboardSize([artboardSize[0],parseInt(e.target.value)])
            }}/>px</label>
            <button onClick={
              (e)=>{
                e.preventDefault()
                document.getElementsByClassName("artboardSettingsBackground")[0].classList.remove("active");
                window.setTimeout(
                  function(){
                    e.preventDefault()
                    changeStateRatio(false)

                    const t = document.getElementsByClassName('section-toolspanel')[0];
                    t.style.zIndex = "2000";
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()
              changeStateRatio(false)

              const newData = updateArtboards(
                {
                  working: working,
                  type: "artboard_size",
                  artboards: artboards,
                  value: [artboardSize[0],artboardSize[1]]
                }
              );

              dispatch({type: 'update/artboard', payload: newData})

            }}>Change</button>
          </form>
        </div>
      </div>

      {/* artboard rename setting */}

      <div className="artboardSettingsBackground"
           style={showRenameWindow ? null:styles.noActiveRename
         }>
        <div className="artboardSettings">
          <p>Rename the artboard</p>
          <form action="">
            <label htmlFor="">
              <input id="artboardNameInput" type="text" value={artboardName} onChange={(e)=>{

                changeArtboardName(e.target.value)

              }}/>
            </label>
            <button onClick={
              (e)=>{

                e.preventDefault()
                document.getElementsByClassName("artboardSettingsBackground")[1].classList.remove("active");
                window.setTimeout(
                  function(){
                    e.preventDefault()
                    changeStateRename(false)

                    const t = document.getElementsByClassName('section-toolspanel')[0];
                    t.style.zIndex = "2000";
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()

              const newData = updateArtboards(
                {
                  working: working,
                  type: "artboard_name",
                  artboards: artboards,
                  value: artboardName
                }
              );

              dispatch({type: 'update/artboard', payload: newData})

              changeStateRename(false)

            }}>Change</button>
          </form>
        </div>
      </div>

      {/* artboard duplicate setting */}
      <div
         className="artboardSettingsBackground"
         style={showDuplicateWindow ? null:styles.noActiveDuplicate
         }
      >
        <div className="artboardSettings">
          <p>Duplicate the artboard</p>
          <form action="">
            <label htmlFor=""><input type="text" value={artboardName} onChange={(e)=>changeArtboardName(e.target.value)}/></label>
            <button onClick={
              (e)=>{
                e.preventDefault()
                document.getElementsByClassName("artboardSettingsBackground")[2].classList.remove("active");
                window.setTimeout(
                  function(){
                    e.preventDefault()
                    changeStateDuplicate(false)

                    const t = document.getElementsByClassName('section-toolspanel')[0];
                    t.style.zIndex = "2000";
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()
              const name = artboardName + '_copy'

              const newData = addNewArtboard({
                artboards: artboards,
                artboard_name: name,
                mainColor: artboard.canvas.color_scheme["mainColor"],
                subColor: artboard.canvas.color_scheme["subColor"],
                accentColor: artboard.canvas.color_scheme["accentColor"],
                background: artboard.canvas.color_scheme["background"],
                width: artboard.canvas.artboard_size[0],
                height: artboard.canvas.artboard_size[1],
                svg: artboard.canvas.svg_data
              })

              dispatch({type: 'add/artboard', payload: newData})

              changeStateDuplicate(false)

            }}>Duplicate</button>
          </form>
        </div>
      </div>

      {/* artboard delete setting */}
      <div
         className="artboardSettingsBackground"
         style={showDeleteWindow ? null:styles.noActiveDelete
         }
      >
        <div className="artboardSettings">
          <p style={{fontWeight:"600",marginBottom: "-5px"}}>Are you sure to delete this artboard?</p>
          <form action="">
            <button onClick={
              (e)=>{
                e.preventDefault()
                document.getElementsByClassName("artboardSettingsBackground")[3].classList.remove("active");
                window.setTimeout(
                  function(){
                    e.preventDefault()
                    changeStateDelete(false)

                    const t = document.getElementsByClassName('section-toolspanel')[0];
                    t.style.zIndex = "2000";
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={
              (e)=>{
                e.preventDefault()
                document.getElementsByClassName("artboardSettingsBackground")[3].classList.remove("active");

                const newData = artboards;

                newData.splice( array_num, 1 );

                changeStateDelete(true)
                changeStateRedirect(true);
                dispatch({type: 'update/artboard', payload: newData})
              }
            }>Delete</button>
            {redirect ? <Redirect to="/home"/>:null}
          </form>
        </div>
      </div>

    </div>
  )
}

function ExportComponent (props) {

  const artboards = useSelector(selectArtboards)
  const working = useSelector(selectWorking)

  const canvas = getCanvas({artboards: artboards,working:working}),
        artboard_size = canvas.artboard_size,
        color_scheme = canvas.color_scheme,
        artboard_name = getArtboardData({artboards:artboards, working: working, type: "artboard_name"});

  const [showExportPanel, changeStateExportPanel] = useState(false);
  const [artboardName, changeStateArtboardName] = useState(artboard_name);
  const [checked_terms, checkedTerms] = useState(false);

  //const [radioFormat, changeStateRadioFormat] = useState("png");
  const [radioSize, changeStateRadioSize] = useState("2");
  //const [radioCompression, changeStateRadioCompression] = useState("low");

  const openExportPanel = () => {
    changeStateExportPanel(true)

    // when panel's opened, toolspanel's zindex is too high.
    // I can't handle this only css, so I handle this JavaScript
    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "100";
  }

  const closeExportPanel = () => {
    changeStateExportPanel(false)
    const t = document.getElementsByClassName('section-toolspanel')[0];
    t.style.zIndex = "2000";
  }

  /*const handleRadioFormat = (e) => {
    changeStateRadioFormat(e.target.value)
  }*/

  const handleRadioSize = (e) => {
    changeStateRadioSize(e.target.value)
  }
  /*const handleRadioCompression = (e) => {
    changeStateRadioCompression(e.target.value)
  }*/

  const styles = {
    overlay: {
      background: 'none',
    },
    content : {
      position: 'relative',
      width: '250px',
      top                   : '11.4%',
      left                  : '48%',
      right                 : 'auto',
      bottom                : 'auto',
      transform             : 'translate(-50%, -10%)',
      borderRadius: '0',
      border: 'solid 1px #F0F0F0',
      transition: 'ease all 1s',
    },
    svg: {
      background: `${props.background}`,
      //fillRule: 'evenodd',
      //clipRule: 'evenodd',
      //strokeLinejoin: 'round',
      //strokeMiterlimit: '2'
    }
  };

  /*const font_json =  [
    {
      font_name: "Quicksand",
      font_weight: "700",
      font_style: "normal"
    },
    {
      font_name: "Oswald",
      font_weight: "700",
      font_style: "normal"
    },
    {
      font_name: "JosefinSlab",
      font_weight: "700",
      font_style: "normal"
    },
    {
      font_name: "JosefinSans",
      font_weight: "700",
      font_style: "normal"
    },
  ]

  const createFontface = ({ font_json }) => {

    let fontlist;

    for (var i = 0; i < font_json.length; i++) {

      switch (font_json[i].font_style) {

        case "normal":

          switch (font_json[i].font_name) {

            case "Lato":

              switch (font_json[i].font_weight) {
                case "100":
                  fontlist += lato_Thin
                  break;
                case "300":
                  fontlist += lato_Light
                  break;
                case "400":
                  fontlist += lato_Regular
                  break;
                case "700":
                  fontlist += lato_Bold
                  break;
                case "900":
                  fontlist += lato_Black
                  break;
                default:

              }

              break;
            case "Oswald":

              switch (font_json[i].font_weight) {
                case "200":
                  fontlist += oswald_Extralight
                  break;
                case "300":
                  fontlist += oswald_Light
                  break;
                case "400":
                  fontlist += oswald_Regular
                  break;
                case "500":
                  fontlist += oswald_Medium
                  break;
                case "600":
                  fontlist += oswald_Semibold
                  break;
                case "700":
                  fontlist += oswald_Bold
                  break;
                default:

              }
              break;
            case "Quicksand":

              switch (font_json[i].font_weight) {
                case "300":
                  fontlist += quicksand_Light
                  break;
                case "400":
                  fontlist += quicksand_Regular
                  break;
                case "500":
                  fontlist += quicksand_Medium
                  break;
                case "600":
                  fontlist += quicksand_Semibold
                  break;
                case "700":
                  fontlist += quicksand_Bold
                  break;
                default:

              }
              break;
            case "JosefinSans":

              switch (font_json[i].font_weight) {
                case "100":
                  fontlist += josefinSans_Thin
                  break;
                case "200":
                  fontlist += josefinSans_Extralight
                  break;
                case "300":
                  fontlist += josefinSans_Light
                  break;
                case "400":
                  fontlist += josefinSans_Regular
                  break;
                case "500":
                  fontlist += josefinSans_Medium
                  break;
                case "600":
                  fontlist += josefinSans_Semibold
                  break;
                case "700":
                  fontlist += josefinSans_Bold
                  break;
                default:

              }
              break;
            case "JosefinSlab":

              switch (font_json[i].font_weight) {
                case "100":
                  fontlist += josefinSlab_Thin
                  break;
                case "200":
                  fontlist += josefinSlab_Extralight
                  break;
                case "300":
                  fontlist += josefinSlab_Light
                  break;
                case "400":
                  fontlist += josefinSlab_Regular
                  break;
                case "500":
                  fontlist += josefinSlab_Medium
                  break;
                case "600":
                  fontlist += josefinSlab_Semibold
                  break;
                case "700":
                  fontlist += josefinSlab_Bold
                  break;
                default:

              }
              break;
            case "EBGaramond":

              switch (font_json[i].font_weight) {
                case "400":
                  fontlist += ebGaramond_Regular
                  break;
                case "500":
                  fontlist += ebGaramond_Medium
                  break;
                case "600":
                  fontlist += ebGaramond_Semibold
                  break;
                case "700":
                  fontlist += ebGaramond_Bold
                  break;
                case "800":
                  fontlist += ebGaramond_Extrabold
                  break;

                default:

              }
              break;
            case "PlayfairDisplay":

              switch (font_json[i].font_weight) {
                case "400":
                  fontlist += playfairDisplay_Regular
                  break;
                case "500":
                  fontlist += playfairDisplay_Medium
                  break;
                case "600":
                  fontlist += playfairDisplay_Semibold
                  break;
                case "700":
                  fontlist += playfairDisplay_Bold
                  break;
                case "800":
                  fontlist += playfairDisplay_Extrabold
                  break;
                case "900":
                  fontlist += playfairDisplay_Black
                  break;

                default:

              }
              break;

            default:

          }



          break;
        case "italic":

          break;
        default:

      }

    }

    return fontlist

  }*/

  const regaxedData = () => {

    const main = color_scheme["mainColor"],
          sub = color_scheme["subColor"],
          accent =color_scheme["accentColor"]
    ;

    /*

    ${josefinSlab_Thin}
    ${josefinSlab_Light}
    ${josefinSlab_Extralight}
    ${josefinSlab_Regular}
    ${josefinSlab_Semibold}
    ${josefinSlab_Bold}

    ${josefinSlab_Thin_Italic}
    ${josefinSlab_Light_Italic}
    ${josefinSlab_Extralight_Italic}
    ${josefinSlab_Regular_Italic}
    ${josefinSlab_Semibold_Italic}
    ${josefinSlab_Bold_Italic}

    ${quicksand_Light}
    ${quicksand_Regular}
    ${quicksand_Medium}
    ${quicksand_Semibold}
    ${quicksand_Bold}

    */

    /*const fontface = `
        <style>
          ${quicksand_Bold}
          ${createFontface({ font_json: font_json })}
        </style>
    `*/



    /*const fontface = `
        <style>
        @font-face {
          font-family: 'JosefinSlab';
          src: url(${josefinSlab_svg});
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'Oswald';
          src: url(${oswald_svg});
          font-weight: 700;
          font-style: normal;
        }
       </style>
    `*/

    //let te = `<defs>` + lato_Regular + lato_Black + lato_Bold + oswald_regular + oswald_bold + quicksand_bold + josefinSlab_Bold +`</defs>`

    let str = props.data.join('')

    //str = fontface + te + str
    //str = fontface + str

    /*let result = str.replace( 'class="main"', `fill="${main}"` );

    while(result !== str) {
      str = str.replace('class="main"', `fill="${main}"`);
      result = result.replace('class="main"', `fill="${main}"`);
    }

    result = str.replace( 'class="sub"', `fill="${sub}"` );

    while(result !== str) {
      str = str.replace('class="sub"', `fill="${sub}"`);
      result = result.replace('class="sub"', `fill="${sub}"`);
    }

    result = str.replace( 'class="accent"', `fill="${accent}"` );

    while(result !== str) {
      str = str.replace('class="accent"', `fill="${accent}"`);
      result = result.replace('class="accent"', `fill="${accent}"`);
    }

    return result*/

    return str
  }

  return (
    <div>
      <p onClick={openExportPanel}>Export</p>
      { showExportPanel ?
        <div className="export-pannel" >
          <div className="export-pannel-background" onClick={closeExportPanel}/>
          <div className="export-pannel-content">
            <div className="export-pannel-content_title">Export</div>
            <div className="export-pannel-preview">
              <h2 className="preview">Preview</h2>
              <svg
                  id="svg_preview"
                  version="1.1"
                  width="100%"
                  height="auto"
                  data-width={artboard_size[0]}
                  data-height={artboard_size[1]}
                  viewBox={`0 0 ${artboard_size[0]} ${artboard_size[1]}`}
                  xmlns="http://www.w3.org/2000/svg"
                  style={styles.svg}
                  dangerouslySetInnerHTML={{__html: regaxedData() }}
              >
              </svg>
              {/*<div>
                <table>
                <tr>
                  <th>File Name</th>
                  <td>{artboardName}</td>
                </tr>
                <tr>
                  <th>Scale</th>
                  <td>{artboard_size[0]}px : {artboard_size[1]}px</td>
                </tr>
                <tr>
                  <th>Size</th>
                  <td>It'll be ... 100KB</td>
                </tr>
                </table>
              </div>*/}
            </div>
            <div className="export-pannel-setting">
              <h2>File Name</h2>
              <input className="export-pannel-artboardname" type="text" value={artboardName} onChange={(e)=>changeStateArtboardName(e.target.value)}/>.png
              {/*<h2>Format</h2>

              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="format"
                      value="png"
                      checked={radioFormat === "png"}
                      onChange={handleRadioFormat} />PNG
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="format"
                      value="jpg"
                      checked={radioFormat === "jpg"}
                      onChange={handleRadioFormat} />JPG
                  </label>
                </li>
              </ul>*/}

              <h2>Size</h2>
              <ul>
                <li>
                  <label>
                    <input
                      className="export-pannel-size"
                      type="radio"
                      name="size"
                      value="1"
                      checked={radioSize === "1"}
                      onChange={handleRadioSize} />x1
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      className="export-pannel-size"
                      type="radio"
                      name="size"
                      value="2"
                      checked={radioSize === "2"}
                      onChange={handleRadioSize} />x2
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      className="export-pannel-size"
                      type="radio"
                      name="size"
                      value="3"
                      checked={radioSize === "3"}
                      onChange={handleRadioSize} />x3
                  </label>
                </li>
              </ul>
              {/*<h2>Compression ratio</h2>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="quality"
                      value="low"
                      checked={radioCompression === "low"}
                      onChange={handleRadioCompression} />Low Quality
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="quality"
                      value="medium"
                      checked={radioCompression === "medium"}
                      onChange={handleRadioCompression} />Medium Quality
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="quality"
                      value="high"
                      checked={radioCompression==="high"}
                      onChange={handleRadioCompression} />High Quality
                  </label>
                </li>
              </ul>*/}
              <br/>

              <label htmlFor="check_terms-of-service">
              <input
                 name="check_terms-of-service"
                 id="check_terms-of-service"
                 type="checkbox"
                 checked={checked_terms}
                 onChange={() => { checkedTerms(!checked_terms) }}
                 /> Agree with <a href="https://www.isography.app/license" target="_blank" rel="noreferrer">our Terms of Service</a>
              </label>
              <div className="attribute-attention">
                <h2>The Attribute Required</h2>
                <div className="attribute-attention-box">
                  <div className="attribute-attention-text">
                    <input id="attribute-attention-text" type="text" value='<a href="https://www.isography.app">Generated by Isography</a>' readonly />
                  </div>
                  <button onClick={(e)=>{
                    e.preventDefault()
                    var text = document.getElementById("attribute-attention-text");
                    text.select();
                    document.execCommand("copy");
                  }}>Copy</button>
                </div>
              </div>
              <button className="cancel" onClick={closeExportPanel}>Cancel</button>
              <button
                  className="download"
                  style={{
                    background: checked_terms ? "#25BCB4" : "lightgray",
                    border: checked_terms ? "solid 2px #25BCB4" : "solid 2px lightgray",
                  }}
                  onClick={()=>{

                if ( checked_terms ) {

                  downloadImages({filename:artboardName, filesize: parseInt(radioSize)})
                  changeStateExportPanel(false)

                }

              }}>Download</button>
            </div>
          </div>
        </div>
      : null }
    </div>
  )
}



const mapStateToProps = state => ({
  json: state.json,
  artboards: state.artboards.present.artboards,
  working: state.json.working,
  grid: state.grid,
  selected: state.json.selected
})

export default connect(
  mapStateToProps,
  dispatch => ({
    switchDarkmode: value => dispatch(actions.switchDarkmode(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    recordHistory: value => dispatch(actions.recordHistory(value)),
    resetHistory: value => dispatch(actions.resetHistory(value))
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(TopBar)
