import http from '@/utils/http'

// 获取事业部角色关系列表
export const getBusinessRole = () => http.get(`/business-role/getBusinessRole`)

// 新增事业部角色关系
export const addBusinessRole = (data) => http.post(`/business-role/saveBusinessRole`,data)

// 修改事业部角色关系
export const updateBusinessRole = (data) => http.post(`/business-role/updateBusinessRole`,data)

// 修改事业部角色关系
export const deleteBusinessRole = (data) => http.get(`/business-role/deleteBusinessRole/${data}`)



