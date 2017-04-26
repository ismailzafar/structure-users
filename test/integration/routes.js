import codes from '../../src/lib/error-codes'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import pluginsList from '../helpers/plugins'
import UserController from '../../src/controllers/user'
import UserModel from '../../src/models/user'

const createOrgAndApp = async function(){
  // getting an organization and application Ids
  var res0 = await new MockHTTPServer()
    .post(`/api/${process.env.API_VERSION}/organizations`)
    .send({
      title: 'work it'
    })

  const org = res0.body.pkg
  const orgId = org.id
  var app = await new MockHTTPServer()
    .post(`/api/${process.env.API_VERSION}/applications`)
    .set('organizationid', orgId)
    .send({
      desc: '',
      title: 'App 45'
    })
  const appId = app.body.pkg.id
  return {orgId, appId}
}

const updateAndGetUserById = async function(orgId, appId, usersId, pkg){
  const res = await new MockHTTPServer()
    .patch(`/api/${process.env.API_VERSION}/users/${usersId}`)
    .set('organizationid',orgId)
    .set('applicationid',appId)
    .send(pkg)

  expect(res.body.status).to.equal(200)

  const res2 = await new MockHTTPServer()
    .get(`/api/${process.env.API_VERSION}/users/${usersId}`)
    .set('organizationid',orgId)
    .set('applicationid',appId)

  return res2
}

