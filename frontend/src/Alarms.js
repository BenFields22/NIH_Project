import React from 'react';
import './Alarms.css';
import { db } from './firebase';
import { withStyles } from '@material-ui/core/styles';
import NumericInput from 'react-numeric-input';


const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
  });

class AlarmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          size:0,
          ids: []
          };
      }
    
      componentDidMount() {

      
        db.getIDs().then(snapshot =>{
          this.setState({ users: snapshot.val() });
          var mywords = this.state.users;
          var keys = Object.keys(mywords).filter(e => e !== "999");
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
    
      }

      updateData = () => {
        
      }

      sendMessage = () => {
        alert("Message Sent");
      }
    
      render() {
        
        const { classes } = this.props;
    
        return (
        <div >
            <div className={classes.appBarSpacer} />
                Patient ID 
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
              <NumericInput min={0}  value={10}/><br/>
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
            <button onClick={this.sendMessage}>Send</button>
            <button onClick={this.sendMessage}>Send All</button>

        </div>
        );
      }
    }

export default withStyles(styles)(AlarmPage);