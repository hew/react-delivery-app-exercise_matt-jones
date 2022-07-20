import logo from './logo.svg';
import './App.css';
import moment from 'moment';

import {
	fetchDeliveries
} from './lib/deliveries';

import React, { useState, useEffect } from 'react';

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [viewingDay] = useState(moment().format('YYYY-MM-DD'))

  useEffect(() => {
    const deliveries = fetchDeliveries(viewingDay);
    setDeliveries(deliveries);
  }, [viewingDay]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Deliveries For: { viewingDay }</h1>
        <pre>
          <code>
          { deliveries.map((delivery) => JSON.stringify(delivery, null, 2)) }
          </code>
        </pre>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
