import accessControl from './access-control'
import Controller from './controllers/user'
import migrations from './migrations'
import Model from './models/user'
import routes from './routes'

export default function pluginInterface(options = {}) {

  return routes(options)

}

const resources = {
  controllers: {
    User: Controller
  },
  models: {
    User: Model
  }
}

const settings = {
  accessControl,
  migrations,
  pluginName: 'users'
}

export {resources}
export {settings}
