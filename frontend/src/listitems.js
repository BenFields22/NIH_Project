import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DashboardIcon from '@material-ui/icons/Dashboard';
import DataIcon from '@material-ui/icons/CloudDownload';
import AlarmIcon from '@material-ui/icons/Alarm';
//import AlarmIcon from '@material-ui/icons/Alarm';
import Calendar from '@material-ui/icons/CalendarTodaySharp';
import List from '@material-ui/core/List';
import ReactDOM from 'react-dom';
import MainContent from './mainContent';
import MyCalendar from './Calendar';
import AlarmPage from './Alarms';
import DataPage from './dataPanel';



//import * as routes from './routes';


import { withRouter} from 'react-router-dom';


class MainListItems extends React.Component {
  state = {
    anchorEl: null,
  };

  updateView = () => {
    ReactDOM.render(<MyCalendar/>, document.getElementById('Main_Content'));
  }

  updateView2 = () => {
    ReactDOM.render(<MainContent/>, document.getElementById('Main_Content'));
  }

  updateView3 = () => {
    var doc = localStorage.getItem('doctor');
    if(doc === "1"){
      ReactDOM.render(<AlarmPage/>, document.getElementById('Main_Content'));
    }
    else{
      ReactDOM.render(<div><br/><br/><br/>Restricted Content</div>, document.getElementById('Main_Content'));
    }
  }

  updateView4 = () => {
    ReactDOM.render(<DataPage/>, document.getElementById('Main_Content'));
  }

  render(){
    return(
      <div>
        <List>
          <ListItem button onClick={this.updateView2}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={this.updateView4}>
            <ListItemIcon>
              <DataIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={this.updateView}>
            <ListItemIcon>
              <Calendar />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={this.updateView3}>
            <ListItemIcon>
              <AlarmIcon/>
            </ListItemIcon>
            <ListItemText primary="Alarms" />
          </ListItem>
          
        </List>
        </div>
      );
  }
}

export default withRouter(MainListItems);
    
  
  

