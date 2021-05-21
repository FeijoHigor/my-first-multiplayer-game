const express = require('express')
const http = require('http')

const createGame = require('./game')

const app = express()
const server = http.createServer(app)

const socketio = require('socket.io')

const io = socketio(server, {
    cors: {
        origin: '*'
    }
})

const game = createGame.createGame()

io.on('connection', (socket) => {
    const playerId = socket.id

    const playerX = Math.floor(Math.random() * (27 - 0 + 1) + 0);
    const playerY = Math.floor(Math.random() * (27 - 15 + 1) + 15);

    game.addPlayer({ 
        playerId, 
        playerX, 
        playerY,
        stamina: 3,
        hp: 5,
        bullets: {}
    })

    /* setInterval(() => {
        io.emit('state', {state: game.state})
    }, 500) */

    io.emit('setup', { state: game.state })

    socket.emit('you', { playerId })

    socket.on('keyPress', (command) => {
        const { keyPressed } = command
        game.keyPressed({ playerId, keyPressed })
        io.emit('playerChange', { changes: game.state.players[playerId], playerId })
    })

    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
        io.emit('state', { state: game.state })
    })
})

server.listen(3000, () => {
    console.log('server running')
})