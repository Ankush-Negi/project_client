import React from 'react';
import propTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import ValidationSchema from './helper';
import { MyContext } from '../../contexts';
import * as ls from 'local-storage';
import callApi from '../../lib/utils/api';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

class AddProdDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: 0,
      description: '',
      isValid: true,
      loader: false,
      allErrors: {},
      touch: {
        Name: true,
        Price: true,
        Desc: true,
      },
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    const { name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  hasError = (field) => {
    const {
      allErrors, name, price, description, touch,
    } = this.state;
    ValidationSchema.validateAt(field, {
      Name: name,
      Price: price,
      Desc: description,
    }).then(() => {
      if (allErrors[field]) {
        delete allErrors[field];
        this.setState(allErrors);
      }
      return false;
    }).catch((error) => {
      if ((allErrors[field] !== error.message) && !touch[field]) {
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
    if (!Object.keys(touch).length && !Object.keys(allErrors).length && isValid) {
      this.setState({ isValid: false });
    }
    if (allErrors[field] && !touch[field]) {
      if (!isValid) {
        this.setState({ isValid: true });
      }
      return allErrors[field];
    }
    return false;
  }

  isTouched = (value) => {
    const { touch } = this.state;
    delete touch[value];
    this.setState({ touch });
  };

  toggler = () => {
    this.setState((prevState) => ({
      loader: !prevState.loader,
    }));
  }

  handleSubmit = async (openSnackBar) => {
    const { name, price, description } = this.state;
    this.toggler();
    const { onClose } = this.props;
    await callApi({
      headers: {
        authorization: ls.get('token')
      },
      data: {
        name, price, description
      }
    }, '/product', 'post')
    .then(response => {
      const { message, status } = response;
      if(status !== 'OK') {
        openSnackBar(message, 'danger');
      }
      openSnackBar(message, 'success');
      this.setState({
        name: '',
        price: 0,
        description: '',
        isValid: true,
        loader: false,
        allErrors: {},
        touch: {
          Name: true,
          Price: true,
          Desc: true,
        },
      });
      onClose()
    })
  }

  render = () => {
    const {
      open, onClose,
    } = this.props;
    const {
      isValid,
      name,
      price,
      description,
      loader,
    } = this.state;
    return (
      <div>
        <Dialog open={open} fullWidth onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter details to Add
            </DialogContentText>
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name *"
                    value={name}
                    name="name"
                    error={!!this.getError('Name')}
                    variant="outlined"
                    fullWidth
                    onChange={this.handleChange}
                    helperText={this.getError('Name')}
                    onBlur={() => this.isTouched('Name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Price *"
                    error={!!this.getError('Price')}
                    variant="outlined"
                    name="price"
                    value={price}
                    fullWidth
                    onChange={this.handleChange}
                    helperText={this.getError('Price')}
                    onBlur={() => this.isTouched('Price')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    error={!!this.getError('Desc')}
                    variant="outlined"
                    name="description"
                    value={description}
                    fullWidth
                    onChange={this.handleChange}
                    helperText={this.getError('Desc')}
                    onBlur={() => this.isTouched('Desc')}
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <MyContext.Consumer>
              {(value) => (
                <Button
                  variant="contained"
                  disabled={isValid}
                  color="primary"
                  onClick={async() => {
                    this.handleSubmit(value.openSnackBar);
                  }}
                >
                  <span>{loader ? <CircularProgress size={20} /> : ''}</span>
                  Submit
                </Button>
              )
            }
            </MyContext.Consumer>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
AddProdDialog.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
};

export default AddProdDialog;
