import codes from '../lib/error-codes'
import PasswordService from 'structure-password-service'
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
  async create(req, res) {
    const pkg = req.body
    const userModel = new UserModel()

    if(pkg.__ghost) {
      delete pkg.__ghost

      return userModel.create(pkg)
    }

    pkg.hash = await new PasswordService().issue(pkg.password)
    delete pkg.password

    return Promise
      .all([
        userModel.getByEmail(pkg.email),
        userModel.getByUsername(pkg.username)
      ])
      .then((response) => {

        if((!response[0] || response[0].length == 0) && (!response[1] || response[1].length == 0)) {
          return Promise.resolve()
        }

        const code = (response[0]) ? codes.USER_DUPLICATE_EMAIL : codes.USER_DUPLICATE_USERNAME

        return Promise.reject({
          code,
          message: 'User already exists'
        })
      })
      .then(() => {
        return userModel.create(pkg)
      })
  }

  deleteById(req, res) {

    const user = new UserModel()

    return user.deleteById(req.params.id)

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
   * Get user by email
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getByEmail(req, res) {
    console.error('hit???')
    const user = new UserModel()

    return user.getByEmail(req.params.email)

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
   * Get user by username
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getByUsername(req, res) {

    const user = new UserModel()

    return user.getByUsername(req.params.username)

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

  updateProfile(req, res) {

    const user = new UserModel()

    return user.updateProfile(req.params.id, req.body)

  }

}
