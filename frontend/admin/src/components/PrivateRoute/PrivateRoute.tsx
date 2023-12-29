// PrivateRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../../Auth/AuthService';

const PrivateRoute = ({ component: Component, children, ...rest }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <Route
      {...rest}
       render={(props) =>
        isAuthenticated ? <Component {...props} >{children}</Component> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
