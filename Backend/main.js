const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const GameHandler = require('./gameHandler');
const config = require('./config.json');

const app = express();

app.get('*', (req, res) => {
    res.send('Hello world');
});

const server = http.createServer(app);

const io = socketIO(server);

const game = new GameHandler();

io.on('connection', socket => {
    game.onSocket(socket);
});

server.listen(config.port, () => {
    console.log(`Listening on *:${config.port}`);
});
