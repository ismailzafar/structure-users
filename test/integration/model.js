import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import userModelInterface from '../../src/model'
import r from '../helpers/driver'
import RootModel from 'structure-root-model'

Migrations.prototype.r = r
RootModel.prototype.r = r

const UserModel = userModelInterface(RootModel)

/** @test {UserModel} */
describe('Model', function() {

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

  it('should initialize', function(done) {

    var user = new UserModel()

    expect(user.table).to.be.equal('users')

    done()

  })

  /** @test {UserModel#create} */
  it('should create a user', async function(done) {

    var orgModel = new OrganizationModel(),
        user     = new UserModel()

    const org = await orgModel.create({
      title: 'Kotton Kandy Klub'
    })

    var res = await user.create({
      username: 'ted0talks2000',
      email: 'ted0@email.com',
      password: 'foo88',
      organizationId: org.id
    })

    var join = await r.table('link_organizations_users').filter({
      organizationId: org.id,
      userId: res.id
    })

    expect(res.username).to.equal('ted0talks2000')
    expect(res.email).to.equal('ted0@email.com')
    expect(res.password).to.be.undefined
    expect(res.hash).to.be.a('string')
    expect(join[0].organizationId).to.equal(org.id)
    expect(join[0].userId).to.equal(res.id)

    done()

  })

  /** @test {UserModel#getById} */
  it('should get by ID', async function(done) {

    var user = new UserModel({
    })

    var res = await user.create({
      username: 'ted1talks2000',
      email: 'ted1@email.com',
      password: 'foo88'
    })

    var res2 = await user.getById(res.id)

    expect(res2.username).to.equal('ted1talks2000')
    expect(res2.email).to.equal('ted1@email.com')
    expect(res2.password).to.be.undefined
    expect(res2.hash).to.be.a('string')

    done()

  })

  /** @test {UserModel#getAll} */
  it('should get all', async function(done) {

    var user = new UserModel({
      name: 'root'
    })

    var res = await user.create({
      username: 'ted2talks2000',
      email: 'ted2@email.com',
      password: 'foo88'
    })

    var res2 = await user.getAll()

    expect(res2.length > 0).to.be.true

    done()

  })

  /** @test {UserModel#update} */
  it('should update a user', async function(done) {

    var user = new UserModel()

    var res = await user.create({
      username: 'ted3talks2000',
      email: 'ted3@email.com',
      password: 'foo88'
    })

    var res2 = await user.updateById(res.id, {
      firstName: 'Theodore',
      lastName: 'Talkington',
      email: 'ted33@email.com'
    })

    expect(res2.firstName).to.equal('Theodore')
    expect(res2.lastName).to.equal('Talkington')
    expect(res2.username).to.equal('ted3talks2000')
    expect(res2.email).to.equal('ted33@email.com')
    expect(res2.password).to.be.undefined
    expect(res2.hash).to.be.a('string')

    done()

  })

})
