import userApi from '@/api/userApi.js'

export default {
  namespaced: true,
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    ADD_USER(state, user) {
      state.users.push(user)
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id)
      if (index !== -1) state.users[index] = updatedUser
    },
    DELETE_USER(state, userId) {
      state.users = state.users.filter(u => u.id !== userId)
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const users = await userApi.getAllUsers()
        commit('SET_USERS', users)
      } catch (error) {
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createUser({ commit }, userData) {
      commit('SET_ERROR', null)
      try {
        const newUser = await userApi.createUser(userData)
        commit('ADD_USER', newUser)
        return newUser
      } catch (error) {
        commit('SET_ERROR', error)
        throw error
      }
    },
    async updateUser({ commit }, { id, userData }) {
      commit('SET_ERROR', null)
      try {
        const updatedUser = await userApi.updateUser(id, userData)
        commit('UPDATE_USER', updatedUser)
        return updatedUser
      } catch (error) {
        commit('SET_ERROR', error)
        throw error
      }
    },
    async deleteUser({ commit }, id) {
      commit('SET_ERROR', null)
      try {
        await userApi.deleteUser(id)
        commit('DELETE_USER', id)
      } catch (error) {
        commit('SET_ERROR', error)
        throw error
      }
    },
  },
  getters: {
    allUsers: (state) => state.users,
    getUserById: (state) => (id) => state.users.find(u => u.id === id),
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
}
