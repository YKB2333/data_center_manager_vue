<template>
  <chart-bar-line
    :data="data"
    :title="`事业部销售目标${ratePrefixTitle}`"
    :legend="['目标', '销售额', '达成率']"
    is-data-zoom
  />
</template>

<script>
import ChartBarLine from '@/components/charts/bar-line'

export default {
  components: {
    ChartBarLine
  },

  props: {
    data: {
      type: Array,
      required: true
    },
    timeType: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    }
  },

  computed: {
    ratePrefixTitle({ timeType }) {
      const map = {
        YEAR: '年度',
        QUARTER: '季度'
      }
      return `${map[timeType] || '月度'}达成率`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>