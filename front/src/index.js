import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import registerServiceWorker from './registerServiceWorker';
import AdminLayout from './routes/AdminLayout';
import ClientLayout from './routes/ClientLayout';
import './css/semantic.min.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={AdminLayout} />
          <Route path="/" component={ClientLayout} />
          <Route path="*" render={() => <div>Page Not Found</div>} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

registerServiceWorker();
