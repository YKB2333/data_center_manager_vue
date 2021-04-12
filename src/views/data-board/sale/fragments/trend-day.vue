<template>
  <div class="h-full custom-scrollbar" style="overflow-x: auto;">
    <div class="h-full" :style="{'width': width}">
      <chart-bar
        class="h-full"
        title="日度销售趋势"
        :data="list"
        :loading="loading"
        :error="error"
        :is-empty="isEmpty"
        @error="init()"
        unit="万"
        y-axis-name="销售额"
        is-data-zoom
        zoom-to-end
      />
    </div>
  </div>
</template>

<script>
import { getSalesTrendByDay } from '@/api/board-sale/trend'
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
      isEmpty: false,
      // width: '1400px'
      width: 'auto'
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
      getSalesTrendByDay(this.businessId)
        .then(({ result }) => {
          this.isEmpty = !result.length
          this.list = result.map(e => {
            return {
              name: `${e.month}/${e.day}`,
              value: e.salesTotalPrice
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