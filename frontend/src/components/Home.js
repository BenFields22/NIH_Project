import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./home.css";
import ReactTable from "react-table";
import 'react-table/react-table.css'
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
    const data = [{
      Date: '11-25-2018',
      Time: '10:10:10',
    },
    {
      Date: '11-25-2018',
      Time: '13:10:10',
    },
    {
      Date: '11-25-2018',
      Time: '19:10:10',
    },
    {
      Date: '11-26-2018',
      Time: '10:10:10',
    },
    {
      Date: '11-26-2018',
      Time: '13:10:10',
    },
    {
      Date: '11-26-2018',
      Time: '18:10:10',
    },
    {
      Date: '11-27-2018',
      Time: '10:10:10',
    },
    {
      Date: '11-27-2018',
      Time: '14:10:10',
    }
    ]
  
    const columns = [{
      Header: 'Date',
      accessor: 'Date' // String-based value accessors!
    }, {
      Header: 'TimeStamp',
      accessor: 'Time',
    }]
  
    
    
    return (
      <div className="home">
        <div id="Welcome"></div>
        <hr/>
        <div id="WorkSpace">
        <div className="left">
          <div className="options">
            <strong>Group</strong>     
            <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <strong>Patient</strong>     
            <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <strong>TimeOfDay</strong>     
            <select>
              <option value="1">9:00am</option>
              <option value="2">1:00pm</option>
              <option value="3">5:00pm</option>
              <option value="4">9:00pm</option>
            </select>
          </div>
          
          <div className="tableSpace">
            <ReactTable
              data={data}
              columns={columns}
              defaultPageSize= {20}
              showPagination= {false}
            />
          </div>
        </div>
        <div className="right">
          <button>Send Message</button><br/>
          <textarea rows={20} cols={50}></textarea>
          <br/>
          <br/>
          <button>Set Alarm</button><br/>
          <strong>Alarm Type</strong>     
            <select>
              <option value="1">Take Medication</option>
            </select>
            <strong>Time</strong>  
            <input type="time"></input>
        </div>
        
        
        </div>
      </div>
    );
  }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);