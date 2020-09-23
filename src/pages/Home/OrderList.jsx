import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone';
import propTypes from 'prop-types';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import {
  Cart, AddOrderDialog,
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

function OrderList(props) {
  const [ state, setState ] = useState({
    all: true,
    open: false,
    order: 'asc',
    orderBy: 'Date',
    page: 0,
    addOpen: false,
    removeOpen: false,
    rowData: {},
    rowsPerPage: 20,
    tableData: [],
    message: '',
    status: '',
    count: 0,
    loader: true,
    tableDataLength: 0,
    counter: 0,
  });

async function handleClickOpen() {
  setState({ ...state, open: true });
}

async function handleClose() {
  await setState({...state, open: false, addOpen: false, });
}

async function handleCartClose() {
  await setState({...state, counter: 0, open: false, addOpen: false, });
}

async function onSubmitHandle(values) {
  const { counter } = state;
  await setState({...state, counter: counter+1 });
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

async function handleAddDialogOpen(values) {
  setState({ ...state, addOpen: true, rowData: values });
}

async function handleChangePage(event, newPage) {
  const { rowsPerPage, status } = state;
  return (status === 'OK') ? (setState({ ...state, page: newPage, loader: true }),
  handleTableData({
    params: {
      skip: newPage * rowsPerPage,
      limit: rowsPerPage,
    },
    headers: { Authorization: ls.get('token') },
  }, '/product', 'get')
  ) : '' ;
}

async function handleTableData(data, url, method) {
  await callApi(data, url, method).then((response) => {
    const { records, count } = response.data;
    setState({
      ...state,
      tableData: records,
      tableDataLength: records.length,
      count,
      open: false,
      editOpen: false,
      removeOpen: false,
    });
  });
}

useEffect(() => {
  const { page , rowsPerPage } = state;
  if( loader ) {
  callApi({
    params: {
      skip: rowsPerPage * page,
      limit: rowsPerPage,
      all,
    },
    headers: { authorization: ls.get('token') }
  },'/product','get')
  .then(response => {
    const { status, message, data } = response;
    const { records, count } = data;
    setState({
      ...state,
      tableData: records,
      tableDataLength: records.length,
      message,
      status,
      count,
      start: false,
      loader: false,
    })
    }).catch( err => {
    setState({...state, loader: true})
    });
  }
});

  const { classes } = props;
  const {
    open, order, orderBy, page, all, addOpen, rowData, counter,
    rowsPerPage, tableData, count, loader, tableDataLength,
  } = state;
  return (
    <>
      <div className={classes.button}>
      <Tooltip title="Cart" aria-label="add">
          <Fab color="primary">
            <ShoppingCartTwoToneIcon onClick={handleClickOpen}/>
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
          field: 'price',
          label: 'Price',
        },
        {
            field: 'description',
            label: 'Description',
        },
        {
          field: 'createdAt',
          label: 'Date',
          align: 'right',
        }]}
        actions={[{
          icons: <AddCircleTwoToneIcon />,
          handler: handleAddDialogOpen,
          align: 'right',
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
      <AddOrderDialog
        open={addOpen}
        onClose={handleClose}
        onSubmit={onSubmitHandle}
        data={rowData}
      />
      <Cart
        data={counter}
        open={open}
        onClose={handleCartClose}
      />
    </>
  );
}
export default withStyles(useStyles, { withTheme: true })(OrderList);

OrderList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};