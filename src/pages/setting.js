import React from 'react';
import { Redirect } from 'react-router-dom'

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

import icon from '../images/logo.png';
import Template from "../template";
import ColorPicker from '../components/ColorPicker.js';
import ColorSchemes from '../components/colorSchemes.js';

//import GallaryPanel from '../components/gallarypanel.js';
//import ToolsPanel from '../components/toolspanel.js';
//import Artboard from '../components/artboard.js';

class Setting extends React.Component {

  // Start - Get API Json

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: []
    };
  }
  componentDidMount() {
    fetch("/api-of-user-json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            users: result.users
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  // END - Get API Json

  render() {
    const { error, isLoaded, users } = this.state;
    if (error) {
      return <section className="section-home">Error: {error.message}<Redirect to="/login" /></section>;

    } else if (!isLoaded) {
      return <section className="section-home">Loading...</section>;
    } else {
      return (
        <section className="section-home">
          <MenuBar />
          <div className="flexbox">
          <Navigation />
          <Tabs>
            <TabList>
              <Tab>Color Schemes</Tab>
              <Tab>Templates</Tab>
              <Tab>User Setting</Tab>
            </TabList>

            <TabPanel>
              <ColorSchemes />
            </TabPanel>
            <TabPanel>
              <TemplateSetting />
            </TabPanel>
            <TabPanel>
            <div className="setion-usersetting">
              <img className="icon" src={icon} alt="Icon" />
              {users.map(item => (
                <li key={item.id}>
                  <p> Username - {item.first_name} {item.last_name}</p>
                  <p> E-mail - {item.email}</p>
                </li>
              ))}
              <form action="/updateyourname" method="post">
                <div>
                  <input id="firstname" placeholder="First Name" type="text" name="firstname"/>
                </div>
                <div>
                  <input id="lastname" placeholder="Last Name" type="text" name="lastname"/>
                </div>
                <div>
                  <input type="submit" value="Update"/>
                </div>
              </form>
              <h2>Plan & Billing</h2>
              <h2>Account</h2>
              <p>Delete your Account</p>
            </div>
            </TabPanel>
         </Tabs>
          </div>
        </section>
      );
    }
  }
}

const TemplateSetting = () => {

  return (
    <div className="section-template">
      <div className="create-template">
        <h2>Create a new template</h2>
        <input type="text" placeholder="template name"/><br/>
        <input type="number" placeholder="width"/><br/>
        <input type="number" placeholder="height"/>
        <p>Ratio - </p>
        <input type="submit" value="Create"/>
      </div>
      <div className="template-list">
      {Template.map((data, i) => {
        const ratio = {
          width: 100*data.ratio[0],
          height: 100*data.ratio[1],
          display: 'block',
          border: 'solid 1px #000'
        }
        return (
          <div className="template-item" key={i}>
            <p className="template-title">{data.title}</p>
            <p className="template-ratio">{data.ratio[0]} × {data.ratio[1]}</p>
            <span style={ratio}></span>
          </div>
        )
      })}
      </div>
    </div>
  )
}




export default Setting;
