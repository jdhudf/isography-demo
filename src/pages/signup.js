import React from 'react';
import '../styles/login.scss';
import { Link } from 'react-router-dom';

class SignUp extends React.Component {
  render() {
    return (
      <section className="section-login">
        <h1>Sign Up</h1>
        <form action="/signup" method="post">
          <div id="username">
            <input id="firstname" placeholder="First Name" type="text" name="firstname" required/>
            <input id="lastname" placeholder="Last Name" type="text" name="lastname" required/>
          </div>
          <div>
            <input id="email" placeholder="E-mail" type="email" name="email" required/>
          </div>
          <div>
            <input id="password" placeholder="Password" type="password" name="password" required/>
          </div>
          <div>
            <input id="password" placeholder="Password(Comfirm)" type="password" name="passwordcomfirm" required/>
          </div>
          <div>
            <input type="submit" value="Sign Up"/>
          </div>
        </form>
        <p><Link to="/login">Already have Account?</Link></p>
      </section>
    );

}
}

export default SignUp;
