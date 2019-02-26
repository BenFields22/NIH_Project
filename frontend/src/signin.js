import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
//import Avatar from '@material-ui/core/Avatar';
//import PropTypes from 'prop-types';
import LockIcon from '@material-ui/icons/LockOutlined';
import "./signin.css";

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth} from './firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import * as routes from './routes';



const SignInPage = ({ history }) =>
  <div className="SignIn">
    <div className="cont">
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
        //console.log(snapshot.val().username);
        //console.log(snapshot.val().doctor);
        var name = snapshot.val().username;
        var doctor = snapshot.val().doctor;
        localStorage.setItem('user', name);
        localStorage.setItem('doctor', doctor);
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
        <div className="lock">
          <LockIcon />
        </div>
        <h3 className="Title">Sign in</h3>
        <h3>Email</h3>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="email"
          placeholder="Email Address"
        /><br/>
        <h3>Password</h3>
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