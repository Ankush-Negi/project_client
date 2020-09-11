import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import propTypes from 'prop-types';
import * as moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  AddDialog, EditDialog, RemoveDialog,
} from './components';
import { TableComponent } from './components';
import { MyContext } from '../../contexts';
import callApi from '../../lib/utils/api';
import ls from 'local-storage';

const useStyles = {
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

function UserList(props) {
  const [ state, setState ] = useState({
    open: false,
    order: 'asc',
    orderBy: 'Date',
    page: 0,
    editOpen: false,
    removeOpen: false,
    rowData: {},
    rowsPerPage: 20,
    tableData: [],
    message: '',
    status: '',
    count: 0,
    loader: true,
    tableDataLength: 0,
  });

async function handleClickOpen() {
  setState({ ...state, open: true });
};

async function handleClose() {
  setState({...state, open: false, editOpen: false, removeOpen: false });
};

async function onSubmitHandle(values) {
  setState({ ...state, open: false, editOpen: false });
  const { page, rowsPerPage } = state;
  handleTableData({
    params: { skip: page * rowsPerPage, limit: rowsPerPage },
    headers: { Authorization: ls.get('token') },
  }, '/owner', 'Get');
  console.log(values);
}

async function handleOnSubmitDelete(values) {
  setState({ ...state, open: false, removeOpen: false, loader: true });
  const { page, rowsPerPage, count } = state;
  console.log(values);
  if (count - page * rowsPerPage !== 1) {
    handleTableData({
      params: {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      },
      headers: { Authorization: ls.get('token') },
    }, '/owner', 'Get');
  } else if (page !== 0) {
    setState({...state, page: page - 1 });
    handleTableData({
      params: {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
      },
      headers: { Authorization: ls.get('token') },
    }, '/owner', 'Get');
  } else {
    handleTableData({
      params: {
        skip: (page) * rowsPerPage,
        limit: rowsPerPage,
      },
      headers: { Authorization: ls.get('token') },
    }, '/owner', 'Get');
  }
  console.log(values);
}

async function handleSort(value) {
  const { orderBy, order } = state;
  const isAsc = orderBy === value && order === 'asc';
  const data = isAsc ? 'desc' : 'asc';
  setState({
    ...state,
    order: data,
    orderBy: value,
  });
}

async function handleSelectChange(value) {
  console.log(value);
}

async function handleEditDialogOpen(values) {
  setState({ ...state, editOpen: true, rowData: values });
}

async function handleRemoveDialogOpen(values) {
  setState({ ...state, removeOpen: true, rowData: values });
}

async function handleChangePage(newPage, openSnackBar) {
  const { rowsPerPage, message, status } = this.state;
  return status === 'ok' ? (setState({ ...state, page: newPage, loader: true }),
  handleTableData({
    params: {
      skip: newPage * rowsPerPage,
      limit: rowsPerPage,
    },
    headers: { Authorization: ls.get('token') },
  }, '/owner', 'Get'))
    : (openSnackBar(message, status));
};

async function handleTableData(data, url, method) {
  await callApi(data, url, method).then((response) => {
    const { records, count } = response.data;
    setState({
      ...state,
      tableData: records,
      loader: false,
      tableDataLength: records.length,
      count,
    });
  });
}

useEffect(() => {
  let start = true;
  callApi({
    params: {
      skip: 0,
      limit: 20,
    },
    headers: { authorization: ls.get('token') }
  },'/owner','get')
  .then(response => {
    console.log('this is the response', response);
    const { status, message, data } = response;
    console.log('values', status, message);
    const { records, count } = data;
    if( start ) {
      setState({
        ...state,
        tableData: records,
        tableDataLength: records.length,
        message,
        status,
        count,
        loader: false,
      })
      start = false;
    }
  }).catch( err => {
    setState({...state, loader: true})
    console.log('Error', err);
  });
});

  console.log('inside userlist', state);
  const { classes } = props;
  const {
    open, order, orderBy, page, editOpen, rowData, removeOpen,
    rowsPerPage, tableData, count, loader, tableDataLength,
  } = state;
  const getDateFormatted = (date) => moment(date).format('dddd,MMMM Do YYYY, h:mm:ss a');
  console.log('loader', loader);
  return !loader ? (
    <>
      <div className={classes.button}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Add User
        </Button>
      </div>
      <AddDialog open={open} onClose={handleClose} onSubmit={onSubmitHandle} />
      <MyContext.Consumer>
        {(value) => (
      <TableComponent
        id={page}
        data={tableData}
        column={[{
          field: 'name',
          label: 'Name',
        },
        {
          field: 'email',
          label: 'Email-Address',
          format: (value) => value && value.toUpperCase(),

        },
        {
          field: 'createdAt',
          label: 'Date',
          align: 'right',
          format: getDateFormatted,
        }]}

        actions={[{
          icons: <EditIcon />,
          handler: handleEditDialogOpen,
        },
        {
          icons: <DeleteIcon />,
          handler: handleRemoveDialogOpen,

        }]}

        order={order}
        orderBy={orderBy}
        onSort={handleSort}
        onSelect={handleSelectChange}
        count={count}
        page={page}
        onChangePage={async() => await handleChangePage( page, value.openSnackBar)}
        rowsPerPage={rowsPerPage}
        loader={loader}
        dataLength={tableDataLength}

      />
      )}
      </MyContext.Consumer>
                
      <EditDialog
        open={editOpen}
        onClose={handleClose}
        onSubmit={onSubmitHandle}
        data={rowData}
      />
      <RemoveDialog
        open={removeOpen}
        onClose={handleClose}
        onSubmit={handleOnSubmitDelete}
        data={rowData}
      />
    </>
  ) : <span><center><CircularProgress size={50} /></center></span>;
}
export default withStyles(useStyles, { withTheme: true })(UserList);

UserList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};