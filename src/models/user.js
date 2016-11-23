import codes from '../lib/error-codes'
import {resources as daResources} from 'structure-digital-assets'
const DigitalAssetModel = daResources.models.DigitalAsset
import logger from 'structure-logger'
import RootModel from 'structure-root-model'

/**
 * UserModel Class
 *
 * @public
 * @class UserModel
 */
export default class UserModel extends RootModel {

  /**
   * UserModel constructor
   *
   * @public
   * @constructor
   * @param {Object} options - Options
   */
  constructor(options = {}) {
    super(Object.assign({}, {
      table: 'users',

      permissions: {
        create:  ['admin'],
        delete:  ['admin'],
        read:    ['organization'],
        replace: ['admin'],
        update:  ['self', 'admin'],
      },
      relations: {
        hasMany: [
          {
            node: 'documents',
            link: {
              foreignKey: 'documentId',
              localKey: 'userId'
            },
            joinTable: 'link_users_documents'
          },
          {
            node: 'document_revisions',
            link: {
              foreignKey: 'documentRevisionsId',
              localKey: 'userId'
            },
            joinTable: 'link_users_document_revisions'
          },
          {
            node: 'templates',
            link: {
              foreignKey: 'templateId',
              localKey: 'userId'
            },
            joinTable: 'link_users_templates'
          },
          {
            node: 'template_revisions',
            link: {
              foreignKey: 'templateRevisionsId',
              localKey: 'userId'
            },
            joinTable: 'link_users_template_revisions'
          }
        ],
        hasManyAndBelongsTo: [
          {
            node: 'groups',
            link: {
              foreignKey: 'groupId',
              localKey: 'userId'
            },
            joinTable: 'link_groups_users'
          },
          {
            node: 'organizations',
            link: {
              foreignKey: 'organizationId',
              localKey: 'userId'
            },
            joinTable: 'link_organizations_users'
          }
        ]
      }
    }, options))
  }

  /**
   * Create, or save, user data for the model
   *
   * @public
   * @param {Object} pkg - Data to be saved
   * @param {Object} options - Options
   */
  create(pkg = {}, options = {}) {

    return new Promise( async (resolve, reject) => {

      try {
        var doc = await RootModel.prototype.create.call(this, pkg, options)

        resolve(doc)
      }
      catch(e) {
        logger.error(e)

        reject({
          code: codes.UKNOWN
        })
      }

    })

  }

  getAll(ids = []) {

    const da = new DigitalAssetModel()
    const r = this.r
    const state = ['active']

    return new Promise( async (resolve, reject) => {

      try {

        const users = []

        let query = r
          .table(this.table)

        if(ids.length > 0) {

          query = query
            .getAll(r.args(ids))
            .filter(function(doc) {
              return r.expr(state).contains(doc('__state'))
            })

        }

        else {
          query = query.getAll(...state, {index: '__state'})
        }

        //query = query.eqJoin('imageId', this.r.table('digital_assets'), {index: 'id'}) <-- won't work as not evey user has an image :/

        const userRes = await query.run()

        const digitalAssetIds = []

        for(let i = 0, l = userRes.length; i < l; i++) {
          const user = userRes[i]
          if(user.imageId) digitalAssetIds.push(user.imageId)
        }

        const daRes = await r
          .table('digital_assets')
          .getAll(r.args(digitalAssetIds))

        const daMap = new Map()
        for(let i = 0, l = daRes.length; i < l; i++) {
          const da = daRes[i]

          daMap.set(da.id, da)
        }

        for(let i = 0, l = userRes.length; i < l; i++) {
          const user = userRes[i]

          if(user.imageId && user.imageId.length > 1) {
            user.avatar = daMap.get(user.imageId)
          }

          users.push(user)

        }

        resolve(users)

      }
      catch(e) {
        reject(e)
      }

    })

  }

  /**
   * Get user by email
   *
   * @public
   * @param {String} email
   */
  getByEmail(email) {

    const state = ['active']

    return new Promise( async (resolve, reject) => {

      try {
        var user = await this.r.table(this.table).getAll(...state, {index: '__state'}).filter({email}).limit(1)

        if(user[0]) return resolve(user[0])

        resolve()
      }
      catch(e) {

        reject(e)

      }

    })
  }

  getById(id) {

    const da = new DigitalAssetModel()

    return new Promise( async (resolve, reject) => {

      try {

        const user = await RootModel.prototype.getById.call(this, id)

        if(user.imageId && user.imageId.length > 1) {
          user.avatar = await da.getById(user.imageId)
        }

        resolve(user)

      }
      catch(e) {
        reject(e)
      }

    })

  }

  /**
   * Get user by username
   *
   * @public
   * @param {String} username
   */
  getByUsername(username) {

    const state = ['active']

    return new Promise( async (resolve, reject) => {

      try {
        var user = await this.r.table(this.table).getAll(...state, {index: '__state'}).filter({username}).limit(1)

        if(user[0]) return resolve(user[0])

        resolve()
      }
      catch(e) {

        reject(e)

      }

    })

  }

  /**
   * Update user
   *
   * @public
   * @param {String} id
   * @param {Object} pkg - Data to update user
   * @param {Object} options - Options
   */
  updateById(id, pkg = {}, options = {}) {

    if(pkg.password) {
      logger.warn('User.update does not support property password; deleted.')
      delete pkg.password
    }

    return RootModel.prototype.updateById.call(this, id, pkg, options)

  }

  /**
   * Update user profile
   *
   * @public
   * @param {String} id
   * @param {Object} pkg - Data to update user
   * @param {Object} options - Options
   */
  updateProfile(id, pkg = {}, options = {}) {

    return this.udpateById.apply(this, arguments)

  }

}
