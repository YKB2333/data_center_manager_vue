<template>
  <div v-loading="loading" element-loading-background="transparent" class="h-full relative">
    <div ref="dom" class="h-full"></div>
    <div class="slot-chart" v-show="isEmpty || error">
      <div v-show="isEmpty">暂无数据</div>
      <el-button v-show="error" type="primary" @click="onError">请求失败，点击重试</el-button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/utils/tools'
import Theme from '../theme.json'
import './res/china'
const geoJson = require('./res/data.json')

export default {
  name: 'ChartCityMap',

  props: {
    title: String,
    data: {
      type: Array,
      require: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      myChart: null
    }
  },

  watch: {
    data: {
      handler: function(val) {
        setTimeout(() => {
          this.init()
        }, 500)
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    on(window, 'resize', this.resize)
    this.$once('hook:beforeDestroy', () => {
      off(window, 'resize', this.resize)
      this.myChart = null
    })
  },

  methods: {
    resize() {
      this.myChart && this.myChart.resize()
    },

    init() {
      this.$nextTick(() => {
        if (!this.myChart) {
          this.myChart = echarts.init(this.$refs.dom, 'theme')
        }
        echarts.registerMap('chinacity', geoJson)
        const option = {
          title: {
            text: this.title
          },
          visualMap: {
            show: true,
            showLabel: true,
            left: 10,
            bottom: 0,
            calculable: false,
            min: 0,
            max: this.data.length > 0 ? Math.max.apply(null, this.data.map(e => e.value)) : 10,
            inRange: {
              color: ['#dcdcdc', '#1488CC', '#2B32B2']
            }
          },
          tooltip: {
            trigger: 'item',
            // formatter: '{b}<br/>{c}'
            formatter: ({name, value}) => {
              return `${name}<br />${value || 0}`
            }
          },
          label: {
          },
          series: [
            {
              type: 'map',
              map: 'chinacity',
              label: {
                normal: {
                  show: true
                }
              },
              roam: true, // 是否开启鼠标缩放和平移漫游
              layoutCenter: ['50%', '50%'],
              // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
              // layoutSize: 380,
              layoutSize: '100%',
              data: this.data,
              // data: [
              //   { name: '广州市', value: 5000 } // 市
              // ]
            }
          ]
        }
        this.myChart.setOption(option)
      })
    },

    onError() {
      this.$emit('error')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>