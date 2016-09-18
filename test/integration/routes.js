import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import userControllerInterface from '../../src/controller'
import userModelInterface from '../../src/model'
import r from '../helpers/driver'
import RootController from 'structure-root-controller'
import RootModel from 'structure-root-model'

Migrations.prototype.r = r
RootModel.prototype.r = r

const UserModel = userModelInterface(RootModel)
const UserController = userControllerInterface(RootController, UserModel)

describe('Routes', function() {

  beforeEach(function() {

    this.migration = new Migrations({
      db: 'test',
      items: migrationItems
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  it('should create a user', async function() {

    var pkg = {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(201)

  })

  it('should get a user by Id', async function() {

    var pkg = {
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${userId}`)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get all users', async function() {

    var pkg = {
      username: 'testuser3',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users`)

    expect(res.body.pkg.users.length).to.be.above(0)
    expect(res.body.status).to.equal(200)

  })

  it('should update a user by Id', async function() {

    var pkg = {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var usersId = user.body.pkg.id

    var res = await new MockHTTPServer()
      .patch(`/api/${process.env.API_VERSION}/users/${usersId}`)
      .send({
        username: 'updateduser4'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${usersId}`)

    expect(res2.body.pkg.username).to.equal('updateduser4')
    expect(res.body.status).to.equal(200)

  })

})
