<template>
  <div class="h-full col chart-container">
    <div class="row space-between plr6 pt8">
      <span class="white fw600 fs18">{{ ratePrefixTitle }}</span>
      <template v-if="chartType === 'all'">
        <el-radio-group v-model="radioType" @change="init()">
          <el-radio label="brand">品牌</el-radio>
          <el-radio label="channel">渠道</el-radio>
        </el-radio-group>
      </template>
    </div>
    <div class="flex-1">
      <chart-bar-line
        :data="list"
        :legend="['目标', '销售额', '达成率']"
        :loading="loading"
        :error="error"
        :is-empty="isEmpty"
        is-data-zoom
        @error="init()"
        @click="onChartClick"
      />
    </div>
  </div>
</template>

<script>
import { statisticsBrandUnit, statisticsChannelUnit } from '@/api/board-sale/statistics'
import ChartBarLine from '@/components/charts/bar-line'
import { hasPermissionPage } from '@/utils/permission'
import { 
  DATA_BOARD_BRAND_SALE_DETAIL_NAME,
  DATA_BOARD_BRAND_SALE_DETAIL_PATH
} from '@/const/router-path'
import { BUSINESS_ID } from '@/const/app'

export default {
  components: {
    ChartBarLine
  },

  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    timeType: {
      type: String,
      required: true
    },
    chartType: {
      type: String,
      default: 'all' // all brand channel
    }
  },

  data() {
    return {
      radioType: 'brand', // channel=>渠道 brand=>品牌
      list: [],
      loading: false,
      error: false,
      isEmpty: false
    }
  },

  computed: {
    propsData() {
      const { businessId, timeType } = this
      return {
        businessId,
        timeType
      }
    },

    ratePrefixTitle({ chartType, timeType }) {
      const titleMap = {
        brand: '品牌',
        channel: '渠道',
        all: '品牌/渠道目标'
      }
      const subtitleMap = {
        YEAR: '年度',
        QUARTER: '季度'
      }
      const title = `${titleMap[chartType]}`
      const subtitle = `${subtitleMap[timeType] || '月度'}达成率`
      return `重点${title}${subtitle}`
    }
  },

  watch: {
    propsData: {
      handler: function(data) {
        if (data.businessId && data.timeType) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    init() {
      if (this.chartType !== 'all') {
        this.radioType = this.chartType
      }
      const fetch = {
        'channel': statisticsChannelUnit,
        'brand': statisticsBrandUnit
      }
      this.loading = true
      this.error = false
      this.isEmpty = false
      fetch[this.radioType](this.businessId, this.timeType)
        .then(({ result }) => {
          this.isEmpty = !result.length
          this.list = result.map(e => {
            return {
              name: this.radioType === 'brand' ? e.brandName : e.channelName,
              value1: e.targetAmount || 0,
              value2: e.sumSalesAmount || 0,
              value3: e.finishRate || 0,
              brandId: e.brandId || null
            }
          })
        })
        .catch(() => {
          this.error = true
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 300)
        })
    },

    onChartClick(xIndex) {
      // 非集团
      if (this.businessId !== BUSINESS_ID) return

      // 无路由页面权限
      if (!hasPermissionPage(DATA_BOARD_BRAND_SALE_DETAIL_NAME)) {
        this.$message.warning('无查看权限')
        return
      }

      if (this.radioType === 'brand') {
        // console.log('xIndex', xIndex)
        const item = this.list[xIndex]
        // console.log('brand', item)
        let durationText = `${new Date().getMonth() + 1}月`
        if (this.timeType === 'YEAR') {
          durationText = `${new Date().getFullYear()}年`
        } else if (this.timeType === 'QUARTER') {
          durationText = this.$options.filters['formatCurrentQuarter'](new Date())
        }
        this.$router.push({
          path: DATA_BOARD_BRAND_SALE_DETAIL_PATH,
          query: {
            brandId: item.brandId,
            businessId: this.businessId,
            dimension: this.timeType,
            durationText,
            brandName: item.name
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>