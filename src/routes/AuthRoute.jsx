import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import ls from 'local-storage';
import { AuthLayout } from '../layouts';

const AuthLayoutRoute = ({ component: Component, ...rest }) => (
  !ls.get('token') ? (
    <Route
      {...rest}
      render={(matchProps) => (
        <AuthLayout>
          <Component {...matchProps} />
        </AuthLayout>
      )}
    />
  ) : <Redirect to="/home" />
);
export default AuthLayoutRoute;

AuthLayoutRoute.propTypes = {

  component: propTypes.elementType.isRequired,

};
