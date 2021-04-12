<template>
  <div>
    <el-page-header @back="$router.go(-1)">
      <div slot="content" class="row space-between center-y">
        <div class="row center-y">
          <span class="fs18 fw600 pr20">库存类型明细</span>
          <export-file-button
            :file-name="exportFileName"
            :api="exportStockTypeDetail"
            :query="exportQuery"
            v-permission-button="'export'"
          >导出</export-file-button>
        </div>
        <span>{{ currentDate | formatDate('Y-M-D') }}</span>
      </div>
    </el-page-header>
    <search-table v-model="query" :page-sizes="[50, 100, 150, 200]" class="mt10" @change="fetchTableData">
      <el-table
        :data="tableData"
        border
        ref="table"
        :max-height="tableMaxHeight"
        row-key="id"
        v-loading="tableLoading"
        class="table-center table-header-color">
        <el-table-column label="SKU编码" prop="ncCode" width="120"></el-table-column>
        <el-table-column label="69码" prop="codeBar" width="120"></el-table-column>
        <el-table-column label="货号" prop="itemNo" width="120"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName" min-width="160"></el-table-column>
        <el-table-column label="有效期" prop="guaranteeDate" width="120"></el-table-column>
        <el-table-column label="库存类型" prop="stockType" min-width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <span>{{ StockTypeText[scope.row.stockType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属仓库" prop="warehouseName" min-width="140" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="所属仓库编码" prop="warehouseCode" width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="库位" prop="skuLocation" width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="生产日期" prop="productionDate" width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <span>{{ scope.row.productionDate | formatDate('Y-M-D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" prop="warehousingDate" width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <span>{{ scope.row.warehousingDate | formatDate('Y-M-D') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存数" prop="stockQuantity" min-width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="可用数" prop="availableQuantity" min-width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="分配数" prop="assignQuantity" min-width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="冻结数" prop="freezeQuantity" min-width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="批次号" prop="batchNo" width="100" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="是否可分配" prop="ship" width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ship === 'Y'" type="success">可分配</el-tag>
            <el-tag v-else type="warning">不可可分配</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </search-table>
  </div>
</template>

<script>
import { getStockTypeDetail, exportStockTypeDetail } from '@/api/stock'
import SearchTable from '@/components/search-table'
import ExportFileButton from '@/components/export-file-button'
import TableHeight from '@/mixins/table-height' 
import { StockTypeText } from '@/const/stock'

export default {
  name: 'StockTypeDetail',

  components: {
    SearchTable,
    ExportFileButton
  },

  mixins: [TableHeight],

  data() {
    return {
      currentDate: new Date().getTime(),
      query: {
        pageIndex: 1,
        pageSize: 50,
        ncCode: null,
        stockType: null,
        total: 0
      },
      tableData: [],
      tableLoading: false
    }
  },

  computed: {
    exportQuery() {
      const params = this.handleQueryKey()
      params.pageIndex = undefined
      params.pageSize = undefined
      return params
    },

    exportFileName() {
      const curDate = this.$options.filters['formatDate'](new Date().getTime(), 'Y-M-D-h-m')
      return `库存类型明细${curDate}.xlsx`
    }
  },

  created() {
    const { ncCode } = this.$route.query
    const { stockType } = this.$route.query
    this.query.ncCode = ncCode
    this.query.stockType = stockType
    this.StockTypeText = StockTypeText
    this.fetchTableData()
  },

  methods: {
    exportStockTypeDetail,

    fetchTableData() {
      const params = this.handleQueryKey()
      this.tableLoading = true
      getStockTypeDetail(params)
        .then(({ result }) => {
          // console.log("库存列表", result)
          this.query.total = Number(result.total)
          this.tableData = result.list || []
          this.setTableMaxHeight()
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    handleQueryKey() {
      const params = _.cloneDeep(this.query)
      params.total = undefined
      return params
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
