import authManager from '../services/authManager.js';
import userManager from '../services/userManager.js';
import contractManager from '../services/contractManager.js';

export const currentUser = {
  namespaced: true,
  state: () => ({
    user: null,
    profile: null,
    isLoading: false,
    remainingSalary: 0
  }),
  getters: {
    userData: (state) => state.user ? { ...state.user, profile: state.profile } : null,
    remainingSalary: (state) => state.remainingSalary,
    isAuthenticated: (state) => !!state.user,
  },
  mutations: {
    SET_USER(state, user) { state.user = user; },
    SET_PROFILE(state, profile) { state.profile = profile; },
    SET_LOADING(state, loading) { state.isLoading = loading; },
    SET_REMAINING_SALARY(state, amount) { state.remainingSalary = amount; }
  },
  actions: {
    async checkAuthState({ commit, dispatch }) {
      commit('SET_LOADING', true);
      try {
        const session = await authManager.getSession();
        const user = session?.user ?? null;
        commit('SET_USER', user);

        if (user) {
          const profile = await userManager.getProfile(user.id);
          commit('SET_PROFILE', profile);

          // Callback registrieren, damit remainingSalary automatisch aktualisiert wird
          contractManager.setOnContractsChange(() => {
            dispatch('recalculateRemainingSalary');
          });

          // Initial berechnen
          await dispatch('recalculateRemainingSalary');
        } else {
          commit('SET_PROFILE', null);
        }
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async recalculateRemainingSalary({ state, commit }) {
      if (!state.user || !state.profile) return;

      // Nur Contracts des aktuellen Users
      const contracts = (await contractManager.getAllContracts())
        .filter(c => c.user_id === state.user.id);

      const usedAmount = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const salary = state.profile.salary || 0;

      commit('SET_REMAINING_SALARY', salary - usedAmount);
    }
  }
};
