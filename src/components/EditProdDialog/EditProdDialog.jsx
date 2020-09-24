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
import { MyContext } from '../../contexts';
import callApi from '../../lib/utils/api';
import * as ls from 'local-storage';

const useStyles = {
  root: {
    flexGrow: 1,
  },
};

class EditProdDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: '',
      description: '',
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

    handlePriceChange = (event) => {
      const { touched } = this.state;
      this.setState({
        price: event.target.value,
        isValid: true,
      }, () => {
        this.setState({
          touched: {
            ...touched,
            price: true,
          },
        });
      });
    };

    handleDescChange = (event) => {
        const { touched } = this.state;
        this.setState({
          description: event.target.value,
          isValid: true,
        }, () => {
          this.setState({
            touched: {
              ...touched,
              description: true,
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

    toggler = () => {
      this.setState((prevState) => ({
        isValid: !prevState.isValid,
      }));
    }

    handleSubmit = async(openSnackBar) => {
      this.toggler();
      const { onClose, data } = this.props;
      const { name, price, description } = this.state;
      const { originalId } = data;
      await callApi({
        headers: {
          authorization: ls.get('token')
        },
	      data: {
	        id: originalId,
	        dataToUpdate: {
            name, price, description,
         },
	}
      },'/product', 'put')
      .then(response => {
        const { message, status } = response;
        if(status !== 'OK') {
          openSnackBar(message, 'danger');
        }
        openSnackBar(message, 'success');
        onClose();
    });
  }

    render = () => {
      const {
        open, onClose, classes, data,
      } = this.props;
      const { isValid } = this.state;
      return (
        <Dialog onClose={onClose} fullWidth aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="simple-dialog-title">Edit Product</DialogTitle>
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
                    label="Price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue={data.price}
                    variant="outlined"
                    onChange={this.handlePriceChange}
                    onBlur={() => { this.isTouched('price'); }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-helperText3"
                    label="Description"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    defaultValue={data.description}
                    variant="outlined"
                    onChange={this.handleDescChange}
                    onBlur={() => { this.isTouched('description'); }}
                  />
                </Grid>
              </Grid>
            </div>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <MyContext.Consumer>
                {(value) => (
                  <Button
                    variant="contained"
                    disabled={!isValid}
                    color="primary"
                    onClick={async() => {
                      await this.handleSubmit(value.openSnackBar);
                    }}
                  >
                    Submit
                  </Button>
                )}
              </MyContext.Consumer>
            </DialogActions>
          </DialogContent>
        </Dialog>
      );
    }
}

EditProdDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(useStyles)(EditProdDialog);
