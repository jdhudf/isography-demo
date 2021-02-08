import React, { useState }  from 'react';
import { Link } from 'react-router-dom'
import '../../styles/topbar.scss';
import icon from '../../images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown,faAdjust,faHome } from '@fortawesome/free-solid-svg-icons'
import ReactModal from 'react-modal';

import {
  getCanvasScale,
  getArtboardName,
  setArtboardName
} from '../handleLocalstorage'

import { useSelector, useDispatch } from 'react-redux'

class TopBar extends React.Component {

  // React Modal -- Start
  constructor () {
    super();
    this.state = {
      showModal: false,
      showExportPanel: false,
      artboardName: getArtboardName(),
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

    setArtboardName(this.state.artboardName)
    this.setState({ showModal: false })
    e.preventDefault();
  }


  render() {

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
        background: `${this.props.background}`
      }
    };

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
          <p>FREE DEMO</p>
        </div>

        {/*<div className="mode-change"><FontAwesomeIcon icon={faAdjust} /></div>*/}
      </section>
    );

  }
}

function ArtboardSetting (props) {
  return (
    <div>
      <p>Artboard</p>
      <div>
        <ul>
          <li>Ratio setting</li>
          <li>Rename artboard</li>
          <li>Duplicate artboard</li>
          <li>Delete artboard</li>
        </ul>
      </div>
    </div>
  )
}

function ExportComponent (props) {
//const ExportComponent = (props) => {

  const [showExportPanel, changeStateExportPanel] = useState(false);
  const [artboardName, changeStateArtboardName] = useState(getArtboardName());

  const openExportPanel = () => {
    changeStateExportPanel(true)
  }

  const closeExportPanel = () => {
    changeStateExportPanel(false)
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
                viewBox={`0 0 ${getCanvasScale()[0]} ${getCanvasScale()[1]}`}
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
                <td>600px : 300px</td>
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
            <input type="text" value={artboardName}/>
            <h2>Format</h2>

            <ul>
              <li><label><input type="radio" name="format" value="png" checked />PNG</label></li>
              <li><label><input type="radio" name="format" value="jpg" />JPG</label></li>
            </ul>

            <h2>Size</h2>
            <ul>
              <li><label><input type="radio" name="size" value="x-small" checked />X-Small</label></li>
              <li><label><input type="radio" name="size" value="small" checked />Small</label></li>
              <li><label><input type="radio" name="size" value="medium" />Medium</label></li>
              <li><label><input type="radio" name="size" value="large" />Large</label></li>
              <li><label><input type="radio" name="size" value="x-large" />X-Large</label></li>
            </ul>
            <h2>Compression ratio</h2>
            <ul>
              <li><label><input type="radio" name="quality" value="low" checked />Low Quality</label></li>
              <li><label><input type="radio" name="quality" value="medium" checked />Medium Quality</label></li>
              <li><label><input type="radio" name="quality" value="high" />High Quality</label></li>
            </ul>
            <p><span>Custom Ratio</span> <input name="quality" type="range" min="0" max="200" /></p>
            <br/>
            <button className="cancel" onClick={closeExportPanel}>Cancel</button><button className="download">Download</button>
          </div>
        </div>
      </div> : null }
    </div>
  )
}

const InputArtboardName = () => {

  const [artboardName, changeStateArtboardName] = useState(getArtboardName());
  const [showModal, changeStateModal] = useState(false);

  const dispatch = useDispatch()

  const handleOpenModal = () => {
    changeStateModal(true)
  }

  const handleCloseModal = () => {
    changeStateModal(false)
  }

  const changeArtboardName = (e) => {
    changeStateArtboardName(e.target.value)
    console.log(artboardName)
  }

  const submitArtboardName = (e) => {

    setArtboardName(artboardName)
    changeStateModal(false)
    e.preventDefault();

  }

  return (
    <div>
      <button className="modal-botton" onClick={handleOpenModal}>
        <p>{artboardName}</p>
      </button>
      <ReactModal isOpen={showModal} contentLabel="Change Document Information">
        <form className="form-document" onSubmit={submitArtboardName}>
          <p>Change a document name.</p>
          <input type="text" value={artboardName} onChange={changeArtboardName}/>
          <button onClick={handleCloseModal}>Cancel</button>
          <input type="submit" value="Submit"/>
        </form>
      </ReactModal>
    </div>
  )
}

export default TopBar;
