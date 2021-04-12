import Vue from 'vue'
import Router from 'vue-router'
import constantRoutes from './constant-routes'
Vue.use(Router)

const createRouter = () => new Router({
  mode: 'hash',
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 })
})

const router = createRouter()
  
export const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}
  
export default router

