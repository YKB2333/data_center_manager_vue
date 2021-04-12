<template>
  <chart-bar
    class="h-full"
    title="品类销售TOP10"
    :data="list"
    :loading="loading"
    :error="error"
    :is-empty="isEmpty"
    @error="init()"
    axis="y"
    unit="万"
    x-axis-name="销售额"
    is-color
  />
</template>

<script>
import { getGoodsCategorySalesTop10 } from '@/api/board-sale/top'
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
      deep: true
    }
  },

  methods: {
    init() {
      this.loading = true
      this.error = false
      getGoodsCategorySalesTop10(this.businessId, this.timeType)
        .then(({ result }) => {
          this.list = result.map(e => {
            return {
              name: e.firstCategoryName,
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