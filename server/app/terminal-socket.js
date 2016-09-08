/* eslint no-console: 0 */
/* eslint no-process-env: 0 */

const net = require('net')
const port = process.env.WSW_SCRIPTS_PTY_PORT || 8007
const host = process.env.WSW_SCRIPTS_HOST || '0.0.0.0'

const client = {
  connect(ws) {
    const terminal = new net.Socket()

    terminal.on('data', (data) => {
      try {
        ws.send(data.toString())
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    })

    ws.on('message', (msg) => terminal.write(msg))
    ws.on('close', () => terminal.end())

    terminal.connect(port, host)

    return terminal
  }
}

module.exports = client
