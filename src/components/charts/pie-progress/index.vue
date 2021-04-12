<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from "echarts"
import { on, off } from "@/utils/tools"

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      required: true
    }
  },

  data() {
    return {
      myChart: null
    }
  },

  watch: {
    wrapData: {
      handler: function(val) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    wrapData({ title, data }) {
      return {
        title, data
      }
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
          this.myChart = echarts.init(this.$refs.dom)
        }
        const value = this.data === null ? 0 : this.data > 100 ? 100 : this.data
        const dataText = this.data === null ? '-' : `${this.data}%`
        const option = {
          title: {
            text: `${this.title}\n${dataText}`,
            top: "center",
            left: "center",
            textStyle: {
              fontSize: 24,
              color: "#fff",
              fontWeight: 600
            }
          },
          color: ['#282c40'],
          series: [{
            type: 'pie',
            clockWise: true,
            radius: ['90%', '74%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            data: [
              {
                value: value,
                itemStyle: {
                  normal: {
                    color: { // 完成的圆环的颜色
                      colorStops: [{
                        offset: 0,
                        color: '#02d6fc' // 0% 处的颜色
                      }, {
                        offset: 1,
                        color: '#367bec' // 100% 处的颜色
                      }]
                    },
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    }
                  }
                }
              },
              {
                value: 100 - value
              }
            ]
          }]
        }
        this.myChart.setOption(option)
      })
    }
  }
}
</script>
