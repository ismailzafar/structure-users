import codes from '../../src/lib/error-codes'
import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import r from '../helpers/driver'
import UserController from '../../src/controllers/user'
import UserModel from '../../src/models/user'

Migrations.prototype.r = r

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

  it('should not create a user; duplicate username', async function() {

    var pkg1 = {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      username: 'testuser1',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg1)

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg2)

    expect(res.body.status).to.equal(400)
    expect(res.body.err.code).to.equal(codes.USER_DUPLICATE_USERNAME)

  })

  it('should not create a user; duplicate email', async function() {

    var pkg1 = {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      username: 'testuser2',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg1)

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg2)

    expect(res.body.status).to.equal(400)
    expect(res.body.err.code).to.equal(codes.USER_DUPLICATE_EMAIL)

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
