import http from '@/utils/http'

/** 
* 客户销售TOP5
* businessId: 事业部ID 
* timeType: YEAR:年度,MONTH:月度,DAY:日度,QUARTER:季度,WEEK:周度
*/
export const getCustomerSalesTop5 = (businessId, timeType) => {
  return http.post(`/board/sales/top/getCustomerSalesTop5`, { businessId, timeType })
}

// 品牌销售TOP10
export const getGoodsBrandSalesTop10 = (businessId, timeType) => {
  return http.post(`/board/sales/top/getGoodsBrandSalesTop10`, { businessId, timeType })
}

// 商品分类销售TOP10
export const getGoodsCategorySalesTop10 = (businessId, timeType) => {
  return http.post(`/board/sales/top/getGoodsCategorySalesTop10`, { businessId, timeType })
}

// 商品销售TOP5
export const getGoodsSalesTop5 = (businessId, timeType, goodsSalesTopType = 0) => {
  // goodsSalesTopType: 0:销售额排序,1:销售量排序
  return http.post(`/board/sales/top/getGoodsSalesTop5`, { businessId, timeType, goodsSalesTopType })
}

