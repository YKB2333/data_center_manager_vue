import http from '@/utils/http'
// 获取采销差异表数据-集团
export const getPurchaseSaleDiffCompany = () => http.get(`/cxcy/company/getStatisticsDataByCompany`)

// 获取采销差异表数据-集团-明细数据
export const getPurchaseSaleDiffCompanyDetail = (data) => http.post(`/cxcy/company/getStatisticsDetailByCompany`, data)

// 获取采销差异表数据-集团-明细数据导出
export const getPurchaseSaleDiffCompanyExport = (data) => http.post(`/cxcy/company/exportData`, data, { responseType: 'blob' })

// (集团)保存异常概述
export const saveCompanyExceptionOverview = (data) => http.post(`/cxcy/company/saveExceptionOverview`, data)

// 获取采销差异表数据-品牌列表
export const getPurchaseSaleDiffBrandList = () => http.get(`/cxcy/brand/getAllChoiceBrands`)

// 获取采销差异表数据-品牌
export const getPurchaseSaleDiffBrand = (data) => http.post(`/cxcy/brand/getStatisticsDataByBrand`,data)

// 获取采销差异表数据-品牌-明细数据
export const getPurchaseSaleDiffBrandDetail = (data) => http.post(`/cxcy/brand/getStatisticsDetailByBrand`, data)

// 获取采销差异表数据-品牌-明细数据导出
export const getPurchaseSaleDiffBrandExport = (data) => http.post(`/cxcy/brand/exportData`, data,  { responseType: 'blob' })

// (品牌维度)保存异常概述
export const saveBrandExceptionOverview = (data) => http.post(`/cxcy/brand/saveExceptionOverview`, data)

// 获取采销差异表数据-商品服务列表
export const getPurchaseSaleDiffGoodsServiceTypeList = () => http.get(`/cxcy/goodsServiceType/getAllChoiceGoodsServiceTypes`)

// 获取采销差异表数据-商品服务
export const getPurchaseSaleDiffGoodsServiceType = (data) => http.post(`/cxcy/goodsServiceType/getStatisticsDataByGoodsServiceType`,data)

// 获取采销差异表数据-商品服务-明细数据
export const getPurchaseSaleDiffGoodsServiceTypeDetail = (data) => http.post(`/cxcy/goodsServiceType/getStatisticsDetailByGoodsServiceType`, data)

// 获取采销差异表数据-商品服务-明细数据导出
export const getPurchaseSaleDiffGoodsServiceTypeExport = (data) => http.post(`/cxcy/goodsServiceType/exportData`, data, { responseType: 'blob' })

// (商品服务类型维度)保存异常概述
export const saveGoodsServiceTypeExceptionOverview = (data) => http.post(`/cxcy/goodsServiceType/saveExceptionOverview`, data)



