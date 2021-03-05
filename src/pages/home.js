import React, { useState }  from 'react';
import { Link } from 'react-router-dom'
import ColorPicker from '../components/ColorPicker.js';

import MenuBar from '../components/menubar.js';

import '../styles/home.scss';
import img from '../images/default.png';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGripHorizontal,
  faList,
} from '@fortawesome/free-solid-svg-icons'

import {
  addNewArtboard
} from '../components/handleLocalstorage'

import { useSelector, useDispatch, connect } from 'react-redux'
import { actions } from '../redux/actions';

const selectHex = state => state.json
const selectArtboard = state => state.artboards
const selectTemplate = state => state.templates

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
    }
  }

  render() {

    const { json,templates } = this.props

    const darkmode = json.darkmode

    return (
      <section className={darkmode? "section-home dark-mode": "section-home"}>
        <MenuBar />
        <Dashboard />
      </section>
    );

  }
}

const Dashboard = () => {

  //const [showModal, toggleModal] = useState(false);
  const [documentList, toggleDocumentList] = useState(false);

  const json = useSelector(selectArtboard).artboards//getIsographyData();

  const styles = {
    test: {
      background: "#000",
      maxWidth: "300px",
      position: "relative"
    },
    /*box: {
      background: "#000",
      posotion: "fixed",
      top: "10px",
      right: "10px",
      color: "#fff",
      display: showModal? "block":"none"
    }*/
  }

  const clicked = (e) => {
    json.working = parseInt(e.currentTarget.getAttribute('data-id'));

    dispatch({type: 'working/switch', payload: parseInt(e.currentTarget.getAttribute('data-id'))})
  }

  //const color = useSelector(selectHex)
  const dispatch = useDispatch()

  //const today = new Date();
  //const dated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  return (
    <section className="section-dashboard">
      <div className="flexbox">
        <main>
          <NewArtboard/>
          <div className="your-document">
            {/*<div style={styles.box}>
              <ul>
                <li>Open</li>
                <li>Duplicate</li>
                <li>Rename</li>
                <li>Delete</li>
              </ul>
            </div>*/}
            <h2>Your Documents</h2>
            <ul className="toggle-document-list">
              <li onClick={()=>toggleDocumentList(false)} class={documentList?null:"display"}><FontAwesomeIcon icon={faGripHorizontal} /></li>
              <li onClick={()=>toggleDocumentList(true)} class={documentList?"display":null}><FontAwesomeIcon icon={faList} /></li>
            </ul>
            <ul className={documentList?"document-list":"document-list-column"}>
            {(()=>{

              const arranged = json.sort(function(a, b){
                //return new Date(a.last_modified) - new Date(b.last_modified)
                return new Date(b.last_modified) - new Date(a.last_modified)
              })

              return arranged.map(item => (
                <li>
                  <Link onClick={clicked} to="/" data-id={item.artboard_id}>
                    <div className="thumb" style={styles.test}>
                    {/* x=y*item.artboard_size[0]/item.artboard_size[1] */}
                    {/* y=x*item.artboard_size[1]/item.artboard_size[0] */}
                    <svg
                        version="1.1"
                        viewBox={`0 0 ${item.canvas.artboard_size[0]} ${item.canvas.artboard_size[1]}`}
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          background:item.canvas.color_scheme['background'],
                          width: "90%",
                          //height: `calc(${item.artboard_size[0]} / ${item.artboard_size[1]} * 90%)`
                        }}
                        dangerouslySetInnerHTML={
                          {__html: item.canvas.svg_data.join('').replace(
                            /class="main"/g,
                            `style="fill:${item.canvas.color_scheme['mainColor']}"`
                          ).replace(
                            /class="sub"/g,
                            `style="fill:${item.canvas.color_scheme['subColor']}"`
                          ).replace(
                            /class="accent"/g,
                            `style="fill:${item.canvas.color_scheme['accentColor']}"`
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
          {/*<div className="message">
            <h2>Some Tip!</h2>
            <p>You can install Isography your desktop and tablet!</p>
            <button>Install App</button>
          </div>*/}
          <ul className="url">
            <li><a href="https://www.isography.app/test" target="_blank" rel="noreferrer">User Guide</a></li>
            <li><a href="https://www.isography.app" target="_blank" rel="noreferrer">Official HP</a></li>
            <li><a href="https://www.isography.app/lisence" target="_blank" rel="noreferrer">Use of Terms & Lisences</a></li>
          </ul>
          <div className="sendFeedback">
            <a href="https://forms.gle/pNbptjqrGctWzJS77" target="_blank" rel="noreferrer">Send Bug report or Feedback<span>Powered by Google From</span></a>
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
  const [width, updateWidth] = useState("800");
  const [height, updateHeight] = useState("600");
  const [ratioName, updateRatioName] = useState("");

  const json = useSelector(selectArtboard).artboards

  const dispatch = useDispatch()

  const createNewArtboard = (e) => {

    console.log("test")

    const today = new Date();

    const newData = {
      artboard_id: json.length + 1,
      artboard_name: value,
      created_at: today,
      last_modified: today,
      canvas: {
        artboard_size: [width,height],
        svg_data: [],
        color_scheme: {
          mainColor: mainColor,
          subColor: subColor,
          accentColor: accentColor,
          background: background
        }
      }
    }

    json.push(newData)

    dispatch({type: 'add/artboard', payload: json})

    toggleModal(false)

  }

  const updateInputValue = (e) => {
    updateValue(e.target.value)
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
      background: 'rgba(180,180,180,0.5)',
      zIndex: '10000',
      display: `${showModal? 'block' : 'none'}`
    }
  }

  const templatesJson = useSelector(selectTemplate).templates


  return (
    <div>
      <div className="modal-background" style={styles.modalBackground}>
        <div className="modal-content" style={styles.modalContent}>
          <div className="preview">
            <h2>Preview</h2>
            <svg style={{background: background}} className="svg-item" viewBox="0 0 200 200" width="100%" height="240.411">
               <g transform="translate(0,0) scale(1,1)">
                 <path className="main" style={{fill:mainColor}} d="M168.68,59.078l-70.627,40.776l-0,81.553l70.627,-40.776l-0,-81.553Z"/>
                 <path className="sub" style={{fill:subColor}} d="M98.043,18.295l-70.627,40.777l70.637,40.782l70.627,-40.777l-70.637,-40.782Z"/>
                 <path className="accent" style={{fill:accentColor}} d="M98.053,99.854l-70.66,-40.795l0,81.548l70.66,40.796l-0,-81.549Z"/>
               </g>
            </svg>
          </div>
          <div className="setting">
            <h2>Artboard Name</h2>
            <p><input type="text" value={value} onChange={(e) => updateInputValue(e)}/></p>
            <h2>Template <span>{ratioName}</span></h2>
            <label htmlFor="">Width : <input type="number" min="300" max="3000" value={width} onChange={(e)=>updateWidth(e.target.value)}/></label>
            <label htmlFor="">Height : <input type="number" min="300" max="3000" value={height} onChange={(e)=>updateHeight(e.target.value)}/></label>
            <h2>Color Scheme</h2>
            <ColorPicker color={mainColor} onChange={(e)=> setMainColor(e.color)}/>
            <ColorPicker color={subColor} onChange={(e)=> setSubColor(e.color)}/>
            <ColorPicker color={accentColor} onChange={(e)=> setAccentColor(e.color)}/>
            <ColorPicker color={background} onChange={(e)=> setBackground(e.color)}/>
            <div className="flex">
              <button onClick={ ()=>toggleModal(false) }>Cancel</button>
              <button onClick={createNewArtboard}>Create!</button>
            </div>
          </div>
        </div>
      </div>
      <div className="section-new">
        <h2>Create A New Document</h2>
        <div className="template-list">
          <div>
            <ul>
              <li onClick={ ()=>{
                toggleModal(true)
                updateWidth(800)
                updateHeight(600)
                updateRatioName("800:600")
              } }>
                <div style={{width:"80px", height:"60px"}} />
                <p>Custom  <span>__px × __px</span></p>
              </li>
              {templatesJson.map(item => (
                <li onClick={ ()=>{
                  toggleModal(true)
                  updateWidth(item.ratio[0]*500)
                  updateHeight(item.ratio[1]*500)
                  updateRatioName(item.name)
                } }>
                  {(()=>{

                    // item.ratio[0] : item.ratio[1] = x : y
                    // item.ratio[0] * y = item.ratio[1] * x

                    const x =  item.ratio[0] / item.ratio[1]
                    const y =  item.ratio[1] / item.ratio[0]

                    if (item.ratio[0]>=item.ratio[1]) {
                      return <div style={{
                                  width: "75px",
                                  height:`${y*75}px`,
                                  margin: `${(75 - y*75)/2}px auto`
                             }}/>//<p>1:{y}</p>
                    } else {
                      return <div style={{
                                  width: `${x*75}px`,
                                  height: "75px"
                             }}/>//<p>{x}:1</p>
                    }
                  })()}
                  {/*<div style={{
                    width:`${item.ratio[0]*80}px`,
                    height:`${item.ratio[1]*80}px`
                  }}/>*/}
                  <p>{item.name} <span>{item.ratio[0]} : {item.ratio[1]}</span></p>
                </li>
              ))}
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

const mapStateToProps = state => ({
  json: state.json,
  templates: state.templates,
  artboards: state.artboard,
})

export default connect(
  mapStateToProps,
  dispatch => ({
    swicthWorking: value => dispatch(actions.swicthWorking(value)),
   })
)(Home)
