import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import { Routes } from './Routes';

function App() {
  const routes = Routes()
  return (
    <div className="container">
        <Router>
            {routes}
        </Router>
    </div>
  );
}

export default App;
