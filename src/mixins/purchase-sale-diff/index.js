import { dayMinWarning, dayMaxWarning, thirdMinWarning, thirdMaxWarning } from '@/const/cxcy'
import { PSD_DETAIL_ROUTE_PATH, PSD_DETAIL_ROUTE_NAME } from "@/const/router-path"
import { hasPermissionPage } from '@/utils/permission'

export default {
  data() {
    return {
      dayMinWarning, 
      dayMaxWarning, 
      thirdMinWarning, 
      thirdMaxWarning,
      currentDate: new Date().getTime(),
      yesterday: new Date().setDate(new Date().getDate() - 1),
      form: {
        monthStockNum: null,
        dayStockNum: null,
        mtdInBoundNum: null,
        inBoundNum: null,
        mtdOutBoundNum: null,
        outBoundNum: null,
        mtdPurchaseSalesRatio: null,
        purchaseSalesRatio: null,
        balanceTime: null,
        fluidSales: null,
      },
      exceptionOverview: {}, //异常概述
      statictTableData: [], // 三阶图下的统计表格
      dayChartData: [], // 日度图表所需数据
      thirdChartData: [], // 三阶图图表所需数据
      isSetMinWidth: true
    }
  },
  methods: {
    formatChartsData(result, cb) {
      let { dayStatisticDto, purchaseSalesRatioDtos, dayStatisticThirdOrderDto, exceptionOverview } = result
       // 异常概述
       this.exceptionOverview = exceptionOverview || {}
      if (dayStatisticDto) {
        this.form.monthStockNum = dayStatisticDto.monthStockNum || 0
        this.form.dayStockNum = dayStatisticDto.dayStockNum || 0
        this.form.mtdInBoundNum = dayStatisticDto.mtdInBoundNum || 0
        this.form.mtdOutBoundNum = dayStatisticDto.mtdOutBoundNum || 0
        this.form.inBoundNum = dayStatisticDto.inBoundNum || 0
        this.form.outBoundNum = dayStatisticDto.outBoundNum || 0
        this.form.mtdPurchaseSalesRatio = dayStatisticDto.mtdPurchaseSalesRatio || 0
        this.form.purchaseSalesRatio = dayStatisticDto.purchaseSalesRatio || 0
        this.form.balanceTime = dayStatisticDto.balanceTime
        this.form.fluidSales = dayStatisticDto.fluidSales || 0
      }
      let curMonth // 月份
      // 解构日图数据
      this.dayChartData = []
      if (purchaseSalesRatioDtos && purchaseSalesRatioDtos.length) {
        curMonth = this.$options.filters.formatDate(purchaseSalesRatioDtos[0].balanceTime, "M")
        this.isSetMinWidth = purchaseSalesRatioDtos.length >= 20
        this.dayChartData = purchaseSalesRatioDtos.map(e => {
          return {
            id: e.id,
            label: this.$options.filters.formatDate(e.balanceTime, "M/D"),
            // value: Number(e.purchaseSalesRatio || 0).toFixed(2)
            value: Number.isNaN(Number(e.purchaseSalesRatio || 0)) ? e.purchaseSalesRatio : Number(e.purchaseSalesRatio || 0) // 数据异常是显示异常信息
          }
        })
      }
      
      // 解构三阶图数据
      if (dayStatisticThirdOrderDto) {
        let {
          firstTenDays, 
          midMonthDays, 
          lateTenDays,
          firstTenDaysInBoundNum,
          firstTenDaysOutBoundNum,
          firstTenDaysInBoundTotalPrice,
          firstTenDaysOutBoundTotalPrice,
          firstTenDaysPurchaseSalesRatio,
          midmonthInBoundNum,
          midmonthOutBoundNum,
          midmonthInBoundTotalPrice,
          midmonthOutBoundTotalPrice,
          midmonthPurchaseSalesRatio,
          lateTenDaysInBoundNum,
          lateTenDaysOutBoundNum,
          lateTenDaysInBoundTotalPrice,
          lateTenDaysOutBoundTotalPrice,
          lateTenDaysPurchaseSalesRatio,
        } = dayStatisticThirdOrderDto;
        // 汇总表格
        this.statictTableData = []
        this.thirdChartData = []
        let tableItem = {
          title: 'WTD',
          inBoundNum: 0, // 入库数量
          outBoundNum: 0, // 出库数量
          inBoundPrice: 0, // 入库金额
          outBoundPrice: 0, // 出库金额
          purchaseSalesRatio: '', // 采销差比
        }
        if (firstTenDays) {
          let firstEndDay = firstTenDays < 10 ? `0${firstTenDays}` : 10
          let firstTitle = `WTD1(${curMonth}/01-${curMonth}/${firstEndDay})`
          // 图表
          this.thirdChartData.push({
            label: firstTitle,
            value1: firstTenDaysInBoundNum || 0, // 入库数量
            value2: firstTenDaysOutBoundNum || 0, // 出库数量
            value3: Number(firstTenDaysPurchaseSalesRatio || 0) * 100
          })
          // 表格
          let item = _.cloneDeep(tableItem)
          item.title = firstTitle
          item.inBoundNum = firstTenDaysInBoundNum
          item.outBoundNum = firstTenDaysOutBoundNum
          item.inBoundPrice = firstTenDaysInBoundTotalPrice
          item.outBoundPrice = firstTenDaysOutBoundTotalPrice
          item.purchaseSalesRatio = firstTenDaysPurchaseSalesRatio
          this.statictTableData.push(item)
        }
        if (midMonthDays) {
          let midLastDay = midMonthDays < 10 ? `${10 + midMonthDays}` : 20
          let midTitle = `WTD2(${curMonth}/11-${curMonth}/${midLastDay})`
          // 图表
          this.thirdChartData.push({
            label: midTitle,
            value1: midmonthInBoundNum || 0, // 入库数量
            value2: midmonthOutBoundNum || 0, // 出库数量
            value3: Number(midmonthPurchaseSalesRatio || 0) * 100
          })
          // 表格
          let item = _.cloneDeep(tableItem)
          item.title = midTitle
          item.inBoundNum = midmonthInBoundNum
          item.outBoundNum = midmonthOutBoundNum
          item.inBoundPrice = midmonthInBoundTotalPrice
          item.outBoundPrice = midmonthOutBoundTotalPrice
          item.purchaseSalesRatio = midmonthPurchaseSalesRatio
          this.statictTableData.push(item)
        }
        if (lateTenDays) {
          let lateTitle = `WTD3(${curMonth}/21-${curMonth}/${20 + lateTenDays})`
          // 图表
          this.thirdChartData.push({
            label: lateTitle,
            value1: lateTenDaysInBoundNum || 0, // 入库数量
            value2: lateTenDaysOutBoundNum || 0, // 出库数量
            value3: Number(lateTenDaysPurchaseSalesRatio || 0) * 100
          })
          // 表格 
          let item = _.cloneDeep(tableItem)
          item.title = lateTitle
          item.inBoundNum = lateTenDaysInBoundNum
          item.outBoundNum = lateTenDaysOutBoundNum
          item.inBoundPrice = lateTenDaysInBoundTotalPrice
          item.outBoundPrice = lateTenDaysOutBoundTotalPrice
          item.purchaseSalesRatio = lateTenDaysPurchaseSalesRatio
          this.statictTableData.push(item)
        }
        if (this.thirdChartData.length) {
          this.thirdChartData.push({
            label: 'MTD采销差比',
            value1: this.form.mtdInBoundNum || 0, // 入库数量
            value2: this.form.mtdOutBoundNum || 0, // 出库数量
            value3: Number(this.form.mtdPurchaseSalesRatio || 0)  * 100
          })
        }
      }    
      
      // 回调函数
      if (cb) cb()
    },

    nextToDetail(query) {
      // 检查是否有采销明细查看权限
      if (!hasPermissionPage(PSD_DETAIL_ROUTE_NAME)) {
        // console.error('无权限')
        this.$message.warning('无查看权限')
        return
      }
      this.$router.push({
        path: PSD_DETAIL_ROUTE_PATH,
        query: query
      })
    }
  }
}