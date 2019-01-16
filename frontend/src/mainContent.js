import React from 'react';
//import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { db } from './firebase';
import './mainContent.css';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import moment from 'moment';

const drawerWidth = 240;


const styles = theme => ({
    root: {
      display: 'flex',
    },
    selectStyle: {
        height: 25,
        marginLeft:15,
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    myButton: {
        marginLeft: 5,
        marginRight: 36,
        marginTop:5,
        height:10,
        'min-height':25,
        padding:5,
      },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9,
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      height: '100vh',
      overflow: 'auto',
    },
    chartContainer: {
      marginLeft: -22,
    },
    tableContainer: {
      height: 320,
    },
    h5: {
      marginBottom: theme.spacing.unit * 2,
    },
    Detail: {
        marginRight:10,
        marginTop:10,
    },
    date:{
        marginLeft: 10,
        marginRight: 10,
        height:30
    },
    table: {
      minWidth: 300,
    },
  });

class MainContent extends React.Component {
    state = {
      totalAdherance:'N/A',
      days:"N/A",
      startdate: 'N/A',
      anchorEl: null,
      users: null,
      size:0,
      ids: [
        
      ],
      data: [],
      dayCounts: [0,0,0,0,0,0,0],
      data2: [
        { name: 'Mon', Percentage: 0},
        { name: 'Tue', Percentage: 0 },
        { name: 'Wed', Percentage: 0 },
        { name: 'Thu', Percentage: 0 },
        { name: 'Fri', Percentage: 0 },
        { name: 'Sat', Percentage: 0 },
        { name: 'Sun', Percentage: 0 },
      ],
      stamps: null,
      patientID : ''
    };
    componentDidMount() {

      
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
  
    }

    updateData = () => {
      var a = moment(this.startingdate.value, 'YYYY-MM-DD');
      var b = moment();
      var mydays = b.diff(a, 'days');
      //console.log("Updating value");
      //console.log("value is "+this.patient.value);
      db.getStamps(this.patient.value).then(snapshot =>{
        this.setState({ stamps: snapshot.val() });
        var mydata2 = [
          { name: 'Mon', Percentage: 0},
          { name: 'Tue', Percentage: 0 },
          { name: 'Wed', Percentage: 0 },
          { name: 'Thu', Percentage: 0 },
          { name: 'Fri', Percentage: 0 },
          { name: 'Sat', Percentage: 0 },
          { name: 'Sun', Percentage: 0 },
        ]
        if(snapshot.val()===null){
          this.setState({data:[]});
          this.setState({startdate:mydays})
          this.setState({totalAdherance:0})
          this.setState({days:0})
          this.setState({data2:mydata2})
          return;
        }
        //console.log(snapshot.val());
        var mystamps = this.state.stamps;
        this.setState({data:[]});
        var keys = Object.keys(mystamps);
        this.setState({size:keys.length})
        //console.log(keys);
        var set4 = new Set(); 
        for(var i = 0;i< keys.length;i++){
          //console.log(keys[i]);
          //console.log(mystamps[keys[i]].date);
          ///console.log(mystamps[keys[i]].timeOfDay);
          this.setState({data: this.state.data.concat(
            [{ id: i,date: mystamps[keys[i]].date, time: mystamps[keys[i]].timeOfDay }]
            )
          });
          var currentDate = moment(mystamps[keys[i]].date, 'YYYY-MM-DD');
          var days2 = currentDate.diff(a, 'days');
          if(days2>0){
            set4.add(mystamps[keys[i]].date);
          }
        }

        if(set4.size === 0){
          this.setState({data:[]});
          this.setState({startdate:mydays})
          this.setState({totalAdherance:0})
          this.setState({days:0})
          this.setState({data2:mydata2})
          return;
        }
        //console.log(set4.size);
        this.setState({startdate:mydays})
        var percentage = (set4.size) / mydays;
        this.setState({totalAdherance:percentage.toFixed(4)})
        this.setState({days:set4.size})
        
        var mydayCounts = [0,0,0,0,0,0,0];
        for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
            var day = m.isoWeekday();
            mydayCounts[day-1] = mydayCounts[day-1]+1;
        }
        //console.log(mydayCounts);
        for (var it = set4.values(), val= null; val=it.next().value; ) {
          //console.log(val);
          var current = moment(val, 'YYYY-MM-DD').isoWeekday();
          mydata2[current-1].Percentage = mydata2[current-1].Percentage+1
        }
        for(var k = 0;k<7;k++){
          mydata2[k].Percentage = 100.0*(mydata2[k].Percentage)/(mydayCounts[k]);
          //console.log(k)
          //console.log((mydata2[k].Percentage))
          //console.log((mydayCounts[k]))
          //console.log((mydata2[k].Percentage)/(mydayCounts[k]))
        }
        this.setState({data2:mydata2})
      });
    }

    render(){
        const { classes } = this.props;
        return(
            <div>
            <div className={classes.appBarSpacer} />
                Start Date<input className={classes.date} type="date" defaultValue="2018-11-11" ref = {(input)=> this.startingdate = input}></input>
                <br/>
                Patient ID
                <select id="PatientNumber" ref = {(input)=> this.patient = input}>
                    {this.state.ids.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                </select>  
                <button className="myButton" onClick={this.updateData}  >
                    Load
                </button>
              <hr/>
              
              <Typography variant="h4" gutterBottom component="h3">
                Adherance
              </Typography>
              <Typography component="div" className={classes.chartContainer}>
              <ResponsiveContainer width="99%" height={300}>
                <LineChart data={this.state.data2}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]}/>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="Percentage" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
                <div align="center">
                <strong className = {classes.Detail}>Total Adherance: {this.state.totalAdherance}</strong><br/>
                <strong className = {classes.Detail}>Successful Days: {this.state.days}</strong><br/>
                <strong className = {classes.Detail}>Total Days: {this.state.startdate}</strong>
              </div>
              </Typography>
              
              <Typography variant="h4" gutterBottom component="h4">
                Data
              </Typography>
              <div className={classes.tableContainer}>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell >Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.data.map(n => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell component="th" scope="row">
                            {n.date}
                          </TableCell>
                          <TableCell>{n.time}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
              </div>
              </div>
        );
    }
    
}

export default withStyles(styles)(MainContent);