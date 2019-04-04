import Vue from 'vue'
import App from './App.vue'
import router from './core/router'

// ui
import './plugins/element.js'
import '@/core/ui.scss'

// 项目通用配置 / test/
import { env } from '@/core/js/env'
import apiService from '@/services/api'
import { formatDate, number, transitionTime } from '@/core/js/filter'
import store from './store'

Vue.filter('formatDate', formatDate)
Vue.filter('number', number)
Vue.filter('transitionTime', transitionTime)

env.init()
apiService.init()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
