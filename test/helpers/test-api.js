export default class TestAPI {

  constructor(server) {
    this.server = server
  }

  async get(orgId, appId, userId) {
    return await this.server
      .get(`/api/${process.env.API_VERSION}/users/${userId}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async getByEmail(orgId, appId, email) {
    return await this.server
      .get(`/api/${process.env.API_VERSION}/users/email/${email}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async getByUsername(orgId, appId, username) {
    return await this.server
      .get(`/api/${process.env.API_VERSION}/users/username/${username}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async getAll(orgId, appId) {
    return await this.server
      .get(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async create(orgId, appId, pkg) {
    return await this.server
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send(pkg)
  }

  async update(orgId, appId, userId, pkg) {
    return await this.server
      .patch(`/api/${process.env.API_VERSION}/users/${userId}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send(pkg)
  }

  async delete(orgId, appId, userId) {
    return await this.server
      .delete(`/api/${process.env.API_VERSION}/users/${userId}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async destroy(orgId, appId, userId) {
    return await this.server
      .delete(`/api/${process.env.API_VERSION}/users/${userId}/destroy`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

  async existence(orgId, appId, key, value) {
    return await this.server
      .get(`/api/${process.env.API_VERSION}/users/existence/${key}/${value}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
  }

}
