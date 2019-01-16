import React from 'react';
import './Alarms.css';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
  });

class AlarmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
    
      componentDidMount() {
       
    
      }
    
      render() {
        
        const { classes } = this.props;
    
        return (
        <div >
            <div className={classes.appBarSpacer} />
            Restricted Content
        </div>
        );
      }
    }

export default withStyles(styles)(AlarmPage);