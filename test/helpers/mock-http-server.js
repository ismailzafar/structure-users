import middleware from './middleware'
import pluginsInteface from 'structure-plugins'
import pluginsList from './plugins'
import request from 'supertest'
import Router from 'structure-router'
import Server from 'structure-server'

function MockHTTPServer(options = {}) {

  const plugins = pluginsInteface({
    list: pluginsList
  })

  const api = new Server({
    router: new Router({
      middleware,
      routes: plugins.routes
    })
  })

  return request(api.server)
}

export default MockHTTPServer
