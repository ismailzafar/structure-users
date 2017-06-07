import UserModel from '../models/user'
const userModel = new UserModel()

const schema = {
  "$async": true,
  "properties": {
    "email": {
      "duplicate_email": true,
      "lowercase": true,
      "format": "email",
      "type": "string",
    },
    "password": {
      "type": "string"
    },
    "username": {
      "duplicate_username": true,
      "lowercase": true,
      "type": "string"
    },
    "timezone": {
      "type": "string",
      "timezone": true,
    },
    "bio": {
      "type": "string"
    },
    "facebookUrl": {
      "type": "string"
    },
    "twitterUrl": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "imageId": {
      "type": "string"
    },
    "roles": {
      "type": "array",
      "items": {
        "lowercase": true,
        "type": "string"
      }
    },
  }
}

const keywords = {
  "duplicate_email": {
    "async": true,
    "format": "email",
    "type": "string",
    "compile": (sch, parentSchema) => {

      return async function(data, dataPath, parentData, propertyName, rootData) {

        const res = await userModel.getByEmail(data.toLowerCase())

        // Failed, should not have duplicate email
        if(res && res.id !== rootData.params.id) {
          return false
        }

        return true

      }
    },
    "errorHandler": function() {
      return {
        errorCode: "EMAIL_DUPLICATE",
        statusCode: 400
      }
    }
  },
  "duplicate_username": {
    "async": true,
    "type": 'string',
    "compile": function checkDuplicateUsername(sch, parentSchema) {

      return async function(data, dataPath, parentData, propertyName, rootData) {

        const res = await userModel.getByUsername(data.toLowerCase())

        // Failed, should not have duplicate username
        if(res && res.id !== rootData.params.id) {
          return false
        }

        return true

      }
    },
    "errorHandler": function() {
      return {
        errorCode: "USERNAME_DUPLICATE",
        statusCode: 400
      }
    }
  }
}

export {schema}
export {keywords}
