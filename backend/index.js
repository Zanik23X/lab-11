const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

app.use(cors(
  {
    origin: 'http://localhost:4200'
  }
));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb+srv://withonick:tajimurat@cluster0.xxw1mxo.mongodb.net/task11?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error:', error));

const routes = require('./routes/routes');
app.use('/', routes);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('taskUpdate', (taskId) => {
    console.log('Received task update request for task:', taskId.taskId);
    io.emit('taskUpdateFront', taskId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
