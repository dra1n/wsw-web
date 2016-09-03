/* eslint no-console: 0 */

const socket = new WebSocket('ws://' + window.location.host, 'send-command-protocol')

socket.onopen = () => {
  console.log('Socket connected.')
  socket.send('stats')
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
  console.log(event.data)
}

socket.onerror = (error) => {
  console.log('Error ' + error.message)
}
