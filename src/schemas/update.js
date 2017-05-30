import createSchemaMiddleware from 'structure-validation-schema-middleware'
import {schema, keywords} from './create-update'

export default createSchemaMiddleware(schema, null, keywords)
