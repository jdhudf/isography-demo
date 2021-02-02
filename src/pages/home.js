import React, { useState }  from 'react';
import { Link } from 'react-router-dom'
import ColorPicker from '../components/ColorPicker.js';


//import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
//  Link
//} from "react-router-dom";

import MenuBar from '../components/menubar.js';
import Navigation from '../components/navigation.js';
import '../styles/home.scss';
import img from '../images/default.png';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  getIsographyData,
  addNewArtboard
 } from '../components/handleLocalstorage'

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
/****
id: [0001,0002,0003,0004,0005,0006]
working: [
  id: id123...,
  name: string,
  created_at: date,
  last_modified: date,
  artboard_size: array,
  svg_data: string,
  color_scheme: array
]

0001.: {,
  name: test 1,
  created_at: date,
  last_modified: date,
  artboard_size: array,
  svg_data: string,
  color_scheme: array
},
0002: {,
  name: string,
  created_at: date,
  last_modified: date,
  artboard_size: array,
  svg_data: string,
  color_scheme: array
}
****/

class Home extends React.Component {
  constructor(props) {
    super(props);
    /*
    this.state = {
      document_id: ['id_1','id_2'],
      id_1 : {
        name: 'Hello World',
        created_at: '2020-01-26',
        last_modified: '2020-01-26',
        artboard_size: [800,600],
        svg_data: [],
        color_scheme: {
          mainColor: '#cccccc',
          subColor: '#000000',
          accentColor: '#FAFAFA',
          background: '#ffffff'
        }
      },
      id_2 : {
        name: 'Hello World 2',
        created_at: '2020-01-27',
        last_modified: '2020-01-27',
        artboard_size: [800,600],
        svg_data: [],
        color_scheme: {
          mainColor: '#cccccc',
          subColor: '#000000',
          accentColor: '#FAFAFA',
          background: '#ffffff'
        }
      },
      history: [],
    }*/
  }

  render() {

    return (
      <section className="section-home">
        <MenuBar />
        <div className="flexbox">
          <Navigation />
          <Dashboard />
        </div>
      </section>
    );

  }
}

const Dashboard = () => {

  const [mainColor, setMainColor] = useState("#B21313");
  const [subColor, setSubColor] = useState("#C7B136");
  const [accentColor, setAccentColor] = useState("#111184");
  const [background, setBackground] = useState("#FFFFFF");

  const [showModal, toggleModal] = useState(false);

  const json = getIsographyData();

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

  const styles = {
    test: {
      background: "#000",
      maxWidth: "300px",
      position: "relative"
    },
    svg: {
      background: "#fff",
    },
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

  const clicked = (e) => {
    json.working = e.currentTarget.getAttribute('data-id');
    localStorage.setItem('isography', JSON.stringify(json));
  }

  const createNewArtboard = (e) => {
    addNewArtboard(e,'new artboard',mainColor,subColor,accentColor,background)
    window.location.reload(false);
  }


  return (
    <section className="section-dashboard">
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
              <p>Artboard Name <input type="text" value="Artboard Name"/></p>
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
          <ul className="template-list">
            <li onClick={ ()=>toggleModal(true) }>
              <div style={{width:"100px", height:"80px"}} />
              <p>Custom  <span>__px × __px</span></p>
            </li>
            <li>
              <div style={{width:"100px", height:"100px"}} />
              <p>Square  <span>100px × 100px</span></p>
            </li>
            <li>
              <div style={{width:"80px", height:"100px"}} />
              <p>Portlait  <span>80px × 100px</span></p>
            </li>
          </ul>
        </div>

        <div className="your-document">

          <h2>Your Documents</h2>
          <ul className="document-list">
            {

              json.data.map(item => (
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
                    <h3>{item.artboard_name}</h3>
                    <p>Last Modified at {item.last_modified}</p>
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>

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

      </div>
    </section>
  );
}
export default Home;
