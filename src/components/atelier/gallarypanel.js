import React from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../styles/atelier.scss';

import Myloop from './images.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

//====================================
//  We need below functions that
//  -[ ] convert svg to component
//====================================


class GallaryPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isMouseDown : false,
      willAddElementOfSvg: null,
    };
  }

  selectElementOfSVG = (e) => {
    console.log(e)
  }

  selectElementOfSVG = (e) => {

    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      console.log(e.target.parentNode.outerHTML)

      this.props.method(e.target.parentNode.outerHTML)

    } else {}

  }

  /*onMouseDown = (e) => {
    //this.setState({isMouseDown:true})

    const mouseX = e.pageX;// pageX and pageY is mouse's axis in the box.
    const mouseY = e.pageY;

    const g = e.target.parentNode.outerHTML;

    if (g.startsWith('<g transform="translate')) {

      this.setState({isMouseDown:true})

      console.log(e.target.parentNode.outerHTML)

      document.querySelector('.section-gallalypanel').style.cursor = 'copy';
      document.querySelector('.section-artboard').style.cursor = 'copy';

      this.setState({willAddElementOfSvg:e.target.parentNode.outerHTML})

    } else {
      this.setState({isMouseDown:false})
    }

  }

  onMouseMove = (e) => {
    e.preventDefault();

    if (this.state.isMouseDown) {
      document.querySelector('.section-gallalypanel').style.cursor = 'copy';
      document.querySelector('.section-artboard').style.cursor = 'copy';
    } else {
      document.querySelector('.section-gallalypanel').style.cursor = 'default';
      document.querySelector('.section-artboard').style.cursor = 'default';
    }
  }

  onMouseUp = (e) => {
    this.setState({isMouseDown:false})
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';
  }

  onMouseLeave = (e) => {
    this.setState({isMouseDown:false})
    //console.log('mouseUp: ' + e.target.parentNode.outerHTML)
    document.querySelector('.section-gallalypanel').style.cursor = 'default';
    document.querySelector('.section-artboard').style.cursor = 'default';
  }*/

  render() {

    const styles={
      gallaryframe: {
        width: "90%",
        margin: "10px auto",
        height:"500px",
        border: "solid 2px #F0F0F0",
        overflow: "scroll",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      },
      style_input: {
        width: "90%",
        padding: "5px 0",
        margin: "10px 0",
        border: "solid 2px #E7E7E7",
        fontWeight: "bold"
      }
    };

    return (
      <section
         className="section-gallalypanel section-bottom"
      >
       <Tabs>
         <TabList>
           <Tab>Category</Tab>
           <Tab>Later</Tab>
           <Tab>Suggest</Tab>
           <Tab>Past</Tab>
           <Tab><FontAwesomeIcon icon={faSearch} /></Tab>
         </TabList>

         <TabPanel>
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
           <div className="gallaryframe"
                style={styles.gallaryframe} onMouseDown={this.selectElementOfSVG}>
             <Myloop />


           </div>
         </TabPanel>
         <TabPanel>
           <div>test</div>
         </TabPanel>
         <TabPanel>
            <div>test</div>
         </TabPanel>
         <TabPanel>
            <div>test</div>
         </TabPanel>
         <TabPanel>
            <div>test</div>
         </TabPanel>
       </Tabs>

      </section>
    );
  }
}

export default GallaryPanel;
