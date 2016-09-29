import Controller from './controllers/user'
import Dispatcher from 'structure-dispatcher'

const controller = new Controller()
const dispatch = new Dispatcher().dispatch
const express = require('express')
const router = express.Router()

router.get(`/email/:email`, dispatch(controller, 'getByEmail'))
router.get(`/username/:username`, dispatch(controller, 'getByUsername'))
router.get(`/:id`, dispatch(controller, 'getById'))
router.get(`/`, dispatch(controller, 'getAll'))

router.patch(`/:id/profile`, dispatch(controller, 'updateProfile'))
router.patch(`/:id`, dispatch(controller, 'updateById'))

router.post(`/`, dispatch(controller, 'create'))

router.delete(`/:id`, dispatch(controller, 'deleteById'))

export default function routes(options = {}) {

  return {
    routeName: 'users',
    routes: router
  }

}
