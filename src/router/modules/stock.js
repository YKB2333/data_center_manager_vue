/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/index'

const routes = {
  path: '/stock',
  name: 'Stock',
  component: Layout,
  redirect: '/stock-list',
  meta: {
    title: '库存报表',
    icon: 'report'
  },
  children: [
    {
      path: 'list',
      name: 'StockList',
      component: () => import('@/views/stock'),
      meta: {
        title: '库存报表'
      }
    },
    {
      path: 'detail',
      name: 'StockDetail',
      component: () => import('@/views/stock/stock-detail'),
      hidden: true,
      meta: {
        title: '库存明细',
        hideInTagsView: true
      }
    },
    {
      path: 'type-detail',
      name: 'StockTypeDetail',
      component: () => import('@/views/stock/stock-type-detail'),
      hidden: true,
      meta: {
        title: '库存类型明细',
        hideInTagsView: true
      }
    }
  ]
}

export default routes
