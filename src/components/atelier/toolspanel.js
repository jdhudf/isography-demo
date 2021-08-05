import React, { useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SketchPicker } from 'react-color';

import {
  faSortAmountUp,
  faSortAmountDown,
  faLongArrowAltRight,
  faLongArrowAltLeft ,
  faFont,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'

import '../../styles/toolspanel.scss';

import {
  getArtboardData,
  updateArtboards,
  setCanvas,
  getCanvas
} from '../handleLocalstorage'

import { connect } from 'react-redux'
import { actions } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux'
//import { ActionCreators } from 'redux-undo';

const getWorking = state => state.json.working
const getArtboards = state => state.artboards.present.artboards
const getGrid = state => state.json.grid
const getDarkmode = state => state.json.darkmode
const getTextEditor = state => state.json.textEditor
const getAddText = state => state.json.addText



class ToolsPanel extends React.Component {

  getAttribute = (g) => {

    const regExp = /-?\d+(\.\d+)?/g,
          translate = g.match(regExp)

    return translate;

  }

  recordArtboard = (data) => {

    const {
      working,
      updateArtboard,
      artboards,
      recordHistory
    } = this.props

    const canvas = getCanvas({ working: working, artboards:artboards });

    const newData = updateArtboards({
      working: working,
      type: "svg_data",
      artboards: artboards,
      value: data
    })

    updateArtboard(newData)
    recordHistory(JSON.parse(JSON.stringify(canvas)))

  }

  handleElement = (action) => {


    const {
      working,
      artboards,
      selected,
      switchSelected,
    } = this.props


    const canvas = getCanvas({ working: working, artboards:artboards }),
          data_copy = canvas.svg_data.slice();


    for (let i = 0; i < selected.length; i++) {

      let el = canvas.svg_data[ selected[i] ];

      switch (action){
        case 'Duplicate':
          console.log('duplicate');
          const svg = document.getElementById('svg'),
                g = svg.children[ selected[i] ];

          const translate = this.getAttribute(el)

          const x = parseInt(translate[0]) + 20
          const y = parseInt(translate[1]) + 20

          g.setAttribute("transform", `translate(`+ x +`,`+ y +`) scale(`+ translate[2] +`,`+ translate[3] +`) skewY(0) rotate(0)`);

          data_copy.push(g.outerHTML);
          break;
        case 'Delete':

          console.log('delete');

          data_copy.splice( selected[i] , 1);

          console.log(data_copy)

          switchSelected([])


          break;
        case 'Reflect':
          const regExp = /-?\d+/g;
          const scale = el.match(regExp)

          let n = 3;

          const result = el.replace(regExp,
            function(match) {
              if(n === 3) {
                n--;
                return scale[0];
              } else if (n === 2) {
                n--;
                return scale[1];
              } else if (n === 1) {
                n--;
                return -scale[2];
              } else if (n === 0) {
                n--;
                return scale[3];
              } else {
                return match;
              };
            }
          );

          data_copy.splice( selected[i] ,1);
          data_copy.push(result);
          break;
        case 'Reflect Vertical':
          const regExp2 = /-?\d+/g;
          const scale2 = el.match(regExp2)

          let nn = 3;

          const result2 = el.replace(regExp2,
            function(match) {
              if(nn === 3) {
                nn--;
                return scale2[0];
              } else if (nn === 2) {
                nn--;
                return scale2[1];
              } else if (nn === 1) {
                nn--;
                return scale2[2];
              } else if (nn === 0) {
                nn--;
                return -scale2[3];
              } else {
                return match;
              };
            }
          );

          data_copy.splice( selected[i] ,1);
          data_copy.push(result2);
          break;
        case 'bringToFront':
          console.log('bringToFront');
          data_copy.splice( selected[i] ,1);
          data_copy.push(el);
          switchSelected([])
          break;
        case 'bringForward':
          console.log('bringForward');

          console.info( selected[i] )

          data_copy.splice( selected[i] ,1);
          data_copy.splice( selected[i]  + 1 ,0,el);

          if (data_copy.length !== selected) {
            //switchSelected( selected[i]  + 1)
            switchSelected([])
          }

          break;
        case 'sendBackward':
          console.log('sendBackward');
          data_copy.splice( selected[i] ,1);
          data_copy.splice( selected[i]  - 1 ,0,el);

          if (data_copy.length !==  selected[i] ) {
            //switchSelected( selected[i]  - 1)
            switchSelected([])
          }
          break;
        case 'sendToBack':
          console.log('sendToBack');
          data_copy.splice( selected[i] ,1);
          data_copy.unshift(el);
          break;
        default:
          break;
      }

    }

    this.recordArtboard(data_copy)

  }

  group = () => {

    const {
      selected,
      switchSelected,
      artboards,
      working
    } = this.props

    const canvas = getCanvas({ artboards: artboards, working: working })

    let data_copy = canvas.svg_data;

    let selectedArray = [];

    for (let i = 0; i<selected.length;i++) {

      selectedArray.push( data_copy[ selected[i] ] )

    }
    data_copy = data_copy.filter(function(v){
      return ! selectedArray.includes(v);
    });

    selectedArray.unshift(`<g transform="translate(0,0) scale(1.00,1.00) skewY(0) rotate(0)" data-type="group">`)
    selectedArray.push(`</g>`)
    const group = selectedArray.join('')

    data_copy.push(group)


    switchSelected([])
    this.recordArtboard(data_copy)

  }

  ungroup = () => {

    const {
      selected,
      artboards,
      working
    } = this.props

    const canvas = getCanvas({ artboards: artboards, working: working })

    const data_copy = canvas.svg_data;

    const svg = document.getElementById('svg')


    for (let i = 0; i < selected.length; i++) {

        const group = svg.children[ selected[i] ]

        //console.log(selected)

        console.log(group.getAttribute('transform'))

        data_copy.shift(selected[i], 1)

        for (let j = 0; j < group.children.length; j++) {

          data_copy.push(group.children[j].outerHTML)

        }

    }

    this.recordArtboard(data_copy)

  }

  render() {

    const {
      working,
      undo, redo,
      //recordHistory,
      past, future,
      updateArtboard,
      artboards,
      selected,
      darkmode } = this.props

    const canvas = getCanvas({artboards: artboards, working: working})
    const svg_data = canvas.svg_data;

    return (
      <section className="section-toolspanel section-bottom">
        {(()=>{
          if ( svg_data.length > 1 ) {
            if( selected === 0 ){
              return (
                <span>
                  <p title="Bring Forward" onClick={()=>this.handleElement("bringForward")}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            } else if (selected === (svg_data.length - 1)) {
              return (
                <span>
                  <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" onClick={()=>this.handleElement("sendBackward")}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            } else if ( selected === null ) {

              return (
                <span>
                  <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )

            } else {
              return (
                <span>
                  <p title="Bring Forward" onClick={()=>this.handleElement("bringForward")}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                  <p title="Send Backward" onClick={()=>this.handleElement("sendBackward")}><FontAwesomeIcon icon={faSortAmountDown} /></p>
                </span>
              )
            }
          } else {

            return (
              <span>
                <p title="Bring Forward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountUp} /></p>
                <p title="Send Backward" style={{color: darkmode ? "#444855":"lightgray"}}><FontAwesomeIcon icon={faSortAmountDown} /></p>
              </span>
            )

          }
        })()}

        {/*<TextEditer />*/}

        {(()=>{
          if ( svg_data.length > 0 ) {
            if( selected !== null ) {
              const fill = darkmode ? "#9EA1B1":"#000"
              return (
                <>
                  <p title="Reflect horizontal"
                     onClick={()=>this.handleElement("Reflect")}>

                     <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><g id="Artboard11"><path fill={fill} d="M16.456,25.786l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Z"/><path fill={fill} d="M10.606,13.231c0.566,0.369 0.907,0.999 0.907,1.675c0,0.676 -0.341,1.306 -0.907,1.675c-1.43,0.933 -3.22,2.102 -4.727,3.085c-0.615,0.401 -1.4,0.434 -2.046,0.084c-0.645,-0.349 -1.047,-1.025 -1.047,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 0.402,-1.409 1.047,-1.759c0.646,-0.349 1.431,-0.317 2.046,0.084c1.507,0.983 3.297,2.152 4.727,3.085Zm-5.32,3.837l3.312,-2.162l-3.312,-2.162l-0,4.324Z"/><path fill={fill} d="M19.306,13.231c-0.566,0.369 -0.907,0.999 -0.907,1.675c0,0.676 0.341,1.306 0.907,1.675c1.43,0.933 3.221,2.102 4.728,3.085c0.615,0.401 1.4,0.434 2.045,0.084c0.646,-0.349 1.048,-1.025 1.048,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 -0.402,-1.409 -1.048,-1.759c-0.645,-0.349 -1.43,-0.317 -2.045,0.084c-1.507,0.983 -3.298,2.152 -4.728,3.085Zm2.008,1.675l3.313,2.162l-0,-4.324l-3.313,2.162Z"/></g></svg>
                  </p>
                  <p title="Reflect vertical"
                     onClick={()=>this.handleElement("Reflect Vertical")}>
                    <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",stroMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M25.681,13.561l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Z"/><path fill={fill} d="M13.126,19.411c0.37,-0.566 1,-0.907 1.675,-0.907c0.676,0 1.306,0.341 1.675,0.907c0.933,1.43 2.102,3.221 3.085,4.728c0.402,0.615 0.434,1.4 0.084,2.045c-0.349,0.646 -1.024,1.048 -1.759,1.048c-1.917,-0 -4.253,-0 -6.17,-0c-0.734,-0 -1.409,-0.402 -1.759,-1.048c-0.349,-0.645 -0.317,-1.43 0.084,-2.045c0.984,-1.507 2.152,-3.298 3.085,-4.728Zm3.837,5.321l-2.162,-3.313l-2.162,3.313l4.324,-0Z"/><path fill={fill} d="M13.126,10.711c0.37,0.566 1,0.907 1.675,0.907c0.676,0 1.306,-0.341 1.675,-0.907c0.933,-1.43 2.102,-3.221 3.085,-4.728c0.402,-0.614 0.434,-1.399 0.084,-2.045c-0.349,-0.645 -1.024,-1.048 -1.759,-1.048c-1.917,0 -4.253,0 -6.17,0c-0.734,0 -1.409,0.403 -1.759,1.048c-0.349,0.646 -0.317,1.431 0.084,2.045c0.984,1.507 2.152,3.298 3.085,4.728Zm1.675,-2.008l2.162,-3.313l-4.324,0l2.162,3.313Z"/></svg>
                  </p>
                  <p title="Duplicate"
                     onClick={()=>this.handleElement("Duplicate")}>

                    <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M7.826,5.677c0.182,-0.031 0.369,-0.048 0.56,-0.048l12.534,-0c1.782,-0 3.229,1.447 3.229,3.228l0,12.543c0,0.17 -0.013,0.337 -0.039,0.5c1.516,-0.265 2.669,-1.589 2.669,-3.18l-0,-12.543c-0,-1.781 -1.447,-3.228 -3.229,-3.228l-12.534,-0c-1.612,-0 -2.949,1.184 -3.19,2.728Z"/><path fill={fill} d="M21.984,11.177c0,-1.782 -1.447,-3.228 -3.228,-3.228l-12.535,-0c-1.782,-0 -3.228,1.446 -3.228,3.228l-0,12.543c-0,1.782 1.446,3.229 3.228,3.229l12.535,-0c1.781,-0 3.228,-1.447 3.228,-3.229l0,-12.543Zm-2.5,0l0,12.543c0,0.402 -0.326,0.729 -0.728,0.729l-12.535,-0c-0.402,-0 -0.728,-0.327 -0.728,-0.729c-0,0 -0,-12.543 -0,-12.543c-0,-0.402 0.326,-0.728 0.728,-0.728c0,-0 12.535,-0 12.535,-0c0.402,-0 0.728,0.326 0.728,0.728Z"/></svg>
                  </p>
                </>
              )
            } else {
              const fill = darkmode ? "#444855":"lightgray"
              return (
                <>
                  <p title="Reflect horizontal">

                     <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><g id="Artboard11"><path fill={fill} d="M16.456,25.786l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Z"/><path  fill={fill} d="M10.606,13.231c0.566,0.369 0.907,0.999 0.907,1.675c0,0.676 -0.341,1.306 -0.907,1.675c-1.43,0.933 -3.22,2.102 -4.727,3.085c-0.615,0.401 -1.4,0.434 -2.046,0.084c-0.645,-0.349 -1.047,-1.025 -1.047,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 0.402,-1.409 1.047,-1.759c0.646,-0.349 1.431,-0.317 2.046,0.084c1.507,0.983 3.297,2.152 4.727,3.085Zm-5.32,3.837l3.312,-2.162l-3.312,-2.162l-0,4.324Z"/><path  fill={fill} d="M19.306,13.231c-0.566,0.369 -0.907,0.999 -0.907,1.675c0,0.676 0.341,1.306 0.907,1.675c1.43,0.933 3.221,2.102 4.728,3.085c0.615,0.401 1.4,0.434 2.045,0.084c0.646,-0.349 1.048,-1.025 1.048,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 -0.402,-1.409 -1.048,-1.759c-0.645,-0.349 -1.43,-0.317 -2.045,0.084c-1.507,0.983 -3.298,2.152 -4.728,3.085Zm2.008,1.675l3.313,2.162l-0,-4.324l-3.313,2.162Z"/></g></svg>
                  </p>
                  <p title="Reflect vertical">

                    <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",stroMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M25.681,13.561l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Z"/><path fill={fill} d="M13.126,19.411c0.37,-0.566 1,-0.907 1.675,-0.907c0.676,0 1.306,0.341 1.675,0.907c0.933,1.43 2.102,3.221 3.085,4.728c0.402,0.615 0.434,1.4 0.084,2.045c-0.349,0.646 -1.024,1.048 -1.759,1.048c-1.917,-0 -4.253,-0 -6.17,-0c-0.734,-0 -1.409,-0.402 -1.759,-1.048c-0.349,-0.645 -0.317,-1.43 0.084,-2.045c0.984,-1.507 2.152,-3.298 3.085,-4.728Zm3.837,5.321l-2.162,-3.313l-2.162,3.313l4.324,-0Z"/><path fill={fill} d="M13.126,10.711c0.37,0.566 1,0.907 1.675,0.907c0.676,0 1.306,-0.341 1.675,-0.907c0.933,-1.43 2.102,-3.221 3.085,-4.728c0.402,-0.614 0.434,-1.399 0.084,-2.045c-0.349,-0.645 -1.024,-1.048 -1.759,-1.048c-1.917,0 -4.253,0 -6.17,0c-0.734,0 -1.409,0.403 -1.759,1.048c-0.349,0.646 -0.317,1.431 0.084,2.045c0.984,1.507 2.152,3.298 3.085,4.728Zm1.675,-2.008l2.162,-3.313l-4.324,0l2.162,3.313Z"/></svg>
                  </p>
                  <p title="Duplicate">

                    <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M7.826,5.677c0.182,-0.031 0.369,-0.048 0.56,-0.048l12.534,-0c1.782,-0 3.229,1.447 3.229,3.228l0,12.543c0,0.17 -0.013,0.337 -0.039,0.5c1.516,-0.265 2.669,-1.589 2.669,-3.18l-0,-12.543c-0,-1.781 -1.447,-3.228 -3.229,-3.228l-12.534,-0c-1.612,-0 -2.949,1.184 -3.19,2.728Z"/><path fill={fill} d="M21.984,11.177c0,-1.782 -1.447,-3.228 -3.228,-3.228l-12.535,-0c-1.782,-0 -3.228,1.446 -3.228,3.228l-0,12.543c-0,1.782 1.446,3.229 3.228,3.229l12.535,-0c1.781,-0 3.228,-1.447 3.228,-3.229l0,-12.543Zm-2.5,0l0,12.543c0,0.402 -0.326,0.729 -0.728,0.729l-12.535,-0c-0.402,-0 -0.728,-0.327 -0.728,-0.729c-0,0 -0,-12.543 -0,-12.543c-0,-0.402 0.326,-0.728 0.728,-0.728c0,-0 12.535,-0 12.535,-0c0.402,-0 0.728,0.326 0.728,0.728Z"/></svg>
                  </p>
                </>
              )
            }
          } else {
            const fill = darkmode ? "#444855":"lightgray"
            return (
              <>
                <p title="Reflect horizontal">

                   <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><g id="Artboard11"><path fill={fill} d="M16.456,25.786l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Zm0,-3.9l0,-1.95l-3,0l0,1.95l3,0Z"/><path  fill={fill} d="M10.606,13.231c0.566,0.369 0.907,0.999 0.907,1.675c0,0.676 -0.341,1.306 -0.907,1.675c-1.43,0.933 -3.22,2.102 -4.727,3.085c-0.615,0.401 -1.4,0.434 -2.046,0.084c-0.645,-0.349 -1.047,-1.025 -1.047,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 0.402,-1.409 1.047,-1.759c0.646,-0.349 1.431,-0.317 2.046,0.084c1.507,0.983 3.297,2.152 4.727,3.085Zm-5.32,3.837l3.312,-2.162l-3.312,-2.162l-0,4.324Z"/><path  fill={fill} d="M19.306,13.231c-0.566,0.369 -0.907,0.999 -0.907,1.675c0,0.676 0.341,1.306 0.907,1.675c1.43,0.933 3.221,2.102 4.728,3.085c0.615,0.401 1.4,0.434 2.045,0.084c0.646,-0.349 1.048,-1.025 1.048,-1.759c-0,-1.917 -0,-4.253 -0,-6.17c-0,-0.734 -0.402,-1.409 -1.048,-1.759c-0.645,-0.349 -1.43,-0.317 -2.045,0.084c-1.507,0.983 -3.298,2.152 -4.728,3.085Zm2.008,1.675l3.313,2.162l-0,-4.324l-3.313,2.162Z"/></g></svg>
                </p>
                <p title="Reflect vertical">

                  <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",stroMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M25.681,13.561l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Zm-3.9,0l-1.95,0l0,3l1.95,0l0,-3Z"/><path fill={fill} d="M13.126,19.411c0.37,-0.566 1,-0.907 1.675,-0.907c0.676,0 1.306,0.341 1.675,0.907c0.933,1.43 2.102,3.221 3.085,4.728c0.402,0.615 0.434,1.4 0.084,2.045c-0.349,0.646 -1.024,1.048 -1.759,1.048c-1.917,-0 -4.253,-0 -6.17,-0c-0.734,-0 -1.409,-0.402 -1.759,-1.048c-0.349,-0.645 -0.317,-1.43 0.084,-2.045c0.984,-1.507 2.152,-3.298 3.085,-4.728Zm3.837,5.321l-2.162,-3.313l-2.162,3.313l4.324,-0Z"/><path fill={fill} d="M13.126,10.711c0.37,0.566 1,0.907 1.675,0.907c0.676,0 1.306,-0.341 1.675,-0.907c0.933,-1.43 2.102,-3.221 3.085,-4.728c0.402,-0.614 0.434,-1.399 0.084,-2.045c-0.349,-0.645 -1.024,-1.048 -1.759,-1.048c-1.917,0 -4.253,0 -6.17,0c-0.734,0 -1.409,0.403 -1.759,1.048c-0.349,0.646 -0.317,1.431 0.084,2.045c0.984,1.507 2.152,3.298 3.085,4.728Zm1.675,-2.008l2.162,-3.313l-4.324,0l2.162,3.313Z"/></svg>
                </p>
                <p title="Duplicate">

                  <svg width="21" height="100%" viewBox="0 0 30 30" version="1.1" style={{fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2.5"}}><rect id="Artboard1" x="0" y="0" width="30" height="30" style={{fill:"none"}}/><path fill={fill} d="M7.826,5.677c0.182,-0.031 0.369,-0.048 0.56,-0.048l12.534,-0c1.782,-0 3.229,1.447 3.229,3.228l0,12.543c0,0.17 -0.013,0.337 -0.039,0.5c1.516,-0.265 2.669,-1.589 2.669,-3.18l-0,-12.543c-0,-1.781 -1.447,-3.228 -3.229,-3.228l-12.534,-0c-1.612,-0 -2.949,1.184 -3.19,2.728Z"/><path fill={fill} d="M21.984,11.177c0,-1.782 -1.447,-3.228 -3.228,-3.228l-12.535,-0c-1.782,-0 -3.228,1.446 -3.228,3.228l-0,12.543c-0,1.782 1.446,3.229 3.228,3.229l12.535,-0c1.781,-0 3.228,-1.447 3.228,-3.229l0,-12.543Zm-2.5,0l0,12.543c0,0.402 -0.326,0.729 -0.728,0.729l-12.535,-0c-0.402,-0 -0.728,-0.327 -0.728,-0.729c-0,0 -0,-12.543 -0,-12.543c-0,-0.402 0.326,-0.728 0.728,-0.728c0,-0 12.535,-0 12.535,-0c0.402,-0 0.728,0.326 0.728,0.728Z"/></svg>
                </p>
              </>
            )
          }
        })()}

        {(()=> {

          const { selected } = this.props

          const svg = document.getElementById('svg')

          if ( selected ) {

            if ( svg ) {

              if ( svg.children !== null ) {

                if ( selected.length === 1 ) {
                  const g = svg.children[selected]

                  if (g.dataset.type === "group") {
                    return (
                      <p onClick={this.ungroup} style={{transform: "scale(0.8, 1)", fontWeight: 600}}>Ungroup</p>
                    )
                  }

                }

                if ( selected.length > 1) {
                  return (
                    <p onClick={this.group} style={{transform: "scale(0.8, 1)", fontWeight: 600}}>Group</p>
                  )
                }

              }

            }

          }

          return <p style={{transform: "scale(0.8, 1)", fontWeight: 600, color: "lightgray"}}>Group</p>

        })()}

        {(()=>{
          if (past.length === 0) {
            return (
              <p title="Undo" style={{color: darkmode ? "#444855":"lightgray" }}>
                <FontAwesomeIcon icon={faLongArrowAltLeft} />
              </p>
            )
          } else {
            return (
              <p title="Undo" onClick={()=>{
                undo(canvas)
                const newData = setCanvas({ working: working, artboards: artboards, value: past[past.length-1] })
                updateArtboard(newData)
              }}>
                <FontAwesomeIcon icon={faLongArrowAltLeft} />
              </p>
            )
          }
        })()}
        {(()=>{
          if (future.length === 0) {
            return (
              <p title="Redo" style={{color: darkmode ? "#444855":"lightgray"}}>
                <FontAwesomeIcon icon={faLongArrowAltRight} />
              </p>
            )
          } else {
            return (
              <p title="Redo" onClick={()=>{
                redo()
                const newData = setCanvas({working:working, artboards: artboards, value: future[0] })
                updateArtboard(newData)
              }}>
                <FontAwesomeIcon icon={faLongArrowAltRight} />
              </p>
            )
          }
        })()}

        <p style={{margin: "0",color:darkmode ? "#9EA3B2":"gray"}}>BG</p>
        <Gradient />

        <ToggleGrid/>

        {(()=>{
          if ( selected !== null ) {

            return (
              <p
                onClick={() => this.handleElement('Delete')}
                title="Remove Element">
                <FontAwesomeIcon icon={faTrashAlt} />
              </p>
            )

          } else {

            return (
              <p title="Remove Element" style={{color: darkmode ? "#444855":"lightgray" }}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </p>
            )

          }
        })()}

      </section>
    );

  }
}


function TextEditer() {

  const textEditor = useSelector(getTextEditor),
        addText = useSelector(getAddText),
        dispatch = useDispatch();

  const appendText = () => {

    if (addText) {
      dispatch({type: 'switch/textEditor', payload: !textEditor})

      dispatch({type: 'switch/textEditor', payload: false})
      dispatch({type: 'switch/addText', payload: false})
    } else {
      dispatch({type: 'switch/textEditor', payload: true})
      dispatch({type: 'switch/addText', payload: true})
    }

  }

  return (
    <p onClick={appendText} style={{color:addText ? "deepskyblue": "#000" }}><FontAwesomeIcon icon={faFont} /></p>
  )
}

function ToggleGrid() {

  const working = useSelector(getWorking)
  const artboards = useSelector(getArtboards)
  const toggleState = useSelector(getGrid)
  const darkmode = useSelector(getDarkmode)

  const [gridScale, setGridScale] = useState(getArtboardData({artboards:artboards,working:working,type:"grid"}));

  //updateArtboards = ({working, type, artboards,value})

  const dispatch = useDispatch()

  const toggleGrid = () => {
    if (toggleState) {
      dispatch({type: 'grid/switch', payload: false})
      document.getElementById('toggle').classList.remove("active")
    } else {
      dispatch({type: 'grid/switch', payload: true})
      document.getElementById('toggle').classList.add("active")
    }
  }

  const updateGrid = (e) => {

    setGridScale(e.target.value)

    const g = updateArtboards({
      working: working,
      artboards: artboards,
      type: "grid",
      value: e.target.value
    })

    dispatch({type: 'update/artboard', payload: g})
  }

  return (
    <div className="grid" style={{marginBottom: "30px"}}>
      <p style={{marginBottom: "0px", color:darkmode ? "#9EA3B2":"gray"}}>Grid</p>
      <div id="toggle" onClick={toggleGrid} className="toggle">
        <div className="button"></div>
      </div>
      <div className="grid-customizer">
        <input type="range" min="0.05" max="3" value={gridScale} step="0.01" onChange={updateGrid}/>
      </div>
    </div>
  )
}

function Gradient() {

  const artboards = useSelector(getArtboards)
  const working = useSelector(getWorking)
  const dispatch = useDispatch()

  /*const canvas = getCanvas({artboards: artboards,working:working}),
        artboard_size = canvas.artboard_size,
        color_scheme = canvas.color_scheme,
        artboard_name = getArtboardData({artboards:artboards, working: working, type: "artboard_name"});*/

  const [ modal, toggleModal] = useState(false)
  const [ picker, changePicker] = useState("solid")
  const color = getCanvas({artboards: artboards, working: working}).color_scheme["background"]

  const [ solid, changeSolid] = useState("#5A7A7C")
  const [ linear, changeLinear] = useState(
    {
      deg: "90",
      color_set: [
        {
          color: "#e66465",
          percent: 0,
        },
        {
            color: "#9198e5",
            percent: 100,
        }
      ]
    }
  )
  const [ radial, changeRadial] = useState(
    {
      deg: "90",
      color_set: [
        {
          color: "#e66465",
          percent: 0,
        },
        {
            color: "#9198e5",
            percent: 100,
        }
      ]
    }
  )

  const [iLinear, switchLinear] = useState(0)
  const [iRadial, switchRadial] = useState(0)

  const styles = {
    color: {
      width: '25px',
      height: '25px',
      borderRadius: '2px',
      background: color,
    },
    swatch: {
      padding: '3px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
      marginTop: '1px',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
      marginLeft: '60px',
      marginTop: '-160px',
      background: '#ffffff',
      borderRadius: '2px',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px;'
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      zIndex: '-1'
    },
    linearGradientHandler: {
      background: `linear-gradient(90deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`
    }
  }

  const handler = []

  for (let i = 0; i < linear.color_set.length; i++) {
    handler.push(
      <span class={(()=>{
               if ( i === iLinear) {
                 return (
                   "handler active"
                 )
               } else {
                 return (
                   "handler"
                 )
               }
            })()}
            onClick={
              () => switchLinear(i)
            }
            style={{
              background: linear.color_set[i].color,
              left: `${linear.color_set[i].percent}%`
            }} />
    )
  }

  const handlerRadial = []

  for (let i = 0; i < radial.color_set.length; i++) {
    handlerRadial.push(
      <span class={(()=>{
               if ( i === iRadial) {
                 return (
                   "handler active"
                 )
               } else {
                 return (
                   "handler"
                 )
               }
            })()}
            onClick={
              () => switchRadial(i)
            }
            style={{
              background: radial.color_set[i].color,
              left: `${radial.color_set[i].percent}%`
            }} />
    )
  }

  const update = (e) => {
    if (artboards !== undefined &&  working !== undefined ) {

      const newData = updateArtboards({
        working: working,
        type: "background",
        artboards: artboards,
        value: e
      })

      dispatch({type: 'hex/update', payload: newData})

    }
  }

  return (
    <div>
      <div className="color-picker">

        <div style={ styles.swatch }
             onClick={ () => toggleModal(true) }>
          <div style={ styles.color } />
        </div>
        {/*
          Conditional operator = condition ? true : false
          */}
        { modal ?
          <div style={ styles.popover }>
            <div style={ styles.cover }
                 onClick={ () => toggleModal(false) }/>
            <select name=""
                    id="picker-selector"
                    onChange={(e)=>{
                      changePicker(e.target.value)
                      if (e.target.value === "solid") {

                        update(solid)

                      } else if(e.target.value === "linear") {

                        const i = `linear-gradient(
                          ${linear.deg}deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`

                        update(i)

                      } else if (e.target.value === "radial") {

                        const i = `radial-gradient(
                          ${radial.color_set[0].color}, ${radial.color_set[1].color})`

                        update(i)
                      }
                    }}>
              <option value="solid"
                      selected={picker === "solid"}>
                      Solid</option>
              <option value="linear"
                      selected={picker === "linear"}>
                      Linear</option>
              <option value="radial"
                      selected={picker === "radial"}>
                      Radial</option>
              <option value="mesh"
                      selected={picker === "mesh"}>
                      Mesh</option>
            </select>
            {(() => {
              if ( picker === "solid" ) {
                return (
                  <SketchPicker
                     color={solid}
                     onChange={(e) => {
                       changeSolid(e.hex)

                       update(e.hex)

                       //recordHistory(JSON.parse(JSON.stringify(canvas)))
                     }} />
                )
              } else if ( picker === "linear") {
                return (
                  <div>
                    <div className="degree-handler">
                      <span className="degree-circle"/>
                      <span className="degree-subtraction"
                      onClick={()=>{
                        const copy = JSON.parse(JSON.stringify(linear))
                        copy.deg = copy.deg - 1
                        changeLinear(copy)

                        const i = `linear-gradient(
                          ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                        update(i)
                      }}></span>
                      <input type="number"
                             min="0" max="360"
                             value={linear.deg}
                             onChange={(e)=>{
                               const copy = JSON.parse(JSON.stringify(linear))
                               copy.deg = e.target.value
                               changeLinear(copy)

                               const i = `linear-gradient(
                                 ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                               update(i)
                             }}/>
                      <span className="degree-addition"
                        onClick={()=>{
                        const copy = JSON.parse(JSON.stringify(linear))
                        copy.deg = copy.deg + 1
                        changeLinear(copy)

                        const i = `linear-gradient(
                          ${copy.deg}deg, ${copy.color_set[0].color}, ${copy.color_set[1].color})`

                        update(i)
                      }}></span>
                    </div>
                    <div class="linear-gradient-handler" style={styles.linearGradientHandler}>
                    </div>
                    <div class="handlers">
                      {handler}
                    </div>
                    <SketchPicker
                       color={linear.color_set[iLinear].color}
                       onChange={
                         (e) => {
                           const copy = JSON.parse(JSON.stringify(linear))
                           copy.color_set[iLinear].color = e.hex
                           changeLinear(copy)

                           const i = `linear-gradient(
                             ${linear.deg}deg, ${linear.color_set[0].color}, ${linear.color_set[1].color})`

                           update(i)
                         }
                       } />
                  </div>
                )
              } else if ( picker === "radial") {
                return (
                  <div>
                    <div class="linear-gradient-handler" style={styles.linearGradientHandler}>
                    </div>
                    <div class="handlers">
                      {handlerRadial}
                    </div>
                    <SketchPicker
                       color={radial.color_set[iRadial].color}
                       onChange={
                         (e) => {
                           const copy = JSON.parse(JSON.stringify(radial))
                           copy.color_set[iRadial].color = e.hex
                           changeRadial(copy)

                           const i = `radial-gradient(
                             ${radial.color_set[0].color}, ${radial.color_set[1].color})`

                           update(i)
                         }
                       } />
                  </div>
                )
              } else if (picker === "mesh") {
                return (
                  <div style={{
                          width: "200px",
                          height: "200px",
                          background: `
                          radial-gradient(ellipse at top, #e66465, transparent),
                          radial-gradient(ellipse at bottom, #4d9f0c, transparent),
                          linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
                          linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)`
                        }}>
                        <p style={{
                          paddingTop: "30px",
                          color: "#fff",
                        }}>Under Development</p>
                  </div>
                )
              }
            })()}
          </div>
        : null }

      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  artboards: state.artboards.present.artboards,
  working: state.json.working,
  past: state.history.past,
  future: state.history.future,
  present: state.history.present,
  selected: state.json.selected,
  darkmode: state.json.darkmode,
  textEditor: state.json.textEditor,
  editable: state.json.editable
})

export default connect(
  mapStateToProps,
  dispatch => ({
    changeHex:    value => dispatch(actions.changeHex(value)),
    updateArtboard: value => dispatch(actions.updateArtboard(value)),
    recordHistory:  value => dispatch(actions.recordHistory(value)),
    undo:           value => dispatch(actions.undo(value)),//value => dispatch(actions.undo(value)),
    redo:           value => dispatch(actions.redo(value)),
    switchSelected: value => dispatch(actions.switchSelected(value)),
    switchEditable: value => dispatch(actions.switchEditable(value)),
  })
  //dispatch => ({ switchDarkmode: value => dispatch(switchDarkmode(value)) })
)(ToolsPanel)
