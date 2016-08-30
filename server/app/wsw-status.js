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
      _onEnter() {
        wswClient.command('wsw-start', (data) => {
          this.trigger(data)
        })
      },
      success: STARTED,
      error: STOPPED
    },

    [STARTED]: {
      stop: STOPPING
    },

    [STOPPING]: {
      _onEnter() {
      }
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
  }
})

module.exports.STOPPED = STOPPED
module.exports.STARTING = STARTING
module.exports.STARTED = STARTED
module.exports.STOPPING = STOPPING

module.exports.wswServer = wswServer
