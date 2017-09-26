import {registerHook} from 'structure-dispatcher'
import {invalidateAllCacheHook} from 'structure-cache-middleware'

registerHook({
  when: 'after',
  serviceName: 'users',
  actionNames: ['updateById'],
}, invalidateAllCacheHook)
