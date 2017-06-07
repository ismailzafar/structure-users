import codes from '../lib/error-codes'
import {OrganizationModel, UserService} from 'structure-organizations'
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
    * Check existence of key value pair
    *
    * @public
    * @param {Object} req - Express req
    * @param {Object} res - Express res
    */
  checkExistence(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    const blacklist = [
      'hash',
      'password'
    ]

    const key = req.params.key.toLowerCase()
    const val = req.params.value.toLowerCase()

    return new Promise( async (resolve, reject) => {

      if(!key || blacklist.indexOf(key) > -1) return reject({
        code: codes.INVALID_KEY
      })

      if(!val) return reject({
        code: codes.INVALID_VALUE
      })

      const filter = {}
      filter[key] = val

      try {
        const existence = await userModel.checkExistence(key, val)

        resolve(existence)

      } catch(e) {

        reject({
          code: codes.UNKNOWN,
          message: e.message,
          stack: e.stack
        })

      }

    })

  }

  /**
   * Create new user
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  async create(req, res) {
    const pkg = Object.assign({}, req.body)
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    delete pkg.password

    return userModel.create(pkg)
  }

  /**
   * Delete user by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  deleteById(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.deleteById(req.params.id)

  }

  /**
   * Destroy user by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  destroyById(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.destroyById(req.params.id)

  }

  /**
   * Get all users
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getAll(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.getAll()

  }

  /**
   * Get user by email
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getByEmail(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.getByEmail(req.params.email)

  }

  /**
   * Get user by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getById(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid

    const organizationModel = new OrganizationModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return new Promise( async (resolve, reject) => {

      const id = req.params.id

      try {

        const result = await Promise.all([
          userModel.getById(id),
          organizationModel.ofUser(id)
        ])

        const user = result[0]
        user.organizationIds = []
        user.organizations = result[1] || []

        for(let i = 0, l = user.organizations.length; i < l; i++) {
          const org = user.organizations[i]

          user.organizationIds.push(org.id)
        }

        resolve(user)

      } catch(e) {

        this.logger.error('Could not getById', e)

        reject(e)
      }

    })

  }

  /**
   * Get user by username
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getByUsername(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.getByUsername(req.params.username)

  }

  /**
   * Update a user
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  async updateById(req, res) {

    let pkg = Object.assign({}, req.body)
    const userId = req.params.id
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })
    const organizationModel = new OrganizationModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    delete pkg.password

    if (pkg.organizationIds) {
      const userOrganizations = await organizationModel.ofUser(userId)
      const existingOrganizations = userOrganizations.map(({id}) => id)

      const orgsToRemove = existingOrganizations.filter((i) => {
        return pkg.organizationIds.indexOf(i) < 0
      })

      const orgsToAdd = pkg.organizationIds.filter((i) => {
        return existingOrganizations.indexOf(i) < 0
      })

      for (const orgId of orgsToRemove) {
        const userService = new UserService(orgId, userId, this.logger)
        await userService.removeUser()
      }

      for (const orgId of orgsToAdd) {
        const userService = new UserService(orgId, userId, this.logger)
        await userService.addUser()
      }
    }

    return userModel.updateById(userId, pkg)

  }

  updateProfile(req, res) {

    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    return userModel.updateProfile(req.params.id, req.body)

  }

}
