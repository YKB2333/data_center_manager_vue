<template>
  <div
    v-loading="loading"
    element-loading-background="transparent"
    class="h-full w-full relative hidden"
  >
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
  name: 'ChartBar',

  props: {
    title: String,
    data: {
      type: Array,
      require: true,
      default: () => []
    },
    axis: {
      type: String,
      default: 'x'
    },
    isDataZoom: {
      type: Boolean,
      default: false
    },
    xAxisLabelRotate: {
      type: Boolean,
      default: false
    },
    yAxisName: {
      type: String
    },
    xAxisName: {
      type: String
    },
    unit: {
      type: String
    },
    isColor: {
      type: Boolean,
      default: false
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
    showValue: {
      type: Boolean,
      default: false
    },
    zoomToEnd: { // 初始化滚动到最右边
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
        let dataAxis = this.data.map((item) => item.name)
        let values = this.data.map((item) => item.value)
        if (this.axis === 'y') {
          dataAxis = dataAxis.reverse()
          values = values.reverse()
        }
        if (this.unit === '万') {
          values = values.map((v) => numbro(v).divide(10000)._value)
        }
        let gridTop = this.axis === 'x' ? 60 : 40
        if (this.yAxisName) {
          gridTop += 20
        }
        let gridRight = this.axis === 'x' ? 20 : 60
        if (this.xAxisName) {
          gridRight += 20
        }
        let yAxisName = this.yAxisName || ''
        if (this.yAxisName && this.unit) {
          yAxisName = `${this.yAxisName}(${this.unit})`
        }
        let xAxisName = this.xAxisName || ''
        if (this.xAxisName && this.unit) {
          xAxisName = `${this.xAxisName}(${this.unit})`
        }
        let zoomStart = 0
        let zoomEnd = 50
        if (this.zoomToEnd) {
          zoomStart = 50
          zoomEnd = 100
        }
        let option = {
          title: {
            text: this.title
          },
          grid: {
            top: gridTop,
            bottom: this.isDataZoom ? 30 : 20,
            right: gridRight,
            left: 20
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            // formatter: '{b}<br />{c}'
            formatter: (arr) => {
              let [{ value, name, marker }] = arr
              let v = value
              if (this.unit === '万') {
                v = numbro(value).multiply(10000)._value
              }
              return `${marker}${name}<br />${numbro(v).format({
                thousandSeparated: true
              })}`
            }
          },
          xAxis: {
            show: this.data.length > 0,
            name: xAxisName,
            axisLine: {
              show: true
            },
            axisLabel: {
              interval: 0,
              rotate: this.xAxisLabelRotate ? -30 : 0
            }
          },
          yAxis: {
            show: this.data.length > 0,
            name: yAxisName,
            axisLine: {
              show: true
            },
            axisLabel: {
              show: true,
              interval: 0,
              formatter: (value) => {
                if (this.axis === 'x') {
                  return value
                }
                const maxNum = 16
                if (value.length <= maxNum) {
                  return value
                } else {
                  return value.substring(0, maxNum) + '...'
                }
              }
            }
          },
          series: [
            {
              type: 'bar',
              barMaxWidth: 14, // 最大宽度
              itemStyle: {
                normal: {
                  color:  this.isColor 
                    ? ({ dataIndex }) => {
                        const list = ['#006ced', '#29AAE3','#64BD3D', '#E89589', '#EE9201', '#00cfff', '#f57700','#0AAF9F', '#afc900', '#F9E79F']
                        const colors = this.axis === 'y' ? list.reverse() : list
                        return colors[dataIndex] || '#F9E79F'
                      } 
                    : '#006ced'
                }
              },
              label: {
                show: this.showValue,
                position: this.axis === 'y' ? 'right' : 'top',
                color: '#fff',
                formatter: ({ value }) => {
                  if (this.unit === '万') {
                    const mantissa = value > 10000 ? 2 : 4
                    return numbro(value).format({
                      thousandSeparated: true,
                      mantissa: mantissa
                    })
                  }
                  return value
                }
              },
              data: values
            }
          ],
          dataZoom: this.isDataZoom
            ? [
                {
                  type: 'inside',
                  realtime: true,
                  start: zoomStart,
                  end: zoomEnd
                },
                {
                  show: true,
                  realtime: true,
                  height: 18, //这里可以设置dataZoom的尺寸
                  bottom: 6,
                  start: zoomStart,
                  end: zoomEnd
                }
              ]
            : null
        }
        if (this.axis === 'y') {
          option.yAxis.data = dataAxis
        } else {
          option.xAxis.data = dataAxis
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
