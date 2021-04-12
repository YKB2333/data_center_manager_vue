import Layout from '@/views/layout/index'

const routes = {
  path: '/data-board',
  name: 'DataBoard',
  component: Layout,
  redirect: 'sale',
  meta: {
    title: '数据看板',
    icon: 'board'
  },
  children: [
    {
      path: 'sale',
      name: 'DataBoardSale',
      component: () => import('@/views/data-board/sale'),
      meta: {
        title: '销售看板'
      }
    },
    {
      path: 'brand-sale-detail',
      name: 'DataBoardBrandSaleDetail',
      component: () => import('@/views/data-board/brand-sale-detail'),
      hidden: true,
      meta: {
        title: '重点品牌销售明细'
      }
    }
  ]
}

export default routes