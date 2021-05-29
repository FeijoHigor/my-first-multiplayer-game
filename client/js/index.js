const screen = document.getElementById('screen')
const context = screen.getContext('2d')

const enemyHealthPoints = document.querySelectorAll('.e-healthpoint')
const yourHealthPoints = document.querySelectorAll('.y-healthpoint')

const socket = io('https://higor-multiplayer-game.herokuapp.com')

const health = document.getElementById('health')
const energy = document.getElementById('energy')

const eHealth = document.getElementById('e-health')
const eEnergy = document.getElementById('e-energy')

var gameState = {}
var currentPlayer;

function seeChanges() {
    const you = gameState.players[currentPlayer]
    health.textContent = you.hp
    energy.textContent = you.stamina
    for(playerId in gameState.players) {
        if(playerId !== currentPlayer) {
            const enemy = gameState.players[playerId]
            eHealth.textContent = enemy.hp
            eEnergy.textContent = enemy.stamina

            if(enemy.hp === 0) {
                window.alert("Você ganhou!! PARABENS!!")
                window.location.reload()
            }
        }
    }

    if(you.hp === 0) {
        window.alert("Você perdeu!! TENTE DE NOVO!!")
        window.location.reload()
    }
}

socket.on('you', ({ playerId }) => {
    currentPlayer = playerId
})

socket.on('setup', ({ state }) => {
    gameState = state
    renderScreen()
})

socket.on('playerChange', ({ playerId, changes }) => {
    gameState.players[playerId] = changes
})

socket.on('state', ({ state }) => {
    gameState = state
    seeChanges()
})

document.addEventListener('keydown', (e) => {
    socket.emit('keyPress', { keyPressed: e.key })
})

function renderScreen() {
    context.clearRect(0, 0, screen.width, screen.height)
    context.fillRect(0, screen.height / 2, screen.width, .1)


    for(playerId in gameState.players) {
        const player = gameState.players[playerId]
        if(playerId === currentPlayer) {
            context.fillStyle = '#5EA7EA'
            context.fillRect(player.x, player.y, 3, 3)
        }else {
            context.fillStyle = '#EA5E5E'
            context.fillRect(player.x, 27 - player.y, 3, 3)
        }

        for(bulletId in player.bullets) {
            const bullet = player.bullets[bulletId]

            if(bullet.player == currentPlayer) {
                context.fillStyle = '#138CFC'
                context.fillRect(bullet.x, bullet.y, 1, 1)
            }else {
                context.fillStyle = '#F53434'
                context.fillRect(bullet.x, 27 - bullet.y + 2, 1, 1)
            }
        }

    }

    requestAnimationFrame(renderScreen)
}
