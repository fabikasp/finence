import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';

const rootElement = document.getElementById('root');

if (rootElement != null) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <h1>Hello World!</h1>
    </Provider>
  );
}
