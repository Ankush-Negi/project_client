import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import callApi from '../../lib/utils/api';
import ls from 'local-storage';

export default class Home extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          roles: '',
      }
  }
  componentDidMount = async () => {
      await callApi({
        params: {
          skip: 0, limit: 20,
        },
        headers: { authorization: ls.get('token') },
      },'/user/me','get')
      .then((response) => {
        const { role } = response;
        this.setState({roles: role});
      });
  }
  render = () => {
    const { roles } = this.state;
    return(
        <Route exact path="/home">
          <Redirect to={`/home/${roles}`} />
        </Route>
    );
  };
}
