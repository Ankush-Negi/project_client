import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(8),
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://successive.tech/">
          Successive Technologies
        </Link>
      </Typography>
    </div>
  );
};

export default Footer;
