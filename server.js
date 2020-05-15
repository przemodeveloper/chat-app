const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });
    socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    socket.on('join', (user) => {
        users.push({name: user, id: socket.id});
        console.log('I registered the following user: ' + user + ' and his id: ' + socket.id);
        socket.broadcast.emit('join', user);
    })

    socket.on('disconnect', () => {
        const found = users.find(element => element.id === socket.id);
        socket.broadcast.emit('removeUser', found.name);
    })

    console.log('I\'ve added a listener on message and disconnect events \n');
  });