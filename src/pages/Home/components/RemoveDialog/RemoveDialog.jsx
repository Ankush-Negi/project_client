import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import propTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


class RemoveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
    };
  }

  render = () => {
    const {
      onClose, open, data, onSubmit,
    } = this.props;
    const { loader } = this.state;
    return (
      <Dialog onClose={() => onClose()} fullWidth aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Remove User</DialogTitle>
        <div>
          <DialogContentText>
              Do you really want to delete trainee ?
          </DialogContentText>
        </div>
        <DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()} variant="contained">
              Cancel
            </Button>
            <Button
              disabled={loader ? true : false}
              color="primary"
              variant="contained"
              onClick={() => {
                onSubmit(data);
                onClose();
              }}
            >
              <span>
                {loader ? <CircularProgress size={20} /> : ''}
              </span>
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

RemoveDialog.propTypes = {
  onClose: propTypes.func.isRequired,
  open: propTypes.bool.isRequired,
  onSubmit: propTypes.func,
  data: propTypes.objectOf(propTypes.string).isRequired,
};

RemoveDialog.defaultProps = {
  onSubmit: undefined,
};

export default RemoveDialog;
