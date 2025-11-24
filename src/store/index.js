import { createStore } from 'vuex'
import user from './modules/user.js'
import auth from './modules/auth.js'
import contract from './modules/contract.js'

export default createStore({
  modules: {
    user,
    auth,
    contract
  },
})