import {errors} from 'structure-dispatcher'
const Plugin = require('../../src/index')

export default [
  'structure-organizations',
  'structure-applications',
  Plugin,
  'structure-groups',
  //'structure-digital-assets',
]
