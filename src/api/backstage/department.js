import http from '@/utils/http'

// 获取事业部列表
export const getBusinessList = (isSalesBoard = false) => http.get(`/business/getBusinessList?isSalesBoard=${isSalesBoard}`)