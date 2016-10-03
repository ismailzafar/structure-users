import Dispatcher from 'structure-dispatcher'
import pluginsInteface from 'structure-plugins'
import pluginsList from './plugins'
import request from 'supertest-as-promised'
import Router from 'structure-router'
import Server from 'structure-server'

const plugins = pluginsInteface({
  list: pluginsList
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
