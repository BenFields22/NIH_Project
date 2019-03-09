import React, { Component } from 'react';
import { withRouter,} from 'react-router-dom';
import { auth, db } from './firebase';
import "./SignUp.css";


const SignUpDocPage = ({ history }) =>
  <div className="signCont">
    <SignUpDocForm history={history} />
  </div>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  MACid: '',
  phone: '',
  passPhrase: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpDocForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne
    } = this.state;


    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUserDoc(authUser.user.uid, username, email,999,0,1)
          .then(() => {
            alert("Admin Account Created");
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
      passPhrase,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''||
      passPhrase !== "supersecret"
      ;

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
        <h2>Secret Phrase</h2>
        <input
          value={passPhrase}
          onChange={event => this.setState(byPropKey('passPhrase', event.target.value))}
          type="password"
          placeholder="Enter Phrase"
        />
        <br/>
        
        <br/>
       <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

export default withRouter(SignUpDocPage);

export {
  SignUpDocForm
};