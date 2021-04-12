<template>
  <!-- <div class="chart-container plr10 ptb10 h-full" v-loading="loading" element-loading-background="transparent">
    <p class="white fs18 fw600">客户销售TOP5</p>
    <div v-for="(item, index) in list" :key="item.customerCode" class="row mt16 fs16">
      <span class="pr8">{{ index + 1 }}</span>
      <span class="flex-1 pr8 text-center">{{ item.name }}</span>
      <span>{{ item.value | formatThousand }}</span>
    </div>
    <div v-show="isEmpty" class="text-center pt80">暂无数据</div>
    <div v-show="error" class="text-center pt80">
      <el-button type="primary" @click="init()">请求失败，点击重试</el-button>
    </div>
  </div> -->
  <bar-rank-horizontal
    title="客户销售TOP5(元)"
    :data="list"
    :loading="loading"
    :error="error"
    :is-empty="isEmpty"
    @error="init()"
  />
</template>

<script>
import { getCustomerSalesTop5 } from '@/api/board-sale/top'
import BarRankHorizontal from '@/components/charts/bar-rank-horizontal'

export default {
  components: {
    BarRankHorizontal
  },

  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    timeType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
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
    }
  },

  watch: {
    propsData: {
      handler: function(data) {
        if (data.businessId && data.timeType) {
          this.init()
        }
      },
      deep: true
    }
  },

  methods: {
    init() {
      this.error = false
      this.isEmpty = false
      this.loading = true
      getCustomerSalesTop5(this.businessId, this.timeType)
        .then(({ result }) => {
          // this.list = result || []
          this.list = result.map(e => {
            return {
              name: e.customerName,
              value: e.totalPrice
            }
          })
          this.isEmpty = !this.list.length
        })
        .catch(() => {
          this.error = true
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 300)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>