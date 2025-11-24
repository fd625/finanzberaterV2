import { ApiManager } from './apiManager.js'

class UserApi extends ApiManager {
  constructor() {
    super('users') 
  }


  async getActiveUsers() {
    const allUsers = await this.getAll()
    return allUsers.filter(user => user.active)
  }
}

export default new UserApi()