const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
// const exec = require('child_process').exec;
require('dotenv').config();

// MongoDB init
mongoose.set('useFindAndModify', false);
mongoose.connect(
  'mongodb+srv://admin:admin@cluster0.qty9z.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

const Logs = mongoose.model('Logs', { date: String, level: String });

// Express server init
const app = express();
app.use(cors('*'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, '../frontend/build')));

const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  let timeout;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      clearTimeout(timeout);
    },
  };
};

// Start Express server
const port = process.env.PORT || '3000';
const http = require('http').Server(app);
http.listen(port, () => console.log(`listening on port ${port}`));

// Socket io stuff
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('connection established');

  // Run python script process on raspberry pi to read the sensors
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python', ['waterlevel.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
    io.emit('RECEIVE_DATA', data.toString());
    const log = new Logs({ date: new Date(), level: data.toString() });
    log
      .save()
      .then(() => console.log('Successfully saved log to MongoDB Atlas'));
  });

  // Fake data when you don't run it from the raspberry pi
  //   setRandomInterval(
  //     () => {
  //       const level = Math.floor(Math.random() * (100 - 10));
  //       console.log(level);
  //       io.emit('RECEIVE_DATA', level);
  //       const log = new Logs({ date: new Date(), level: level });
  //       log
  //         .save()
  //         .then(() => console.log('Successfully saved log to MongoDB Atlas'));
  //     },
  //     1000,
  //     5000
  //   );
});

module.exports = app;
