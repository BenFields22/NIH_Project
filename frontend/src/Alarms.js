import React from 'react';
import './Alarms.css';
import { db } from './firebase';
import { withStyles } from '@material-ui/core/styles';
import NumericInput from 'react-numeric-input';
import ReactDOM from 'react-dom';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
  });

class AlarmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          receiveMessages:1,
          size:0,
          ids: []
          };
      }
    
      async componentDidMount() {
        const snapshot =  await db.getIDs();
        var myids = snapshot.val();
        //console.log(myids);
        var filteredIDs = Object.keys(myids).filter(e => e !== "999");
        var options = [];
        //console.log(filteredIDs);
        for(var i = 0;i< filteredIDs.length;i++){
            //console.log(keys[i]);
            options.push(
                { value: filteredIDs[i], name: filteredIDs[i] }
            )
        }
        this.setState({ids: options});
      }

      updateData = () => {
        
      }

      sendMessage = () => {
        if (window.confirm('Are you sure you want to send this message?')) {
          console.log("Sending Message");
          ReactDOM.render("Message Sent", document.getElementById('MessageStatus'));
          setTimeout(()=>{ReactDOM.render("", document.getElementById('MessageStatus'));},2000);
        } else {
            
        }
      }

      printReceiveOpt = () =>{
        if(this.state.receiveMessages === 1){
          return "Yes";
        }
        else{
          return "No";
        }
      };

      changeReceiveFlag = () => {
        var val = this.state.receiveMessages;
        if(val===1){
          this.setState({receiveMessages:0});
        }
        else{
          this.setState({receiveMessages:1});
        }
      };

      
    
      render() {
        
        const { classes } = this.props;
    
        return (
        <div >
            <div className={classes.appBarSpacer} />
                <label id="PatientLabel">Patient ID </label>
                <select id="PatientNumber" ref = {(input)=> this.patient = input}>
                    {this.state.ids.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                </select>  <br/>
                <button className="myButton" onClick={this.updateData}  >
                    Load
                </button>
                <button className="myButton" onClick={this.updateData}  >
                    Update
                </button>
              <hr/>
              Receive Messages: {this.printReceiveOpt()} <br/>
              <button className="myButton" onClick={this.changeReceiveFlag}  >
                    Change
              </button>
              <hr/>
            <h2>Time of Application</h2>
            <input
              type="time" value="18:00:00"
            />
            <br/>
            <h2>Standard Message</h2>
            <textarea cols="50" rows="5">
              Time to apply your eye drops.
            </textarea>
            <br/>
            <hr/>
            <h2>Reminder Messages</h2>
            <div>
              
              Minutes after Application for First Reminder<br/>
              <NumericInput min={0}  value={10}/><br/><br/>
              Minutes after Application for Second Reminder<br/>
              <NumericInput min={0}  value={30}/>
            </div><br/>
            <textarea cols="50" rows="5">
              Looks like you still need to use your eye drops.
            </textarea>
            <br/>
            <hr/>
            <h2>Custom Message</h2>
            <textarea cols="50" rows="5">
              
            </textarea>
            <br/>
            <button className="myButton" onClick={this.sendMessage}>Send</button>
            <button className="myButton" onClick={this.sendMessage}>Send All</button>
            <div id="MessageStatus"></div>

        </div>
        );
      }
    }

export default withStyles(styles)(AlarmPage);