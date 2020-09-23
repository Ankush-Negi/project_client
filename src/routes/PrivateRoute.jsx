import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ls from 'local-storage';
import { PrivateLayout } from '../layouts';

const PrivateLayoutRoute = ({ component: Component, ...rest }) => (
  ls.get('token') ? (
    <Route
      {...rest}
      render={(matchProps) => (
        <PrivateLayout>
          <Component {...matchProps} />
        </PrivateLayout>
      )}
    />
  ) : <Redirect to="/login" />
);
export default PrivateLayoutRoute;

PrivateLayoutRoute.propTypes = {

  component: propTypes.elementType.isRequired,

};
