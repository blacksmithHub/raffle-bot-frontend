import Vue from 'vue'

import './plugins/vuelidate'
import './plugins/vue-moment'

import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
