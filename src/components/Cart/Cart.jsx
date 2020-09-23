import React from 'react';
import propTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { MyContext } from '../../contexts';
import * as ls from 'local-storage';
import callApi from '../../lib/utils/api';

class CartDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: [],
    };
  }

  componentDidMount = () => {
    callApi({
        headers: {
          authorization: ls.get('token')
        },
        params: {
            skip: 0,
            limit: 50,
        }
      }, '/order', 'get')
    .then(response => {
      const { data } = response;
      const { record } = data;
      this.setState({record: record});
    });
  }

  fetchData = async() => {
    await callApi({
        headers: {
          authorization: ls.get('token')
        },
        params: {
            skip: 0,
            limit: 50,
        }
      }, '/order', 'get')
    .then(response => {
      const { data } = response;
      const { record } = data;
      this.setState({record: record});
    });
  }

  deleteOrder = async(id, openSnackBar) => {
    await callApi({
        headers: {
          authorization: ls.get('token')
        },
      }, `/order/${id}`, 'delete')
    .then(response => {
        const { message, status } = response;
        if(status !== 'OK') {
          openSnackBar(message, 'danger');
        }
        openSnackBar(message, 'success');
        this.fetchData();
    });
  }

  render = () => {
    const {
      open, onClose, data,
    } = this.props;
    const { record } = this.state;
    if(data) {
        this.fetchData();
    }
    console.log('Records: ', record.length); 
    return (
      <div>
        <Dialog open={open} fullWidth onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" variant="h1">Orders</DialogTitle>
          <DialogContent>
            <div>
              {
                !record.length ? ('No Order Remaining... ') : (
                <Grid container spacing={2}>
                    {record.map(({ _id, product, price, originalId }) => (
                    <Grid key={_id} item xs={6}>
                        <Card variant="outlined" display="inline-block" margin="2px">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    ProductName:
                                    <br />
                                    {product}
                                </Typography>
                                <Typography color="textSecondary" variant="h6">
                                  Price: {price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                            <MyContext.Consumer>
                            {(value) => (
                            <Button
                            size="small"
                            color="primary"
                            onClick={async() => {
                                await this.deleteOrder(originalId, value.openSnackBar);
                            }}
                            >
                            Delete
                            </Button>
                            )}
                            </MyContext.Consumer>
                            </CardActions>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
CartDialog.propTypes = {
  open: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
};

export default CartDialog;
