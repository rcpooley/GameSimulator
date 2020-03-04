import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Router from './router';
import './index.css';

const socket = socketIO('http://localhost:8080');

function genID() {
    const alpha =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let id = '';
    for (let i = 0; i < 128; i++) {
        id += alpha[Math.floor(Math.random() * alpha.length)];
    }
    return id;
}

let id;
socket.on('connect', async () => {
    id = localStorage.getItem('id');
    if (!id) {
        id = genID();
        localStorage.setItem('id', id);
    }
    await call('init');

    onConnected();
});

function call(func, ...args) {
    return new Promise((resolve, reject) => {
        socket.emit('callFunc', id, func, args, ({ resp, error }) => {
            if (error) {
                reject(error);
            } else {
                resolve(resp);
            }
        });
    });
}

function onConnected() {
    ReactDOM.render(
        <BrowserRouter>
            <Router socket={call} />
        </BrowserRouter>,
        document.getElementById('root')
    );
}

if (module.hot) {
    module.hot.accept();
}
