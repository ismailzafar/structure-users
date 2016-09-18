export default function controllerInterface(RootController, UserModel) {

  /**
   * UsersController Class
   *
   * @public
   * @class UsersController
   */
  return class UsersController extends RootController {

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
      var {username,email} = req.body
      return new Promise(async (resolve,reject) => {
        try{
          var user     = new UserModel(),
          response = await Promise.all([user.getByEmail(email),user.getByUsername(username)])
          if(!response[0] && !response[1]){
            resolve(user.create(req.body))
          }
        }
        catch(err){
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

}
