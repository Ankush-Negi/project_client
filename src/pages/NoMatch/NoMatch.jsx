import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
    fontWeight: 488,
  },
});

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
});

const NoMatch = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container component="main" className={classes.main} maxWidth="sm">
          <Typography align="center" color="textSecondary" variant="h2" component="h2" gutterBottom>
            Not Found
          </Typography>
          <Typography align="center" variant="h5" component="h2" gutterBottom>
            Page does not exist
          </Typography>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default NoMatch;
