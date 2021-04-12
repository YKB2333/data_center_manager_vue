<template>
  <chart-bar
    class="h-full"
    title="当月每周销售趋势"
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
import { getSalesTrendByWeekOfMonth } from '@/api/board-sale/trend'
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
      getSalesTrendByWeekOfMonth(this.businessId)
        .then(({ result }) => {
          this.list = result.map(e => {
            return {
              name: `W${e.week}`,
              value: e.salesTotalPrice
            }
          })
          this.isEmpty = !this.list.length
        })
        .catch(e => {
          console.error(e)
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