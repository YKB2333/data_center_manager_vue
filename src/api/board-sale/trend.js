import http from '@/utils/http'

// 日度销售趋势
export const getSalesTrendByDay = (businessId) => http.get(`/board/sales/trend/getSalesTrendByDay/${businessId}`)

// 周度销售趋势
export const getSalesTrendByWeek = (businessId) => http.get(`/board/sales/trend/getSalesTrendByWeekOfYear/${businessId}`)

// 月度销售趋势
export const getSalesTrendByMonth = (businessId) => http.get(`/board/sales/trend/getSalesTrendByMonth/${businessId}`)

// 季度销售趋势
export const getSalesTrendByQuarter = (businessId) => http.get(`/board/sales/trend/getSalesTrendByQuarter/${businessId}`)

// 年度销售趋势
export const getSalesTrendYear = (businessId) => http.get(`/board/sales/trend/getSalesTrendYear/${businessId}`)

// 当周每日销售趋势
export const getSalesTrendByDayOfWeek = (businessId) => http.get(`/board/sales/trend/getSalesTrendByDayOfWeek/${businessId}`)

// 当月每周销售趋势
export const getSalesTrendByWeekOfMonth = (businessId) => http.get(`/board/sales/trend/getSalesTrendByWeekOfMonth/${businessId}`)

// 当季每月销售趋势
export const getSalesTrendByMonthOfQuarter = (businessId) => http.get(`/board/sales/trend/getSalesTrendByMonthOfQuarter/${businessId}`)

// 销售额区域
export const getSalesPriceRegionalDistribution = (businessId) => http.get(`/board/sales/trend/getSalesPriceRegionalDistribution/${businessId}`)
