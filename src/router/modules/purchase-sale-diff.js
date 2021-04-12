import Layout from '@/views/layout/index'

const routes = {
  path: '/purchase-sale-diff',
  name: 'PurchaseSaleDiff',
  component: Layout,
  redirect: 'company',
  meta: {
    title: '每日采销差异报表',
    icon: 'report'
  },
  children: [
    {
      path: 'company',
      name: 'PurchaseSaleDiffCompany',
      component: () => import('@/views/purchase-sale-diff/company'),
      meta: {
        title: '全集团'
      }
    },
    {
      path: 'brand',
      name: 'PurchaseSaleDiffBrand',
      component: () => import('@/views/purchase-sale-diff/brand'),
      meta: {
        title: '品牌'
      }
    },
    {
      path: 'goods-service-type',
      name: 'PurchaseSaleDiffGoodsServiceType',
      component: () => import('@/views/purchase-sale-diff/goods-service-type'),
      meta: {
        title: '商品服务类型'
      }
    },
    {
      path: 'detail',
      name: 'PurchaseSaleDiffDetail',
      component: () => import('@/views/purchase-sale-diff/detail'),
      hidden: true,
      meta: {
        title: '采销明细',
        hideInTagsView: true
      }
    }
  ]
}

export default routes