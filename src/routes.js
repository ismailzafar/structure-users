import Controller from './controllers/user'
import Dispatcher from 'structure-dispatcher'

const controller = new Controller()
const dispatch = new Dispatcher().dispatch
const express  = require('express')
const routes   = express.Router()

routes.get(`/:id`,    dispatch(controller, 'getById'))
routes.get(`/`,       dispatch(controller, 'getAll'))

routes.patch(`/:id`,  dispatch(controller, 'updateById'))

routes.post(`/`,      dispatch(controller, 'create'))

routes.delete(`/:id`, dispatch(controller, 'deleteById'))

export default routes
