import codes from '../lib/error-codes'
import RootController from 'structure-root-controller'
import UserModel from '../models/user'

/**
 * UsersController Class
 *
 * @public
 * @class UsersController
 */
export default class UsersController extends RootController {

  /**
   * UsersController constructor
   *
   * @public
   * @constructor
   * @param {Object} options - Options
   */
   constructor(options = {}) {
     super(Object.assign({}, {
       name: 'users'
     }, options))
   }

   /**
   * Create new user
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  create(req, res) {
    const {username, email} = req.body

    return new Promise( async (resolve,reject) => {

      try {
        const user = new UserModel()

        const response = await Promise.all([
          user.getByEmail(email),
          user.getByUsername(username)
        ])

        if(!response[0] && !response[1]) {
          resolve(user.create(req.body))
        }

        const code = (response[0]) ? codes.USER_DUPLICATE_EMAIL : codes.USER_DUPLICATE_USERNAME

        reject({
          code,
          message: 'User already exists'
        })
      }
      catch(err) {
        reject(err)
      }

    })
  }

  /**
   * Get user by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getById(req, res) {

    var user = new UserModel()

    return user.getById(req.params.id)

  }

  /**
   * Get all users
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getAll(req, res) {

    var user = new UserModel()

    return user.getAll()

  }

  /**
   * Update a user
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  updateById(req, res) {

    var user = new UserModel()

    return user.updateById(req.params.id, req.body)

  }

}
