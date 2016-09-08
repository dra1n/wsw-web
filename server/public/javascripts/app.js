/* globals Terminal */

const GameConsole = {
  init() {
    GameConsole.createTerminal(document.querySelector('.terminal'))
  },

  runRealTerminal(socket, terminal) {
    terminal.attach(socket)
  },

  createTerminal(terminalContainer) {
    while (terminalContainer.children.length) {
      terminalContainer.removeChild(terminalContainer.children[0])
    }

    const terminal = new Terminal({
      cursorBlink: true
    })

    const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://'
    const socketURL = protocol + location.hostname +
      ((location.port) ? (':' + location.port) : '') + '/terminal'

    terminal.open(terminalContainer)
    terminal.fit()

    const { cols, rows } = terminal.proposeGeometry()

    fetch('/game?cols=' + cols + '&rows=' + rows + '&pty=true').then((res) => {
      res.text().then(() => {
        const socket = new WebSocket(socketURL)
        socket.onopen = () => GameConsole.runRealTerminal(socket, terminal)
      })
    })
  }
}

GameConsole.init()
