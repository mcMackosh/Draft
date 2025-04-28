import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppWrapper from './App';
import { ThemeProvider } from '@emotion/react';
import { theme } from './style/mui';
import { CssBaseline } from '@mui/material';
import React from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    </ThemeProvider>
  </Provider>
);
reportWebVitals();