describe('Routes', function() {

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
    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        email: 'testuser1@mail.com',
        password : 'foo88'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_USERNAME)

  })

  it('should not create a user; missing email', async function() {
    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        username: 'fpp',
        password : 'foo88'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_EMAIL)

  })

  it('should not create a user; missing password', async function() {
    const {orgId, appId} = await createOrgAndApp()
    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        username: 'woober',
        email: 'woo@gfoo.com'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_PASSWORD)

  })

  it.skip('should not create a user; missing organization', async function() {
    const {orgId, appId} = await createOrgAndApp()
    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        password: 'pumpitup',
        username: 'woober',
        email: 'woo@gfoo.com'
      })

    expect(res.body.err.code).to.equal(codes.MISSING_ORGANIZATIONID)

  })

  it('should not create a user; duplicate username', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg1 = {
      organizationId: orgId,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: orgId,
      username: 'testuser1',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg1)

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg2)

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal(codes.DUPLICATE_USERNAME)

  })

  it('should not create a user; duplicate username (case)', async function() {
    const {orgId, appId} = await createOrgAndApp()
    var pkg1 = {
      organizationId: orgId,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: orgId,
      username: 'Testuser1',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg1)

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg2)

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal(codes.DUPLICATE_USERNAME)

  })

  it('should not create a user; duplicate email', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg1 = {
      organizationId: orgId,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: orgId,
      username: 'testuser2',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg1)

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg2)

    expect(res.body.status).to.equal(400)
    expect(res.body.err.code).to.equal(codes.DUPLICATE_EMAIL)

  })

  it('should not create a user; duplicate email (case)', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg1 = {
      organizationId: orgId,
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password : 'foo88'
    }

    var pkg2 = {
      organizationId: orgId,
      username: 'testuser2',
      email: 'Testuser1@mail.com',
      password : 'foo88'
    }

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg1)

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg2)

    expect(res.body.status).to.equal(400)
    expect(res.body.err.code).to.equal(codes.DUPLICATE_EMAIL)

  })

  it('should create a user', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        username: 'testuser1',
        email: 'testuser1@mail.com',
        password : 'foo88'
      })

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(201)

  })

  it.skip('should create a ghost user', async function() {

    const {orgId, appId} = await createOrgAndApp()
    process.env.USER_REGISTRATION = 'loose'

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        firstName: 'Charlie'
      })

    expect(res.body.pkg.firstName).to.equal('Charlie')
    expect(res.body.status).to.equal(201)

    process.env.USER_REGISTRATION = 'strict'

  })

  it('should get a user by Id', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${userId}`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get a user by email', async function() {
    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)
    //console.error('users.error', users.error)
    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/email/testuser2@mail.com`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get a user by username', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var userId = users.body.pkg.id

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/username/testuser2`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res.body.pkg.username).to.equal('testuser2')
    expect(res.body.pkg.email).to.equal('testuser2@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get all users', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser3',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var users = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var res = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res.body.pkg.users.length).to.be.above(0)
    expect(res.body.status).to.equal(200)

  })

  it('should update a user by Id', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const pkg = {
      organizationId: orgId,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    const user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    const usersId = user.body.pkg.id

    const res = await updateAndGetUserById(orgId, appId, usersId, {
      username: 'updateduser4'
    })
    expect(res.body.pkg.username).to.equal('updateduser4')

  })

  it('should update a users organizations', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const pkg = {
      organizationId: orgId,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    const user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    const usersId = user.body.pkg.id

    const res = await updateAndGetUserById(orgId, appId, usersId, {
      organizationIds: [orgId]
    })
    expect(res.body.pkg.organizationIds).to.eql([orgId])

    const res2 = await updateAndGetUserById(orgId, appId, usersId, {
      organizationIds: []
    })
    expect(res2.body.pkg.organizationIds).to.eql([])

  })

  it('should delete a user by Id', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var usersId = user.body.pkg.id

    var res = await new MockHTTPServer()
      .delete(`/api/${process.env.API_VERSION}/users/${usersId}`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${usersId}`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res2.body.pkg.status).to.equal('deleted')

  })

  it.skip('should update a user by username', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: org.id,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var user = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var usersId = user.body.pkg.id

    var res = await new MockHTTPServer()
      .patch(`/api/${process.env.API_VERSION}/users/${usersId}`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        username: 'updateduser4'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/users/${usersId}`)
      .set('organizationid',orgId)
      .set('applicationid',appId)

    expect(res2.body.pkg.username).to.equal('updateduser4')
    expect(res.body.status).to.equal(200)

  })

  it('should check existence of key value pair', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var pkg = {
      organizationId: orgId,
      username: 'testuser4',
      email: 'testuser@mail.com',
      password : 'foo88'
    }

    var userRes = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send(pkg)

    var user = userRes.body.pkg

    var res = await Promise
      .all([
        new MockHTTPServer()
          .get(`/api/${process.env.API_VERSION}/users/existence/username/${user.username}`)
          .set('organizationid',orgId)
          .set('applicationid',appId)
          ,
        new MockHTTPServer()
          .get(`/api/${process.env.API_VERSION}/users/existence/email/johnny@brown.com`)
          .set('organizationid',orgId)
          .set('applicationid',appId)
      ])

    expect(res[0].body.pkg.exists).to.equal(true)
    expect(res[1].body.pkg.exists).to.equal(false)

  })

  it('should delete user references when user is deleted', async function() {

    const server = new MockHTTPServer()

    const {orgId, appId} = await createOrgAndApp()

    var res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        title: 'work it out 1'
      })

    const group = res1.body.pkg

    var userRes1 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        groupId: group.id,
        username: 'testuser5',
        email: 'testuser@mail.com',
        password : 'foo88'
      })

    var userRes2 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        groupId: group.id,
        username: 'testuser6',
        email: 'testuser7@mail.com',
        password : 'foo88'
      })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    var deleteRes = await server
      .delete(`/api/${process.env.API_VERSION}/users/${user1.id}/destroy`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send()

    const results1 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user1.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/users`)
        .set('organizationid',orgId)
        .set('applicationid',appId)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user2.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/users`)
        .set('organizationid',orgId)
        .set('applicationid',appId)
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


    const {orgId, appId} = await createOrgAndApp()


    var res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
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
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        groupId: group.id,
        username: 'testuser5',
        email: 'testuser@mail.com',
        password : 'foo88'
      })

    var userRes2 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send({
        organizationId: orgId,
        groupId: group.id,
        username: 'testuser6',
        email: 'testuser7@mail.com',
        password : 'foo88'
      })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    var deleteRes = await server
      .delete(`/api/${process.env.API_VERSION}/users/${user1.id}/destroy`)
      .set('organizationid',orgId)
      .set('applicationid',appId)
      .send()

    const results1 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user1.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/users`)
        .set('organizationid',orgId)
        .set('applicationid',appId)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        server.get(`/api/${process.env.API_VERSION}/organizations/of/users/${user2.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`)
        .set('organizationid',orgId)
        .set('applicationid',appId),
        server.get(`/api/${process.env.API_VERSION}/users`)
        .set('organizationid',orgId)
        .set('applicationid',appId)
      ])

    const orgs2 = results2[0].body.pkg.organizations
    const groups2 = results2[1].body.pkg.groups
    const users = results2[2].body.pkg.users

    expect(orgs2.length).to.equal(1)
    expect(groups2.length).to.equal(1)
    expect(users.length).to.equal(1)

  })

})
