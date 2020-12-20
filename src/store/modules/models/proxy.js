export default {
  namespaced: true,
  state () {
    return {
      items: localStorage.getItem('proxies')
        ? JSON.parse(localStorage.getItem('proxies'))
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
      if (localStorage.getItem('proxies')) localStorage.removeItem('proxies')
    },

    /**
     * Trigger store items.
     *
     * @param {*} param
     * @param {*} items
     */
    setItems ({ commit }, items) {
      commit('SET_ITEMS', items)
      localStorage.setItem('proxies', JSON.stringify(items))
    },

    /**
     * Trigger add item.
     *
     * @param {*} param
     * @param {*} item
     */
    addItem ({ state, commit }, item) {
      const proxies = state.items.slice()

      let lastItemId = proxies[proxies.length - 1]

      if (lastItemId) {
        lastItemId = lastItemId.id + 1
      } else {
        lastItemId = 1
      }

      proxies.push({
        id: lastItemId,
        ...item,
        name: item.name || `Proxy ${lastItemId}`,
        status: {
          id: 1,
          msg: 'stopped',
          class: 'grey'
        }
      })

      commit('SET_ITEMS', proxies)
      localStorage.setItem('proxies', JSON.stringify(proxies))
    },

    /**
     * Trigger update item.
     *
     * @param {*} param
     */
    updateItem ({ state, commit }, params) {
      const proxies = state.items.slice()

      const index = proxies.indexOf(proxies.find((element) => element.id === params.id))

      proxies[index].status = params.status

      commit('SET_ITEMS', proxies)
      localStorage.setItem('proxies', JSON.stringify(proxies))
    },

    /**
     * Trigger delete item.
     *
     * @param {*} param
     * @param {*} key
     */
    deleteItem ({ state, commit }, params) {
      const proxies = state.items.slice()

      const index = proxies.find((element) => element.id === params.id)

      commit('DELETE_ITEM', index)
      localStorage.setItem('proxies', JSON.stringify(state.items))
    }
  }
}
