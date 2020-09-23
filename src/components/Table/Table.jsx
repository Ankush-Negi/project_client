import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import propTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withLoaderAndMessage } from '../HOC';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
    border: 'solid',
    borderWidth: 'thin',
    borderColor: 'lightGrey',
  },
  color: {
    color: 'grey',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  button: {
    padding: 0,
    border: 'none',
    background: 'none',
  },
}));

const TableComponent = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const {
    id, data, column, order, orderBy, onSort, actions,
    count, page, onChangePage, rowsPerPage,
  } = props;

  const tableBody = data.map((element) => (
    // eslint-disable-next-line no-underscore-dangle
    <StyledTableRow hover  key={element._id}>
      {column.map(({ field, align, format }) => (

        // eslint-disable-next-line no-underscore-dangle
        <StyledTableCell key={element._id.concat(field)} align={align}>
          {format ? format(element[field]) : element[field]}
        </StyledTableCell>
      ))}
      {
        <StyledTableCell>
          {
            actions.map((
              { icons, handler }, index,
            ) => (
              <Button
                // eslint-disable-next-line no-underscore-dangle
                key={element._id.concat(index)}
                className={classes.background}
                onClick={() => { handler(element); }}
              >
                {icons}
              </Button>
            ))
          }

        </StyledTableCell>
      }
    </StyledTableRow>

  ));

  const handleSortIcon = (e) => {
    e.target.style.color = 'black';
    setOpen(true);
  };
  const handleColorChange = (e) => {
    e.target.style.color = 'grey';
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow key={id}>
              {column.length && column.map((col, index) => (
                <TableCell
                  key={`key_${index + 1}`}
                  align={col.align}
                  className={classes.color}
                >
                  <TableSortLabel
                    onMouseEnter={handleSortIcon}
                    onMouseLeave={handleColorChange}
                    onBlur={handleColorChange}
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : 'asc'}
                    onClick={() => onSort(col.field)}
                    hideSortIcon={open}
                  >
                    <>
                      {col.label}
                      {orderBy === col.field ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
    {count ? (
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          onChangePage={onChangePage}
        />
      ) : ''}
    </>
  );
};
TableComponent.propTypes = {
  id: propTypes.number.isRequired,
  data: propTypes.arrayOf(propTypes.object).isRequired,
  column: propTypes.arrayOf(propTypes.object).isRequired,
  actions: propTypes.arrayOf(propTypes.object).isRequired,
  order: propTypes.oneOf(['asc', 'desc']),
  orderBy: propTypes.string,
  onSort: propTypes.func.isRequired,
  count: propTypes.number.isRequired,
  page: propTypes.number,
  onChangePage: propTypes.func.isRequired,
  rowsPerPage: propTypes.number,
  dataLength: propTypes.number.isRequired,
};
TableComponent.defaultProps = {
  order: 'asc',
  orderBy: '',
  page: 0,
  rowsPerPage: 100,
};

export default withLoaderAndMessage(TableComponent);
