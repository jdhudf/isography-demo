import React from 'react';
import { Link } from 'react-router-dom'
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
  const state = {
    document_id: ['id_1','id_2'],
    id_1 : {
      name: 'Hello World',
      created_at: '2020-01-26',
      last_modified: '2020-01-26',
      artboard_size: [800,600],
      svg_data: ['<g transform="translate(50,50) scale(1,1)" class="sub" style="cursor:move"><circle cx="0" cy="0" r="50"></circle></g>',
      '<g transform="translate(100,250) scale(2,2)" class="main" style="cursor:move" border="solid 3px #000000"><circle cx="30" cy="30" r="20"></circle></g>',
      '<g transform="translate(50,150) scale(1,1)" class="accent" style="cursor:move"><circle cx="10" cy="10" r="15"></circle><circle cx="20" cy="20" r="10"></circle></g>'],
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
  }

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
    }
  }

  return (
    <section className="section-dashboard">
      <div>

        <div className="section-new">
          <h2>Create A New Document</h2>
          <ul className="template-list">
            <li>
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
            <li>
              <Link to="/">
              <div style={styles.test}>
                <svg
                    version="1.1"
                    width="100%"
                    height="auto"
                    viewBox="0 0 600 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.svg}
                    dangerouslySetInnerHTML={{__html: state.id_1['svg_data'].join('') }}
                >
                </svg>
              </div>
              <h3>{state.id_1['name']}</h3>
              <p>Last Modified at {state.id_1['last_modified']}</p>
              </Link>
            </li>
            <li>
             <Link to="/">
              <div style={styles.test}>
                <svg
                    version="1.1"
                    width="100%"
                    height="auto"
                    viewBox="0 0 600 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.svg}
                    dangerouslySetInnerHTML={{__html: state.id_2['svg_data'].join('') }}
                >
                </svg>
              </div>
              <h3>{state.id_2['name']}</h3>
              <p>Last Modified at {state.id_2['last_modified']}</p>
              </Link>
            </li>
            <li>
            <Link to="/">
              <div style={styles.test}>
                <svg
                    version="1.1"
                    width="100%"
                    height="auto"
                    viewBox="0 0 600 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.svg}
                    dangerouslySetInnerHTML={{__html: state.id_2['svg_data'].join('') }}
                >
                </svg>
              </div>
              <h3>{state.id_2['name']}</h3>
              <p>Last Modified at {state.id_2['last_modified']}</p>
              </Link>
            </li>
            <li>
            <Link to="/">
              <div style={styles.test}>
                <svg
                    version="1.1"
                    width="100%"
                    height="auto"
                    viewBox="0 0 600 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={styles.svg}
                    dangerouslySetInnerHTML={{__html: state.id_2['svg_data'].join('') }}
                >
                </svg>
              </div>
              <h3>{state.id_2['name']}</h3>
              <p>Last Modified at {state.id_2['last_modified']}</p>
              </Link>
            </li>
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
