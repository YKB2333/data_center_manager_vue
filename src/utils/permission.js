import Layout from '@/views/layout/index'
import store from '@/store'

// export const _import = (path) => () => Promise.resolve(require(`@/views/${path}`).default)
export const _import = (path) => resolve => require([`@/views/${path}`], resolve)

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(item => {
    getFormatItem(item)
    if (!item.component) return false
    // Layout组件特殊处理
    if (['layout', 'Layout'].includes(item.component)) {
      item.component = Layout
    } else {
      if (item.component !== 'null') {
        item.component = _import(item.component)
      }
    }
    if (item.children && item.children.length) {
      item.meta.permission = item.children.filter(key => key.type === 2)
      item.children = filterAsyncRouter(item.children)
      if (item.children.length === 0) delete item.children
    }
    return true
  })
  return accessedRouters
}

function getFormatItem(item) {
  let meta = item.meta && JSON.parse(item.meta.replace(/\'/g, '"')) || {}
  let constantMeta = {
    title: meta.title || item.name,
    isCache: meta.isCache === false ? false : true,
    hideInTagsView: meta.hideInTagsView || false,
    icon: meta.icon || ''
  }
  item.meta = Object.assign(constantMeta, meta)
  item.path = item.routerPath || ''
  item.name = item.routerName || ''
  item.pos = item.pos || ''
  item.component = item.routerComponent || ''
  if (item.redirectUrl) item.redirect = item.redirectUrl
  item.hidden = !item.isShow
  return item
}

export function getterTreeArray(parentKey, subKey, data) {
  // 过滤父级 => 遍历获取子children => 判断有没有length、如果有递归
  let baseNodes = data.filter(item => !item[subKey])
  const toTreeArray = (nodeList, nodeData) => {
    nodeList.forEach(item => {
      let children = nodeData.filter(key => key[subKey] === item[parentKey])
      if (children.length > 0) {
        children.sort((a, b) => b.pos - a.pos)
        item.children = children
        toTreeArray(children, nodeData)
      }
    })
  }
  toTreeArray(baseNodes, data)
  return baseNodes.sort((a, b) => b.pos - a.pos)
}

// 判断是否有页面权限
export const hasPermissionPage = (routeName) => {
  let flag = false
  const routes = store.getters.permissinRoutes
  // console.log('routes', routes)
  let hasPermission = (arr) => {
    arr.forEach(e => {
      if (e.name === routeName) {
        flag = true
      }
      if (e.children && e.children.length) {
        hasPermission(e.children)
      }
    })
  }
  hasPermission(routes)
  return flag
}

//  生成扁平化机构路由(将三级路由转换为二级结构)
export const generateFlatRoutes = (accessRoutes) => {
  const castToFlatRoute = (routes) => {
    let flatRoutes = []
    routes.forEach(item => {
      if (item.children && item.children.length) {
        item.children.forEach(child => {
          flatRoutes.push({
            ...child,
            path: `${item.path}/${child.path}`,
          })
        })
      } else {
        flatRoutes.push({
          ...item
        })
      }
    })
    return flatRoutes
  }

  let result = []
  accessRoutes.forEach(accessRouter => {
    let childrenFlatRoutes = []
    if (accessRouter.children && accessRouter.children.length) {
      childrenFlatRoutes = castToFlatRoute(accessRouter.children)
    }
    result.push({
      ...accessRouter,
      children: childrenFlatRoutes
    })
  })
  return result
}

