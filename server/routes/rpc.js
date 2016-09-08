const express = require('express')
const router = express.Router()
const gameClient = require('../app/game-socket')

const cmd = (options) => JSON.stringify(options)

router.get('/game', (req, res) => {
  const commandOptions = Object.assign(req.query, { cmd: 'game' })
  console.log(commandOptions)
  gameClient.command(cmd(commandOptions))
  res.send('ok')
})

router.get('/start', (req, res) => {
  gameClient.command(cmd({ cmd: 'start' }))
  res.send('ok')
})

router.get('/stop', (req, res) => {
  gameClient.command(cmd({ cmd: 'stop' }))
  res.send('ok')
})

router.get('/stats', (req, res) => {
  gameClient.command(cmd({ cmd: 'stats' }), (data) => {
    res.write(data, 'utf8')
  }, () => {
    res.end()
  })
})

module.exports = router
