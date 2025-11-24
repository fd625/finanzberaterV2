import authApi from '@/api/auth.js'

export default {
  namespaced: true,
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    error: null,
  }),
  mutations: {
    SET_USER(state, user) { state.user = user },
    SET_USER_PROFILE(state, profile) { state.userProfile = profile },
    SET_LOADING(state, value) { state.loading = value },
    SET_ERROR(state, error) { state.error = error },
    CLEAR_AUTH(state) { state.user = null; state.userProfile = null },
  },
  actions: {
    async checkAuthState({ commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const session = await authApi.getSession()
        if (session) {
          commit('SET_USER', session.user)
          await dispatch('loadUserProfile')
        } else {
          commit('CLEAR_AUTH')
        }
      } catch (error) {
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async loadUserProfile({ state, commit }) {
      if (!state.user) return
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const profile = await authApi.getUserProfile(state.user.id)
        if (profile) commit('SET_USER_PROFILE', profile)
      } catch (error) {
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async handleLoginSuccess({ commit, dispatch }, user) {
      commit('SET_USER', user)
      await dispatch('loadUserProfile')
    },

    async logout({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await authApi.logout()
        commit('CLEAR_AUTH')
      } catch (error) {
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
    userProfile: (state) => state.userProfile,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
}