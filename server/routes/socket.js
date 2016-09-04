/* eslint no-console: 0 */
/* eslint default-case: 0 */

const WebSocketRouter = require('websocket').router
const router = new WebSocketRouter()

const gameServer = require('../app/game-server').gameServer
const gameClient = require('../app/game-socket')

function sendCallback(err) {
  if (err) {
    console.error('send() error: ' + err)
  }
}

function originIsAllowed() {
  return true
}

router.mount('*', 'send-command-protocol', (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return
  }

  const connection = request.accept(request.origin)
  console.log((new Date()) + ' Connection accepted.')

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      let command = message.utf8Data
      console.log('Received Command: ' + command)

      switch (command) {
      case 'start':
        gameServer.start()
        gameServer.on('data', (data) => connection.send(data))
        return
      case 'stop':
        gameServer.stop()
        gameServer.on('data', (data) => connection.send(data))
        return
      case 'stats':
        gameClient.command('game-stats', (data) => connection.send(data.toString(), sendCallback))
      }
    }
  })

  connection.on('close', () => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
  })
})

module.exports = router
