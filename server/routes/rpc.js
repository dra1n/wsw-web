const express = require('express')
const router = express.Router()
const gameServer = require('../app/game-server').gameServer
const gameClient = require('../app/game-socket')

router.get('/start', function (req, res) {
  gameServer.start()
  res.send('ok')
})

router.get('/stop', function (req, res) {
  gameServer.stop()
  res.send('ok')
})

router.get('/stats', function (req, res) {
  gameClient.command('game-stats', (data) => {
    res.write(data, 'utf8')
  }, () => {
    res.end()
  })
})

module.exports = router
