import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { persistor, Store } from './store/Store'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

axios.defaults.baseURL = 'https://onlinetestbackendapplication.herokuapp.com/'

ReactDOM.render(
  
  <React.StrictMode>
    <Provider store={Store} >
      <PersistGate persistor={persistor} loading={null}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

reportWebVitals();
