/* eslint no-console: 0 */
/* eslint default-case: 0 */

const express = require('express')
const router = express.Router()
const gameClient = require('../app/terminal-socket')

router.ws('/terminal', (ws) => gameClient.connect(ws))

module.exports = router
