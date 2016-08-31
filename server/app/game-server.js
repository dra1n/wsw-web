const machina = require('machina')
const gameClient = require('./game-socket')

const STOPPED = 'STOPPED'
const STARTING = 'STARTING'
const STARTED = 'STARTED'
const STOPPING = 'STOPPING'

const gameServer = new machina.Fsm({
  initialState: STOPPED,
  states: {
    [STARTING]: {
      _onEnter() {
        this.command('game-start')
      },
      success: STARTED,
      error: STOPPED
    },

    [STARTED]: {
      stop: STOPPING
    },

    [STOPPING]: {
      _onEnter() {
        this.command('game-stop')
      },
      success: STOPPED,
      error: STARTED
    },

    [STOPPED]: {
      start: STARTING
    }
  },

  start() {
    this.handle('start')
  },

  stop() {
    this.handle('stop')
  },

  command(name) {
    gameClient.command(name, (data) => {
      this.emit('data', data.toString())
    }, (hadError) => {
      this.handle(hadError ? 'error' : 'success')
    })
  }
})

module.exports.STOPPED = STOPPED
module.exports.STARTING = STARTING
module.exports.STARTED = STARTED
module.exports.STOPPING = STOPPING

module.exports.gameServer = gameServer
