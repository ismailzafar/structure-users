import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import userControllerInterface from '../../src/controller'
import userModelInterface from '../../src/model'
import r from '../helpers/driver'
import RootController from 'structure-root-controller'
import RootModel from 'structure-root-model'

Migrations.prototype.r = r
RootModel.prototype.r = r

const UserModel = userModelInterface(RootModel)
const UserController = userControllerInterface(RootController, UserModel)

/** @test {UserController} */
describe('Controller', function() {

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

  /** @test {UsersController#create} */
  it('should create an user', async function(done) {

      var user = new UsersController(),
      organization = new OrganizationsController()

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

    done()

  })


  /** @test {UsersController#getById} */
  it('should get by ID', async function(done) {

    var user = new UsersController({
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

    done()

  })

  /** @test {UserModel#getAll} */
  it('should get all', async function(done) {

    var user = new UsersController({
    })

    var req = {
      body: {
        username: 'ted1talks3002',
        email: 'ted12@email.com',
        password: 'foo88'
      }
    }

    var res = await user.create(req)

    var res2 = await user.getAll()

    expect(res2.length > 0).to.be.true

    done()

  })

  /** @test {UsersController#update} */
  it('should update a user', async function(done) {

    var user = new UsersController()

    var req = {
      body: {
        username: 'ted1talks3003',
        email: 'ted13@email.com',
        password: 'foo88'
      }
    }

    var res = await user.create(req)

    var req = {
      body: {
        username: 'ted1talks3004',
        email: 'ted14@email.com',
      },
      params: {
        id: res.id
      }
    }

    var res2 = await user.updateById(req)

    expect(res2.username).to.equal('ted1talks3004')
    expect(res2.email).to.equal('ted14@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.be.a('string')

    done()

  })

})
