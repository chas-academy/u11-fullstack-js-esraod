import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [waterLevel, setWaterLevel] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:3000/');

    socket.on('RECEIVE_DATA', (data) => {
      console.log(data);
      setWaterLevel(data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>waterlevel</h1>
        <h4>Bamse's waterbowl</h4>
      </header>
      <div className="watercontent">
        <h2> The water level is </h2>
        <h3> {waterLevel}% </h3>
        <div className="bowl">
          <div className="water"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
