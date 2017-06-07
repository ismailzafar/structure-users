import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import pluginsList from '../helpers/plugins'
import TestAPI from '../helpers/test-api'
import OrgTestAPI from 'structure-organizations/test/helpers/test-api'
import AppTestAPI from 'structure-applications/test/helpers/test-api'

const server =  new MockHTTPServer()
const testApi = new TestAPI(server)
const orgTestApi = new OrgTestAPI(server)
const appTestApi = new AppTestAPI(server)

describe('Routes', function() {

  let orgId, appId

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

  beforeEach(async function() {
    const orgRes = await orgTestApi.create({
      title: 'work it'
    })
    orgId = orgRes.body.pkg.id

    const appRes = await appTestApi.create(orgId, {
      title: 'App 45'
    })
    appId = appRes.body.pkg.id
  })

  afterEach(function() {
    return this.migration.purge()
  })

  it('should not create a user; missing username', async function() {

    const res = await testApi.create(orgId, appId, {
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("USERNAME_MISSING")

  })

  it('should not create a user; invalid username', async function() {

    const res = await testApi.create(orgId, appId, {
      username: {what: 'weird'},
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("USERNAME_INVALID")

  })

  it('should not create a user; duplicate username', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const res2 = await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser2@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal("USERNAME_DUPLICATE")

  })

  it('should not create a user; duplicate username (case)', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const res2 = await testApi.create(orgId, appId, {
      username: 'TestUser1',
      email: 'testuser2@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal("USERNAME_DUPLICATE")

  })

  it('should not create a user; missing email', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'fpp',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("EMAIL_MISSING")

  })

  it('should not create a user; invalid email', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'fpp',
      email: {what: 'weird'},
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("EMAIL_INVALID")

  })

  it('should not create a user; duplicate email', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const res2 = await testApi.create(orgId, appId, {
      username: 'testuser2',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal("EMAIL_DUPLICATE")

  })

  it('should not create a user; duplicate email (case)', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const res2 = await testApi.create(orgId, appId, {
      username: 'testuser2',
      email: 'TestUser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    expect(res2.body.status).to.equal(400)
    expect(res2.body.err.code).to.equal("EMAIL_DUPLICATE")

  })

  it('should not create a user; missing password', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("PASSWORD_MISSING")

  })

  it('should not create a user; invalid password', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: {what: 'weird'},
      email: 'woo@gfoo.com',
      timezone: 'America/New_York'
    })

    expect(res.body.err.code).to.equal("PASSWORD_INVALID")

  })

  it('should not create a user; missing timezone', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com'
    })

    expect(res.body.err.code).to.equal("TIMEZONE_MISSING")

  })

  it('should not create a user; invalid timezone', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'Not/A_Real_Place'
    })

    expect(res.body.err.code).to.equal("TIMEZONE_INVALID")

  })

  it('should not create a user; invalid bio', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      bio: [],
    })

    expect(res.body.err.code).to.equal("BIO_INVALID")

  })

  it('should not create a user; invalid facebookUrl', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      facebookUrl: [],
    })

    expect(res.body.err.code).to.equal("FACEBOOKURL_INVALID")

  })

  it('should not create a user; invalid twitterUrl', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      twitterUrl: [],
    })

    expect(res.body.err.code).to.equal("TWITTERURL_INVALID")

  })

  it('should not create a user; invalid first name', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      firstName: [],
    })

    expect(res.body.err.code).to.equal("FIRSTNAME_INVALID")

  })

  it('should not create a user; invalid last name', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      lastName: [],
    })

    expect(res.body.err.code).to.equal("LASTNAME_INVALID")

  })

  it('should not create a user; invalid image ID', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      imageId: [],
    })

    expect(res.body.err.code).to.equal("IMAGEID_INVALID")

  })

  it('should not create a user; invalid roles', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'woober',
      password: 'foo88',
      email: 'woo@gfoo.com',
      timezone: 'America/New_York',
      roles: 'myrole',
    })

    expect(res.body.err.code).to.equal("ROLES_INVALID")

  })

  it('should create a user', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York',
      bio: 'Extreme pumpkin farmer',
      facebookUrl: 'www.facebook.com/besturl',
      twitterUrl: 'www.twitter.com/besturl',
      firstName: 'Pumpkin',
      lastName: 'Joe',
      roles: ['role1', 'role2']
    })

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.pkg.bio).to.equal('Extreme pumpkin farmer')
    expect(res.body.pkg.facebookUrl).to.equal('www.facebook.com/besturl')
    expect(res.body.pkg.twitterUrl).to.equal('www.twitter.com/besturl')
    expect(res.body.pkg.firstName).to.equal('Pumpkin')
    expect(res.body.pkg.lastName).to.equal('Joe')
    expect(res.body.pkg.roles).to.deep.equal(['role1', 'role2'])
    expect(res.body.status).to.equal(201)

  })

  it('should create a user (case)', async function() {

    const res = await testApi.create(orgId, appId, {
      username: 'TestUser1',
      email: 'TestUser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York',
      bio: 'Extreme pumpkin farmer',
      facebookUrl: 'www.facebook.com/besturl',
      twitterUrl: 'www.twitter.com/besturl',
      firstName: 'Pumpkin',
      lastName: 'Joe',
      roles: ['ROLE1', 'ROLE2']
    })

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.pkg.bio).to.equal('Extreme pumpkin farmer')
    expect(res.body.pkg.facebookUrl).to.equal('www.facebook.com/besturl')
    expect(res.body.pkg.twitterUrl).to.equal('www.twitter.com/besturl')
    expect(res.body.pkg.firstName).to.equal('Pumpkin')
    expect(res.body.pkg.lastName).to.equal('Joe')
    expect(res.body.pkg.roles).to.deep.equal(['role1', 'role2'])
    expect(res.body.status).to.equal(201)

  })

  it('should create a ghost user', async function() {

    process.env.USER_REGISTRATION = 'loose'

    const looseServer =  new MockHTTPServer()
    const looseTestApi = new TestAPI(looseServer)

    const res = await looseTestApi.create(orgId, appId, {
      firstName: 'Charlie'
    })

    expect(res.body.pkg.firstName).to.equal('Charlie')
    expect(res.body.status).to.equal(201)

    process.env.USER_REGISTRATION = 'strict'

  })

  it('should get a user by ID', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })
    const userId = userRes.body.pkg.id

    const res = await testApi.get(orgId, appId, userId)

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get a user by email', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })
    const userEmail = userRes.body.pkg.email

    const res = await testApi.getByEmail(orgId, appId, userEmail)

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get a user by username', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })
    const username = userRes.body.pkg.username

    const res = await testApi.getByUsername(orgId, appId, username)

    expect(res.body.pkg.username).to.equal('testuser1')
    expect(res.body.pkg.email).to.equal('testuser1@mail.com')
    expect(res.body.status).to.equal(200)

  })

  it('should get all users', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser1',
      email: 'testuser1@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    await testApi.create(orgId, appId, {
      username: 'testuser2',
      email: 'testuser2@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const usersRes = await testApi.getAll(orgId, appId)

    expect(usersRes.body.pkg.users.length).to.equal(2)
    expect(usersRes.body.pkg.users[0].username).to.equal('testuser1')
    expect(usersRes.body.pkg.users[1].username).to.equal('testuser2')
    expect(usersRes.body.status).to.equal(200)

  })

  describe('should not update a user', async function() {
    let userId

    beforeEach(async function() {
      const userRes = await testApi.create(orgId, appId, {
        username: 'testuser1',
        email: 'testuser1@mail.com',
        password: 'foo88',
        timezone: 'America/New_York'
      })
      userId = userRes.body.pkg.id
    })

    it('invalid username', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        username: {what: 'weird'},
      })

      expect(res.body.err.code).to.equal("USERNAME_INVALID")

    })

    it('duplicate username', async function() {

      await testApi.create(orgId, appId, {
        username: 'testuser2',
        email: 'testuser2@mail.com',
        password: 'foo88',
        timezone: 'America/New_York'
      })

      const res2 = await testApi.update(orgId, appId, userId, {
        username: 'testuser2',
      })

      expect(res2.body.status).to.equal(400)
      expect(res2.body.err.code).to.equal("USERNAME_DUPLICATE")

    })

    it('duplicate username (case)', async function() {

      await testApi.create(orgId, appId, {
        username: 'testuser2',
        email: 'testuser2@mail.com',
        password: 'foo88',
        timezone: 'America/New_York'
      })

      const res2 = await testApi.update(orgId, appId, userId, {
        username: 'TestUser2',
      })

      expect(res2.body.status).to.equal(400)
      expect(res2.body.err.code).to.equal("USERNAME_DUPLICATE")

    })

    it('invalid email', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        email: {what: 'weird'}
      })

      expect(res.body.err.code).to.equal("EMAIL_INVALID")

    })

    it('duplicate email', async function() {

      await testApi.create(orgId, appId, {
        username: 'testuser2',
        email: 'testuser2@mail.com',
        password: 'foo88',
        timezone: 'America/New_York'
      })

      const res2 = await testApi.update(orgId, appId, userId, {
        email: 'testuser2@mail.com'
      })

      expect(res2.body.status).to.equal(400)
      expect(res2.body.err.code).to.equal("EMAIL_DUPLICATE")

    })

    it('duplicate email (case)', async function() {

      await testApi.create(orgId, appId, {
        username: 'testuser2',
        email: 'testuser2@mail.com',
        password: 'foo88',
        timezone: 'America/New_York'
      })

      const res2 = await testApi.update(orgId, appId, userId, {
        email: 'TestUser2@mail.com'
      })

      expect(res2.body.status).to.equal(400)
      expect(res2.body.err.code).to.equal("EMAIL_DUPLICATE")

    })

    it('invalid password', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        password: {what: 'weird'},
      })

      expect(res.body.err.code).to.equal("PASSWORD_INVALID")

    })

    it('invalid timezone', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        timezone: 'Not/A_Real_Place'
      })

      expect(res.body.err.code).to.equal("TIMEZONE_INVALID")

    })

    it('invalid bio', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        bio: [],
      })

      expect(res.body.err.code).to.equal("BIO_INVALID")

    })

    it('invalid facebookUrl', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        facebookUrl: [],
      })

      expect(res.body.err.code).to.equal("FACEBOOKURL_INVALID")

    })

    it('invalid twitterUrl', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        twitterUrl: [],
      })

      expect(res.body.err.code).to.equal("TWITTERURL_INVALID")

    })

    it('invalid first name', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        firstName: [],
      })

      expect(res.body.err.code).to.equal("FIRSTNAME_INVALID")

    })

    it('invalid last name', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        lastName: [],
      })

      expect(res.body.err.code).to.equal("LASTNAME_INVALID")

    })

    it('invalid image ID', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        imageId: [],
      })

      expect(res.body.err.code).to.equal("IMAGEID_INVALID")

    })

    it('invalid roles', async function() {

      const res = await testApi.update(orgId, appId, userId, {
        roles: 'myrole',
      })

      expect(res.body.err.code).to.equal("ROLES_INVALID")

    })

  })

  it('should update a user by ID', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York',
    })
    const userId = userRes.body.pkg.id

    await testApi.update(orgId, appId, userId, {
      username: 'updateduser4',
      email: 'updateuser@email.com',
      timezone: 'America/Denver',
      bio: 'Extreme pumpkin farmer',
      facebookUrl: 'www.facebook.com/besturl',
      twitterUrl: 'www.twitter.com/besturl',
      firstName: 'Pumpkin',
      lastName: 'Joe',
      roles: ['role1', 'role2']
    })

    const res = await testApi.get(orgId, appId, userId)

    expect(res.body.pkg.username).to.equal('updateduser4')
    expect(res.body.pkg.email).to.equal('updateuser@email.com')
    expect(res.body.pkg.timezone).to.equal('America/Denver')
    expect(res.body.pkg.bio).to.equal('Extreme pumpkin farmer')
    expect(res.body.pkg.facebookUrl).to.equal('www.facebook.com/besturl')
    expect(res.body.pkg.twitterUrl).to.equal('www.twitter.com/besturl')
    expect(res.body.pkg.firstName).to.equal('Pumpkin')
    expect(res.body.pkg.lastName).to.equal('Joe')
    expect(res.body.pkg.roles).to.deep.equal(['role1', 'role2'])

  })

  it('should update a user by ID (case)', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York',
    })
    const userId = userRes.body.pkg.id

    await testApi.update(orgId, appId, userId, {
      username: 'UpdatedUser4',
      email: 'UpdateUser@email.com',
      timezone: 'America/Denver',
      bio: 'Extreme pumpkin farmer',
      facebookUrl: 'www.facebook.com/besturl',
      twitterUrl: 'www.twitter.com/besturl',
      firstName: 'Pumpkin',
      lastName: 'Joe',
      roles: ['ROLE1', 'ROLE2']
    })

    const res = await testApi.get(orgId, appId, userId)

    expect(res.body.pkg.username).to.equal('updateduser4')
    expect(res.body.pkg.email).to.equal('updateuser@email.com')
    expect(res.body.pkg.timezone).to.equal('America/Denver')
    expect(res.body.pkg.bio).to.equal('Extreme pumpkin farmer')
    expect(res.body.pkg.facebookUrl).to.equal('www.facebook.com/besturl')
    expect(res.body.pkg.twitterUrl).to.equal('www.twitter.com/besturl')
    expect(res.body.pkg.firstName).to.equal('Pumpkin')
    expect(res.body.pkg.lastName).to.equal('Joe')
    expect(res.body.pkg.roles).to.deep.equal(['role1', 'role2'])

  })

  it('should update a users organizations', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })
    const userId = userRes.body.pkg.id

    const res = await testApi.update(orgId, appId, userId, {
      organizationIds: [orgId]
    })
    expect(res.body.pkg.organizationIds).to.eql([orgId])

    const res2 = await testApi.update(orgId, appId, userId, {
      organizationIds: []
    })
    expect(res2.body.pkg.organizationIds).to.eql([])

  })

  it('should delete a user by ID', async function() {

    const userRes = await testApi.create(orgId, appId, {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })
    const userId = userRes.body.pkg.id

    await testApi.delete(orgId, appId, userId)

    const res = await testApi.get(orgId, appId, userId)

    expect(res.body.pkg.status).to.equal('deleted')

  })

  it('should check existence of key value pair', async function() {

    await testApi.create(orgId, appId, {
      username: 'testuser4',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const res1 = await testApi.existence(orgId, appId, 'username', 'testuser4')

    const res2 = await testApi.existence(orgId, appId, 'email', 'johnny@brown.com')

    expect(res1.body.pkg.exists).to.equal(true)
    expect(res2.body.pkg.exists).to.equal(false)

  })

  it('should delete user references when user is destroyed', async function() {

    const res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'work it out 1'
      })

    const group = res1.body.pkg

    const userRes1 = await testApi.create(orgId, appId, {
      organizationId: orgId,
      groupId: group.id,
      username: 'testuser5',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const userRes2 = await testApi.create(orgId, appId, {
      organizationId: orgId,
      groupId: group.id,
      username: 'testuser6',
      email: 'testuser7@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    await testApi.destroy(orgId, appId, user1.id)

    const results1 = await Promise
      .all([
        orgTestApi.getOrganizationsOfUser(user1.id),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`)
        .set('organizationid', orgId)
        .set('applicationid', appId),
        testApi.getAll(orgId, appId)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        orgTestApi.getOrganizationsOfUser(user2.id),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`)
        .set('organizationid', orgId)
        .set('applicationid', appId),
        testApi.getAll(orgId, appId)
      ])

    const orgs2 = results2[0].body.pkg.organizations
    const groups2 = results2[1].body.pkg.groups
    const users = results2[2].body.pkg.users

    expect(orgs2.length).to.equal(1)
    expect(groups2.length).to.equal(1)
    expect(users.length).to.equal(1)

  })

  it('should delete user references when user is deleted', async function() {

    const res1 = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'work it out 1'
      })

    const group = res1.body.pkg

    await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'work it out 2'
      })

    const userRes1 = await testApi.create(orgId, appId, {
      organizationId: orgId,
      groupId: group.id,
      username: 'testuser5',
      email: 'testuser@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const userRes2 = await testApi.create(orgId, appId, {
      organizationId: orgId,
      groupId: group.id,
      username: 'testuser6',
      email: 'testuser7@mail.com',
      password: 'foo88',
      timezone: 'America/New_York'
    })

    const user1 = userRes1.body.pkg
    const user2 = userRes2.body.pkg

    await testApi.delete(orgId, appId, user1.id)

    const results1 = await Promise
      .all([
        orgTestApi.getOrganizationsOfUser(user1.id),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user1.id}`)
        .set('organizationid', orgId)
        .set('applicationid', appId),
        testApi.getAll(orgId, appId)
      ])

    const orgs1 = results1[0].body.pkg.organizations
    const groups1 = results1[1].body.pkg.groups

    expect(orgs1.length).to.equal(0)
    expect(groups1.length).to.equal(0)

    const results2 = await Promise
      .all([
        orgTestApi.getOrganizationsOfUser(user2.id),
        server.get(`/api/${process.env.API_VERSION}/groups/of/users/${user2.id}`)
        .set('organizationid', orgId)
        .set('applicationid', appId),
        testApi.getAll(orgId, appId)
      ])

    const orgs2 = results2[0].body.pkg.organizations
    const groups2 = results2[1].body.pkg.groups
    const users = results2[2].body.pkg.users

    expect(orgs2.length).to.equal(1)
    expect(groups2.length).to.equal(1)
    expect(users.length).to.equal(1)

  })

})
