import Controller from './controllers/user'
import migrations from './migrations'
import Model from './models/user'
import routes from './routes'

export default function pluginInterface(props = {}) {

  return {
    routes
  }

}

const resources = {
  controllers: {
    Application: Controller
  },
  models: {
    Application: Model
  }
}

const settings = {
  pluginName: 'users',
  routeName: 'users'
}

export {migrations}
export {resources}
export {settings}
