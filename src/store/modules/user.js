import constantRoutes from '@/router/constant-routes'
import { getToken, setToken } from '@/utils/auth'
import { filterAsyncRouter, getterTreeArray, generateFlatRoutes } from '@/utils/permission'
import { login, logout } from '@/api/user'
import router from '@/router'
import { LOGIN_PATH } from '@/const/router-path'

const user = {
  state: {
    token: getToken(),
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    permissinRoutes: [],
    appMenuList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },

    SET_PERMISSION_ROUTES: (state, routes) => {
      state.permissinRoutes = routes
    },

    SET_APP_MENU_LIST: (state, list) => {
      state.appMenuList = list
    },
    
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  },

  actions: {
    // 登录获取token
    Login({ commit }, { account, pwd }) {
      return new Promise((resolve, reject) => {
        login(account, pwd).then(({ result }) => {
          console.log(result)
          commit('SET_USER_INFO', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    generateRoutes({ commit, state }) {
      return new Promise(resolve => {
        let appMenuList = []
        let permissionRoutes = []
        if (!state.userInfo.menuList || state.userInfo.menuList.length === 0) {
          appMenuList = constantRoutes
        } else {
          const serverMenuList = getterTreeArray('id', 'pid', state.userInfo.menuList)
          const replaceComponent = filterAsyncRouter(serverMenuList)
          permissionRoutes = generateFlatRoutes(replaceComponent)
          appMenuList = [...constantRoutes, ...replaceComponent]
        }
        // console.log('菜单', appMenuList)
        commit('SET_PERMISSION_ROUTES', permissionRoutes)
        commit('SET_APP_MENU_LIST', appMenuList)
        resolve(permissionRoutes)
      })
    },

    // 退出登录
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('SET_TOKEN', '')
          commit('SET_USER_INFO', {})
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
          // router.push({ path:  LOGIN_PATH})
          resolve()
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      })
    },
    
    clearUser({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', {})
        resolve()
      })
    }
  }
}

export default user
