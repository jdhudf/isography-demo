import React, { useState }  from 'react';
import { Link } from 'react-router-dom'
import ColorPicker from '../components/ColorPicker.js';


//import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
//  Link
//} from "react-router-dom";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import MenuBar from '../components/menubar.js';
import Navigation from '../components/navigation.js';
import '../styles/home.scss';
import img from '../images/default.png';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import HexInput from '../redux/hexinput'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGripHorizontal,
  faList,
} from '@fortawesome/free-solid-svg-icons'

import {
  //getIsographyData,
  addNewArtboard
 } from '../components/handleLocalstorage'

import { useSelector, useDispatch } from 'react-redux'
const selectHex = state => state.json

//import GallaryPanel from '../components/gallarypanel.js';
//import ToolsPanel from '../components/toolspanel.js';
//import Artboard from '../components/artboard.js';

// document data in localStorage
// * document id
// * document name
// * created at
// * last modified at
// * artboard size [width,height]
// * svg data
// * color_scheme
// * documents are limited to 9


class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <section className="section-home">
        <MenuBar />
        <Dashboard />
      </section>
    );

  }
}

const Dashboard = () => {

  const [showModal, toggleModal] = useState(false);
  const [documentList, toggleDocumentList] = useState(false);

  const json = useSelector(selectHex).json//getIsographyData();

  const styles = {
    test: {
      background: "#000",
      maxWidth: "300px",
      position: "relative"
    },
    svg: {
      background: "#fff",
    },
    box: {
      background: "#000",
      posotion: "fixed",
      top: "10px",
      right: "10px",
      color: "#fff",
      display: showModal? "block":"none"
    }
  }

  const clicked = (e) => {
    json.working = e.currentTarget.getAttribute('data-id');
    localStorage.setItem('isography', JSON.stringify(json));
  }

  const color = useSelector(selectHex)

  const today = new Date();
  const dated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  return (
    <section className="section-dashboard">
      <div className="flexbox">
        <main>
          <NewArtboard/>
          <div className="your-document">
            <div style={styles.box}>
              <ul>
                <li>Open</li>
                <li>Duplicate</li>
                <li>Rename</li>
                <li>Delete</li>
              </ul>
            </div>
            <h2>Your Documents</h2>
            {/*<ul style={{textAlign: "center"}}>
              <li style={{display:"inline-block"}}><FontAwesomeIcon icon={faGripHorizontal} /></li>
              <li style={{display:"inline-block"}}><FontAwesomeIcon icon={faList} /></li>
            </ul>*/}
            <ul className="toggle-document-list">
              <li onClick={()=>toggleDocumentList(false)} class={documentList?null:"display"}><FontAwesomeIcon icon={faGripHorizontal} /></li>
              <li onClick={()=>toggleDocumentList(true)} class={documentList?"display":null}><FontAwesomeIcon icon={faList} /></li>
            </ul>
            <ul className={documentList?"document-list":"document-list-column"}>
            {(()=>{
              const list = json.data;

              const arranged = list.sort(function(a, b){
                //return new Date(a.last_modified) - new Date(b.last_modified)
                return new Date(b.last_modified) - new Date(a.last_modified)
              })

              return arranged.map(item => (
                <li>
                  <Link onClick={clicked} to="/" data-id={item.artboard_id}>
                    <div style={styles.test}>
                    {/* x=y*item.artboard_size[0]/item.artboard_size[1] */}
                    {/* y=x*item.artboard_size[1]/item.artboard_size[0] */}
                    <svg
                        version="1.1"
                        viewBox={`0 0 ${item.artboard_size[0]} ${item.artboard_size[1]}`}
                        xmlns="http://www.w3.org/2000/svg"
                        style={styles.svg}
                        style={{
                          background:item.color_scheme['background'],
                          width: "90%",
                          //height: `calc(${item.artboard_size[0]} / ${item.artboard_size[1]} * 90%)`
                        }}
                        dangerouslySetInnerHTML={
                          {__html: item.svg_data.join('').replace(
                            /class="main"/g,
                            `style="fill:${item.color_scheme['mainColor']}"`
                          ).replace(
                            /class="sub"/g,
                            `style="fill:${item.color_scheme['subColor']}"`
                          ).replace(
                            /class="accent"/g,
                            `style="fill:${item.color_scheme['accentColor']}"`
                          )}
                        }
                    />
                    </div>
                    <div>
                      <h3>{item.artboard_name}</h3>
                      <p>Last Modified at
                      {(()=>{
                        const today = new Date(item.last_modified);
                        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                        if (today !== null) {
                            return <span> {date}</span>;
                        }
                        return <span> No Data</span>;
                      })()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))

            })()}
            </ul>
          </div>
        </main>
        <aside>
          <NewsFeed/>
          <div className="message">
            <h2>Some Tip!</h2>
            <p>You can install Isography your desktop and tablet!</p>
            <button>Install App</button>
          </div>
          <ul>
            <li><a href="https://www.isography.app/test">User Guide</a></li>
            <li><a href="https://www.isography.app" target="_blank">Official HP</a></li>
            <li><a href="#">Use of Terms & Lisences</a></li>
          </ul>
          <div className="sendFeedback">
            <a href="#">Send Bug report or Feedback<span>Powered by Google From</span></a>
          </div>
        </aside>
      </div>
    </section>
  );
}

const NewArtboard = () => {
  const [mainColor, setMainColor] = useState("#B21313");
  const [subColor, setSubColor] = useState("#C7B136");
  const [accentColor, setAccentColor] = useState("#111184");
  const [background, setBackground] = useState("#FFFFFF");

  const [showModal, toggleModal] = useState(false);
  const [value, updateValue] = useState("Artboard Name");

  const createNewArtboard = (e) => {
    addNewArtboard(e,value,mainColor,subColor,accentColor,background)
    window.location.reload(false);
  }

  const updateInputValue = (e) => {
    updateValue(e.target.value)
    console.log(value);
  }

  const styles = {
    modalContent: {
      width: '90%',
      maxWidth: '700px',
      position: 'fixed',
      top: '50%',
      left: '50%',
      background: '#fff',
      transform: 'translate(-50%,-50%)',
      zIndex: '100000',
      display: 'flex',
    },
    modalBackground: {
      width: '100%',
      minWidth: '100vw',
      minHeight: '100vh',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      background: 'rgba(0,0,0,0.3)',
      zIndex: '10000',
      display: `${showModal? 'block' : 'none'}`
    }
  }

  return (
    <div>
      <div className="modal-background" style={styles.modalBackground}>
        <div className="modal-content" style={styles.modalContent}>
          <div className="preview">
            <svg style={{background: background,border:'solid 10px #F0F0F0',boxSizing:'border-box'}} className="svg-item" viewBox="0 0 200 200" width="100%" height="240.411">
               <g transform="translate(0,0) scale(1,1)">
                 <path className="main" style={{fill:mainColor}} d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"/>
                 <path className="sub" style={{fill:subColor}} d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z"/>
                 <path className="accent" style={{fill:accentColor}} d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z"/>
               </g>
            </svg>
          </div>
          <div className="setting">
            <p>Artboard Name <input type="text" value={value} onChange={(e) => updateInputValue(e)}/></p>
            <ColorPicker color={mainColor} onChange={(e)=> setMainColor(e.color)}/>
            <ColorPicker color={subColor} onChange={(e)=> setSubColor(e.color)}/>
            <ColorPicker color={accentColor} onChange={(e)=> setAccentColor(e.color)}/>
            <ColorPicker color={background} onChange={(e)=> setBackground(e.color)}/>
            <button onClick={ ()=>toggleModal(false) }>Cancel</button>
            <button onClick={createNewArtboard}>Create!</button>
          </div>
        </div>
      </div>

      <div className="section-new">
        <h2>Create A New Document</h2>
        <div className="template-list">
          <div>
            <ul>
              <li onClick={ ()=>toggleModal(true) }>
                <div style={{width:"80px", height:"60px"}} />
                <p>Custom  <span>__px × __px</span></p>
              </li>
              <li>
                <div style={{width:"60px", height:"60px"}} />
                <p>Square  <span>1.00 : 1.00</span></p>
              </li>
              <li>
                <div style={{width:"85px", height:"60px"}} />
                <p>Twitter Card Ratio  <span>80px × 100px</span></p>
              </li>
              <li>
                <div style={{width:"90px", height:"60px"}} />
                <p>OGP Card Ratio  <span>80px × 100px</span></p>
              </li>
              <li>
                <div style={{width:"50px", height:"60px"}} />
                <p>Portlait  <span>80px × 100px</span></p>
              </li>
              <li>
                <div style={{width:"90px", height:"60px"}} />
                <p>Silver Ratio <span>80px × 100px</span></p>
              </li>
            </ul>
          </div>
          <p className="edit-templates">Edit templates</p>
        </div>
      </div>
    </div>
  )
}

const NewsFeed = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    fade: true,
  };

  return (
    <div className="new-feed">
      <Slider {...settings}>
      <div className="article">
        <img src={img} alt=""/>
        <h3>New Features !! 🎉</h3>
      </div>
      <div className="article">
        <img src={img} alt=""/>
        <h3>New Release !! 🎉</h3>
      </div>
      <div className="article">
        <img src={img} alt=""/>
        <h3>Demo Released !! 🎉</h3>
      </div>
      </Slider>
    </div>
  )
}


export default Home;
