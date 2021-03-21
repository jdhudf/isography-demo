import React, { useState }  from 'react';
import { Link,Redirect } from 'react-router-dom'
import '../../styles/topbar.scss';
//import icon from '../../images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  //faChevronDown,
  //faAdjust,
  faHome
} from '@fortawesome/free-solid-svg-icons'

import {
  getArtboardData,
  setArtboardData,
  removeArtboard,
  addNewArtboard,
  updateArtboards
} from '../handleLocalstorage'

import {
  downloadImages
} from './download'

import { useSelector, useDispatch } from 'react-redux'

const getState = state => state.json
const selectArtboard = state => state.artboards

class TopBar extends React.Component {

  // React Modal -- Start
  constructor () {
    super();
    this.state = {
      showModal: false,
      showExportPanel: false,
      artboardName: getArtboardData('artboard_name'),
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

    setArtboardData({
      type: 'artboard_name',
      value: this.state.artboardName,
    })

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

    return (
      <section className="section-menubar">
        <div>
          <Link to="/home" aria-label="Home" title="Home"><FontAwesomeIcon icon={faHome}/></Link>
        </div>
        <div>
          <ArtboardSetting />
          <ExportComponent data={this.props.data} background={this.props.background}/>
        </div>
        <div>
          <InputArtboardName/>
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

  const artboards = useSelector(selectArtboard).artboards
  const working = useSelector(getState)
  const dispatch = useDispatch()
  //
  let artboard;

  for (var i = 0; i < artboards.length; i++) {
    if (artboards[i].artboard_id == working.working) {
      artboard = artboards[i];
    }
  }

  console.log(artboards)

  const [artboardSize, changeArtboardSize] = useState(artboard.canvas.artboard_size);
  const [artboardName, changeArtboardName] = useState(artboard.artboard_name);

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
            <button onClick={()=>{

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
            <label htmlFor=""><input type="text" value={artboardName + "_copy"} onChange={(e)=>{console.log("hoo~~~")}}/></label>
            <button onClick={
              (e)=>{
                e.preventDefault()
                console.log('click')
                document.getElementsByClassName("artboardSettingsBackground")[2].classList.remove("active");
                window.setTimeout(
                  function(){
                    e.preventDefault()
                    changeStateDuplicate(false)
                  },[500]
                )
            }}>Cancel</button>
            <button onClick={()=>{
              const name = artboardName + '_copy'

              addNewArtboard({
                artboard_name: name,
                mainColor: getArtboardData('color_scheme')['mainColor'],
                subColor: getArtboardData('color_scheme')['subColor'],
                accentColor: getArtboardData('color_scheme')['accentColor'],
                background: getArtboardData('color_scheme')['background'],
                width: artboardSize[0],
                height: artboardSize[1],
                svg: getArtboardData('svg_data'),
              });

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
                document.getElementsByClassName("artboardSettingsBackground")[3].classList.remove("active");
                removeArtboard({artboards:artboards,working:working.working});
                changeStateRedirect(true);
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

  const artboards = useSelector(selectArtboard).artboards
  const working = useSelector(getState).working

  let artboard;

  for (var i=0;i<artboards.length;i++){
    if (working === artboards[i].artboard_id) {

      artboard = artboards[i]

    } else {
      //console.log(working,artboard_array[i].artboard_id)
    }
  }

  const artboard_size = artboard.canvas.artboard_size

  console.log(artboard)

  const [showExportPanel, changeStateExportPanel] = useState(false);
  const [artboardName, changeStateArtboardName] = useState(artboard.artboard_name);

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

  return (
    <div>
      <p onClick={openExportPanel}>Export</p>
      { showExportPanel ? <div className="export-pannel" >
        <div className="export-pannel-background" onClick={closeExportPanel}/>
        <div className="export-pannel-content">
          <div>
            <h2>Preview</h2>
            <svg
                id="svg"
                version="1.1"
                width="100%"
                height="auto"
                data-width={artboard_size[0]}
                data-height={artboard_size[1]}
                viewBox={`0 0 ${artboard_size[0]} ${artboard_size[1]}`}
                xmlns="http://www.w3.org/2000/svg"
                style={styles.svg}
                dangerouslySetInnerHTML={{__html: props.data.join('') }}
            >
            </svg>
            <div>
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
            </div>
          </div>
          <div>
            <h2>File Name</h2>
            <input type="text" value={artboardName} onChange={(e)=>changeStateArtboardName(e.target.value)}/>
            <h2>Format</h2>

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
            </ul>
            <br/>
            <button className="cancel" onClick={closeExportPanel}>Cancel</button>
            <button className="download" onClick={()=>downloadImages({filename:artboardName})}>Download</button>
          </div>
        </div>
      </div> : null }
    </div>
  )
}

const InputArtboardName = () => {

  const artboards = useSelector(selectArtboard).artboards
  const working = useSelector(getState)

  let artboard;

  for (var i = 0; i < artboards.length; i++) {
    if (artboards[i].artboard_id == working.working) {
      artboard = artboards[i];
    }
  }

  //const artboardSize = artboard.canvas.artboard_size;
  const artboardName = artboard.artboard_name

  const styles = {
    i: {
      fontWeight: "600",
      padding: "3px 15px",
      borderRadius: "3px",
      display: "inline-block",
      fontSize: "12px"
    }
  }

  return (
    <div>
      <p style={styles.i}>{artboardName}</p>
    </div>
  )
}

export default TopBar;
