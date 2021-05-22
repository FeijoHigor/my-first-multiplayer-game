function createGame() {

    const state = {
        players: {}
    }

    function addPlayer(command) {
        const { playerId, playerX, playerY, color, stamina, hp, bullets } = command

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            stamina,
            hp,
            bullets
        }
    }

    function removePlayer(command) {
        const { playerId } = command

        delete state.players[playerId]
    }

    function addBullet(command) {
        const { playerId, player, bulletId, bulletX, bulletY } = command

        player.bullets[bulletId] = {
            x: bulletX,
            y: bulletY,
            player: playerId
        }

        player.stamina--
        addStamina({ player })
    }

    function removeBullet(command) {
        const { bulletId, player } = command

        delete player.bullets[bulletId]
    }

    function moveBullet(command) {
        const { bulletId, player } = command

        const bullet = player.bullets[bulletId]

        var interval = 0

        const enemyPosition = () => {
            for(playerId in state.players) {
                if(playerId !== bullet.player) {
                    var enemy = state.players[playerId]
                }
            }

            if(enemy) {
                return { 
                    position : {
                        x: enemy.x, 
                        y: enemy.y 
                    },
                    enemy}
            }
        }

        interval = setInterval(() => {
            bullet.y = bullet.y - 1
            if(enemyPosition()) {
                const { position, enemy } = enemyPosition()
    
                const colision = [ false, false ]
    
                if(bullet.x === position.x || bullet.x === position.x + 1 || bullet.x === position.x + 2) {
                    colision[0] = true
                }
    
                if( bullet.y === 27 - position.y || bullet.y === 27 - position.y + 1 || bullet.y === 27 - position.y + 2) {
                    colision[1] = true
                }
    
                if(colision[0] && colision[1]) {
                    console.log('bateu')
                    console.log(enemy.hp)
                    removeBullet({ bulletId, player })
                    enemy.hp--
                    clearInterval(interval)
                }
            }
            
            if(bullet.y < 0) {
                removeBullet({ bulletId, player})
                clearInterval(interval)
            }
        }, 50)
        
    }

    function addStamina(command) {
        const { player } = command

        setTimeout(() => {player.stamina++}, 3000)
    }

    function keyPressed(command) {

        const acceptedKeys = {
            ArrowUp(player) {
                if(player.y > 15) {
                    player.y = player.y - 1
                }
            },
            ArrowDown(player) {
                if(player.y < 27) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if(player.x > 0) {
                    player.x = player.x - 1
                }
            },
            ArrowRight(player) {
                if(player.x < 27) {
                    player.x = player.x + 1
                }
            },
            ' '() {
                if(player.stamina > 0) {
                    const bulletId = Math.floor(Math.random() * 10000000)
                    addBullet({ 
                        bulletId, 
                        playerId, 
                        player, 
                        bulletX: player.x + 1, 
                        bulletY: player.y 
                    })
                    moveBullet({ bulletId, player, playerId })
                }
            }
        }

        const { playerId, keyPressed } = command
        const player = state.players[playerId]
        const keyFunction = acceptedKeys[keyPressed]

        if(player && keyFunction) {
            acceptedKeys[keyPressed](player)
        }

    }

    return {
        addPlayer,
        removePlayer,
        keyPressed,
        removeBullet,
        addStamina,
        state
    }
}

module.exports = { createGame }