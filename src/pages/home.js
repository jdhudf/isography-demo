import React from 'react';
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
      zIndex: '10000'
    }
  }

  const clicked = (e) => {
    json.working = e.currentTarget.getAttribute('data-id');
    localStorage.setItem('isography', JSON.stringify(json));
  }

  const createNewArtboard = (e) => {
    addNewArtboard(e,'new artboard','#272727','#d9d7e1','#a59fcc','#514C6E')
    window.location.reload(false);
  }


  return (
    <section className="section-dashboard">
      <div>
        <div className="modal-background" style={styles.modalBackground}>
          <div className="modal-content" style={styles.modalContent}>
            <p>Artboard Name <input type="text" value="Artboard Name"/></p>
            <ColorPicker color="#000000"/>
            <ColorPicker color="#000000"/>
            <ColorPicker color="#000000"/>
            <button>Cancel</button><button>Create!</button>
          </div>
        </div>

        <div className="section-new">
          <h2>Create A New Document</h2>
          <ul className="template-list">
            <li onClick={createNewArtboard}>
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
