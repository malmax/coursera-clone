import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client/lib/main';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

import store from './redux/store';
import registerServiceWorker from './registerServiceWorker';
import AdminLayout from './routes/AdminLayout';
import ClientLayout from './routes/ClientLayout';
import './css/semantic.min.css';

const httpLink = createUploadLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const middlewareLink = setContext(() => ({
  headers: {
    'Access-Control-Request-Headers': 'x-refresh-token,x-token',
    'Access-Control-Expose-Headers': 'x-refresh-token,x-token',
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');
      console.log(token, refreshToken);
      if (token === 'none' || !refreshToken === 'none') {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
      }
    }

    return response;
  })
);

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
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
