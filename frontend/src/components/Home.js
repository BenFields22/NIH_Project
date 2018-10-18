import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./home.css";

import withAuthorization from './withAuthorization';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    var test = localStorage.getItem('user');
    //console.log(test)
    ReactDOM.render(<h1>Welcome {test}</h1>, document.getElementById('Welcome'));

  }

  render() {
    
    return (
      <div className="home">
        <div id="Welcome"></div>
        <hr/>
        <div id="WorkSpace">

        </div>
      </div>
    );
  }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);