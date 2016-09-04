/* globals Terminal */

const GameConsole = {
  term: null,

  createTerminal(terminalContainer) {
    const shellprompt = '> '
    let command = []

    const term = new Terminal({
      cursorBlink: true
    })

    term.open(terminalContainer)
    term.fit()

    term.prompt = function () {
      term.write('\r\n' + shellprompt)
    }

    term.writeln('This is kind of game server management console.')
    term.writeln('Type "help" to list all available commands')
    term.writeln('')
    term.prompt()

    term.on('key', function (key, ev) {
      const printable = (
        !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
      )

      if (ev.keyCode === 13) {
        term.emit('command', command.join(''))
        command = []
        term.prompt()
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        command.pop(key)
        if (term.x > 2) {
          term.write('\b \b')
        }
      } else if (printable) {
        command.push(key)
        term.write(key)
      }
    })

    term.on('paste', (data) => {
      term.write(data)
    })

    GameConsole.term = term
    GameConsole.createHelpCommand()

    return term
  },

  createHelpCommand() {
    const { term } = GameConsole

    GameConsole.addCommand('help', () => {
      term.writeln('')
      term.writeln('Type:   "stats" to see server statistics')
      term.writeln('        "start" to start server')
      term.writeln('        "stop" to stop server')
      term.writeln('        "help" to see this help message')
    })
  },

  addCommand(name, handler) {
    const { term } = GameConsole

    term.on('command', (command) => {
      if (command === name) {
        handler()
      }
    })
  }
}
