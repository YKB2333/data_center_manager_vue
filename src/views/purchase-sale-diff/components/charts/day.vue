<template>
  <div ref="dom" style="height: 500px;" class="w-full"></div>
</template>

<script>
import echarts from "echarts"
import { on, off } from "@/utils/tools"
import variables from '@/assets/styles/charts/variables.scss'

export default {
  props: {
    title: String,
    // { label, value }
    chartData: Array,
    // 警戒线最大值
    warningLineMax: Number,
    // 警戒线最小值
    warningLineMin: Number,
    zeroLine: Number
  },
  data() {
    return {
      myCharts: null
    }
  },
  watch: {
    chartData: {
      handler: function(data) {
        if (data.length) {
          // console.log('watch', data)
          this.init()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.myCharts = echarts.init(this.$refs.dom)
    })
  },
  methods: {
    showLoading() {
      if (this.myCharts) {
        this.myCharts.showLoading({
          maskColor: 'transparent',
          text: '加载中',
          textColor: '#fff'
        })
      }
    },

    init() {
      // https://www.makeapie.com/editor.html?c=xvOXp4Eqn7
      // console.log('chartData===', this.chartData)
      const xAxisData = this.chartData.map(e => e.label)
      const seriesData = this.chartData.map(e => e.value)
      // console.log(xAxisData)
      // console.log(seriesData)
      let arrMinValue = Math.min.apply(null, this.seriesData)
      let yMinPer = arrMinValue > 0 ? 0 : arrMinValue
      if (arrMinValue > this.warningLineMin) {
        yMinPer = this.warningLineMin - 0.2
      }
      let option = {
        backgroundColor: variables.chartBoxBg, // 背景色
        title: {
          text: this.title,
          textStyle: {
            color: variables.titleColor, // 坐标的字体颜色
          },
          left: 'center',
          top: '20'
        },
        grid: {
          left: '2%',
          containLabel: true,
          top: "16%",
          bottom: '10px'
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b0} : {c0}"
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisLabel: {
              color: variables.axisLabelColor,
              margin: 20,
              interval: 0,
            },
            boundaryGap: true,
            axisLine: {
              onZero: false,
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: variables.splitLineColor
              }
            }
          }
        ],
        yAxis: [
          {
            // max : 2,
            // min : -2,
            // splitNumber : 4,
            min: yMinPer,
            splitLine: {
              show: true,
              lineStyle: {
                color: variables.splitLineColor
              }
            },
            axisLabel: {
              color: variables.axisLabelColor,
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: variables.splitLineColor
              }
            }
          },
        ],
        series: [
          {
            type: "bar",
            data: seriesData,
            barMaxWidth: 40, // 最大宽度
            markLine : {
              symbol: "none",
              silent: true,
              data : [{
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: "dashed",
                  color: "red",
                  width: 3,
                },
                label: {
                  position: 'end',
                  formatter: `警戒线${this.warningLineMax}`,
                  color: variables.warningLabelColor
                },
                yAxis: this.warningLineMax
              },
              {
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: "dashed",
                  color: "red",
                  width: 3,
                },
                label: {
                  position: 'end',
                  formatter: `警戒线${this.warningLineMin}`,
                  color: variables.warningLabelColor
                },
                yAxis: this.warningLineMin
              },
              {
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: "solid",
                  color: "rgb(125, 145, 207)",
                  width: 1,
                },
                label: {
                  position: 'zero',
                  formatter: '',
                },
                yAxis: this.zeroLine
              }]
            }
          },
          {
            type: "bar",
            barGap: "-100%",
            barMaxWidth: 40, // 最大宽度
            data: seriesData.map((val) => {
              return {
                value: val,
                label: {
                  show: true,
                  // position: val >= 0 ? 'top' : 'bottom',
                  position: 'top',
                  color: '#ffffff',
                  formatter: function(item) {
                    // console.log('label', item)
                    if (Number.isNaN(Number(item.value))) {
                      return item.value
                    }
                    return item.value.toFixed(2)
                  }
                },
                itemStyle: {
                  color: val >= this.warningLineMin && val <= this.warningLineMax ? "#67C23A" : "#F56C6C",
                }
              }
            })
          }
        ]
      }
      this.myCharts.setOption(option)
      this.myCharts.hideLoading()
      on(window, "resize", this.resize)
      this.myCharts.on('click', (data) => {
        // console.log('点击事件', data)
        if (data.componentSubType === 'bar') {
          this.$emit('bar', data)
        }
      })
    },

    resize() {
      this.myCharts.resize()
    }
  },
  beforeDestroy() {
    off(window, "resize", this.resize)
    this.myCharts = null
  }
}
</script>

<style lang="scss" scoped>
</style>