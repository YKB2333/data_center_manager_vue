<template>
  <div class="row h-full">
    <chart-pie 
      style="width: 60%;"
      title="商品服务类型销售额(元)"
      :data="list"
      :loading="loading"
      :error="error"
      :is-empty="isEmpty"
      @error="init()"
    />
    <!-- is-rose
    is-radius -->
    <div class="chart-container pt30 pb10 plr10 flex-1">
      <el-scrollbar class="h-full" wrap-class="hidden-x center-y-scrollbar">
        <div v-for="(item, index) in list" :key="index" class="row mt10">
          <span class="pr8">{{ index + 1 }}</span>
          <span class="flex-1 pr8">{{ item.name }}</span>
          <span>{{ item.value | formatThousand }}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { statisticsGoodsServiceTypeUnit } from '@/api/board-sale/statistics'
import ChartPie from '@/components/charts/pie'

export default {
  components: {
    ChartPie
  },

  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    timeType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      list: [],
      loading: false,
      error: false,
      isEmpty: false
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
        if (data.businessId && data.timeType) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    init() {
      this.loading = true
      this.error = false
      statisticsGoodsServiceTypeUnit(this.businessId, this.timeType)
        .then(({ result }) => {
          this.list = result.map(e => {
            return {
              name: e.goodsServiceTypeDesc,
              value: e.sumSalesAmount
            }
          })
          this.isEmpty = !this.list.length
        })
        .catch(() => {
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
/deep/ .center-y-scrollbar {
  display: flex;
  align-items: center;
  .el-scrollbar__view {
    width: 100%;
  }
}
</style>