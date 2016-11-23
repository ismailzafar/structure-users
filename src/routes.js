import Controller from './controllers/user'
import Dispatcher from 'structure-dispatcher'

const controller = new Controller()
const dispatcher = new Dispatcher()
const dispatch = dispatcher.dispatch
const respond = dispatcher.respond
const express = require('express')
const router = express.Router()

import schemaCreate from './schemas/create'

router.get('/existence/:key/:value', dispatch(controller, 'checkExistence'), respond())
router.get(`/email/:email`, dispatch(controller, 'getByEmail'), respond())
router.get(`/username/:username`, dispatch(controller, 'getByUsername'), respond())
router.get(`/:id`, dispatch(controller, 'getById'), respond())
router.get(`/`, dispatch(controller, 'getAll'), respond())

router.patch(`/:id/profile`, dispatch(controller, 'updateProfile'), respond())
router.patch(`/:id`, dispatch(controller, 'updateById'), respond())

router.post(`/`, schemaCreate, dispatch(controller, 'create'), respond())

router.delete(`/:id/purge`, dispatch(controller, 'purgeById'), respond())
router.delete(`/:id`, dispatch(controller, 'deleteById'), respond())

export default function routes(options = {}) {

  return {
    routeName: 'users',
    routes: router
  }

}
