import Vue from 'vue'
import Vuex from 'vuex'

import core from './modules/core'

import task from './modules/models/task'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    core,

    task
  }
})
