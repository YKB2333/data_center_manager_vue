<template>
  <div class="row h-full chart-container">
    <map-china
      class="h-full"
      style="width: 70%;"
      title="当月线上销售额按区域分布"
      :data="list"
      :loading="loading"
      :error="error"
      :is-empty="isEmpty"
      :pieces="pieces"
      @error="init()"
    />
    <div class="chart-container pt30 pb10 plr10 flex-1">
      <el-scrollbar class="h-full" wrap-class="hidden-x">
        <div v-for="(item, index) in list" :key="item.name" class="row mt10">
          <span class="inline-block w30 text-center">{{ index + 1 }}</span>
          <span class="flex-1 pr8">{{ item.name }}</span>
          <span>{{ item.value | formatThousand }}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import MapChina from '@/components/charts/map/china'
import { getSalesPriceRegionalDistribution } from '@/api/board-sale/trend'

export default {
  components: {
    MapChina
  },

  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    timeType: {
      type: String
    }
  },

  data() {
    return {
      list: [],
      loading: false,
      error: false,
      isEmpty: false,
      pieces: [
        {
          min: 1000,
          label: ">1000",
        },
        {
          max: 1000,
          min: 200,
          label: "200-1000",
        },
        {
          max: 200,
          min: 0,
          label: "<200",
        },
        {
          value: 0,
          label: "无数据"
        }
      ]
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
        if (data.businessId) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    init() {
      this.error = false
      this.isEmpty = false
      this.loading = true
      getSalesPriceRegionalDistribution(this.businessId)
        .then(({ result }) => {
          // console.log('map', result)
          this.isEmpty = !result.length
          this.list = result.map(e => {
            return {
              name: e.province.replace(/省|自治区|壮族自治区|回族自治区|维吾尔自治区/g, ''),
              value: e.salesTotalPrice
            }
          })
        })
        .catch(e => {
          console.error(e)
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