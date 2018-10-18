import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./signIn.css";

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth} from '../firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
  <div className="SignIn">
    <div className="cont">
      <h1>SignIn</h1>
      <SignInForm history={history} />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.updateProc = this.props.updateProc;

    this.state = { 
      ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        const db = firebase.database();
       var ref = db.ref('users');
       ref.orderByChild('email').equalTo(email).on("child_added", function(snapshot) {
        console.log(snapshot.val().username);
        var name = snapshot.val().username;
        localStorage.setItem('user', name);
        history.push(routes.HOME);
      });
        
        
        
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form className="InForm" onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="email"
          placeholder="Email Address"
        /><br/>
        <input
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        /><br/>
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};