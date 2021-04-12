import http from '@/utils/http'

// 获取下拉选择的时间维度
export const getTimesDimension = () => http.get(`/board/sales/getTimesDimension`)

/**
 * 重点品牌目标达成率
 * @param {*} dimension 时间维度 YEAR/QUARTER/MONTH/WEEK/DAY，从可以选择时间维度的接口获取
 * @param {*} divisionId 事业部Id
 */
export const statisticsBrandUnit = (divisionId, dimension) => {
  return http.get(`/board/sales/statisticsBrandUnit?dimension=${dimension}&divisionId=${divisionId}`)
}

/**
 * 渠道目标达成率
 * @param {*} dimension 时间维度 YEAR/QUARTER/MONTH/WEEK/DAY，从可以选择时间维度的接口获取
 * @param {*} divisionId 事业部Id
 */
export const statisticsChannelUnit = (divisionId, dimension) => {
  return http.get(`/board/sales/statisticsChannelUnit?dimension=${dimension}&divisionId=${divisionId}`)
}

/**
 * 商品服务类型销售额
 * @param {*} dimension 时间维度 YEAR/QUARTER/MONTH/WEEK/DAY，从可以选择时间维度的接口获取
 * @param {*} divisionId 事业部Id
 */
export const statisticsGoodsServiceTypeUnit = (divisionId, dimension) => {
  return http.get(`/board/sales/statisticsGoodsServiceTypeUnit?dimension=${dimension}&divisionId=${divisionId}`)
}

/**
 * 销售大盘数据
 * @param {*} dimension 时间维度 YEAR/QUARTER/MONTH/WEEK/DAY，从可以选择时间维度的接口获取
 * @param {*} divisionId 事业部Id
 */
export const statisticsUnit = (divisionId, dimension) => {
  return http.get(`/board/sales/statisticsUnit?dimension=${dimension}&divisionId=${divisionId}`)
}

/**
 * 重点品牌销售明细
 * @param {*} dimension 时间维度 YEAR/QUARTER/MONTH/WEEK/DAY，从可以选择时间维度的接口获取
 * @param {*} brandId 品牌ID
 * @param {*} businessId 事业部Id
 */
export const getBrandDetailsByDimension = ({ dimension, brandId, businessId }) => {
  return http.get(`/board/sales/getBrandDetailsByDimension/${dimension}/${brandId}/${businessId}`)
}




