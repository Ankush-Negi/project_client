import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import EmailIcon from '@material-ui/icons/Email';
import PropTypes from 'prop-types';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as ls from 'local-storage';
import { MyContext } from '../../contexts';
import LoginValidationSchema from './helper';
import callApi from '../../lib/utils/api';

const styles = () => ({
  root: {
    margin: '5px 0 20px 0',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 80,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  avatar: {
    margin: 20,
    backgroundColor: '#0e30d8',
  },
  submit: {
    padding: '8px',
  },
  grid: {
    padding: '10px 0 10px 0',
  },
});

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isValid: false,
      loader: false,
      allErrors: {},
      touch: {
        Email: true,
        Password: true,
      },
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  toggler = async() => {
    await this.setState({
      loader: true,
      isValid: false,
    });
  }

  handleLoader = async (data, openSnackBar) => {
    await this.toggler();
    const { message, status, data: token } = await data;
    const { history } = this.props;
    await this.setState({ loader: false, isValid: true }, async() => (status === 'OK' ? (
      await ls.set('token', token),
      await history.push('/home'))
      : openSnackBar(message, status)));
  }

  hasError = (field) => {
    const {
      allErrors, email, password, touch,
    } = this.state;
    LoginValidationSchema.validateAt(field, {
      Email: email,
      Password: password,
    }).then(() => {
      if (allErrors[field] && !touch[field]) {
        delete allErrors[field];
        this.setState(allErrors);
      }
      return false;
    }).catch((error) => {
      if (allErrors[field] !== error.message && !touch[field]) {
        this.setState({
          allErrors: {
            ...allErrors,
            [field]: error.message,
          },
        });
      }
      return true;
    });
  };

  getError = (field) => {
    const {
      touch, allErrors, isValid,
    } = this.state;
    this.hasError(field);
    if (!Object.keys(touch).length && !Object.keys(allErrors).length && !isValid) {
      this.setState({ isValid: true });
      return allErrors[field];
    }
    if ((Object.keys(touch).length || Object.keys(allErrors).length) && isValid) {
      this.setState({ isValid: false });
    }
    return allErrors[field];
  }

  isTouched = (value) => {
    const { touch } = this.state;
    delete touch[value];
    this.setState({ touch });
  };

  render = () => {
    const { classes } = this.props;
    const {
      email,
      password,
      loader,
      isValid,
    } = this.state;
    return (
      <div>
        <Grid container className={classes.container}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h3" variant="h5">
              Login
            </Typography>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!this.getError('Email')}
                helperText={this.getError('Email')}
                onChange={this.handleEmailChange}
                onBlur={() => this.isTouched('Email')}
              />
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisibilityOffIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!this.getError('Password')}
                helperText={this.getError('Password')}
                onChange={this.handlePasswordChange}
                onBlur={() => this.isTouched('Password')}
              />
            </Grid>
            <MyContext.Consumer>
              {(value) => (
                <Button
                  className={classes.submit}
                  fullWidth
                  variant="contained"
                  disabled={!isValid}
                  color="primary"
                  onClick={async () => {
                    this.handleLoader(await callApi({ data: { email, password } }, '/user/login', 'post'), value.openSnackBar);
                  }}
                >
                  <span>{loader ? <CircularProgress size={20} /> : ''}</span>
                  Sign In
                </Button>
              )}
            </MyContext.Consumer>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/sign-up" variant="body2">
                Create Account? Sign Up
              </Link>
            </Grid>
          </Grid>
          </div>
        </Grid>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withStyles(styles)(LoginPage);
