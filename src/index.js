import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';

//import Bootstrap JS
import "bootstrap";

//import Bootstrap CSS
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

//import CSS main segun ENV
if (process.env.REACT_APP_ENV!=='local') require('./assets/css/main.min.css');
else require('./assets/main.scss');

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);