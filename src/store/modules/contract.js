import contractApi from '@/api/contract.js'

export default {
  namespaced: true,
  state: () => ({
    contracts: [],
    amountSum: 0,
    loading: false,
    error: null,
  }),
  mutations: {
    SET_CONTRACTS(state, contracts) {
      state.contracts = contracts
      state.amountSum = contracts.reduce((sum, c) => sum + (c.amount || 0), 0)
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_CONTRACTS(state) {
      state.contracts = []
      state.amountSum = 0
    },
  },
  actions: {
    async loadContracts({ commit, rootState }) {
      const user = rootState.auth.user
      if (!user) return

      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const contracts = await contractApi.getContractsByUser(user.id)
        // Optional: Datum formatieren
        const formattedContracts = contracts.map(c => ({
          ...c,
          date: new Date(c.start_date).toLocaleDateString(),
          start_date: c.start_date,
          end_date: c.end_date,
        }))
        commit('SET_CONTRACTS', formattedContracts)
      } catch (error) {
        console.error('Error loading contracts:', error)
        commit('SET_ERROR', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addContract({ dispatch, rootState }, newContract) {
      const user = rootState.auth.user
      if (!user) return
      try {
        await contractApi.addContract(user.id, newContract)
        await dispatch('loadContracts')
      } catch (error) {
        console.error('Error adding contract:', error)
      }
    },

    async deleteContract({ dispatch, rootState }, contractId) {
      const user = rootState.auth.user
      if (!user) return
      if (!confirm('Möchten Sie diesen Vertrag wirklich löschen?')) return

      try {
        await contractApi.deleteContract(user.id, contractId)
        await dispatch('loadContracts')
      } catch (error) {
        console.error('Error deleting contract:', error)
        alert('Fehler beim Löschen des Vertrags.')
      }
    },
  },
  getters: {
    contracts: (state) => state.contracts,
    amountSum: (state) => state.amountSum,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
}