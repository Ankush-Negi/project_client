import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import propTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {
  AddDialog, EditDialog, RemoveDialog,
} from '../../components';
import { TableComponent } from '../../components';
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
}

async function handleClose() {
  setState({...state, open: false, editOpen: false, removeOpen: false });
  const { page, rowsPerPage } = state;
  await handleTableData({
    params: { skip: page * rowsPerPage, limit: rowsPerPage },
    headers: { Authorization: ls.get('token') },
  }, '/owner', 'Get');
}

async function handleOnSubmitDelete(values) {
  setState({ ...state, open: false, removeOpen: false, loader: true });
  const { page, rowsPerPage, count } = state;
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

async function handleEditDialogOpen(values) {
  setState({ ...state, editOpen: true, rowData: values });
}

async function handleRemoveDialogOpen(values) {
  setState({ ...state, removeOpen: true, rowData: values });
}

async function handleChangePage(event, newPage) {
  const { rowsPerPage, status } = state;
  if (status === 'OK')  await setState({ ...state, page: newPage, loader: true });
  return await handleTableData({
    params: {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    },
    headers: { Authorization: ls.get('token') },
  }, '/owner', 'Get');
}

async function handleTableData(data, url, method) {
  await callApi(data, url, method).then((response) => {
    const { status, message, data } = response;
    const { records, count } = data;
    setState({
      ...state,
      tableData: records,
      loader: false,
      tableDataLength: records.length,
      count,
      status,
      message,
      open: false,
      editOpen: false,
      removeOpen: false,
    });
  });
}

useEffect(() => {
  if( loader ) {
    handleTableData({
      params: {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      },
      headers: {
        authorization: ls.get('token')
      }
    },'/owner','get');
  }
});

  const { classes } = props;
  const {
    open, order, orderBy, page, editOpen, rowData, removeOpen,
    rowsPerPage, tableData, count, loader, tableDataLength,
  } = state;
  return (
    <>
      <div className={classes.button}>
        <Tooltip title="Add" aria-label="add">
          <Fab color="primary">
            <AddIcon onClick={handleClickOpen}/>
          </Fab>
        </Tooltip>
      </div>
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
        count={count}
        page={page}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        loader={loader}
        dataLength={tableDataLength}
      />
                
      <AddDialog
        open={open}
        onClose={handleClose}
      />

      <EditDialog
        open={editOpen}
        onClose={handleClose}
        data={rowData}
      />
      <RemoveDialog
        open={removeOpen}
        onClose={handleClose}
        onSubmit={handleOnSubmitDelete}
        data={rowData}
      />
    </>
  );
}
export default withStyles(useStyles, { withTheme: true })(UserList);

UserList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};