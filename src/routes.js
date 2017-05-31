import Controller from './controllers/user'
import {dispatch} from 'structure-dispatcher'

const controller = new Controller()
const express = require('express')

import constructSchemaCreate from './schemas/create'
import schemaUpdate from './schemas/update'

export default function routes(options = {}) {

  const router = express.Router()

  router.get('/existence/:key/:value',             dispatch(controller, 'checkExistence'))
  router.get(`/email/:email`,                      dispatch(controller, 'getByEmail'))
  router.get(`/username/:username`,                dispatch(controller, 'getByUsername'))
  router.get(`/:id`,                               dispatch(controller, 'getById'))
  router.get(`/`,                                  dispatch(controller, 'getAll'))

  router.patch(`/:id/profile`, schemaUpdate,       dispatch(controller, 'updateProfile'))
  router.patch(`/:id`, schemaUpdate,               dispatch(controller, 'updateById'))

  router.post(`/`, constructSchemaCreate(),        dispatch(controller, 'create'))

  router.delete(`/:id/destroy`,                    dispatch(controller, 'destroyById'))
  router.delete(`/:id`,                            dispatch(controller, 'deleteById'))

  return {
    routeName: 'users',
    routes: router
  }

}
