import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import {settings as organizationSettings} from 'structure-organizations'
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
  it('should create an user', async function() {

    const org = await createOrg()
    const app = await createApp(org.id)

    const user = new UserController()

    const res = await user.create({
      body: {
        username: 'ted1talks3000',
        email: 'ted10@email.com',
        password: 'foo88',
      },
      headers: {
        applicationid: app.id,
        organizationid: org.id
      }
    })

    expect(res.username).to.equal('ted1talks3000')
    expect(res.email).to.equal('ted10@email.com')
    expect(res.password).to.be.undefined

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
