import React, { Component } from 'react';
import { Link ,withRouter,} from 'react-router-dom';
import { auth, db } from './firebase';
import "./SignUp.css";

import * as routes from './routes';

const SignUpPage = ({ history }) =>
  <div className="signCont">
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  MACid: '',
  phone: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
      MACid,
      phone
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email,MACid,phone,2)
          .then(() => {
            localStorage.setItem('user', username);
            localStorage.setItem('doctor', 2);
            this.setState({ ...INITIAL_STATE });
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      MACid,
      phone,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      MACid === '' ||
      phone === '';

    return (
      <form onSubmit={this.onSubmit}>
        <h2>Full Name</h2>
        <input
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))}
          type="text"
          placeholder="First Last"
        />
        <br/>
        <h2>Email Address</h2>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <br/>
        <h2>Password</h2>
        <input
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <br/>
        <h2>Confirm Password</h2>
        <input
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        />
        <br/>
        <h2>Assigned MAC ID</h2>
        <input
          value={MACid}
          onChange={event => this.setState(byPropKey('MACid', event.target.value))}
          type="text"
          placeholder="MAC ID"
        />
        <br/>
        <h2>Phone Number</h2>
        <input
          value={phone}
          onChange={event => this.setState(byPropKey('phone', event.target.value))}
          type="text"
          placeholder="Phone Number"
        />
        <br/>
       <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link className="signup" to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};