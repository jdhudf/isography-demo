import React from 'react';

//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../styles/atelier.scss';
import '../../styles/gallarypanel.scss';

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';

import Myloop from './images.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { /*faSearch,*/faChevronLeft,faChevronRight } from '@fortawesome/free-solid-svg-icons'

import iot from '../../images/iot.svg';
import flag from '../../images/flag.svg';
import interior from '../../images/interior.svg';
import people from '../../images/people.svg';
import nature from '../../images/nature.svg';
import logo from '../../images/logo.svg';

//====================================
//  We need below functions that
//  -[ ] convert svg to component
//====================================


class GallaryPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      willAddElementOfSvg: null,
    };
  }

  selectElementOfSVG = (e) => {

    let svg;

    //console.log(e.target.parentNode.outerHTML)

    if (e.target.parentNode.outerHTML.startsWith('<svg ')) {
      svg = e.target.parentNode//.outerHTML
    } else if (e.target.parentNode.outerHTML.startsWith('<div class="item">')) {

      svg = e.target.parentNode.childNodes[0];

    } else {
      svg = e.target.parentNode.closest("svg")//.outerHTML
    }

    if (svg) {
      const children = svg.children;

      let gtag = document.createElement('g');

      gtag.setAttribute('transform', 'translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)');
      gtag.setAttribute('data-type', 'el');

      for (let i = 0; i< children.length; i++) {
        gtag.appendChild(children[i].cloneNode(true));
      }

      if (gtag.outerHTML.startsWith('<g transform="translate')) {

        this.props.method(gtag.outerHTML)

      } else {}
    }

  }

  selectElementOfSVGMobile = (e) => {

    const touchObject = e.changedTouches[0];

    let svg;

    if (touchObject.target.parentNode.outerHTML.startsWith('<svg ')) {
      svg = touchObject.target.parentNode//.outerHTML
    } else if (touchObject.target.parentNode.outerHTML.startsWith('<div class="item">')) {

      svg = touchObject.target.parentNode.childNodes[0];

    } else {
      svg = touchObject.target.parentNode.closest("svg")//.outerHTML
    }

    if (svg) {
      const children = svg.children;

      let gtag = document.createElement('g');

      gtag.setAttribute('transform', 'translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)');
      gtag.setAttribute('data-type', 'el');

      for (let i = 0; i< children.length; i++) {
        gtag.appendChild(children[i].cloneNode(true));
      }

      if (gtag.outerHTML.startsWith('<g transform="translate')) {

        this.props.method(gtag.outerHTML)

      }
    }

  }

  filterItems = (e) => {

    const div = document.getElementsByClassName('gallaryframe_category')[0]
    const items =  div.children;

    switch (e) {
      case "all":
        for (let i = 0; i < items.length; i++) {

          items[i].style.display = "block"

        }

        break;
      case "interior":

        for (let i = 0; i < items.length; i++) {

          if (items[i].dataset.tag === "interior") {
            console.log(items[i])
            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }

        }

        break;
      case "iot":

        for (let i = 0; i < items.length; i++) {

          if (items[i].dataset.tag === "iot" || items[i].dataset.tag === "graph") {
            console.log(items[i])
            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }

        }

        break;
      case "nature":

        for (let i = 0; i < items.length; i++) {

          if (items[i].dataset.tag === "nature") {
            console.log(items[i])
            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }

        }

        break;
      case "flag":

        for (let i = 0; i < items.length; i++) {

          if (items[i].dataset.tag === "flag" || items[i].dataset.tag === "map") {

            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }

        }

        break;
      case "people":

        for (let i = 0; i < items.length; i++) {

          if (items[i].dataset.tag === "people") {
            console.log(items[i])
            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }

        }

        break;
      default:

    }
  }

  render() {

    const { drawer, toggleDrawer } = this.props

    return (
      <section
         className={drawer ? "drawer show section-gallalypanel section-bottom":"drawer hide section-gallalypanel section-bottom"}
      >
          <div className="drawer-button">
           <p onClick={()=> {
             toggleDrawer()
           }}>
             {drawer ?
               <span><FontAwesomeIcon icon={faChevronRight} /></span>
               : <span><FontAwesomeIcon icon={faChevronLeft} /></span>}
           </p>
          </div>
          <div className="drawer-content">
          <div className="gallary-category-list">
            <ul>
              <li onClick={()=>this.filterItems("all")}>
                <span><img src={logo} alt=""/></span>
                <p>All</p>
              </li>
              <li onClick={()=>this.filterItems("people")}>
                <span><img src={people} alt=""/></span>
                <p>People</p>
              </li>
              <li onClick={()=>this.filterItems("iot")}>
                <span><img src={iot} alt=""/></span>
                <p>IoT / Web</p>
              </li>
              <li onClick={()=>this.filterItems("interior")}>
                <span><img src={interior} alt=""/></span>
                <p>Interior</p>
              </li>
              <li onClick={()=>this.filterItems("nature")}>
                <span><img src={nature} alt=""/></span>
                <p>Nature</p>
              </li>
              <li onClick={()=>this.filterItems("flag")}>
                <span><img src={flag} alt=""/></span>
                <p>Internatinal</p>
              </li>
            </ul>
          </div>
          <div className="gallaryframe gallaryframe_category"
               onMouseDown={this.selectElementOfSVG}
               onMouseUp={() => this.props.me()}
               onTouchStart={this.selectElementOfSVGMobile}
               onTouchEnd={() => this.props.me()}>
            <Myloop />
          </div>
          </div>

      </section>
    );
  }
}


const mapStateToProps = state => ({
  drawer: state.json.drawer
})

export default connect(
  mapStateToProps,
  dispatch => ({
    toggleDrawer: value => dispatch(actions.toggleDrawer()),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(GallaryPanel)
