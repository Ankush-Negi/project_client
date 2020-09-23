import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import ls from 'local-storage';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '10 10 10 0',
  },
  title: {
    flexGrow: 1,
  },
  textSize:
  {
    fontSize: '1rem',
  },
  marginButton: {
    marginRight: 30,
  },
});

export default function Navbar() {
  const classes = useStyles();
  const logout = () => {
    ls.clear();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Home
          </Typography>
          <Typography>
            <Button className={classes.textSize} component={Link} to="/me" size="small" color="inherit">My Profile</Button>
            <Button className={classes.textSize} component={Link} to="/home" size="small" color="inherit">Home</Button>
            <Button className={classes.textSize} component={Link} to="/login" onClick={logout} size="small" color="inherit">Logout</Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
