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
  name: 'BarRankHorizontal',

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
      myChart: null,
      color: ['#006ced', '#29AAE3','#64BD3D', '#E89589', '#EE9201', '#00cfff', '#B74AE5','#0AAF9F','#4A235A', '#C39BD3'],
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
            text: this.title
          },
          grid: {
            top: this.title ? 50 : 20,
            left: 10,
            right: 100,
            bottom: 0
          },
          xAxis: {
            type: 'value',
            show: false
          },
          yAxis: {
            show: true,
            inverse: true,
            type: 'category',
            axisLine: {
              show: false
            },
            data: this.data.map((item, i) => i + 1),
            axisLabel: {
              formatter: (value, index) => {
                return [
                  `{n${value <=5 ? value : 'n'}|${value}}`
                ].join("\n")
              },
              fontSize: 12,
              align: 'center',
              margin: 20,
              verticalAlign: 'top',
              rich: {
                n1: {
                  color: '#fff',
                  backgroundColor: this.color[0],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                },
                n2: {
                  color: '#fff',
                  backgroundColor: this.color[1],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                },
                n3: {
                  color: '#fff',
                  backgroundColor: this.color[2],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                },
                n4: {
                  color: '#fff',
                  backgroundColor: this.color[3],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                },
                n5: {
                  color: '#fff',
                  backgroundColor: this.color[4],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                },
                nn: {
                  color: '#fff',
                  backgroundColor: this.color[5] || this.color[4],
                  width: 20,
                  height: 20,
                  borderRadius: 100
                }
              }
            }
          },
          series: [{
            name: 'label',
            type: 'bar',
            barWidth: 20,
            barGap: 0,
            // barCategoryGap: '40%',
            label: {
              show: true,
              position: 2,
              color: '#fff'
            },
            data: this.data.map(item => {
              return {
                value: 0,
                label: {
                  formatter() {
                    return item.name
                  }
                }
              }
            })
          }, {
            name: 'value',
            type: 'bar',
            barWidth: 18,
            barMinHeight: 2, // 最小高度
            label: {
              show: true,
              position: 'right'
            },
            data: this.data.map((item, i) => {
              return {
                value: item.value,
                label: {
                  color: '#cbd2d8',
                  formatter: ({ value }) => {
                    return numbro(value).format({ thousandSeparated: true })
                  }
                },
                itemStyle: {
                  color: this.color[i]
                }
              }
            })
          }]
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
