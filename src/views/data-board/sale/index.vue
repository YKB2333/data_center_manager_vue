<template>
  <div class="board-page">
    <p class="board-title text-center">品牌公司销售看板</p>
    <el-row :gutter="10" type="flex" align="bottom">
      <el-col :lg="3" style="height: 58px;">
        <div class="static-grid">
          <p class="label">订单数(单)</p>
          <p class="value">{{ statistics.totalOrderNums | formatThousand }}</p>
        </div>
      </el-col>
      <el-col :lg="3" style="height: 58px;">
        <div class="static-grid">
          <p class="label">销售量(PCS)</p>
          <p class="value">{{ statistics.totalOrderPcs | formatThousand }}</p>
        </div>
      </el-col>
      <el-col :lg="12" style="height: 58px;">
        <div class="static-grid h-full col center">
          <div class="row center">
            <el-select v-model="currentBusinessId" placeholder="选择事业部" class="mr10" @change="onChange" style="width: 120px;">
              <el-option
                v-for="item in businessOptions" 
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <!-- <el-select v-model="currentTimeType" placeholder="选择时间" class="mr10" style="width: 100px;" @change="onChange">
              <el-option
                v-for="item in timeOptions" 
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select> -->
            <el-radio-group 
              v-model="currentTimeType"
              @change="onChange"
            >
              <el-radio-button 
                v-for="item in timeOptions" 
                :key="item.value"
                :label="item.value"
              >
                {{ item.text }}
              </el-radio-button>
            </el-radio-group>
            <div class="pl10">
              <p>{{ new Date().getTime() | formatDate('Y年M月D日') }}</p>
              <p>{{ new Date() | formatCurrentQuarter }} {{ new Date() | formatCurrentWeek }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="3" style="height: 58px;">
        <div class="static-grid">
          <p class="label">销售额同比</p>
          <p class="value">{{ `${statistics.withRatio}%` }}</p>
        </div>
      </el-col>
      <el-col :lg="3" style="height: 58px;">
        <div class="static-grid">
          <p class="label">销售额环比</p>
          <p class="value">{{ `${statistics.loopRatio}%` }}</p>
        </div>
      </el-col>
    </el-row>
    <div class="mt4">
      <el-row :gutter="10">
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <template v-if="currentBusinessId === BUSINESS_ID">
            <business-achievement-rate
              :data="statistics.businessAchievementRate"
              :time-type="currentTimeType"
              :loading="loading"
            />
          </template>
          <template v-else>
            <channel-brand-achievement-rate
              chart-type="brand"
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <div class="row h-full center" v-loading="loading" element-loading-background="transparent">
            <div>
              <p class="fw600 fs26 white mb10">
                <span>{{ saleVolumeTitle }}</span>
                <span>累计销售额</span>
              </p>
              <p class="fw600 fs24 white">{{ statistics.totalAmount | formatThousand }}</p>
            </div>
            <pie-progress
              ref="pie-progress"
              class="h-full"
              style="width: 50%;"
              :title="ratePrefixTitle"
              :data="statistics.achievementRate"
            />
          </div>
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <channel-brand-achievement-rate
            :chart-type="currentBusinessId === BUSINESS_ID ? 'all' : 'channel'"
            :business-id="currentBusinessId"
            :time-type="currentTimeType"
          />
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <top-customer
            :business-id="currentBusinessId"
            :time-type="currentTimeType"
          />
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <template v-if="currentTimeType === 'YEAR'">
            <trend-month
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'QUARTER'">
            <trend-quarter-month
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'MONTH'">
            <trend-month-week
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'WEEK'">
            <trend-week-day
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'DAY'">
            <sale-map
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <top-goods-service-type
            :business-id="currentBusinessId"
            :time-type="currentTimeType"
          />
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <top-goods
            :business-id="currentBusinessId"
            :time-type="currentTimeType"
          />
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <template v-if="['YEAR', 'QUARTER'].includes(currentTimeType)">
            <div class="row h-full">
              <div class="flex-1 hidden" v-if="currentTimeType === 'YEAR'">
                <trend-quarter
                  :business-id="currentBusinessId"
                  :time-type="currentTimeType"
                />
              </div>
              <div class="flex-1 hidden">
                <trend-year
                  :business-id="currentBusinessId"
                  :time-type="currentTimeType"
                />
              </div>
            </div>
          </template>
          <template v-if="currentTimeType === 'MONTH'">
            <trend-month
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'WEEK'">
            <trend-week
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
          <template v-if="currentTimeType === 'DAY'">
            <trend-day
              :business-id="currentBusinessId"
              :time-type="currentTimeType"
            />
          </template>
        </el-col>
        <el-col :lg="colLg" :xl="colXl" class="board-col">
          <top10
            :business-id="currentBusinessId"
            :time-type="currentTimeType"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PieProgress from '@/components/charts/pie-progress'
import { getBusinessList } from '@/api/backstage/department'
import {
  getTimesDimension,
  statisticsUnit,
} from '@/api/board-sale/statistics'
import {
  getSalesTrendByMonth,
  getSalesTrendByQuarter,
  getSalesTrendYear
} from '@/api/board-sale/trend'
import BusinessAchievementRate from './fragments/business-achievement-rate'
import TopCustomer from './fragments/top-customer'
import TopGoodsServiceType from './fragments/top-goods-service-type'
import TopGoodsCategory from './fragments/top-goods-category'
import TopGoods from './fragments/top-goods'
import TopBrand from './fragments/top-brand'
import ChannelBrandAchievementRate from './fragments/channel-brand-achievement-rate'
import TrendQuarter from './fragments/trend-quarter'
import TrendQuarterMonth from './fragments/trend-quarter-month'
import TrendMonth from './fragments/trend-month'
import TrendMonthWeek from './fragments/trend-month-week'
import TrendYear from './fragments/trend-year'
import TrendWeek from './fragments/trend-week'
import TrendWeekDay from './fragments/trend-week-day'
import TrendDay from './fragments/trend-day'
import SaleMap from './fragments/sale-map'
import Top10 from './fragments/top10'
import ChartResize from "@/mixins/chart-resize"
import { BUSINESS_ID } from '@/const/app'

export default {
  name: "DataBoardSale",

  components: { 
    PieProgress,
    BusinessAchievementRate,
    TopCustomer,
    TopGoodsServiceType,
    TopGoodsCategory,
    ChannelBrandAchievementRate,
    TopGoods,
    TopBrand,
    TrendYear,
    TrendQuarter,
    TrendQuarterMonth,
    TrendMonth,
    TrendMonthWeek,
    TrendWeek,
    TrendWeekDay,
    TrendDay,
    Top10,
    SaleMap
  },

  mixins: [ChartResize],

  data() {
    return {
      businessOptions: [], // 事业部下拉选项
      timeOptions: [], // 时间维度下拉选项
      currentBusinessId: '', // 当前事业部ID
      currentTimeType: '', // 当前时间维度
      statistics: {
        totalOrderNums: 0, // 订单数
        totalOrderPcs: 0, // 销售量（PCS）
        loopRatio: 0, // 销售额环比
        withRatio: 0, // 销售额同比
        totalAmount: 0, // 总额
        targetAmount: 0, // 目标
        achievementRate:  0, // 达成率
        businessAchievementRate: [], // 事业部销售目标达成率
      },
      loading: false
    }
  },

  computed: {
    saleVolumeTitle({ currentTimeType }) {
      const map = {
        YEAR: '年度',
        QUARTER: '当季度',
        MONTH: '当月',
        WEEK: '当周',
        DAY: '当日'
      }
      return map[currentTimeType] || ''
    },

    ratePrefixTitle({ currentTimeType }) {
      const map = {
        YEAR: '年度',
        QUARTER: '季度'
      }
      return `${map[currentTimeType] || '月度'}达成率`
    }
  },

  created() {
    // 初始化无需响应的数据，减少一些性能消耗
    this.colLg = 8 // 小屏
    this.colXl = 8 // 大屏
    this.BUSINESS_ID = BUSINESS_ID
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        // 获取事业部下拉选项
        const { result: businessList } = await getBusinessList(true)
        this.businessOptions = businessList || []
        if (this.businessOptions.length === 0) {
          this.$confirm('获取事业部选择列表为空', {
            showCancelButton: false,
            type: 'warning'
          })
          return
        }
        this.currentBusinessId = this.businessOptions[0].id // 默认第一个
        // 获取时间维度下拉选项
        const { result: timeOptions } = await getTimesDimension()
        this.timeOptions = timeOptions || []
        if (this.timeOptions.length === 0) {
          this.$confirm('获取时间维度选择列表为空', {
            showCancelButton: false,
            type: 'warning'
          })
          return
        }
        this.currentTimeType = this.timeOptions[0].value // 默认第一个
        this.fetchData()
      } catch (error) {
        console.error(error)
        this.$confirm('数据请求失败', {
          confirmButtonText: '重试',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.init()
        })
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },

    fetchData() {
      // 数据统计
      this.fetchStatisticsUnit()
    },

    fetchStatisticsUnit() {
      this.loading = true
      statisticsUnit(this.currentBusinessId, this.currentTimeType)
        .then(({ result }) => {
          this.statistics.totalOrderNums = result.totalOrderNums || 0
          this.statistics.totalOrderPcs = result.totalOrderPcs || 0
          this.statistics.loopRatio = result.loopRatio || 0
          this.statistics.withRatio = result.withRatio || 0
          this.statistics.totalAmount = result.totalAmount || 0
          this.statistics.targetAmount = result.targetAmount || 0
          this.statistics.achievementRate = Number(result.achievementRate || 0)
          const subBusinessStatisticsVoList = result.subBusinessStatisticsVoList || []
          this.statistics.businessAchievementRate = subBusinessStatisticsVoList.map(e => {
            return {
              name: e.divisionName,
              value1: e.targetAmount || 0,
              value2: e.totalAmount || 0,
              value3: e.achievementRate || 0
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    onChange() {
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/charts/variables.scss';
$colHeight: 18vw;
$minHeight: 300px;
.board-col {
  height: $colHeight;
  min-height: $minHeight;
  margin-top: 10px;
}

.board-page {
  background-color: #180f2a;
  min-height: calc(100vh - 80px);
  color: $axisLabelColor;
  min-width: 1680px;
  overflow-x: auto;
}
.data-box {
  background-color: $chartBoxBg;
}
.static-grid {
  background-color: $chartBoxBg;
  padding: 8px 10px;
  text-align: center;
  .label {
    padding-bottom: 6px;
    font-weight: 600;
    font-size: 16px;
  }
  .value {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }
}
.board-title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  padding-bottom: 6px;
}
.static-grid {
  /deep/ .el-select .el-input__inner {
    // background-color: $chartBoxBg;
    background-color: transparent;
    // border-color: $splitLineColor;
    color: #ffffff;
  }
}
/deep/ .vue-portal-target {
  height: 100%;
}
</style>
