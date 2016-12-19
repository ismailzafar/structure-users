import codes from '../../src/lib/error-codes'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import pluginsList from '../helpers/plugins'
import UserController from '../../src/controllers/user'
import UserModel from '../../src/models/user'

describe.only('Routes', function() {

  before(function() {

    this.migration = new Migrations({
      db: 'test',
      items: {
        tables: [{
          action: 'create',
          table: 'digital_assets',
        }],
      },
      plugins: pluginsList
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  it('should not create a user; missing username', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        email: 'testuser1@mail.com',
        password : 'foo88'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_USERNAME)

  })

  it('should not create a user; missing email', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        username: 'fpp',
        password : 'foo88'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_EMAIL)

  })

  it('should not create a user; missing password', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        username: 'woober',
        email: 'woo@gfoo.com'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_PASSWORD)

  })

  it('should not create a user; missing organization', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        password: 'pumpitup',
        username: 'woober',
        email: 'woo@gfoo.com'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_ORGANIZATIONID)

  })

  it('should not create a user; duplicate username', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg1 = {
      organizationId: org.id,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: org.id,
      username: 'testuser1',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg1)

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg2)

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal(codes.DUPLICATE_USERNAME)

  })

  it('should not create a user; duplicate username (case)', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg1 = {
      organizationId: org.id,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: org.id,
      username: 'Testuser1',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg1)

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg2)

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal(codes.DUPLICATE_USERNAME)

  })

  it('should not create a user; duplicate email', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg1 = {
      organizationId: org.id,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: org.id,
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
    expect(res.body.err.code).to.equal(codes.DUPLICATE_EMAIL)

  })

  it('should not create a user; duplicate email (case)', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg1 = {
      organizationId: org.id,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: org.id,
      username: 'testuser2',
      email: 'Testuser1@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg1)

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg2)

    expect(res.body.status).to.equal(400)
    expect(res.body.err.code).to.equal(codes.DUPLICATE_EMAIL)

  })

  it('should create a user', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        username: 'testuser1',
        email: 'testuser1@mail.com',
        password : 'foo88'
      })

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(201)

  })

  it.skip('should create a ghost user', async function() {

    process.env.USER_REGISTRATION = 'loose'

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        firstName: 'Charlie'
      })

    expect(res.body.pkg.firstName).to.equal('Charlie')
    expect(res.body.status).to.equal(201)

    process.env.USER_REGISTRATION = 'strict'

  })

  it('should get a user by Id', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
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

  it('should get a user by email', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)
    //console.error('users.error', users.error)
    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/email/testuser2@mail.com`)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get a user by username', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/username/testuser2`)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get all users', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
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

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
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

  it('should delete a user by Id', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var usersId = user.body.pkg.id

    var res = await new MockHTTPServer()
      .delete(`/api/${process.env.API_VERSION}/users/${usersId}`)

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${usersId}`)

    expect(res2.body.pkg.status).to.equal('deleted')

  })

  it.skip('should update a user by username', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
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

  it('should check existence of key value pair', async function() {

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it'
      })

    const org = res0.body.pkg

    var pkg = {
      organizationId: org.id,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var userRes = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send(pkg)

    var user = userRes.body.pkg

    var res = await Promise
      .all([
        new MockHTTPServer()
          .get(`/api/${process.env.API_VERSION}/users/existence/username/${user.username}`),
        new MockHTTPServer()
          .get(`/api/${process.env.API_VERSION}/users/existence/email/johnny@brown.com`)
      ])

    expect(res[0].body.pkg.exists).to.equal(true)
    expect(res[1].body.pkg.exists).to.equal(false)

  })

  it('should delete user references when user is deleted', async function() {

    const server = new MockHTTPServer()

    var res0 = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it 1'
      })

    const org = res0.body.pkg

    await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it 2'
      })

    var res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'work it out 1'
      })

    const group = res1.body.pkg

    await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'work it out 2'
      })

    var userRes1 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        groupId: group.id,
        username: 'testuser5',
        email: 'testuser@mail.com',
        password : 'foo88'
      })

    var userRes2 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        groupId: group.id,
        username: 'testuser6',
        email: 'testuser7@mail.com',
        password : 'foo88'
      })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    var deleteRes = await server
      .delete(`/api/${process.env.API_VERSION}/users/${user1.id}/destroy`)
      .send()

    const results1 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user1.id}`),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`),
        server.get(`/api/${process.env.API_VERSION}/users`)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user2.id}`),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`),
        server.get(`/api/${process.env.API_VERSION}/users`)
      ])

    const orgs2 = results2[0].body.pkg.organizations
    const groups2 = results2[1].body.pkg.groups
    const users = results2[2].body.pkg.users

    expect(orgs2.length).to.equal(1)
    expect(groups2.length).to.equal(1)
    expect(users.length).to.equal(1)

  })

  it('should delete user references when user is destroyed', async function() {

    const server = new MockHTTPServer()

    var res0 = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it 1'
      })

    const org = res0.body.pkg

    await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .send({
        title: 'work it 2'
      })

    var res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'work it out 1'
      })

    const group = res1.body.pkg

    await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'work it out 2'
      })

    var userRes1 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        groupId: group.id,
        username: 'testuser5',
        email: 'testuser@mail.com',
        password : 'foo88'
      })

    var userRes2 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        organizationId: org.id,
        groupId: group.id,
        username: 'testuser6',
        email: 'testuser7@mail.com',
        password : 'foo88'
      })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    var deleteRes = await server
      .delete(`/api/${process.env.API_VERSION}/users/${user1.id}/destroy`)
      .send()

    const results1 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user1.id}`),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`),
        server.get(`/api/${process.env.API_VERSION}/users`)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user2.id}`),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`),
        server.get(`/api/${process.env.API_VERSION}/users`)
      ])

    const orgs2 = results2[0].body.pkg.organizations
    const groups2 = results2[1].body.pkg.groups
    const users = results2[2].body.pkg.users

    expect(orgs2.length).to.equal(1)
    expect(groups2.length).to.equal(1)
    expect(users.length).to.equal(1)

  })

})
