import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const useStyles = {
  root: {
    flexGrow: 1,
  },
};

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isValid: false,
      touched: {},

    };
  }

    handleNameChange = (event) => {
      const { touched } = this.setState;
      this.setState({
        name: event.target.value,
        isValid: true,
      }, () => {
        this.setState({
          touched: {
            ...touched,
            name: true,
          },
        });
      });
    };

    handleEmailChange = (event) => {
      const { touched } = this.state;
      this.setState({
        email: event.target.value,
        isValid: true,
      }, () => {
        this.setState({
          touched: {
            ...touched,
            email: true,
          },
        });
      });
    };

    isTouched = (value) => {
      const { touched } = this.state;
      const { data } = this.props;
      this.setState({
        touched: {
          ...touched,
          [value]: true,

        },
        isValid: true,
      }, () => {
        Object.keys(data).forEach((keys) => {
          if (!touched[keys]) {
            this.setState({
              [keys]: data[keys],
            });
          }
        });
      });
    }

    formReset = () => {
      this.setState({
        name: '',
        email: '',
        isValid: false,
        touched: {},
      });
    }

    toggler=() => {
      this.setState((prevState) => ({
        isValid: !prevState.isValid,
      }));
    }

    render = () => {
      const {
        open, onClose, classes, data, onSubmit,
      } = this.props;
      const {
        name, email, isValid,
      } = this.state;
      const { originalId } = data;
      return (
        <Dialog onClose={onClose} fullWidth aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="simple-dialog-title">Edit User</DialogTitle>
          <DialogContent>
            <div className={classes.root}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-helperText1"
                    label="Name"
                    defaultValue={data.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    variant="outlined"
                    onChange={this.handleNameChange}
                    onBlur={() => { this.isTouched('name'); }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-helperText2"
                    label="Email Address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue={data.email}
                    variant="outlined"
                    onChange={this.handleEmailChange}
                    onBlur={() => { this.isTouched('email'); }}

                  />
                </Grid>
              </Grid>
            </div>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!isValid}
                color="primary"
                onClick={() => {
                  this.toggler();
                  onSubmit({ name, email, originalId });
                  onClose();
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      );
    }
}

EditDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.string).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

EditDialog.defaultProps = {
  onSubmit: undefined,
};

export default withStyles(useStyles)(EditDialog);
