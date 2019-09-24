
import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

function App() {
	const[level,setLevel]=useState('0');
  const socket = io('http://192.168.1.222:3000');

  socket.on('RECEIVE_DATA', (data) => {
    console.log(data);
	setLevel(data);
	console.log("variable works " + level);
  });

  return (
     <div className="app">
    <header>
      <h1>waterlevel</h1>
      <h4>Bamse's waterbowl</h4>
    </header>
    <div className="watercontent">
      <h2>The water level is</h2>
      <h3>{level}</h3>

      <div className="bowl">
          <div className="water">
        
          </div>
      </div>
    </div>
      
  </div>
  );
}

export default App;
