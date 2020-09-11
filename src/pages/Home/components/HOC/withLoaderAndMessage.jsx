import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const withLoaderAndMessage = (WrappedComponent) => function NewComponenet(props) {
  const { loader, dataLength, ...rest } = props;
  if (loader) {
    return (
      <Box paddingLeft={50}>
        <CircularProgress />
      </Box>
    );
  }
  return (<WrappedComponent loader={loader} dataLength={dataLength} {...rest} />);
};

export default withLoaderAndMessage;
