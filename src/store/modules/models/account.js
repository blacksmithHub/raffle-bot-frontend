export default {
  namespaced: true,
  state () {
    return {
      items: localStorage.getItem('accounts')
        ? JSON.parse(localStorage.getItem('accounts'))
        : []
    }
  },

  mutations: {
    /**
     * Reset all items.
     *
     * @param {*} state
     */
    RESET (state) {
      state.items = []
    },

    /**
     * Store all items.
     *
     * @param {*} state
     * @param {*} items
     */
    SET_ITEMS (state, items) {
      state.items = items
    },

    /**
     * Delete an item.
     *
     * @param {*} state
     * @param {*} key
     */
    DELETE_ITEM (state, key) {
      state.items.splice(key, 1)
    }
  },

  actions: {
    /**
     * Trigger reset.
     *
     * @param {*} param
     */
    reset ({ commit }) {
      commit('RESET')
      if (localStorage.getItem('accounts')) localStorage.removeItem('accounts')
    },

    /**
     * Trigger store items.
     *
     * @param {*} param
     * @param {*} items
     */
    setItems ({ commit }, items) {
      commit('SET_ITEMS', items)
      localStorage.setItem('accounts', JSON.stringify(items))
    },

    /**
     * Trigger add item.
     *
     * @param {*} param
     * @param {*} item
     */
    addItem ({ state, commit }, item) {
      const accounts = state.items.slice()

      let lastItemId = accounts[accounts.length - 1]

      if (lastItemId) {
        lastItemId = lastItemId.id + 1
      } else {
        lastItemId = 1
      }

      accounts.push({
        id: lastItemId,
        ...item,
        name: item.name || `Proxy ${lastItemId}`,
        status: {
          id: 1,
          msg: 'stopped',
          class: 'grey'
        }
      })

      commit('SET_ITEMS', accounts)
      localStorage.setItem('accounts', JSON.stringify(accounts))
    },

    /**
     * Trigger update item.
     *
     * @param {*} param
     */
    updateItem ({ state, commit }, params) {
      const accounts = state.items.slice()

      const index = accounts.indexOf(accounts.find((element) => element.id === params.id))

      accounts[index].status = params.status

      commit('SET_ITEMS', accounts)
      localStorage.setItem('accounts', JSON.stringify(accounts))
    },

    /**
     * Trigger delete item.
     *
     * @param {*} param
     * @param {*} key
     */
    deleteItem ({ state, commit }, params) {
      const accounts = state.items.slice()

      const index = accounts.find((element) => element.id === params.id)

      commit('DELETE_ITEM', index)
      localStorage.setItem('accounts', JSON.stringify(state.items))
    }
  }
}
