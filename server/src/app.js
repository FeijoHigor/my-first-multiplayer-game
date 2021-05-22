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

    var newState = JSON.parse(JSON.stringify(game.state))
    
    function seeIqual(firstObj, secndObj) {
        var firstObjJS = JSON.stringify(firstObj)
        var secndObjJS = JSON.stringify(secndObj)

        const isIqual = Object.is(firstObjJS, secndObjJS)

        return isIqual
    }

    setInterval(() => {
        const isEqual = seeIqual(game.state, newState)
        if(!isEqual) {    
            newState = JSON.parse(JSON.stringify(game.state))
            io.emit('state', {state: game.state})
        } 
    }, 50)

    io.emit('setup', { state: game.state })

    socket.emit('you', { playerId })

    socket.on('keyPress', (command) => {
        const { keyPressed } = command
        game.keyPressed({ playerId, keyPressed })
    })

    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
    })
})

server.listen(3000, () => {
    console.log('server running')
})