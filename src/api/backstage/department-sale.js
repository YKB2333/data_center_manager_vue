import http from '@/utils/http'

// 获取事业部-销售部门
export const getBusinessAndOrganization = () => http.get(`/business/organization/getBusinessOrganizations`)

// 导出
export const exportExcel = () => http.post(`/business/organization/export`, {}, { responseType: 'blob' })