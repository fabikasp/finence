import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';
import { assertNonNullable } from './utils/assert';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Frame from './components/Frame';

const rootElement = document.getElementById('root');
assertNonNullable(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Frame>
        <Routes>
          <Route index element={<div>TEST123</div>} />
          <Route path="test" element={<div>TEST456</div>} />
        </Routes>
      </Frame>
    </BrowserRouter>
  </Provider>
);
