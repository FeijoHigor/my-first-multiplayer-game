const screen = document.getElementById('screen')
const context = screen.getContext('2d')

const enemyHealthPoints = document.querySelectorAll('.e-healthpoint')
const yourHealthPoints = document.querySelectorAll('.y-healthpoint')

/* const enemyEnergy = document.querySelector('.e-energy')
 */
const socket = io('http://localhost:3000')

var gameState = {}
var currentPlayer;

function updateStatus() {
    for(const playerId in gameState.players) {     
        if(playerId !== currentPlayer) {
            let player = gameState.players[playerId]
            let hp = player.hp
            for(let c = 0; c < hp ; c++) {
                enemyHealthPoints[c].classList.add('green')
            }
        }else {
            let player = gameState.players[playerId]
            let hp = player.hp
            for(let c = 0; c < hp ; c++) {
                yourHealthPoints[c].classList.add('green')
            }
        }
    }
}
 
socket.on('you', ({ playerId }) => {
    currentPlayer = playerId
})

socket.on('setup', ({ state }) => {
    gameState = state
    renderScreen()
    updateStatus()
})

socket.on('playerChange', ({ playerId, changes }) => {
    gameState.players[playerId] = changes
    const countBullets = bulletCount()
    
    if(countBullets > 0) {
        moveBullets()
    }
})

socket.on('state', ({ state }) => {
    gameState = state
})

function bulletCount() {
    var count = 0
    for(const playerId in gameState.players) {
        const player = gameState.players[playerId]
        for(const bullet in player.bullets) {
            count++
        }
    } 

    return count
}

function moveBullets() {
    for(playerId in gameState.players) {
        const player = gameState.players[playerId]
        for(bulletId in player.bullets) {
            const bullet = player.bullets[bulletId]
            var interval

            interval = setInterval(() => {
                bullet.y = bullet.y - 1
                if(bullet.y < 0) {
                    clearInterval(interval)
                }
            }, 50)
        }
    }
}


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
