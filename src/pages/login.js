import React from 'react';
import '../styles/login.scss';
import { Link } from 'react-router-dom';

class Login extends React.Component {
  render() {
    return (
      <section className="section-login">
        <h1>Isography</h1>
        <form action="/login" method="post">
          <div>
            <input id="ename" placeholder="E-mail" type="email" name="email"/>
          </div>
          <div>
            <input id="password" placeholder="Password" type="password" name="password"/>
          </div>
          <div>
            <input type="submit" value="Log In"/>
          </div>
        </form>
        <p><Link to="/signup">Create Account?</Link></p>
      </section>
    );

  }
}

export default Login;
