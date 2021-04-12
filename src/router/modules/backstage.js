import Layout from '@/views/layout/index'

const routes = {
  path: '/backstage',
  name: 'Backstage',
  component: Layout,
  redirect: '/backstage/sale-board/department',
  meta: {
    title: '后台管理',
    icon: 'backstage'
  },
  children: [
    {
      path: 'sale-board',
      name: 'BackstageSaleBorad',
      redirect: '/backstage/sale-board/department',
      component: () => import('@/views/backstage'), // 3级路由时后台填写null即可
      meta: {
        title: '销售看板'
      },
      children: [
        {
          path: 'department-sale',
          name: 'DepartmentSale',
          component: () => import('@/views/backstage/department-sale'),
          meta: {
            title: '事业部与销售部门关系'
          }
        },
        {
          path: 'department-sale-target',
          name: 'DepartmentSaleTarget',
          component: () => import('@/views/backstage/department-sale-target'),
          meta: {
            title: '事业部销售销售目标'
          }
        },
        {
          path: 'department-channel-sale-target',
          name: 'DepartmentChannelSaleTarget',
          component: () => import('@/views/backstage/department-channel-sale-target'),
          meta: {
            title: '事业部渠道销售目标'
          }
        },
        {
          path: 'department-brand-sale-target',
          name: 'DepartmentBrandSaleTarget',
          component: () => import('@/views/backstage/department-brand-sale-target'),
          meta: {
            title: '事业部品牌销售目标'
          }
        },
        {
          path: 'department-auth-role',
          name: 'DepartmentAuthRole',
          component: () => import('@/views/backstage/department-auth-role'),
          meta: {
            title: '事业部与角色'
          }
        }
      ]
    }
  ]
}

export default routes
