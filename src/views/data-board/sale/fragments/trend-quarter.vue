<template>
  <!-- <chart-pie
    ref="chart"
    class="h-full w-full"
    title="季度销售趋势"
    :data="list"
    :loading="loading"
    :error="error"
    :is-empty="isEmpty"
    @error="init()"
  /> -->
  <chart-bar
    class="h-full"
    title="季度销售趋势"
    :data="list"
    :loading="loading"
    :error="error"
    :is-empty="isEmpty"
    @error="init()"
    unit="万"
    y-axis-name="销售额"
  />
</template>

<script>
import { getSalesTrendByQuarter } from '@/api/board-sale/trend'
import ChartPie from '@/components/charts/pie'
import ChartBar from '@/components/charts/bar'

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
      getSalesTrendByQuarter(this.businessId)
        .then(({ result }) => {
          this.list = result.map(e => {
            return {
              name: `${e.quarter}季度`,
              value: e.salesTotalPrice
            }
          })
          this.isEmpty = !this.list.length
          // this.$refs['chart'].resize()
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