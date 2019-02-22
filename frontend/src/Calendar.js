import React from 'react';
import moment from 'moment';
import { Calendar, CalendarControls } from 'react-yearly-calendar';
import './Calendar.css';
import { db } from './firebase';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    
    appBarSpacer: theme.mixins.toolbar,
    
  });

class CalendarComp extends React.Component {
    constructor(props) {
        super(props);
    
        const today = moment();
    
        var customCSSclasses = {
          missed: [],
          taken: [],
          noConnection: []
        };
        // alternatively, customClasses can be a function accepting a moment object. For example:
        // day => (day.isBefore(moment([day.year(),2,21])) || day.isAfter(moment([day.year(),11,21]))) ? 'winter': 'summer'
    
        this.state = {
          size:0,
          ids:[],
          year: today.year(),
          selectedDay: today,
          selectedRange: [today, moment(today).add(15, 'day')],
          showDaysOfWeek: true,
          showTodayBtn: true,
          showWeekSeparators: true,
          selectRange: false,
          firstDayOfWeek: 0, // sunday
          customCSSclasses
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
    
      onPrevYear() {
        this.setState(prevState => ({
          year: prevState.year - 1
        }));
      }
    
      onNextYear() {
        this.setState(prevState => ({
          year: prevState.year + 1
        }));
      }
    
      goToToday() {
        const today = moment();
    
        this.setState({
          selectedDay: today,
          selectedRange: [today, moment(today).add(15, 'day')],
          year: today.year()
        });
      }
    
      datePicked(date) {
        this.setState({
          selectedDay: date,
          selectedRange: [date, moment(date).add(15, 'day')]
        });
      }
    
      rangePicked(start, end) {
        this.setState({
          selectedRange: [start, end],
          selectedDay: start
        });
      }
    
      toggleShowDaysOfWeek() {
        this.setState(prevState => ({
          showDaysOfWeek: !prevState.showDaysOfWeek
        }));
      }
    
      toggleForceFullWeeks() {
        this.setState(prevState => ({
          showDaysOfWeek: true,
          forceFullWeeks: !prevState.forceFullWeeks
        }));
      }
    
      toggleShowTodayBtn() {
        this.setState(prevState => ({
          showTodayBtn: !prevState.showTodayBtn
        }));
      }
    
      toggleShowWeekSeparators() {
        this.setState(prevState => ({
          showWeekSeparators: !prevState.showWeekSeparators
        }));
      }
    
      toggleSelectRange() {
        this.setState(prevState => ({
          selectRange: !prevState.selectRange
        }));
      }
    
      selectFirstDayOfWeek(event) {
        this.setState({
          firstDayOfWeek: parseInt(event.target.value, 10)
        });
      }
    
      updateData = (e)=>{
        //console.log("Updating value");
        //console.log("value is "+this.patient.value);
    
        
        
        db.getStamps(this.patient.value).then(snapshot =>{
          this.setState({ stamps: snapshot.val() });
          //console.log(snapshot.val());
          var mystamps = this.state.stamps;
          var dates = [];
          var newCSSclasses;
          if(mystamps === null){
            newCSSclasses = {
              missed: [],
              taken: [],
              noConnection: []
            };
            this.setState({customCSSclasses:newCSSclasses});
            return;
          }
          
          var keys = Object.keys(mystamps);
          this.setState({size:keys.length});
          //console.log(keys);
          
          for(var i = 0;i< keys.length;i++){
            //console.log(keys[i]);
            //console.log(mystamps[keys[i]].date);
            dates.push(mystamps[keys[i]].date);
          }
          newCSSclasses = {
            missed: [],
            taken: dates,
            noConnection: []
          };
          this.setState({customCSSclasses:newCSSclasses});
        });
    
      }
    
      render() {
        const {
          year,
          selectedDay,
          showDaysOfWeek,
          forceFullWeeks,
          showWeekSeparators,
          firstDayOfWeek,
          selectRange,
          selectedRange,
          customCSSclasses
        } = this.state;
        const { classes } = this.props;
    
        return (
          <div >
              <div className={classes.appBarSpacer} />
              <div className="DataOptions">
                <table className="label2">
                  <tbody>
                    <tr>
                      <td>
                        Patient ID
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
                    <br/>
              </div>
            <div id="calendar">
              <CalendarControls
                year={year}
                onPrevYear={() => this.onPrevYear()}
                onNextYear={() => this.onNextYear()}
                goToToday={() => this.goToToday()}
              />
              <Calendar
                year={year}
                selectedDay={selectedDay}
                showDaysOfWeek={showDaysOfWeek}
                forceFullWeeks={forceFullWeeks}
                showWeekSeparators={showWeekSeparators}
                firstDayOfWeek={firstDayOfWeek}
                selectRange={selectRange}
                selectedRange={selectedRange}
                onPickDate={(date, classes) => this.datePicked(date, classes)}
                onPickRange={(start, end) => this.rangePicked(start, end)}
                customClasses={customCSSclasses}
              />
            </div>
            
            </div>
        );
      }
    }

export default withStyles(styles)(CalendarComp);