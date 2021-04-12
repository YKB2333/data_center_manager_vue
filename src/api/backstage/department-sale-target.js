import http from '@/utils/http'

// 删除销售目标
export const deleteTarget = (id) => http.get(`/target/business/remove/${id}`)

// 批量删除销售目标
export const deleteBatchTarget = (ids) => http.post(`/target/business/removeBatch`, ids)

// 修改销售目标
export const updateTarget = (params) => http.post(`/target/business/update`, params)

// 新增销售目标
export const addTarget = (params) => http.post(`/target/business/save`, params)

// 获取销售目标
export const getBusinessTargets = (query) => http.post(`/target/business/getBusinessTargets`, query)

// 下载导入模板
export const downLoadTemplate = () => http.post(`/target/business/downLoadTemplate`, {}, { responseType: 'blob' })

// 导入
export const importTemplate = (formData) => http.post(`/target/business/import`, formData)


