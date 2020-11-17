import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
Vue.use(ViewUI)

Vue.config.productionTip = false

import baseEnv from './assets/js/config.js'
Vue.prototype.$baseEnv = baseEnv

import {common} from './assets/js/common.js'
Vue.prototype.$commonFunc = common

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
