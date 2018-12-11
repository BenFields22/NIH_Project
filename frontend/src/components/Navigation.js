import React from 'react';
import { Link } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import "./navigation.css";

const Navigation = () =>
  <AuthUserContext.Consumer>
    {authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>

const NavigationAuth = () =>
  <ul className="nav">
  <li><Link to={routes.HOME}>Data</Link></li>
  <li><Link to={routes.CALENDAR}>Calendar</Link></li>
  <li><Link to={routes.ACCOUNT}>Account</Link></li>
  <li className="logout"><SignOutButton/></li>
  </ul>

  

const NavigationNonAuth = () =>
  <ul className="navOne">
  <li><Link to={routes.SIGN_IN}>SignIn</Link></li>
  </ul>

export default Navigation;