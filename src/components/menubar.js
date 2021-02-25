import React from 'react';
import { Link } from 'react-router-dom'
import '../styles/menubar.scss';
import icon from '../images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  //faChevronDown,
  faAdjust
} from '@fortawesome/free-solid-svg-icons'

import { useSelector, useDispatch } from 'react-redux'

const selectDarkmode = state => state.json

class MenuBar extends React.Component {

  // React Modal -- Start
  constructor () {
    super();
    this.state = {
      showModal: false
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
      }
    };*/

    return (
      <section className="section-menubar">
        <Link to="/home" aria-label="Home" title="Home"><img className="icon" src={icon} alt="Icon" /></Link>
        {/*<div>
        <button className="modal-botton" onClick={this.handleOpenModal}>
          <p>{Document[0].title} <span><FontAwesomeIcon icon={faChevronDown} /></span></p>
        </button>
        <ReactModal style={styles} isOpen={this.state.showModal} contentLabel="Change Document Information">
          <form className="form-document" action="">
          <p>Change a document name.</p>
          <input type="text" value={Document[0].title}/>
          <button onClick={this.handleCloseModal}>Cancel</button>
          <input type="submit" value="Submit"/>
          </form>
        </ReactModal>
      </div>*/}
        <Darkmode/>
      </section>
    );
  }
}


const Darkmode = () => {
  const dispatch = useDispatch()

  const mode = useSelector(selectDarkmode)

  const value = mode.darkmode

  const handleChange = e => {
    if (value) {
      dispatch({type: 'darkmode/switch', payload: false})
    } else {
      dispatch({type: 'darkmode/switch', payload: true})
    }
  }

  return (
    <div className="mode-change" onClick={handleChange}><FontAwesomeIcon icon={faAdjust} /></div>
  )
}

export default MenuBar;
