import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import './index.css';

console.log('Starting to mount React application...');

const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found! Check if the HTML file has a div with id="root"');
} else {
  console.log('Root element found, creating React root...');
}

const root = createRoot(container);

console.log('Rendering React application...');

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
