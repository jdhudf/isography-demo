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
  removeArtboard,
  addNewArtboard,
  updateArtboards,
  getCanvas,
} from '../handleLocalstorage'

import {
  downloadImages
} from './download'

import { useSelector, useDispatch } from 'react-redux'

const getState = state => state.json
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

    /*const styles = {
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
        background: `${this.props.background}`
      }
    };*/

    const { artboards, working } = this.props

    const artboardName = getArtboardData({
                           artboards:artboards,
                           working:working,
                           type:"artboard_name"
                         }),
          canvas = getCanvas({artboards:artboards,working:working}),
          svg_data = canvas.svg_data,
          background = canvas.color_scheme['background']

    return (
      <section className="section-menubar">
        <div>
          <Link to="/home" aria-label="Home" title="Home"><FontAwesomeIcon icon={faHome}/></Link>
        </div>
        <div>
          <ArtboardSetting />
          <ExportComponent data={svg_data} background={background}/>
        </div>
        <div>

          <p style={{
            fontWeight: "600",
            padding: "3px 15px",
            borderRadius: "3px",
            display: "inline-block",
            fontSize: "12px"
          }}>{artboardName}</p>

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
    if (artboards[i].artboard_id == working) {
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
    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[0].classList.add("active");
      },[300]
    )
  }

  const renameSetting = (e) => {
    changeStateRename(true)

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[1].classList.add("active");
      },[300]
    )
  }

  const duplicateSetting = (e) => {
    changeStateDuplicate(true)

    window.setTimeout(
      function(){
        document.getElementsByClassName("artboardSettingsBackground")[2].classList.add("active");
      },[300]
    )
  }

  const deleteSetting = (e) => {
    changeStateDelete(true)

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
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()
              changeStateRatio(false)

              const newData = updateArtboards(
                {
                  working: working.working,
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
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()

              const newData = updateArtboards(
                {
                  working: working.working,
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
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={(e)=>{

              e.preventDefault()
              const name = artboardName + '_copy'
              const now = new Date()

              const newData = {
                artboard_id: artboards.length + 1,
                artboard_name: name,
                created_at: now,
                last_modified: now,
                canvas: {
                  artboard_size: artboard.canvas.artboard_size,
                  svg_data: artboard.canvas.svg_data,
                  color_scheme: artboard.canvas.color_scheme,
                  grid: artboard.canvas.grid,
                }
              }

              artboards.push(newData)

              dispatch({type: 'update/artboard', payload: artboards})

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

  const [radioFormat, changeStateRadioFormat] = useState("png");
  const [radioSize, changeStateRadioSize] = useState("x-small");
  const [radioCompression, changeStateRadioCompression] = useState("low");

  const openExportPanel = () => {
    changeStateExportPanel(true)
  }

  const closeExportPanel = () => {
    changeStateExportPanel(false)
  }

  const handleRadioFormat = (e) => {
    changeStateRadioFormat(e.target.value)
  }

  const handleRadioSize = (e) => {
    changeStateRadioSize(e.target.value)
  }
  const handleRadioCompression = (e) => {
    changeStateRadioCompression(e.target.value)
  }

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
      background: `${props.background}`
    }
  };

  const regaxedData = () => {

    const main = color_scheme["mainColor"],
          sub = color_scheme["subColor"],
          accent =color_scheme["accentColor"]
    ;

    let str = props.data.join('')

    let result = str.replace( 'class="main"', `fill="${main}"` );

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

    return result
  }


  return (
    <div>
      <p onClick={openExportPanel}>Export</p>
      { showExportPanel ?
        <div className="export-pannel" >
          <div className="export-pannel-background" onClick={closeExportPanel}/>
          <div className="export-pannel-content">
            <div>
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
            <div>
              <h2>File Name</h2>
              <input type="text" value={artboardName} onChange={(e)=>changeStateArtboardName(e.target.value)}/>.png
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
              </ul>

              <h2>Size</h2>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value="x-small"
                      checked={radioSize === "x-small"}
                      onChange={handleRadioSize} />X-Small
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value="small"
                      checked={radioSize === "small"}
                      onChange={handleRadioSize} />Small
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value="medium"
                      checked={radioSize === "medium"}
                      onChange={handleRadioSize} />Medium
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value="large"
                      checked={radioSize === "large"}
                      onChange={handleRadioSize} />Large
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      value="x-large"
                      checked={radioSize === "x-large"}
                      onChange={handleRadioSize} />X-Large
                  </label>
                </li>
              </ul>
              <h2>Compression ratio</h2>
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
              <button className="cancel" onClick={closeExportPanel}>Cancel</button>
              <button className="download" onClick={()=>{
                downloadImages({filename:artboardName})
                changeStateExportPanel(false)
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
