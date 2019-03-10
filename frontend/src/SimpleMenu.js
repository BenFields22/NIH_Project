import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as routes from './routes';
import { auth } from './firebase';
//import Account from './Account';
//import ReactDOM from 'react-dom';
import PeopleIcon from '@material-ui/icons/People';
import { withRouter} from 'react-router-dom';



class SimpleMenu extends React.Component {
    state = {
      anchorEl: null,
    };
  
    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };

    AccountClick = () => {
      const {
        history,
      } = this.props;
      
      history.push(routes.ACCOUNT);   
    }
    

  
    onSubmit = (event) => {
      auth.doSignOut();
      localStorage.removeItem("user");
    }
  
    render() {
      const { anchorEl } = this.state;
  
      return (
        <div>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
            color="inherit"
          >
                
                  <PeopleIcon/>
                
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.AccountClick}>My account</MenuItem>
            <MenuItem onClick={this.onSubmit}>Logout</MenuItem>
          </Menu>
        </div>
      );
    }
  }


  export default withRouter(SimpleMenu);