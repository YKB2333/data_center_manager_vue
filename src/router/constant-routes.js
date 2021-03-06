import Layout from '@/views/layout/index'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    isCache: true                if true, the page will be cached(default is true)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
    hideInTagsView: true         if true the page will not show in the tags-view
  }
**/

export default [
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { 
          title: '首页', 
          icon: 'dashboard', 
          isCache: false, 
          affix: true 
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/getBackPassword',
    name: 'GetBackPassword',
    component: () => import('@/views/get-back-password'),
    hidden: true,
    meta: {
      title: '找回密码'
    }
  },
  {
    path: '/401',
    name: 'Page401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  }
]
