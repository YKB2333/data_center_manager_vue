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
import numbro from 'numbro'
import echarts from 'echarts'
import { on, off } from '@/utils/tools'
import Theme from '../theme.json'
echarts.registerTheme('theme', Theme)

export default {
  name: 'ChartBarLine',

  props: {
    title: String,
    data: {
      type: Array,
      require: true,
      default: () => []
    },
    legend: { 
      type: Array,
      require: true
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
    isDataZoom: {
      type: Boolean,
      default: false
    },
    linePostfix: {
      type: String,
      default: '%'
    },
    dataZoomCount: {
      type: Number,
      default: 4
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
        if (this.data.length === 0) {
          this.myChart.clear()
          return
        }
        const dataAxis = this.data.map(item => item.name)
        const value1 = this.data.map(item => item.value1)
        const value2 = this.data.map(item => item.value2)
        const value3 = this.data.map(item => item.value3)
        const option = {
          title: {
            text: this.title
          },
          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              let str = ''
              params.forEach((item, i) => {
                if (item.seriesType === 'line') {
                  str += `${item.marker}${item.seriesName}：${numbro(item.value).format({ thousandSeparated: true })}${this.linePostfix}`
                } else {
                  str += `${item.marker}${item.seriesName}：${numbro(item.value).format({ thousandSeparated: true })}`
                }
                if (i !== params.length - 1) {
                  str += '<br />'
                }
              })
              return str
            }
          },
          grid: {
            top: this.title ? 80 : 40,
            bottom: this.isDataZoom ? 30 : 10,
            right: '2%'
          },
          legend: {
            data: this.legend,
            top: this.title ? 40 : 10,
          },
          xAxis: [
            {
              type: "category",
              data: dataAxis,
              axisPointer: {
                type: "shadow"
              },
              axisLabel: {
                interval: 0
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              axisLine: {
                show: true
              },
              splitLine: {
                show: false
              }
            },
            {
              type: "value",
              axisLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: this.legend[0],
              type: "bar",
              data: value1,
              barMaxWidth: 40,
              barMinHeight: 2,
              itemStyle: {
                normal: {
                  color: "rgba(0,133,245,0.7)"
                }
              }
            },
            {
              name: this.legend[1],
              type: "bar",
              data: value2,
              barMaxWidth: 40,
              barMinHeight: 2,
              barGap: "0",
              itemStyle: {
                normal: {
                  color: "rgba(0,255,252,0.7)"
                }
              }
            },
            {
              name: this.legend[2],
              type: "line",
              yAxisIndex: 1,
              data: value3,
              itemStyle: {
                normal: {
                  color: "#ffaa00"
                }
              },
              label: {
                show: true,
                formatter: `{c}${this.linePostfix}`
              },
              smooth: true
            }
          ],
          dataZoom: this.isDataZoom 
            ? [{
                type: 'inside',
                realtime: true,
                startValue: 0,
                endValue: this.dataZoomCount - 1,
                // start: 0,
                // end: this.dataZoomEnd
              }, {
                show: true,
                realtime: true,
                height: 18, //这里可以设置dataZoom的尺寸
                bottom: 6
              }]
            : null
        }
        this.myChart.setOption(option)
        this.myChart.getZr().off('click')
        this.myChart.getZr().on('click', (params) => {
          // console.log('点击事件', params)
          const pointInPixel = [params.offsetX, params.offsetY]
          if (this.myChart.containPixel('grid', pointInPixel)) {
            // x轴索引
            const xIndex = this.myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
            // console.log('xIndex', xIndex, typeof xIndex)
            if (xIndex >= 0) {
              this.$emit('click', xIndex)
            }
          }
        })
      })
    },

    onError() {
      this.$emit('error')
    }
  },

  beforeDestroy() {
    off(window, 'resize', this.resize)
  }
}
</script>
