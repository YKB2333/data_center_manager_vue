<template>
  <div ref="dom" style="height: 600px;" class="w-full"></div>
</template>

<script>
import echarts from "echarts"
import { on, off } from "@/utils/tools"
import variables from '@/assets/styles/charts/variables.scss'

export default {
  props: {
    title: String,
    chartData: {
      type: Array,
      default: () => [],
    },
    // 警戒线最大值
    warningLineMax: Number,
    // 警戒线最小值
    warningLineMin: Number
  },
  data() {
    return {
      myCharts: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.myCharts = echarts.init(this.$refs.dom)
    })
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
      let v1 = `标准V1（${this.warningLineMax}%）`
      let v2 = `标准V2（${this.warningLineMin}%）`
      // console.log(this.chartData)
      let xAxisData = this.chartData.map(e => e.label) // x轴
      let inBoundNum = this.chartData.map(e => e.value1) // 入库
      let outBoundNum = this.chartData.map(e => e.value2) // 出库
      // console.log('chartData', this.chartData)
      let purchaseSalesRatio = this.chartData.map(e => {
        return Number.isNaN(Number(e.value3)) ? 0 : e.value3.toFixed(2)
      }) // 采销差比
      // console.log('purchaseSalesRatio', purchaseSalesRatio)

      let arrMinValue = Math.min.apply(null, purchaseSalesRatio)
      let arrMaxValue = Math.max.apply(null, purchaseSalesRatio)
      let yMinPer = arrMinValue > 0 ? 0 : arrMinValue
      if (arrMinValue > this.warningLineMin) {
        yMinPer = this.warningLineMin - 2
      }
      let yMaxPer = null
      if (this.warningLineMax >= arrMaxValue) {
        yMaxPer = this.warningLineMax + 2
      }
      let option = {
        backgroundColor: variables.chartBoxBg, // 背景色
        title: {
          text: this.title,
          textStyle: {
            color: variables.titleColor, // 坐标的字体颜色
          },
          left: "center",
          top: "20",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(0,27,251,0.03)",
            }
          },
          textStyle: {
            color: variables.titleColor
          },
          formatter:function(params) {
            var result = `${params[0].axisValue}</br>`;
            params.forEach(function(item) {
              // console.log(item);
              if(item.seriesName == '采销差异比'){
                result += `${item.marker} ${item.seriesName}: ${item.data}%</br>`;
              }else{
                result += `${item.marker} ${item.seriesName}: ${item.data}</br>`;
              }
            });
            return result;
          },
        },
        grid: {
          left: "2%",
          containLabel: true,
          bottom: "10%",
          top: "16%",
        },
        legend: {
          data: ["入库数量", "出库数量", "采销差异比", v1, v2],
          bottom: 10,
          orient: "horizontal",
          textStyle: {
            color: variables.titleColor
          }
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisLabel: {
              textStyle: {
                color: variables.axisLabelColor
              }
            },
            axisTick: {
              show: false,
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
            name: "数量",
            nameTextStyle: {
              color: variables.titleColor
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: variables.splitLineColor
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: variables.axisLabelColor
              }
            },
            axisTick: {
              show: false
            }
          },
          {
            name: "采销差比",
            nameTextStyle: {
              color: variables.titleColor
            },
            min: yMinPer,
            max: yMaxPer,
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: variables.axisLabelColor,
              },
              formatter: "{value}%",
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: variables.splitLineColor
              }
            },
          },
        ],
        series: [
          {
            name: "入库数量",
            type: "bar",
            yAxisIndex: 0,
            data: inBoundNum,
            barWidth: 40,
            label: {
              color: '#ffffff',
              show: false,
              // position: "top",
            },
            itemStyle: {
              normal: {
                color: "#458EF3",
              },
            },
          },
          {
            name: "出库数量",
            type: "bar",
            yAxisIndex: 0,
            barWidth: 40,
            barGap: "0%",
            data: outBoundNum,
            label: {
              color: '#ffffff',
              show: false,
              // position: "top",
            },
            itemStyle: {
              normal: {
                color: "rgba(250,180,101,0.8)",
              },
            },
          },
          {
            name: "采销差异比",
            type: "line",
            data: purchaseSalesRatio,
            yAxisIndex: 1,
            smooth: false,
            symbolSize: 10,
            lineStyle: {
              // color: "#2fca95",
              width: 6
            },
            itemStyle: {
              normal: {
                color: "#2fca95"
              }
            },
            label: {
              show: true,
              color: "#fff",
              formatter: "{c}%",
            }
          },
          {
            name: v1,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "red",
              },
            },
            markLine: {
              symbol: "none",
              data: [
                {
                  lineStyle: {
                    type: "dashed",
                    color: "red",
                    width: 3,
                  },
                  yAxis: this.warningLineMax,
                  label: {
                    formatter: "{c}%",
                  }
                }
              ]
            }
          },
          {
            name: v2,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "red",
              },
            },
            markLine: {
              symbol: "none",
              data: [
                {
                  lineStyle: {
                    type: "dashed",
                    color: 'red',
                    width: 3,
                  },
                  yAxis: this.warningLineMin,
                  label: {
                    formatter: "{c}%",
                  }
                }
              ]
            }
          }
        ],
        // visualMap: {
        //   seriesIndex: 2,
        //   show: false,
        //   pieces: [
        //     { gte: this.warningLineMin, lte: this.warningLineMax, color: '#2fca95' },
        //     { lte: this.warningLineMin, color: 'red' },
        //     { gte: this.warningLineMax, color: 'red' }
        //   ]
        // }
      };
      this.myCharts.setOption(option);
      this.myCharts.hideLoading()
      on(window, "resize", this.resize);
      this.myCharts.on("click", (data) => {
        // console.log('点击事件', data)
        if (data.componentSubType === "bar") {
          this.$emit("bar", data);
        }
      });
    },

    resize() {
      this.myCharts.resize();
    }
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
    this.myCharts = null;
  }
}
</script>

<style lang="scss" scoped></style>
