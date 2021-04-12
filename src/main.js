import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css
import '@/assets/icons' // icon
import './router/permission' // permission control
import VueBus from '@/utils/bus'
import importDirective from '@/directives'
import { elementSize } from '@/config'
import * as filters from './filters' // global filters
import 'lodash'
// import tableHeight from '@/directives/table-height'

// 注册指令
importDirective(Vue)
// 表格自适应指令
// Vue.use(tableHeight)
// elementUI
Vue.use(Element, { size: elementSize })
// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// event-bus
Vue.use(VueBus)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
