import React from 'react';
import "./Account.css";
import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';

const AccountPage = () =>
  <AuthUserContext.Consumer>
    {authUser =>
      <div className="Account">
        <h1>Account: {authUser.email}</h1><br/><hr/>
        Change Password through Email<br/>
        <PasswordForgetForm /><br/>
        Change Password<br/>
        <PasswordChangeForm />
      </div>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);