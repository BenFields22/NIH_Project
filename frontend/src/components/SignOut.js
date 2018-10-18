import React, { Component } from 'react';

import { auth } from '../firebase';
import {
  withRouter
} from 'react-router-dom';

class SignOutButton extends Component {
  handleSubmit = () => {
      auth.doSignOut();
      localStorage.removeItem("user");
      //this.props.history.push(routes.LANDING)
  }

  render(){
    return (
  <button
    type="button"
    onClick={
      this.handleSubmit
    }
  >
    LogOut
  </button>
    )
  }
}
export default withRouter(SignOutButton);