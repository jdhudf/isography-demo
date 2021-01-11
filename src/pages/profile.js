import React from 'react';
import { Redirect } from 'react-router-dom'

//import {
//  BrowserRouter as Router,
//  Switch,
//  Route,
//  Link
//} from "react-router-dom";

import '../styles/atelier.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: []
    };
  }
  componentDidMount() {
    fetch("/profile")
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

  render() {
    const { error, isLoaded, users } = this.state;
    if (error) {
      return <section className="section-artboard section-bottom">Error: {error.message}<Redirect to="/login" /></section>;

    } else if (!isLoaded) {
      return <section className="section-artboard section-bottom">Loading...</section>;
    } else {
      return (
        <section className="section-artboard section-bottom">
        {users.map(item => (
          <li key={item.id}>
            {item.username} {item.id}
          </li>
        ))}
        <svg width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
        </svg>
        </section>
      );
    }
  }
}

export default Profile;
