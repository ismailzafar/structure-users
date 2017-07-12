import r from 'structure-driver'
import pluginsList from '../helpers/plugins'
import Migrations from 'structure-migrations'
import {OrganizationModel} from 'structure-organizations'
import UserModel from '../../src/models/user'

/** @test {UserModel} */
describe('Model', function() {

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

  it('should initialize', function() {

    var user = new UserModel()

    expect(user.table).to.be.equal('users')

  })

  /** @test {UserModel#create} */
  it('should create a user', async function() {

    var orgModel = new OrganizationModel()
    var user = new UserModel()

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
    expect(join[0].organizationId).to.equal(org.id)
    expect(join[0].userId).to.equal(res.id)

  })

  /** @test {UserModel#getById} */
  it('should get by ID', async function() {

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

  })

  /** @test {UserModel#getByEmail} */
  it('should not get by email', async function() {

    var user = new UserModel({
    })

    await user.create({
      username: 'ted1talks2000',
      email: 'ted1@email.com',
      password: 'foo88'
    })

    const res2 = await user.getByEmail('ted2@email.com')

    expect(res2).to.equal(undefined)

  })

  /** @test {UserModel#getByEmail} */
  it('should get by email', async function() {

    var user = new UserModel({
    })

    var res = await user.create({
      username: 'ted1talks2000',
      email: 'ted1@email.com',
      password: 'foo88'
    })

    var res2 = await user.getByEmail(res.email)

    expect(res2.username).to.equal('ted1talks2000')
    expect(res2.email).to.equal('ted1@email.com')

  })

  /** @test {UserModel#getByUsername} */
  it('should not get by username', async function() {

    var user = new UserModel({
    })

    await user.create({
      username: 'ted1talks2000',
      email: 'ted1@email.com',
      password: 'foo88'
    })

    const res2 = await user.getByUsername('foobar')

    expect(res2).to.equal(undefined)

  })

  /** @test {UserModel#getByUsername} */
  it('should get by username', async function() {

    var user = new UserModel({
    })

    var res = await user.create({
      username: 'ted1talks2000',
      email: 'ted1@email.com',
      password: 'foo88'
    })

    var res2 = await user.getByUsername(res.username)

    expect(res2.username).to.equal('ted1talks2000')
    expect(res2.email).to.equal('ted1@email.com')

  })

  /** @test {UserModel#getAll} */
  it('should get all', async function() {

    var user = new UserModel({
      name: 'root'
    })

    await user.create({
      username: 'ted2talks2000',
      email: 'ted2@email.com',
      password: 'foo88'
    })

    var res = await user.getAll()

    expect(res.length > 0).to.be.true

  })

  /** @test {UserModel#update} */
  it('should update a user', async function() {

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

  })

})
