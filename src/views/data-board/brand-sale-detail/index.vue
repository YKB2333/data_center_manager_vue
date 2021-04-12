<template>
  <div>
    <el-page-header @back="$router.go(-1)">
      <div class="row space-between" slot="content">
        <div class="row center-y">
          <span class="fs18 fw600 pr20">重点品牌销售明细</span>
        </div>
      </div>
    </el-page-header>
    <el-table
      :data="tableData"
      border
      row-key="id"
      v-loading="tableLoading"
      class="table-center mt10">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="事业部" prop="businessName" min-width="100"></el-table-column>
      <el-table-column label="品牌" prop="brandName" min-width="100"></el-table-column>
      <el-table-column label="品牌ID" prop="brandId" min-width="100"></el-table-column>
      <el-table-column label="期间" prop="durationText" width="100"></el-table-column>
      <el-table-column label="目标" prop="targetAmount" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.targetAmount | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售额" prop="salesAmount" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.salesAmount | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="达成率" prop="achievementRate" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.achievementRate === null">-</span>
          <el-progress-bar v-else :data="scope.row.achievementRate" text-inside :stroke-width="16"></el-progress-bar>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBrandDetailsByDimension } from '@/api/board-sale/statistics'
import ElProgressBar from '@/components/el-progress-bar'
import numbro from 'numbro'

export default {
  name: 'DataBoardBrandSaleDetail',
  
  components: {
    ElProgressBar
  },

  data() {
    return {
      tableData: [],
      tableLoading: false
    }
  },

  created() {
    // console.log(this.$route.query)
    this.init()
  },

  methods: {
    init() {
      this.tableLoading = true
      getBrandDetailsByDimension({
        brandId: this.$route.query.brandId,
        businessId: this.$route.query.businessId,
        dimension: this.$route.query.dimension
      }).then(({ result }) => {
        const list  = result || []
        this.tableData = list.map(item => {
          return {
            ...item,
            achievementRate: item.achievementRate === '' ? null : numbro(item.achievementRate)._value,
            durationText: this.$route.query.durationText || '',
            brandName: this.$route.query.brandName || ''
          }
        })
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>