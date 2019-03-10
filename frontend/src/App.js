import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import SignIn from './signin';

import SignUpPage from './SignUp';
import AccountPage from './Account';
import PasswordForgetPage from './PasswordForget';
import SignUpDoc from './SignUpDoc';
import UserGuide from './userGuide';



import Dashboard from './Dashboard';

import * as routes from './routes';
import withAuthentication from './withAuthentication';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Route exact path={routes.SIGN_IN} component={SignIn} />
        <Route exact path={routes.SIGN_UP_DOC} component={SignUpDoc} />
        <Route exact path={routes.HOME} component={Dashboard} />
        <Route exact path={routes.SIGN_UP} component={SignUpPage} />
        <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route exact path={routes.ACCOUNT} component={AccountPage} />
        <Route exact path={routes.USER_GUIDE} component={UserGuide} />
      </div>
    </Router>
    );
  }
}

export default withAuthentication(App);
