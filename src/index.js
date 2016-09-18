import controllerInterface from './controller'
import migrations from './migrations'
import modelInterface from './model'
import routeInterface from './routes'

export default function pluginInterface(props = {}) {

  const Model = modelInterface(props.Model)
  const Controller = controllerInterface(props.Controller, Model)

  return {
    Controller,
    migrations,
    Model,
    routeName: 'users',
    routes: routeInterface({
      Controller
    })
  }

}
