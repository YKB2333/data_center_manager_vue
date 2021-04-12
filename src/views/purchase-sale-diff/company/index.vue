<template>
  <div :class="['chart-page-container', isSetMinWidth ? 'set-max-width' : '']">
    <div class="row space-between center-y mb10">
      <span class="fs18 fw600">集团每日采销异常报表</span>
      <span>{{ yesterday | formatDate('Y-M-D') }}</span>
    </div>
    <div class="mb10 row">
      <purchase-sale-diff-box :form="form" />
      <div class="flex-1 ml10">
        <day-chart
          ref="day-chart"
          title="采销差比推移（日度）"
          :chart-data="dayChartData"
          :warning-line-min="dayMinWarning"
          :warning-line-max="dayMaxWarning"
          :zero-line="0"
          @bar="onBarClick"
        />
      </div>
    </div>
    <!-- 每日采销差异报表-三阶图 -->
    <div class="mb10 row">
      <exception-overview 
        ref="exception-overview"
        :exception-content="exceptionOverview.content" 
        :exception-tital="'每日异常概述'" 
        @save="saveException" 
        :loading="saveLoading" 
      />
      <div class="flex-1 ml10">
        <third-chart
          ref="third-chart"
          title="采销差比推移（三阶图）"
          :chart-data="thirdChartData"
          :warning-line-min="thirdMinWarning"
          :warning-line-max="thirdMaxWarning"
        />
      </div>
    </div>
    <table-data-diff :statict-table-data="statictTableData"></table-data-diff>
  </div>
</template>

<script>
import DayChart from "../components/charts/day"
import ThirdChart from "../components/charts/third"
import PurchaseSaleDiffBox from "../components/purchase-sale-diff-box"
import TableDataDiff from "../components/table-data-diff"
import ExceptionOverview from "../components/exception-overview"
import {
  getPurchaseSaleDiffCompany,
  getPurchaseSaleDiffCompanyDetail,
  saveCompanyExceptionOverview
} from "@/api/purchase-sale-diff"
import Cxcy from "@/mixins/purchase-sale-diff"
import ChartResize from "@/mixins/chart-resize"

export default {
  name: "PurchaseSaleDiffCompany",

  mixins: [Cxcy, ChartResize],
  
  components: { 
    DayChart, 
    ThirdChart, 
    PurchaseSaleDiffBox, 
    TableDataDiff, 
    ExceptionOverview 
  },

  data() {
    return {
      saveLoading: false
    }
  },

  mounted() {
    this.$refs['day-chart'].showLoading()
    this.$refs['third-chart'].showLoading()
    getPurchaseSaleDiffCompany().then(({ result }) => {
      // console.log("result", result)
      this.formatChartsData(result)
    })
  },

  methods: {
    onBarClick(e) {
      // console.log("柱状图点击事件", e)
      this.nextToDetail({
        page: "PurchaseSaleDiffCompany",
        date: `${new Date().getFullYear()}/${e.name}`
      })
    },

    //保存异常报告
    saveException(content) {
      // console.log(content)
      if (!content) return
      let params = { "content": content }
      if(this.exceptionOverview.id) {
        params.id = this.exceptionOverview.id
      }
      this.saveLoading = true
      saveCompanyExceptionOverview(params).then(() => {
        this.exceptionOverview.content = content
        this.$refs['exception-overview'].clear()
      }).finally(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/charts/chart-page-container.scss';
</style>
