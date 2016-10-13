import {errors} from 'structure-dispatcher'
const Plugin = require('../../src/index')

export default [
  'structure-organizations',
  Plugin,
  'structure-groups',
  errors()
]
