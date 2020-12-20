import Vue from 'vue'
import Vuex from 'vuex'

import core from './modules/core'

import task from './modules/models/task'
import store from './modules/models/store'
import proxy from './modules/models/proxy'
import profile from './modules/models/profile'
import account from './modules/models/account'
import country from './modules/models/country'
import city from './modules/models/city'
import region from './modules/models/region'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    core,

    task,
    store,
    proxy,
    profile,
    account,
    country,
    city,
    region
  }
})
