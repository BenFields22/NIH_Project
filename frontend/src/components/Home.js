import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./home.css";
import ReactTable from "react-table";
//import image from '../img/Picture1.png';
import 'react-table/react-table.css';
import { db } from '../firebase';
import withAuthorization from './withAuthorization';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      size:0,
      ids: [
        
      ],
      data: [],
      stamps: null
    };
  }

  componentDidMount() {
    var test = localStorage.getItem('user');
    db.getIDs().then(snapshot =>{
      this.setState({ users: snapshot.val() });
      var mywords = this.state.users;
      var keys = Object.keys(mywords);
      this.setState({size:keys.length})
      //console.log(keys);
      for(var i = 0;i< keys.length;i++){
        //console.log(keys[i]);
        this.setState({ids: this.state.ids.concat(
          [{ value: keys[i], name: keys[i] }]
          )
        });
      }
    });
    ReactDOM.render(<h1>Hi, {test}</h1>, document.getElementById('Welcome'));

  }

  updateData = (e)=>{
    //console.log("Updating value");
    //console.log("value is "+this.patient.value);
    db.getStamps(this.patient.value).then(snapshot =>{
      this.setState({ stamps: snapshot.val() });
      //console.log(snapshot.val());
      var mystamps = this.state.stamps;
      if(mystamps === null){
        this.setState({data:[]});
        return;
      }
      
      var keys = Object.keys(mystamps);
      this.setState({size:keys.length})
      //console.log(keys);
      for(var i = 0;i< keys.length;i++){
        //console.log(keys[i]);
        //console.log(mystamps[keys[i]].date);
        ///console.log(mystamps[keys[i]].timeOfDay);
        this.setState({data: this.state.data.concat(
          [{ Date: mystamps[keys[i]].date, Time: mystamps[keys[i]].timeOfDay }]
          )
        });
      }
    });

  }

  render() {
    
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
          <div className="DataOptions">
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>Patient ID</strong> 
                  </td>
                  <td>
                    <select id="PatientNumber" ref = {(input)=> this.patient = input}>
                    {this.state.ids.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                    </select>              
                  </td> 
                </tr>             
              </tbody>
            </table>
            <button onClick={this.updateData}>Load</button>
                
          </div>
          
          <div className="tableSpace">
            <ReactTable
              data={this.state.data}
              columns={columns}
              defaultPageSize= {10}
              showPagination= {true}
            />
          </div>
        </div>
        </div>
      </div>
    );
  }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);

/*
<div className="right">
          <img src={image} alt="Graph" ></img><br/>
          <button>Send Message</button><br/>
          <textarea rows={10} cols={75}></textarea>
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
*/