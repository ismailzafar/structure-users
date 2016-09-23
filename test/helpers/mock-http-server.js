import Dispatcher from 'structure-dispatcher'
const Plugin = require('../../src/index')
import pluginsInteface from 'structure-plugins'
import request from 'supertest-as-promised'
import RootController from 'structure-root-controller'
import RootModel from 'structure-root-model'
import Router from 'structure-router'
import Server from 'structure-server'

const plugins = pluginsInteface({
  Controller: RootController,
  Model: RootModel,
  list: [Plugin]
})

function MockHTTPServer(options = {}) {

  const api = new Server({
    router: new Router({
      dispatcher: new Dispatcher(),
      routes: plugins.routes
    })
  })

  return request(api.server)
}

export default MockHTTPServer
