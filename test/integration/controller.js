import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import {resources as organizationResources, settings as organizationSettings} from 'structure-organizations'
import UserController from '../../src/controllers/user'
import {OrganizationModel} from 'structure-organizations'
import {ApplicationModel} from 'structure-applications'

const OrganizationController = organizationResources.controllers.Organization

/** @test {UserController} */
describe('Controller', function() {

  beforeEach(function() {

    this.migration = new Migrations({
      db: 'test',
      items: {
        tables: migrationItems.tables.concat(organizationSettings.migrations.tables)
      }
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  /** @test {UserController#create} */
  it.skip('should create an user', async function() {

    var user = new UserController()
    var organization = new OrganizationController()

    var req0 = {
      body: {
        title: 'My Organization'
      }
    }

    var org = await organization.create(req0)

    var req = {
      body: {
        username: 'ted1talks3000',
        email: 'ted10@email.com',
        password: 'foo88',
        organizationId: org.id
      }
    }

    var res = await user.create(req)

    expect(res.username).to.equal('ted1talks3000')
    expect(res.email).to.equal('ted10@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.be.a('string')

  })


  /** @test {UserController#getById} */
  it.skip('should get by ID', async function() {

    var user = new UserController({
    })

    var req = {
      body: {
        username: 'ted1talks3001',
        email: 'ted11@email.com',
        password: 'foo88'
      }
    }

    var res = await user.create(req)

    var req2 = {
      params: {
        id: res.id
      }
    }

    var res2 = await user.getById(req2)

    expect(res2.username).to.equal('ted1talks3001')
    expect(res2.email).to.equal('ted11@email.com')
    expect(res2.password).to.be.undefined
    expect(res2.hash).to.be.a('string')
  })

  /** @test {UserModel#getAll} */
  it.skip('should get all', async function() {

    var user = new UserController({
    })

    var req = {
      body: {
        username: 'ted1talks3002',
        email: 'ted12@email.com',
        password: 'foo88'
      }
    }

    await user.create(req)

    var res2 = await user.getAll()

    expect(res2.length > 0).to.be.true

  })

  /** @test {UserController#update} */
  it.skip('should update a user', async function() {

    var user = new UserController()

    var req1 = {
      body: {
        username: 'ted1talks3003',
        email: 'ted13@email.com',
        password: 'foo88'
      }
    }

    var res = await user.create(req1)

    var req2 = {
      body: {
        username: 'ted1talks3004',
        email: 'ted14@email.com',
      },
      params: {
        id: res.id
      }
    }

    var res2 = await user.updateById(req2)

    expect(res2.username).to.equal('ted1talks3004')
    expect(res2.email).to.equal('ted14@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.be.a('string')

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

    const req1 = {
      body: {
        organizationIds: [organizationId, organizationId2]
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

    const req2 = {
      params: {
        id: res.id
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res2 = await user.getById(req2)

    expect(res1.organizationIds).to.eql([organizationId, organizationId2])
    expect(res2.organizationIds).to.eql([organizationId, organizationId2])

    const req3 = {
      body: {
        organizationIds: [organizationId]
      },
      params: {
        id: res.id
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res3 = await user.updateById(req3)

    const req4 = {
      params: {
        id: res.id
      },
      headers: {
        applicationid: applicationId,
        organizationid: organizationId
      }
    }

    const res4 = await user.getById(req4)

    expect(res3.organizationIds).to.eql([organizationId])
    expect(res4.organizationIds).to.eql([organizationId])

  })

})
