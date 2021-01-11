import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigation.scss';

class Navigation extends React.Component {
  render() {

    return (
      <section className="section-navigation section-bottom">
        <nav>
          <ul>
            <li>
              <NavLink to="/home" activeClassName="selected">Home</NavLink>
            </li>
            <li>
              <NavLink to="/setting" activeClassName="selected">Setting</NavLink>
            </li>
          </ul>
        </nav>
      </section>
    );

}
}

export default Navigation;
