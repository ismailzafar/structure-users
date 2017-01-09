import Controller from './controllers/user'
import {dispatch} from 'structure-dispatcher'

const controller = new Controller()
const express = require('express')
const router = express.Router()

import schemaCreate from './schemas/create'

router.get('/existence/:key/:value', dispatch(controller, 'checkExistence'))
router.get(`/email/:email`, dispatch(controller, 'getByEmail'))
router.get(`/username/:username`, dispatch(controller, 'getByUsername'))
router.get(`/:id`, dispatch(controller, 'getById'))
router.get(`/`, dispatch(controller, 'getAll'))

router.patch(`/:id/profile`, dispatch(controller, 'updateProfile'))
router.patch(`/:id`, dispatch(controller, 'updateById'))

router.post(`/`, schemaCreate, dispatch(controller, 'create'))

router.delete(`/:id/destroy`, dispatch(controller, 'destroyById'))
router.delete(`/:id`, dispatch(controller, 'deleteById'))

export default function routes(options = {}) {

  return {
    routeName: 'users',
    routes: router
  }

}
