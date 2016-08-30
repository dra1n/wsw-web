const machina = require('machina')
const wswClient = require('./wsw-client')

const STOPPED = 'STOPPED'
const STARTING = 'STARTING'
const STARTED = 'STARTED'
const STOPPING = 'STOPPING'

const wswServer = new machina.Fsm({
  initialState: STOPPED,
  states: {
    [STARTING]: {
      _onEnter() { this.command('wsw-start') },
      success: STARTED,
      error: STOPPED
    },

    [STARTED]: {
      stop: STOPPING
    },

    [STOPPING]: {
      _onEnter() { this.command('wsw-stop') },
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
    this.handle('start')
  },

  command(name) {
    wswClient.command(name, (data) => {
      this.emit('data', data.toString())
    }, (result) => {
      this.handle(result ? 'success' : 'error')
    })
  }
})

module.exports.STOPPED = STOPPED
module.exports.STARTING = STARTING
module.exports.STARTED = STARTED
module.exports.STOPPING = STOPPING

module.exports.wswServer = wswServer
