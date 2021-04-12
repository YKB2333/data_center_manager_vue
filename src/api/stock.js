import http from '@/utils/http'

// 库存列表分页查询
export const getStockList = (data) => http.post(`/stock/page`, data)

// 获取库存明细
export const getStockDetail = (data) => http.post(`/stock/pageDetail`, data)

// 导出库存报表
export const exportStockList = (data = {}) => http.post(`/stock/export`, data, { responseType: 'blob' })

// 导出库存明细
export const exportStockDetail = (data) => http.post(`/stock/exportDetail`, data, { responseType: 'blob' })

/**
 * 库存类型明细
 * {
  "ncCode": 571427514786500609,  // ncCode
  "stockType": 4,                 // 库存类型（在二级页面点击总计数量的时候传，一级页面的不用）
  "pageIndex": 1,                 // 第几页
  "pageSize": 2                   // 每页大小
}
*/
export const getStockTypeDetail = (data) => http.post('/stock/pageLocation', data)

// 导出
export const exportStockTypeDetail = (data) => http.post(`/stock/exportLocation`, data, { responseType: 'blob' })


