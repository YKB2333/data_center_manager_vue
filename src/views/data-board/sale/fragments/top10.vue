<template>
  <div class="h-full col chart-container">
    <div class="row space-between plr6 pt8">
      <span class="white fw600 fs18">{{ topType[currentTopTypeKey] }}销售TOP10</span>
      <el-radio-group v-model="currentTopTypeKey" @change="init()">
        <el-radio v-for="(value, key) in topType" :key="key" :label="key">{{ value }}</el-radio>
      </el-radio-group>
    </div>
    <div class="flex-1">
      <chart-bar
        class="h-full"
        :data="list"
        :loading="loading"
        :error="error"
        :is-empty="isEmpty"
        @error="init()"
        axis="y"
        unit="万"
        x-axis-name="销售额"
        is-color
        show-value
      />
    </div>
  </div>
</template>

<script>
import ChartBar from '@/components/charts/bar'
import { getGoodsBrandSalesTop10, getGoodsCategorySalesTop10 } from '@/api/board-sale/top'

export default {
  components: {
    ChartBar
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
      topType: {
        brand: '品牌',
        category: '品类'
      },
      currentTopTypeKey: 'brand',
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
      deep: true,
      immediate: true
    }
  },

  methods: {
    init() {
      this.error = false
      this.isEmpty = false
      this.loading = true
      const fetch = {
        'brand': getGoodsBrandSalesTop10,
        'category': getGoodsCategorySalesTop10
      }
      fetch[this.currentTopTypeKey](this.businessId, this.timeType)
        .then(({ result }) => {
          this.isEmpty = !result.length
          this.list = result.map(e => {
            if (this.currentTopTypeKey === 'brand') {
              return {
                name: e.brandName,
                value: e.totalPrice
              }
            } else if (this.currentTopTypeKey === 'category') {
              return {
                name: e.firstCategoryName,
                value: e.totalPrice
              }
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>