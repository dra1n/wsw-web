/* eslint no-console: 0 */
/* eslint default-case: 0 */

const router = require('express').Router()
const expressWs = require('express-ws')
const gameClient = require('../app/terminal-socket')

expressWs(router)

router.ws('/terminal', (ws) => {
  gameClient.connect(ws)
})

module.exports = router
