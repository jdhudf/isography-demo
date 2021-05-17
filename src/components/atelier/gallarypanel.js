import React from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../styles/atelier.scss';
import '../../styles/gallarypanel.scss';

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';

import Myloop from './images.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { /*faSearch,*/faChevronLeft,faChevronRight } from '@fortawesome/free-solid-svg-icons'

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

    const children = svg.children;

    let gtag = document.createElement('g');

    gtag.setAttribute('transform', 'translate(0,0) scale(1.00,1.00)');
    gtag.setAttribute('data-type', 'el');

    for (let i = 0; i< children.length; i++) {
      gtag.appendChild(children[i].cloneNode(true));
    }

    if (gtag.outerHTML.startsWith('<g transform="translate')) {

      this.props.method(gtag.outerHTML)

    } else {}

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

    const children = svg.children;

    let gtag = document.createElement('g');

    gtag.setAttribute('transform', 'translate(0,0) scale(1.00,1.00)');
    gtag.setAttribute('data-type', 'el');

    for (let i = 0; i< children.length; i++) {
      gtag.appendChild(children[i].cloneNode(true));
    }

    if (gtag.outerHTML.startsWith('<g transform="translate')) {

      this.props.method(gtag.outerHTML)

    } else {}

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
             <Tabs>
               <TabList>
                 <Tab>All</Tab>
                 {/*<Tab>Categories</Tab>*/}
                 {/*<Tab>Later</Tab>
                 <Tab><FontAwesomeIcon icon={faSearch} /></Tab>*/}
               </TabList>

               <TabPanel>
                 <div className="gallaryframe"
                      onMouseDown={this.selectElementOfSVG}
                      onMouseUp={() => this.props.me()}
                      onTouchStart={this.selectElementOfSVGMobile}
                      onTouchEnd={() => this.props.me()}>
                   <Myloop />
                 </div>
               </TabPanel>
               {/*<TabPanel>
               <div>
                 <ul className="gallary-category-list">
                   <li>
                     <span></span>
                     <p>People</p>
                   </li>
                   <li>
                     <span></span>
                     <p>Plants</p>
                   </li>
                   <li>
                     <span></span>
                     <p>Buildings</p>
                   </li>
                   <li>
                     <span></span>
                     <p>Animals</p>
                   </li>
                 </ul>
               </div>
               </TabPanel>*/}

               {/*<TabPanel>
                  <div>test</div>
               </TabPanel>*/}
             </Tabs>
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
