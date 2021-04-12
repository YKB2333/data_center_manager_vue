
import http from './axios-mock.js'
const Mock = require('mockjs')
let Random = Mock.Random

let data1 = {
  result: {
    // MTD日统计对象
    dayStatisticDto: {
      monthStockNum: Random.integer(60000, 1400000),
      dayStockNum: Random.integer(60000, 1400000),
      mtdInBoundNum: Random.integer(60000, 1400000),
      yesterdayInBoundNum: Random.integer(60000, 1400000),
      mtdOutBoundNum: Random.integer(60000, 1400000),
      yesterdayOutBoundNum: Random.integer(60000, 1400000),
      mtdPurchaseSalesRatio: Random.integer(0, 100) + '%',
      yesterdayPurchaseSalesRatio: Random.integer(0, 100) + '%',
      balanceTime: new Date().getTime(),
      fluidSales: Random.integer(0, 100) + '%',
    },
    // 采销差比推移（三阶图）
    dayStatisticThirdOrderDto: {
      firstTenDaysInBoundNum: Random.integer(60000, 1400000),
      firstTenDaysOutBoundNum: Random.integer(60000, 1400000),
      firstTenDaysPurchaseSalesRatio: Random.integer(0, 100) + '%',
      lateTenDaysInBoundNum: Random.integer(60000, 1400000),
      lateTenDaysOutBoundNum: Random.integer(60000, 1400000),
      lateTenDaysPurchaseSalesRatio: Random.integer(0, 100) + '%',
      midmonthInBoundNum: Random.integer(60000, 1400000),
      midmonthOutBoundNum: Random.integer(60000, 1400000),
      midmonthPurchaseSalesRatio: Random.integer(0, 100) + '%',
    },
    purchaseSalesRatioDtos: function() {
      var list = []
      var dottedBase = +new Date()
      for (var i = 30; i > 0; i--) {
        var date = new Date((dottedBase -= 1000 * 3600 * 24))
        list.push({
          id: Random.string(),
          purchaseSalesRatio: Random.integer(0, 100) + '%',
          balanceTime: date.getTime()
        })
      }
      return list
    }
  },
  success: true
}

Mock.mock('/cxcy/company/getStatisticsDataByCompany', 'get', data1)

// 获取采销差异表数据-集团
export const getPurchaseSaleDiffCompany = () => http.get(`/cxcy/company/getStatisticsDataByCompany`)
