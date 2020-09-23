import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import propTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {
  AddProdDialog, EditProdDialog, RemoveProdDialog,
} from '../../components';
import { TableComponent, SimpleTable } from '../../components';
import callApi from '../../lib/utils/api';
import ls from 'local-storage';

const useStyles = {
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

function ProductList(props) {
  const [ state, setState ] = useState({
    all: false,
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
  await setState({...state, open: false, editOpen: false, removeOpen: false });
  await handleTableData({
    params: { skip: page * rowsPerPage, limit: rowsPerPage, all },
    headers: { Authorization: ls.get('token') },
  }, '/product', 'get');
}

async function handleOnSubmitDelete(values) {
  setState({ ...state, open: false, removeOpen: false, loader: true });
  const { page, rowsPerPage, count, all } = state;
  if (count - page * rowsPerPage !== 1) {
    handleTableData({
      params: {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        all,
      },
      headers: { Authorization: ls.get('token') },
    }, '/product', 'Get');
  } else if (page !== 0) {
    setState({...state, page: page - 1 });
    handleTableData({
      params: {
        skip: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        all,
      },
      headers: { Authorization: ls.get('token') },
    }, '/product', 'Get');
  } else {
    handleTableData({
      params: {
        skip: (page) * rowsPerPage,
        limit: rowsPerPage,
        all,
      },
      headers: { Authorization: ls.get('token') },
    }, '/product', 'Get');
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

async function handleProductChange() {
  await setState({
    ...state,
    all: !all,
    loader: true,
  });
}

useEffect(() => {
  const { page , rowsPerPage, all } = state;
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
      loader: false,
    })
    }).catch(err => {
    setState({...state, loader: true})
    });
  }
});

  const { classes } = props;
  const {
    open, order, orderBy, page, editOpen, rowData, removeOpen, all,
    rowsPerPage, tableData, count, loader, tableDataLength,
  } = state;
  return (
    <>
      <div className={classes.button}>
      <FormGroup>
        <FormControlLabel
          label={all ? 'own' : 'all'}
          control={
            <Switch onChange={handleProductChange} />
          }
        />
      </FormGroup>
      </div>
      {!all && (
      <div className={classes.button}>
      <Tooltip title="Add" aria-label="add">
          <Fab color="primary">
            <AddIcon onClick={handleClickOpen}/>
          </Fab>
        </Tooltip>
      </div>)}
      {!all && (      
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
          icons: <EditIcon />,
          handler: handleEditDialogOpen,
          align: 'right',
        },
        {
          icons: <DeleteIcon />,
          handler: handleRemoveDialogOpen,
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
      />)}

      {all && (      
      <SimpleTable
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
      />)}
                
      <AddProdDialog
        open={open}
        onClose={handleClose}
      />

      <EditProdDialog
        open={editOpen}
        onClose={handleClose}
        data={rowData}
      />
      <RemoveProdDialog
        open={removeOpen}
        onClose={handleClose}
        onSubmit={handleOnSubmitDelete}
        data={rowData}
      />
    </>
  );
}
export default withStyles(useStyles, { withTheme: true })(ProductList);

ProductList.propTypes = {
  classes: propTypes.objectOf(propTypes.any).isRequired,
};