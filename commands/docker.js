let addonApi = require('./addon_api')
let utils = require('./utils')
let cli = require('heroku-cli-util')
let co = require('co')

function * docker (context, heroku) {
  let [, dockheroConfig] = yield addonApi.getConfigs(context, heroku)
  let env = yield addonApi.dockerEnv(dockheroConfig)
  try {
    yield utils.runCommand('docker', context.args, env)
  } catch (err) {
    if (err.code === 'ENOENT') {
      cli.error("Couldn't find docker binary installed locally")
      cli.warn(`Please see https://docs.docker.com/engine/installation/`)
      process.exit(1)
    }
    throw err
  }
}

module.exports = {
  topic: 'dh',
  command: 'docker',
  description: 'dockhero-docker',
  help: 'run docker against dockhero machine',
  needsApp: true,
  needsAuth: true,
  variableArgs: true,
  run: cli.command(co.wrap(docker))
}
