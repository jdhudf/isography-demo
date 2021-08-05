import React from 'react';
import { Link } from 'react-router-dom'
import '../styles/menubar.scss';
//import Icon from '../images/isography_logo.inline.svg';
import logo from '../images/isography_logo.svg';
import avater from '../images/logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  //faChevronDown,
  faAdjust
} from '@fortawesome/free-solid-svg-icons'

import { /*useSelector,*/ useDispatch } from 'react-redux'

//const selectDarkmode = state => state.json

class MenuBar extends React.Component {

  // React Modal -- Start
  constructor () {
    super();
    this.state = {
      plan: "Free Demo"
    };
  }
  // React Modal -- End

  render() {

    return (
      <section className="section-menubar">
        <div className="wrapper">
          <Link to="/" aria-label="Home" title="Home">
            <img src={logo} alt="Isography"/>
          </Link>
          <div className="menubar_right">
            <p className="plan">{this.state.plan}</p>
            {/*<Darkmode/>*/}
            <img alt="avater" style={{display: "none"}} src={avater} className="avater"/>
          </div>
        </div>
      </section>
    );
  }
}


const Darkmode = () => {
  const dispatch = useDispatch()

  //const mode = useSelector(selectDarkmode)

  //const value = mode.darkmode

  const handleChange = e => {
    dispatch({type: 'darkmode/switch'})
  }

  return (
    <div className="mode-change" onClick={handleChange}><FontAwesomeIcon icon={faAdjust} /></div>
  )
}

export default MenuBar;
