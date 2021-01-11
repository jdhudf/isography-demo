import React from 'react';
import { Redirect } from 'react-router-dom'

//import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
//  Link
//} from "react-router-dom";

import ColorPicker from '../components/ColorPicker.js';

class ColorSchemes extends React.Component {

  // Start - Get API Json

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: [],
      main: '#000000',
      sub: '#555555',
      accent: '#999999',
      color_schemes: [],
    };
  }

  componentDidMount() {
    fetch("/api-of-user-json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            users: result.users,
            color_schemes: this.state.users.map(item => (item.color_schemes)),
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

  eventhandlerMain = data => {
    this.setState({main:data.color});
  }
  eventhandlerSub = data => {
    this.setState({sub:data.color});
  }
  eventhandlerAccent = data => {
    this.setState({accent:data.color});
  }

  eventhandler = (data,key) => {
    this.setState({accent:data.color});
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
        <div className="section-color-scheme">
          <p>{/*this.state.color_schemes*/}</p>
          {/*this.state.users.map(item => (item.color_schemes))*/}
          <div className="create-color-scheme">
            <h2>Create a new color scheme</h2>
            <form action="/createcolorschemes" method="post">
              <div>
                <input type="text" name="name" placeholder="Color Scheme Name" required/>
                <br/>
                <ColorPicker color={this.state.main} onChange={this.eventhandlerMain}/>
                <ColorPicker color={this.state.sub} onChange={this.eventhandlerSub}/>
                <ColorPicker color={this.state.accent} onChange={this.eventhandlerAccent}/>
                <input type="hidden" name="main" value={this.state.main}/>
                <input type="hidden" name="sub" value={this.state.sub}/>
                <input type="hidden" name="accent" value={this.state.accent}/>
              </div>
              <input type="submit" value="Create"/>
            </form>
          </div>

          <div className="color-scheme-list">
            <div>
              {users.map(item => (
                <div className="color-scheme-item">
                <ul className="color-scheme">
                {JSON.parse(item.color_schemes).map((c,key) => (
                  <li>
                    <p>{c.name}</p>
                    <span className="pallet" style={{'background': c.main}}></span>
                    <span className="pallet" style={{'background': c.sub}}></span>
                    <span className="pallet" style={{'background': c.accent}}></span>

                    {/* Update From */}
                    <form action="/updatecolorschemes" method="post">
                      <div>
                        <input type="text" name="name" placeholder="Color Scheme Name" required/>
                        <br/>
                        <ColorPicker color={this.state.main} onChange={this.eventhandler}/>
                        <ColorPicker color={this.state.sub} onChange={this.eventhandlerSub}/>
                        <ColorPicker color={this.state.accent} onChange={this.eventhandlerAccent}/>
                        <input type="hidden" name="main" value={this.state.main}/>
                        <input type="hidden" name="sub" value={this.state.sub}/>
                        <input type="hidden" name="accent" value={this.state.accent}/>
                      </div>
                      <button type="submit" name="id" value={key}>Update</button>
                    </form>

                    {/* Delete From */}
                    <form action="/deletecolorscheme" method="post">
                      <button type="submit" name="name" value={key}>Delete</button>
                    </form>
                  </li>
                ))}
                </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ColorSchemes;
