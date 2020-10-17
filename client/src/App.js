import React, { Fragment } from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import { Routes } from './Routes';

function App() {
  const routes = Routes()
  return (
    <Fragment>
        <Router>
            {routes}
        </Router>
    </Fragment>
  );
}

export default App;
