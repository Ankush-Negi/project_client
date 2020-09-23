
import React from 'react';
import propTypes from 'prop-types';
import { Footer } from '../components/Footer';

const AuthLayout = ({ children, ...rest }) => (
  <>
    <div>{children}</div>
    <div>
      {' '}
      <Footer />
    </div>
  </>
);
export default AuthLayout;

AuthLayout.propTypes = {
  children: propTypes.element.isRequired,
};
