import Ajv from 'ajv'
const ajv = new Ajv({
  allErrors: false,
  format: 'full'
})
import UserModel from '../models/user'

const userRegistrationMode = (process.env.USER_REGISTRATION) ? process.env.USER_REGISTRATION : 'strict'
const userModel = new UserModel()
const strictMode = userRegistrationMode == 'strict'

ajv.addKeyword('duplicate_email', {
  async: true,
  format: 'email',
  type: 'string',
  compile: function checkDuplicateUserEmail(sch, parentSchema) {

    return async function(data) {

      const res = await userModel.getByEmail(data)

      // Failed, should not have duplicate email
      if(res) return false

      return true

    }
  }
})

ajv.addKeyword('duplicate_username', {
  async: true,
  type: 'string',
  compile: function checkDuplicateUsername(sch, parentSchema) {

    return async function(data) {

      const res = await userModel.getByUsername(data)

      // Failed, should not have duplicate username
      if(res) return false

      return true

    }
  }
})

const schema = {
  "$async": true,
  "properties": {
    "email": {
      "duplicate_email": {},
      "format": "email",
      "type": "string"
    },
    "password": {
      "type": "string"
    },
    "username": {
      "duplicate_username": {},
      "type": "string"
    }
  }
}

if(strictMode) {

  schema.required = ['email', 'password', 'username']

}

const validate = ajv.compile(schema)

export default function schemaCreate(req, res, next) {

  const pkg = req.body

  // Only support lowercase here, as RethinkDB is case sensitive
  if(pkg.email) pkg.email = pkg.email.toLowerCase()
  if(pkg.username) pkg.username = pkg.username.toLowerCase()

  validate(pkg)
    .then(() => {
      next()
    })
    .catch((res) => {
      next(res.errors)
    })

}
