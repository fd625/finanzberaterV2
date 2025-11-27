import authManager from '../services/authManager.js';
import userManager from '../services/userManager.js';

export const currentUser = {
  namespaced: true,
  state: () => ({
    user: null,
    profile: null,
    isLoading: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userProfile: (state) => state.profile,
    isLoading: (state) => state.isLoading
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    async checkAuthState({ commit }) {
      commit('SET_LOADING', true);
      try {
        const session = await authManager.getSession();
        const user = session?.user ?? null;
        commit('SET_USER', user);

        if (user) {
          try {
            const profile = await userManager.getProfile(user.id);
            commit('SET_PROFILE', profile);
          } catch (err) {
            console.warn('Profil konnte nicht geladen werden:', err);
            commit('SET_PROFILE', null);
          }
        } else {
          commit('SET_PROFILE', null);
        }
      } catch (err) {
        console.error('Fehler beim Prüfen des Auth-Status:', err);
        commit('SET_USER', null);
        commit('SET_PROFILE', null);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async handleLoginSuccess({ dispatch }, user) {
      // Nach Login Session neu laden
      await dispatch('checkAuthState');
    },

    async logout({ commit }) {
      try {
        await authManager.signOut();
      } catch (err) {
        console.error('Fehler beim Logout:', err);
      } finally {
        commit('SET_USER', null);
        commit('SET_PROFILE', null);
      }
    }
  }
};