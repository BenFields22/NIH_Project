import React from 'react';
import './Alarms.css';
import { db } from './firebase';
import { withStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
  });
  const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });

class AlarmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          receiveMessages:1,
          size:0,
          ids: [],
          time: '',
          firstInterval:0,
          secondInterval:0,
          MainMessage:'N/A',
          ReminderMessage:'N/A',
          status:''
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

      updateData = async () => {
        var snapshot = await db.getUser(this.patient.value);
        var user = snapshot.val();
        //console.log(user);
        //console.log(user.doctor);
        //console.log(user.mainMessage);
        //console.log(user.secondMessage);
        //console.log(user.firstReminder);
        //console.log(user.secondReminder);
        //console.log(user.timeOfApplication);
        //console.log(user.receiveMessages);

        this.setState({
          MainMessage: user.mainMessage,
          firstInterval:user.firstReminder,
          secondInterval:user.secondReminder,
          ReminderMessage:user.secondMessage,
          time:user.timeOfApplication,
          receiveMessages: user.receiveMessages,
          status:'Data Loaded'
        });
        setTimeout(()=>{
          this.setState({
            status:""
          });
        },2000);
      }

      updateDataOnDB = () => {
        db.UpdateContentOfUser(this.patient.value,
          this.state.receiveMessages,
          this.state.MainMessage,
          this.state.ReminderMessage,
          this.state.time,
          this.state.firstInterval,
          this.state.secondInterval);
          //console.log("updated");
          this.setState({
            status:"Content Updated"
          });
          setTimeout(()=>{
            this.setState({
              status:""
            });
          },2000);
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
                <button className="myButton" onClick={this.updateDataOnDB}  >
                    Update
                </button>
                <div>{this.state.status}</div>
              <hr/>
              Receive Messages: {this.printReceiveOpt()} <br/>
              <button className="myButton" onClick={this.changeReceiveFlag}  >
                    Change
              </button>
              <hr/>
            <h2>Time of Application</h2>
            <TextField
              id="time"
              type="time"
              value={this.state.time}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event => this.setState(byPropKey('time', event.target.value))}
              inputProps={{
                step: 100, 
              }}
            />
            <br/>
            <h2>Standard Message</h2>
            <textarea cols="50" rows="5" value={this.state.MainMessage} onChange={event => this.setState(byPropKey('MainMessage', event.target.value))}>
            </textarea>
            <br/>
            <hr/>
            <h2>Reminder Messages</h2>
            <div>
              
              Minutes after Application for First Reminder<br/>
              <input type="number" name="quantity" min={0} value={this.state.firstInterval} onChange={event => this.setState(byPropKey('firstInterval', event.target.value))}/>
              <br/><br/>
              Minutes after Application for Second Reminder<br/>
              <input type="number" name="quantity" min={0} value={this.state.secondInterval} onChange={event => this.setState(byPropKey('secondInterval', event.target.value))}/>
            </div><br/>
            <textarea cols="50" rows="5" value={this.state.ReminderMessage} onChange={event => this.setState(byPropKey('ReminderMessage', event.target.value))}>
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