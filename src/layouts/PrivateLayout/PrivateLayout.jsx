import React from 'react';
import propTypes from 'prop-types';
import { Navbar } from '../components';

const PrivateLayout = ({ children, ...rest }) => (
  <>
    <div><Navbar /></div>
    <br />
    <div>{children}</div>
  </>
);
export default PrivateLayout;

PrivateLayout.propTypes = {
  children: propTypes.element.isRequired,
};
