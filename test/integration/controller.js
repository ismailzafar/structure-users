import r from 'structure-driver'
import pluginsList from '../helpers/plugins'
import Migrations from 'structure-migrations'
import UserController from '../../src/controllers/user'
import {OrganizationModel} from 'structure-organizations'
import {ApplicationModel} from 'structure-applications'


async function createOrg() {

  const organizationModel = new OrganizationModel()

  return await organizationModel.create({
    desc: 'cool organization',
    title: 'My organization'
  })

}

async function createApp(orgId) {

  const applicationModel = new ApplicationModel({
    orgId
  })

  return await applicationModel.create({
    desc: '',
    title: 'My App'
  })

}

/** @test {UserController} */
describe('Controller', function() {

  beforeEach(function() {

    this.migration = new Migrations({
      db: 'test',
      plugins: pluginsList
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  /** @test {UserController#create} */
  it('should create a user', async function() {

    const org = await createOrg()
    const app = await createApp(org.id)

    const user = new UserController()

    const roles = {
      organizations: {},
      applications: {}
    }
    roles.organizations[org.id] = ['admin']
    roles.applications[app.id] = ['editor']

    const res = await user.create({
      body: {
        username: 'ted1talks3000',
        email: 'ted10@email.com',
        password: 'foo88',
        organizationIds: [org.id],
        applicationIds: [app.id],
        roles
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    expect(res.username).to.equal('ted1talks3000')
    expect(res.email).to.equal('ted10@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.not.be.undefined

    const orgLinks = await r
      .table('link_organizations_users')
      .filter({
        organizationId: org.id,
        userId: res.id
      })

    expect(orgLinks.length).to.equal(1)
    expect(orgLinks[0].organizationId).to.equal(org.id)
    expect(orgLinks[0].userId).to.equal(res.id)
    expect(orgLinks[0].roles).to.deep.equal(['admin'])

    const appLinks = await r
      .table('link_applications_users')
      .filter({
        applicationId: app.id,
        userId: res.id
      })

    expect(appLinks.length).to.equal(1)
    expect(appLinks[0].applicationId).to.equal(app.id)
    expect(appLinks[0].userId).to.equal(res.id)
    expect(appLinks[0].roles).to.deep.equal(['editor'])

  })


  /** @test {UserController#getById} */
  it('should get by ID', async function() {

    const org = await createOrg()
    const app = await createApp(org.id)

    const user = new UserController()

    const res = await user.create({
      body: {
        username: 'ted1talks3001',
        email: 'ted11@email.com',
        password: 'foo88',
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    const req2 = {
      params: {
        id: res.id
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    }

    const res2 = await user.getById(req2)

    expect(res2.username).to.equal('ted1talks3001')
    expect(res2.email).to.equal('ted11@email.com')
    expect(res2.password).to.be.undefined
    expect(res.hash).to.not.be.undefined

  })

  /** @test {UserModel#getAll} */
  it('should get all', async function() {

    const org = await createOrg()
    const app = await createApp(org.id)

    const user = new UserController()

    await user.create({
      body: {
        username: 'ted1talks3001',
        email: 'ted11@email.com',
        password: 'foo88',
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    const res2 = await user.getAll({
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    expect(res2.length > 0).to.be.true

  })

  /** @test {UserController#update} */
  it('should update a user', async function() {

    const org = await createOrg()
    const app = await createApp(org.id)

    const user = new UserController()

    const res = await user.create({
      body: {
        username: 'ted1talks3003',
        email: 'ted13@email.com',
        password: 'foo88'
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    const req2 = {
      body: {
        username: 'ted1talks3004',
        email: 'ted14@email.com',
      },
      params: {
        id: res.id
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    }

    const res2 = await user.updateById(req2)

    expect(res2.username).to.equal('ted1talks3004')
    expect(res2.email).to.equal('ted14@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.not.be.undefined

  })

  /** @test {UserController#update} */
  it('should update a users organizations', async function() {

    const organizationModel = new OrganizationModel()
    const organization = await organizationModel.create({
      desc: 'cool organization',
      title: 'My organization'
    })
    const organizationId = organization.id
    const organization2 = await organizationModel.create({
      desc: 'cool organization2',
      title: 'My organization2'
    })
    const organizationId2 = organization2.id

    const applicationModel = new ApplicationModel({
      organizationId
    })
    const application = await applicationModel.create({
      desc: '',
      title: 'My App'
    })
    const applicationId = application.id
    const application2 = await applicationModel.create({
      desc: '',
      title: 'My App2'
    })
    const applicationId2 = application2.id

    const user = new UserController()

    const req = {
      body: {
        username: 'ted1talks3003',
        email: 'ted13@email.com',
        password: 'foo88'
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res = await user.create(req)

    const roles = {
      organizations: {},
      applications: {}
    }
    roles.organizations[organizationId] = ['admin']
    roles.organizations[organizationId2] = ['member']
    roles.applications[applicationId] = ['editor']
    roles.applications[applicationId2] = ['writer']

    const req1 = {
      body: {
        organizationIds: [organizationId, organizationId2],
        applicationIds: [applicationId, applicationId2],
        roles
      },
      params: {
        id: res.id
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res1 = await user.updateById(req1)

    expect(res1.organizationIds).to.eql([organizationId, organizationId2])
    expect(res1.applicationIds).to.eql([applicationId, applicationId2])

    const res2 = await organizationModel.ofUser(res.id)

    expect(res2.length).to.equal(2)
    expect(res2[0].id).to.equal(organizationId)
    expect(res2[1].id).to.equal(organizationId2)

    const res3 = await applicationModel.ofUser(res.id)

    expect(res3.length).to.equal(2)
    expect(res3[0].id).to.equal(applicationId)
    expect(res3[1].id).to.equal(applicationId2)

    const roles2 = {
      organizations: {},
      applications: {}
    }
    roles2.organizations[organizationId] = ['admin']
    roles2.applications[applicationId] = ['editor']

    const req4 = {
      body: {
        organizationIds: [organizationId],
        applicationIds: [applicationId],
        roles: roles2
      },
      params: {
        id: res.id
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res4 = await user.updateById(req4)

    expect(res4.organizationIds).to.eql([organizationId])
    expect(res4.applicationIds).to.eql([applicationId])

    const res5 = await organizationModel.ofUser(res.id)

    expect(res5.length).to.equal(1)
    expect(res5[0].id).to.equal(organizationId)

    const res6 = await applicationModel.ofUser(res.id)

    expect(res6.length).to.equal(1)
    expect(res6[0].id).to.equal(applicationId)

    const orgLinks = await r
      .table('link_organizations_users')
      .filter({
        organizationId: organizationId,
        userId: res.id
      })

    expect(orgLinks.length).to.equal(1)
    expect(orgLinks[0].organizationId).to.equal(organizationId)
    expect(orgLinks[0].userId).to.equal(res.id)
    expect(orgLinks[0].roles).to.deep.equal(['admin'])

    const appLinks = await r
      .table('link_applications_users')
      .filter({
        applicationId: applicationId,
        userId: res.id
      })

    expect(appLinks.length).to.equal(1)
    expect(appLinks[0].applicationId).to.equal(applicationId)
    expect(appLinks[0].userId).to.equal(res.id)
    expect(appLinks[0].roles).to.deep.equal(['editor'])

  })

})
