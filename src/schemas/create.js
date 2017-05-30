import createSchemaMiddleware from 'structure-validation-schema-middleware'
import {schema, keywords} from './create-update'

export default function constructSchemaCreate() {
  const finalSchema = Object.assign({}, schema)

  const strictMode = process.env.USER_REGISTRATION === 'strict'

  if (strictMode) {
    finalSchema.required = ['email', 'password', 'username', 'timezone']
  }

  return createSchemaMiddleware(
    finalSchema,
    null,
    keywords
  )
}
