import React from 'react';
//import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { db } from './firebase';
import './mainContent.css';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import BarChart from 'recharts/lib/chart/BarChart';
import Bar from 'recharts/lib/cartesian/Bar';
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
        padding:5
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
        fontSize:18
    },
    date:{
        marginLeft: 10,
        marginRight: 10,
        height:30
    },
    table: {
      minWidth: 300
    },
  });

class MainContent extends React.Component {
    state = {
      totalAdherance:'N/A',
      days:"N/A",
      startdate: 'N/A',
      anchorEl: null,
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
      data3: [
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0},
          { name: "N/A", Taken: 0}
      ],
      peerAverage:'N/A',
      peer10DayAvg:'N/A',
      stamps: null,
      patientID : '',
      tenDayAdherence:'N/A'
    };


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

    formatDate(date){

      var dd = date.getDate();
      var mm = date.getMonth()+1;
      var yyyy = date.getFullYear();
      if(dd<10) {dd='0'+dd}
      if(mm<10) {mm='0'+mm}
      date = mm+'/'+dd+'/'+yyyy;
      return date
   }

   peerAvg = async (id,numberOfDays) => {
    var a = moment(this.startingdate.value, 'YYYY-MM-DD');
    const snapshot =  await db.getIDs();
    var myids = snapshot.val();
    //console.log(myids);
    var filteredIDs = Object.keys(myids).filter(e => e !== "999");
    filteredIDs = filteredIDs.filter(e => e !== id);
    //console.log("Filtered ids: ",filteredIDs);
    var numIDS = filteredIDs.length;
    var total = 0;
    for(var i = 0;i<filteredIDs.length;i++){
      var StampSnapShot = await db.getStamps(filteredIDs[i]);
      var timeStamps = StampSnapShot.val();
      //console.log(timeStamps);
      //console.log("Current id: ",filteredIDs[i]);
      if(timeStamps == null){
        continue;
      }
      var timeStampkeys = Object.keys(timeStamps);
      //console.log(timeStampkeys);
      var set4 = new Set(); 
      for(var j = 0;j< timeStampkeys.length;j++){
        var currentDate = moment(timeStamps[timeStampkeys[j]].date, 'YYYY-MM-DD');
        var days2 = currentDate.diff(a, 'days');
        if(days2>0){
          //console.log(timeStamps[timeStampkeys[j]].date);
          set4.add(timeStamps[timeStampkeys[j]].date);
        }
      }
      //console.log(set4.size);
      var res = (set4.size) / numberOfDays;
      //console.log(numberOfDays);
      //console.log("res ",res);
      total = total + res;
      //console.log("running total ",total);
    }
    //console.log("Total is: ",total);
    var percentage = ((total/numIDS)*100.0).toFixed(1);
    //console.log(percentage);
    return `${percentage}%`
   }

   peerTenAvg = async (id) => {
    var a = moment(this.startingdate.value, 'YYYY-MM-DD');
    const snapshot =  await db.getIDs();
    var myids = snapshot.val();
    //console.log(myids);
    var filteredIDs = Object.keys(myids).filter(e => e !== "999");
    filteredIDs = filteredIDs.filter(e => e !== id);
    //console.log("Filtered ids: ",filteredIDs);
    var numIDS = filteredIDs.length;
    var resTotal = 0;
    for(var i = 0;i<filteredIDs.length;i++){
      var StampSnapShot = await db.getStamps(filteredIDs[i]);
      var timeStamps = StampSnapShot.val();
      //console.log(timeStamps);
      //console.log("Current id: ",filteredIDs[i]);
      if(timeStamps == null){
        continue;
      }
      var timeStampkeys = Object.keys(timeStamps);
      //console.log(timeStampkeys);
      var set4 = new Set(); 
      for(var j = 0;j< timeStampkeys.length;j++){
        var currentDate = moment(timeStamps[timeStampkeys[j]].date, 'YYYY-MM-DD');
        var days2 = currentDate.diff(a, 'days');
        if(days2>0){
          //console.log(timeStamps[timeStampkeys[j]].date);
          set4.add(timeStamps[timeStampkeys[j]].date);
        }
      }
      var total = 0;
      for(var d=1; d<=10; d++) {
        var setFormatday = moment().subtract(d, 'days').format("YYYY-MM-DD");
        var check = set4.has(setFormatday);
        //console.log(check);
        if(check === true){
          total = total +1;
        }
        else{
          continue;
        } 
      }
      total = (total/10.0);
      //console.log(set4.size);
      //console.log(numberOfDays);
      //console.log("res ",total);
      resTotal = resTotal + total;
      //console.log("running total ",resTotal);
    }
    //console.log("Total is: ",total);
    var percentage = ((resTotal/numIDS)*100.0).toFixed(1);
    //console.log(percentage);
    return `${percentage}%`
   }

    updateData = () => {
      var a = moment(this.startingdate.value, 'YYYY-MM-DD');
      //console.log(a.toDate());
      var b = moment();
      var mydays = b.diff(a, 'days');
      //console.log(mydays);
      //console.log("Updating value");
      //console.log("value is "+this.patient.value);
      db.getStamps(this.patient.value).then(async (snapshot) =>{
        //peer adherence
        this.setState({ stamps: snapshot.val() });
        var peeraverage = await this.peerAvg(this.patient.value,mydays);
        var peerTenDay = await this.peerTenAvg(this.patient.value,mydays);
        //console.log("Peer 10-day average:",peerTenDay);
        //console.log("Peer average: ",peeraverage);
        var mydata2 = [
          { name: 'Mon', Percentage: 0},
          { name: 'Tue', Percentage: 0 },
          { name: 'Wed', Percentage: 0 },
          { name: 'Thu', Percentage: 0 },
          { name: 'Fri', Percentage: 0 },
          { name: 'Sat', Percentage: 0 },
          { name: 'Sun', Percentage: 0 },
        ]
        this.setState({peerAverage:peeraverage});
        this.setState({peer10DayAvg:peerTenDay});
        var mydata3 = [
        ];
        for(var x=1; x<=10; x++) {
          var firstthisday = moment().subtract(x, 'days').format("MM/DD/YY");
          var item1 = {
            name: firstthisday,
            Taken: 0
          }
          mydata3.push(item1);
        }
        mydata3.reverse();
        
        if(snapshot.val()===null){
          this.setState({data:[]});
          this.setState({startdate:mydays})
          this.setState({totalAdherance:`${0}%`})
          this.setState({days:0})
          this.setState({data2:mydata2})
          this.setState({tenDayAdherence:`${0}%`})
          this.setState({data3:mydata3})
          return;
        }
        //console.log(snapshot.val());
        var mystamps = this.state.stamps;
        this.setState({data:[]});
        var keys = Object.keys(mystamps);
        //console.log(keys);
        var set4 = new Set(); 
        //var builtdata = [];
        for(var i = 0;i< keys.length;i++){
          var currentDate = moment(mystamps[keys[i]].date, 'YYYY-MM-DD');
          var days2 = currentDate.diff(a, 'days');
          if(days2>0){
            //console.log(mystamps[keys[i]].date);
            set4.add(mystamps[keys[i]].date);
          }
        }

        if(set4.size === 0){
          this.setState({data:[]});
          this.setState({startdate:mydays})
          this.setState({totalAdherance:`${0}%`})
          this.setState({days:0})
          this.setState({data2:mydata2})
          this.setState({tenDayAdherence:`${0}%`})
          this.setState({data3:mydata3})
          return;
        }
        mydata3 = [
        ];
        var total = 0;
        for(var d=1; d<=10; d++) {
          var thisday = moment().subtract(d, 'days').format("MM/DD/YY");
          var setFormatday = moment().subtract(d, 'days').format("YYYY-MM-DD");
          var check = set4.has(setFormatday);
          //console.log(check);
          if(check === true){
            check=1;
            total = total +1;
          }
          else{
            check = 0;
          } 
          var item = {
            name: thisday,
            Taken: check
          }
          mydata3.push(item);
        }
        mydata3.reverse();
        //console.log(mydata3);
        total = ((total/10.0)*100.0).toFixed(1);
        this.setState({tenDayAdherence:`${total}%`})
        //console.log(set4.size);
        this.setState({startdate:mydays})
        var percentage = 100.0*(set4.size) / mydays;
        this.setState({totalAdherance:`${percentage.toFixed(1)}%`})
        this.setState({days:set4.size})
        
        var mydayCounts = [0,0,0,0,0,0,0];
        var count = 0;
        //console.log(a.toDate());
        for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
            //console.log(m.toDate());
          
            count = count+1;
            var day = m.isoWeekday();
            //console.log(day);
            mydayCounts[day-1] = mydayCounts[day-1]+1;
        }
        //console.log(count);
        //console.log(mydayCounts);
        var tempArr = Array.from(set4);
        
        for (var j=0;j<tempArr.length;j++ ) {
          //console.log(val);
          var current = moment(tempArr[j], 'YYYY-MM-DD').isoWeekday();
          mydata2[current-1].Percentage = mydata2[current-1].Percentage+1
        }
        for(var k = 0;k<7;k++){
          mydata2[k].Percentage = (100.0*(mydata2[k].Percentage)/(mydayCounts[k])).toFixed(1);
          //console.log(k)
          //console.log((mydata2[k].Percentage))
          //console.log((mydayCounts[k]))
          //console.log((mydata2[k].Percentage)/(mydayCounts[k]))
        }
        this.setState({data2:mydata2})
        this.setState({data3:mydata3})
      });
    }

    render(){
        const { classes } = this.props;
        
        return(
            <div>
            <div className={classes.appBarSpacer} />
                <label className="label">Start Date</label><input className={classes.date} type="date" defaultValue="2018-12-30" ref = {(input)=> this.startingdate = input}></input>
                <br/>
                <label id="PatientLabel">Patient ID </label>
                <select id="PatientNumber" ref = {(input)=> this.patient = input}>
                    {this.state.ids.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                </select>  
                <button className="myButton" onClick={this.updateData}  >
                    Load
                </button>
              <hr/>
              
              <div className = {classes.Detail}>
                <strong>Adherence</strong><br/>
                Average: {this.state.totalAdherance} <br/> 
                Successful Days: {this.state.days} <br/> 
                Total Days: {this.state.startdate} <br/> 
                10-Day Average: {this.state.tenDayAdherence}
              </div>
              <hr/>
              <div className = {classes.Detail}>
              <strong>Peer Adherence</strong><br/>
              Peer Average: {this.state.peerAverage} <br/>
              Peer 10-day Average: {this.state.peer10DayAvg}
              </div>
              <hr/>
              <h3>10-Day Adherence</h3>
              <Typography component="div" className={classes.chartContainer}>
              <ResponsiveContainer width="99%" height={300}>
                <BarChart data={this.state.data3}>
                  <XAxis dataKey="name" />
                  <YAxis interval={3} domain={[0, 1.00]}/>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar  dataKey="Taken" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              </Typography>

              <h3>Adherence by Weekday</h3>
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
              </Typography>
              </div>
              
        );
    }
    
}

export default withStyles(styles)(MainContent);