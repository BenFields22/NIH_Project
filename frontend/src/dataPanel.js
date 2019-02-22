import React from 'react';
import './dataPanel.css';
import { db } from './firebase';
import MUIDataTable from "mui-datatables";

import { withStyles } from '@material-ui/core/styles';
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

class DataComp extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            ids:[],
            data: []
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
    
    updateData = async ()=>{
        var id = this.patient.value;
        var builtdata = [];
        var StampSnapShot = await db.getStamps(id);
        var timeStamps = StampSnapShot.val();
        //console.log(timeStamps);
        var stampkeys = Object.keys(timeStamps);
        //console.log(stampkeys);
        for(var j = 0;j<stampkeys.length;j++){
            //console.log(stampkeys[j]);
            builtdata.push([1,id,timeStamps[stampkeys[j]].date, timeStamps[stampkeys[j]].timeOfDay]);
        }
        this.setState({data:builtdata});
        //console.log(this.state.data)
    }

    LoadAllData =  async () => {
        const snapshot =  await db.getIDs();
        var myids = snapshot.val();
        //console.log(myids);
        var filteredIDs = Object.keys(myids).filter(e => e !== "999");
        //console.log(filteredIDs);
        var builtdata = [];
        for(var i = 0;i<filteredIDs.length;i++){
            var id = filteredIDs[i];
            //console.log(id);
            var StampSnapShot = await db.getStamps(id);
            var timeStamps = StampSnapShot.val();
            //console.log(timeStamps);
            var stampkeys = Object.keys(timeStamps);
            //console.log(stampkeys);
            for(var j = 0;j<stampkeys.length;j++){
                //console.log(stampkeys[j]);
                builtdata.push([1,id,timeStamps[stampkeys[j]].date, timeStamps[stampkeys[j]].timeOfDay]);
            }
        }
        //console.log(builtdata)
        this.setState({data:builtdata});
    }
    
      render() {
        
        const { classes } = this.props;
        const columns = [
            {
                name: "GROUP",
                options: {
                  filter: true,
                  sort:true
                }
            },
            {
                name: "ID",
                options: {
                  filter: true,
                  sort:true
                }
            },
            {
                name: "Date",
                options: {
                    filter: true,
                    sort:true
                }
            },
            {
              name: "Time",
              options: {
                filter: false,
                sort:true
              }
            }
          ];
  
          const options = {
            selectableRows:false,
            filter: true,
            sort:true,
            responsive: 'stacked'
          };

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
                <button onClick={this.updateData}>Load</button><button onClick={this.LoadAllData}>Load All</button>
                    <br/>
              </div>
            <div id="data">
                <MUIDataTable
                  className={classes.table}
                  title={"Registered Cap Turns"}
                  data={this.state.data}
                  columns={columns}
                  options={options}
                />
            </div>
            
            </div>
        );
      }
    }

export default withStyles(styles)(DataComp);