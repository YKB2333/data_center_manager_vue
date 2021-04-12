<template>
  <div class="h-full col chart-container">
    <div class="row space-between plr6 pt8">
      <span class="white fw600 fs18">商品销售TOP5({{ goodsSalesTopType === 0 ? '元' : 'PCS' }})</span>
      <el-radio-group v-model="goodsSalesTopType" @change="init()">
        <el-radio :label="0">销售额</el-radio>
        <el-radio :label="1">销售量</el-radio>
      </el-radio-group>
    </div>
    <div class="flex-1">
      <bar-rank-horizontal
        :data="list"
        :loading="loading"
        :error="error"
        :is-empty="isEmpty"
        @error="init()"
      />
    </div>
  </div>
</template>

<script>
import { getGoodsSalesTop5 } from '@/api/board-sale/top'
import ChartBar from '@/components/charts/bar'
import BarRankHorizontal from '@/components/charts/bar-rank-horizontal'

export default {
  components: {
    ChartBar,
    BarRankHorizontal
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
      goodsSalesTopType: 0, // 0:销售额排序,1:销售量排序
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
      this.error = false
      this.isEmpty = false
      this.loading = true
      getGoodsSalesTop5(this.businessId, this.timeType, this.goodsSalesTopType)
        .then(({ result }) => {
          this.list = result.map(e => {
            return {
              name: e.goodsName,
              value: this.goodsSalesTopType === 0 ? e.totalPrice : e.totalNum
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
</style>