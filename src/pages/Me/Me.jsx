import React, { useEffect, useState } from 'react';
// import * as moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { NoMatch } from '../NoMatch';
import callApi from '../../lib/utils/api';
import * as ls from 'local-storage';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    width: 151,
  },
  wrapper: {
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'lightGrey',
  },
});

// const getDateFormatted = (date) => moment(date).format('dddd,MMMM Do YYYY, h:mm:ss a');

const TraineeDetails = () => {
    const [ data, setData ] = useState({});
    const [ loader, setLoader ] = useState(true);
    const classes = useStyles();
    useEffect(() => {
      if(loader) {
        callApi({
            params: {
            skip: 0, limit: 20,
            },
            headers: { authorization: ls.get('token') },
        },'/user/me','get')
        .then((response) => {
            if(data !== null && data !== undefined) {
                setData(response);
                setLoader(false);
            }
        });
      }
    });

    return (
    <>
      { Object.keys(data).length
        ? (
          <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  Id - {data.originalId}
                </Typography>
                <Typography component="h5" variant="h5">
                  Name - {data.name}
                </Typography>
                <Typography variant="subtitle1">
                  Email - {data.email}
                </Typography>
                <Typography variant="subtitle1">
                  Address - {data.address}
                </Typography>
                <Typography variant="subtitle1">
                  Role - {data.role}
                </Typography>
                <Typography variant="subtitle1">
                  Date of Birth - {data.dob}
                </Typography>
                <Typography variant="subtitle1">
                  Mobile Number - {data.mobileNumber}
                </Typography>
                </CardContent>
            </div>
          </Card>
        ) : <NoMatch />}
    </>
  );
};
export default TraineeDetails;
