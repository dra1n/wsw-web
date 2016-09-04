/* globals GameConsole */

/* eslint no-console: 0 */
/* eslint no-underscore-dangle: 0 */

const GameSocket = {
  socket: null,

  init() {
    const socket = new WebSocket('ws://' + window.location.host, 'send-command-protocol')

    socket.onopen = () => {
      console.log('Socket connected.')
    }

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log('Socket connection closed')
      } else {
        console.log('Socket connection interrupted')
      }
      console.log('Code: ' + event.code + ' reason: ' + event.reason)
    }

    socket.onmessage = (event) => {
      const { term } = GameConsole
      term.writeln(event.data.trim())
    }

    socket.onerror = (error) => {
      console.log('Error ' + error.message)
    }

    GameConsole.createTerminal(document.querySelector('.terminal'))
    GameSocket.socket = socket

    GameSocket.addCommandHandler('stats')
    GameSocket.addCommandHandler('start')
    GameSocket.addCommandHandler('stop')
  },

  addCommandHandler(command) {
    const { socket } = GameSocket
    const { term } = GameConsole

    GameConsole.addCommand(command, () => {
      term.writeln('')
      socket.send(command)
    })
  }
}

GameSocket.init()
