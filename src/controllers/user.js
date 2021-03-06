import codes from '../lib/error-codes'
import PasswordService from 'structure-password-service'
import {OrganizationModel, UserService as OrgUserService} from 'structure-organizations'
import {ApplicationModel, UserService as AppUserService} from 'structure-applications'
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
    const pkg = req.body
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    if(pkg.password) {
      pkg.hash = await new PasswordService().issue(pkg.password)
      delete pkg.password
    }

    const user = await userModel.create(pkg)

    if (pkg.roles && pkg.roles.organizations) {
      const organizationIds = Object.keys(pkg.roles.organizations).filter(
        orgId => Boolean(pkg.roles.organizations[orgId].length)
      )

      for (const orgId of organizationIds) {
        const orgUserService = new OrgUserService(orgId, user.id, this.logger)
        await orgUserService.addUser(pkg.roles.organizations[orgId])
      }

    }

    if (pkg.roles && pkg.roles.applications) {

      const applicationIds = Object.keys(pkg.roles.applications).filter(
        appId => Boolean(pkg.roles.applications[appId].length)
      )

      for (const appId of applicationIds) {
        const appUserService = new AppUserService(appId, user.id, this.logger)
        await appUserService.addUser(pkg.roles.applications[appId])
      }

    }

    return user
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
        user.organizations = result[1] || []

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

    let pkg = req.body
    const userId = req.params.id
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid
    const userModel = new UserModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    if (pkg.roles && pkg.roles.organizations) {
      await this.updateOrganizations(req, pkg)
    }

    if (pkg.roles && pkg.roles.applications) {
      await this.updateApplications(req, pkg)
    }

    delete pkg.password

    return userModel.updateById(userId, pkg)

  }

  async updateApplications(req, pkg) {
    const userId = req.params.id
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid

    const appliationModel = new ApplicationModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    const userApplications = await appliationModel.ofUser(userId)
    const existingApplications = userApplications.map(({id}) => id)

    const applicationIds = Object.keys(pkg.roles.applications).filter(
      appId => Boolean(pkg.roles.applications[appId].length)
    )

    const appsToRemove = existingApplications.filter((i) => {
      return applicationIds.indexOf(i) < 0
    })

    const appsToAdd = applicationIds.filter((i) => {
      return existingApplications.indexOf(i) < 0
    })

    const appsToUpdate = applicationIds.filter((i) => {
      return appsToAdd.indexOf(i) < 0
    })

    for (const appId of appsToRemove) {
      const appUserService = new AppUserService(appId, userId, this.logger)
      await appUserService.removeUser()
      pkg.roles.applications[appId] = []
    }

    for (const appId of appsToAdd) {
      const appUserService = new AppUserService(appId, userId, this.logger)
      await appUserService.addUser(pkg.roles.applications[appId])
    }

    for (const appId of appsToUpdate) {
      const appUserService = new AppUserService(appId, userId, this.logger)
      await appUserService.updateUser(pkg.roles.applications[appId])
    }

  }

  async updateOrganizations(req, pkg) {
    const userId = req.params.id
    const applicationId = req.headers.applicationid
    const organizationId = req.headers.organizationid

    const organizationModel = new OrganizationModel({
      applicationId,
      logger: this.logger,
      organizationId
    })

    if(pkg.password) {
      pkg.hash = await new PasswordService().issue(pkg.password)
      delete pkg.password
    }

    const userOrganizations = await organizationModel.ofUser(userId)
    const existingOrganizations = userOrganizations.map(({id}) => id)

    const organizationIds = Object.keys(pkg.roles.organizations).filter(
      orgId => Boolean(pkg.roles.organizations[orgId].length)
    )

    const orgsToRemove = existingOrganizations.filter((i) => {
      return organizationIds.indexOf(i) < 0
    })

    const orgsToAdd = organizationIds.filter((i) => {
      return existingOrganizations.indexOf(i) < 0
    })

    const orgsToUpdate = organizationIds.filter((i) => {
      return orgsToAdd.indexOf(i) < 0
    })

    for (const orgId of orgsToRemove) {
      const orgUserService = new OrgUserService(orgId, userId, this.logger)
      await orgUserService.removeUser()
      pkg.roles.organizations[orgId] = []
    }

    for (const orgId of orgsToAdd) {
      const orgUserService = new OrgUserService(orgId, userId, this.logger)
      await orgUserService.addUser(pkg.roles.organizations[orgId])
    }

    for (const orgId of orgsToUpdate) {
      const orgUserService = new OrgUserService(orgId, userId, this.logger)
      await orgUserService.updateUser(pkg.roles.organizations[orgId])
    }

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
