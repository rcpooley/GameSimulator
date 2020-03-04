const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const GameHandler = require('./gameHandler');
const config = require('./config.json');

const app = express();

app.use(express.static(path.resolve(__dirname, '../Frontend/dist')));
app.use((req, res) =>
    res.sendFile(path.resolve(__dirname, '../Frontend/dist/index.html'))
);

const server = http.createServer(app);

const io = socketIO(server);

const game = new GameHandler(io);

io.on('connection', socket => {
    game.onSocket(socket);
});

server.listen(config.port, () => {
    console.log(`Listening on *:${config.port}`);
});
