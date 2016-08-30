/* eslint no-console: "allow" */

const net = require('net')
const port = process.env.WSW_SCRIPTS_PORT || 1337
const host = process.env.WSW_SCRIPTS_HOST || '0.0.0.0'

const client = {
  command(name, stdout, finished) {
    let socket = new net.Socket()

    socket.on('data', (data) => stdout(data.toString()))
    socket.on('close', finished)
    socket.connect(port, host, () => socket.write(name))
  }
}

module.exports = client
