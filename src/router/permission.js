import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import { projectName } from '@/config'
import { LOGIN_PATH, GET_BACK_PASSWORD_PATH } from '@/const/router-path'
import { resetRouter } from '@/router'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = [LOGIN_PATH, GET_BACK_PASSWORD_PATH] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === LOGIN_PATH) {
      // 如果是登录页，直接进入首页
      const { redirect } = to.query
      if (redirect) {
        let query = _.cloneDeep(to.query)
        delete query.redirect
        next({ 
          path: redirect,
          query
        })
      } else {
        // 跳转首页
        next({ path: '/' })
      }
      // next({ path: '/' })
      NProgress.done() // 如果当前页是首页时不会触发afterEach hook,需要在这里结束进度条
    } else {
      if (store.getters.appMenuList.length === 0) {
        store.dispatch('generateRoutes').then(routes => {
          let arr = [...routes]
          arr.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          // console.log('路由', arr)
          resetRouter()
          router.addRoutes(arr)
          next({ ...to, replace: true })
        }).catch(err => {
          console.error('err', err)
          Message.error('路由初始化失败')
          NProgress.done() // 如果当前页是首页时不会触发afterEach hook,需要在这里结束进度条
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // next(`${LOGIN_PATH}?redirect=${to.path}`) // 否则全部重定向到登录页
      next(`${LOGIN_PATH}`) // 否则全部重定向到登录页
      NProgress.done() // 如果当前页是登录页时不会触发afterEach hook,需要在这里结束进度条
    }
  }
})

router.afterEach((to) => {
  NProgress.done() // finish progress bar
  if (to.meta.title) {
    document.title = `${to.meta.title}-${projectName}`
  }
})
