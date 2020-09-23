import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import { SignUp, Login, NoMatch, Home, Me } from './pages';
import UserList from './pages/Home/UserList';
import ProductList from './pages/Home/ProductList';
import OrderList from './pages/Home/OrderList';
import { AuthLayoutRoute, PrivateLayoutRoute } from './routes/index';
import { SnackBarProvider } from './contexts';
// import client from './lib/apollo-client';

function App() {
  return (
    <SnackBarProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/sign-up" />
          </Route>
          <AuthLayoutRoute exact path="/sign-up" component={SignUp} />
          <AuthLayoutRoute exact path="/login" component={Login} />
          <PrivateLayoutRoute exact path="/home" component={Home} />
          <PrivateLayoutRoute exact path="/me" component={Me} />
          <PrivateLayoutRoute exact path="/home/owner" component={UserList} />
          <PrivateLayoutRoute exact path="/home/product-manager" component={ProductList} />
          <PrivateLayoutRoute exact path="/home/user" component={OrderList} />
          {/* <PrivateLayoutRoute exact path="/children-demo" component={ChildrenDemo} />
          <PrivateLayoutRoute exact path="/input-demo" component={InputDemo} />  */}
          <PrivateLayoutRoute component={NoMatch} />
        </Switch>
      </Router>
    </SnackBarProvider>
  );
}

export default App;
