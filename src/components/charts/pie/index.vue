<template>
  <div v-loading="loading" element-loading-background="transparent" class="h-full relative hidden">
    <div ref="dom" class="h-full"></div>
    <div class="slot-chart" v-show="isEmpty || error">
      <div v-show="isEmpty">暂无数据</div>
      <el-button v-show="error" type="primary" @click="onError">请求失败，点击重试</el-button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import numbro from 'numbro'
import { on, off } from '@/utils/tools'
import Theme from '../theme.json'
echarts.registerTheme('theme', Theme)

export default {
  name: "ChartPie",

  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    title: String,
    isRadius: Boolean,
    isRose: Boolean,
    colors: {
      type: Array,
      default: () => {
        return ['#5567cc', '#37a2da', '#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3','#8378ea', '#00ffc3', '#8ea08a']
      }
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
    },
    unit: {
      type: String
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
        this.init()
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
        const option = {
          title: {
            text: [`{title|${this.title || ''}}`,`{subtitle|${this.unit ? `（单位：${this.unit}）` : ''}}`].join('')
          },
          tooltip: {
            trigger: "item",
            // formatter: "{b}<br/>{c}（{d}%）"
            formatter: ({ name, value, percent }) => {
              let fValue = numbro(value).format({ thousandSeparated: true })
              return `${name}<br/>${fValue}（${percent}%）`
            }
          },
          series: [
            {
              type: "pie",
              clockWise: false,
              radius: this.isRadius ? ["40%", "70%"] : "55%",
              roseType: this.isRose ? "area" : "",
              center: ["50%", "60%"],
              data: this.data,
              itemStyle: {
                normal: {
                  color: ({ dataIndex }) => {
                    return this.colors[dataIndex] || '#8ea08a'
                  }
                }
              },
              label: {
                color: "#cbd2d8",
                fontSize: 14,
                formatter: "{b}",
                position: "outer",
                alignTo: "edge",
                margin: 10
              }
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
