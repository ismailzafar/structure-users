import {errors, respond} from 'structure-dispatcher'
import {plugins} from 'structure-middleware'

export default [
  plugins,
  respond(),
  errors()
]
