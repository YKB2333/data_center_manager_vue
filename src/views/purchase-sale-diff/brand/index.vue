<template>
  <div :class="['chart-page-container', isSetMinWidth ? 'set-max-width' : '']">
    <div class="row space-between center-y mb10">
      <span class="fs18 fw600">品牌每日采销异常报表</span>
      <div>
        <el-select
          v-model="brandValue"
          placeholder="请选择"
          class="mr10"
          @change="brandValueChange"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <span>{{ yesterday | formatDate('Y-M-D') }}</span>
      </div>
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
    <div class="mb10 row">
      <exception-overview 
        ref="exception-overview"
        :exception-content="exceptionOverview.content" 
        :exception-tital="'异常概述'" 
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
  getPurchaseSaleDiffBrandList,
  getPurchaseSaleDiffBrand,
  getPurchaseSaleDiffBrandDetail,
  saveBrandExceptionOverview
} from "@/api/purchase-sale-diff"
import Cxcy from "@/mixins/purchase-sale-diff"
import ChartResize from "@/mixins/chart-resize"

export default {
  name: "PurchaseSaleDiffBrand",

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
      brandOptions: [],
      brandValue: "",
      saveLoading: false
    }
  },

  mounted() {
    this.init()
  },
  
  methods: {
    init() {
      getPurchaseSaleDiffBrandList().then((res) => {
        this.brandOptions = res.result || []
        if (this.brandOptions.length) {
          this.brandValue = this.brandOptions[0]
          this.fetchPurchaseSaleDiffBrand()
        }
      })
    },

    //获取表格数据
    fetchPurchaseSaleDiffBrand() {
      this.$refs['day-chart'].showLoading()
      this.$refs['third-chart'].showLoading()
      getPurchaseSaleDiffBrand({
        balanceTime: this.currentDate,
        name: this.brandValue
      }).then(({ result }) => {
        this.formatChartsData(result)
      })
    },

    onBarClick(e) {
      // console.log("柱状图点击事件", e)
      this.nextToDetail({
        page: 'PurchaseSaleDiffBrand',
        date: `${new Date().getFullYear()}/${e.name}`,
        name: this.brandValue
      })
    },

    brandValueChange(e) {
      // console.log(e)
      this.brandValue = e
      this.fetchPurchaseSaleDiffBrand()
    },

    //保存异常报告
    saveException(content){
      // console.log(content)
      if (!content) return
      let params = {
        "content": content,
        "brand": this.brandValue
      }
      if(this.exceptionOverview.id) {
        params.id = this.exceptionOverview.id
      }
      this.saveLoading = true
      saveBrandExceptionOverview(params).then(res => {
        // console.log(res)
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
