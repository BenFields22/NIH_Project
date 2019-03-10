import React, { Component } from 'react';
import "./userGuide.css";
import { withStyles } from '@material-ui/core/styles';
import adherencePic from './imgs/adherence.png';
import dataPic from './imgs/data.png';
import calendarPic from './imgs/calendar.png';
import alarmPic from './imgs/alarm.png';

const styles = theme => ({
    
    appBarSpacer: theme.mixins.toolbar,
    
  });

class UserGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
    <div className="GuideContent">
        <div className={classes.appBarSpacer} />
        <div className="title">User Guide</div>
        <hr/>
        <ul>
            <li className="option"><a href='#adherence'>Adherence Panel</a></li>
            <li className="option"><a href='#data'>Data Panel</a></li>
            <li className="option"><a href='#calendar'>Calendar Panel</a></li>
            <li className="option"><a href='#alarm'>Alarm Panel</a></li>
        </ul>
        <hr/>
        <strong id="adherence" className="heading1">Adherence Panel</strong><br/>
        <img src={adherencePic} alt="adherence panel"  ></img><br/>
        <div className="guideText">
        The adherence panel is used to provide statistics and analytics based on adherence. 
        In order to populate the panel with data the appropriate ID and the correct trial start date must be selected.
        Once the correct ID and date are selected the Load button can be clicked. 
        This will then show the adherence for that id with the adherence of all peers below.<br/><br/> 
        Two graphs are presented to provide a visual representation. 
        The first is a graph representing the adherence for that ID over the last 10 days. 
        A green bar represents a successful day. 
        The second graph is adherence by day, which shows how well that ID has performed based on the day of the week. 
        Each data point represents a percentage based on the number of that weekday seen in the trial period.
        </div>
        <hr/>
        <strong id="data" className="heading1">Data Panel</strong><br/>
        <img src={dataPic} alt="data panel" ></img><br/>
        <div className="guideText">
        The data panel is used to see the raw data captured by the software system. 
        By selecting an individual ID and selecting load all the captured cap turns are populated in the table below. 
        To load the data from all participants select the load all button.
        Once the data is loaded, filters can be applied and the table can even be downloaded into a .csv file.
        </div>
        <hr/>
        <strong id="calendar" className="heading1">Calendar Panel</strong><br/>
        <img src={calendarPic} alt="calendar panel" ></img><br/>
        <div className="guideText">
        The calendar panel is used to visualize adherence within a calendar. 
        If a participant was successful on a given day, the day will show up as green, but if the participant never applied their eye drops, the day will show up white. 
        To populate the calendar select the appropriate ID and press Load.
        </div>
        <hr/>
        <strong id="alarm" className="heading1">Alarm Panel</strong><br/>
        <img src={alarmPic} alt="alarm panel" ></img><br/>
        <div className="guideText">
        The alarm panel is a restricted panel and is only accessible by admin accounts. 
        This panel provides an interface to update when eye drops should be used, as well as when reminder messages should be provided. 
        If the content of each message needs to be personalized or changed in any way the interface allows the message content to be updated. 
        If at any point a custom message needs to be sent to a participant this panel can be used to send an SMS message at any given point. 
        <br/><br/>
        To load the information for a given participant select an ID and press Load. 
        All the information should be populated within the panel. If any changes are made to the participants information the Save button can be selected to save the new content. 
        To send a custom SMS message enter the message body in the text field located at the bottom of the page and press send. 
        If the message should be sent to every participant in the study press the send all button and the message will be distributed to all participants. 
        </div>
        
    </div>
    )
  }
}
export default withStyles(styles)(UserGuide);

