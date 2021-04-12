<template>
  <div>
    <el-page-header @back="$router.go(-1)">
      <div class="row space-between" slot="content">
        <div class="row center-y">
          <span class="fs18 fw600 pr20">WMS库存明细</span>
          <export-file-button
            :file-name="exportFileName"
            :api="exportStockDetail"
            :query="exportQuery"
            v-permissionButton="'exportDetail'"
          >导出</export-file-button>
        </div>
        <span>{{ currentDate | formatDate('Y-M-D') }}</span>
      </div>
    </el-page-header>
    <div class="mt10">
      <el-table
        :data="tableData"
        border
        ref="table"
        :max-height="tableMaxHeight"
        v-loading="tableLoading"
        :span-method="spanMethod"
        class="table-center table-header-color">
        <el-table-column
          label="商品服务类型"
          prop="goodsServiceType"
          min-width="100"
          class-name="highlight-cell">
          <template>
            <span>{{ stockData.goodsServiceType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="品牌"
          prop="brand"
          min-width="100"
          class-name="highlight-cell">
          <template>
            <span>{{ stockData.brand }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="NC编码"
          prop="ncCode"
          min-width="120"
          class-name="highlight-cell">
          <template>
            <span>{{ stockData.ncCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品条码"
          prop="codeBar"
          min-width="120"
          class-name="highlight-cell">
          <template>
            <span>{{ stockData.codeBar }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="goodsName"
          min-width="200"
          class-name="highlight-cell">
          <template>
            <span>{{ stockData.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="库存类型"
          prop="stockType"
          min-width="100"
          class-name="highlight-cell">
          <template slot-scope="scope">
            <span>{{ StockTypeText[scope.row.stockType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属仓库" prop="warehouse" min-width="140" class-name="th-header-color-light">
        </el-table-column>
        <el-table-column label="库存数量" prop="warehouseTotal" min-width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <span>{{ (scope.row.warehouseTotal || 0) | formatThousand }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总计" prop="total" min-width="100" class-name="th-header-color-light">
          <template slot-scope="scope">
            <el-link @click="toStockTypeDetailPage(stockData.ncCode, scope.row.stockType)">{{ getTotal | formatThousand }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getStockDetail, exportStockDetail } from '@/api/stock'
import SearchTable from '@/components/search-table'
import { StockType, StockTypeText } from '@/const/stock'
import ExportFileButton from '@/components/export-file-button'
import TableHeight from '@/mixins/table-height'
import { hasPermissionPage } from '@/utils/permission'
import { STOCK_TYPE_DETAIL_PATH, STOCK_TYPE_DETAIL_NAME } from '@/const/router-path'

export default {
  name: 'StockDetail',

  components: {
    SearchTable,
    ExportFileButton
  },

  mixins: [TableHeight],

  data() {
    return {
      currentDate: new Date().getTime(),
      query: {
        ncCode: null,
        stockType: null
      },
      tableData: [],
      tableLoading: false,
      stockData: {
        brand: '',
        ncCode: '',
        codeBar: '',
        goodsName: '',
        goodsServiceType: ''
      }
    }
  },

  computed: {
    getTotal({ tableData }) {
      return tableData.reduce((total, cur) => total + cur.warehouseTotal, 0)
    },

    exportQuery({ query }) {
      return {
        ncCode: query.ncCode,
        stockType: query.stockType
      }
    },

    exportFileName() {
      const curDate = this.$options.filters['formatDate'](new Date().getTime(), 'Y-M-D-h-m')
      const file = `库存报表明细${curDate}.xlsx`
      return file
    }
  },

  created() {
    this.StockTypeText = StockTypeText
    if (this.$route.query.stockType && this.$route.query.ncCode) {
      const routeQuery = this.$route.query
      // console.log("routeQuery", routeQuery)
      this.query.stockType = StockType[routeQuery.stockType]
      this.query.ncCode = routeQuery.ncCode
      this.stockData.ncCode = routeQuery.ncCode
      this.stockData.brand = routeQuery.brand
      this.stockData.codeBar = routeQuery.codeBar
      this.stockData.goodsName = routeQuery.goodsName
      this.stockData.goodsServiceType = routeQuery.goodsServiceType
      this.fetchTableData()
    }
  },

  methods: {
    exportStockDetail,

    fetchTableData() {
      let params = _.cloneDeep(this.query)
      this.tableLoading = true
      getStockDetail(params)
        .then(({ result }) => {
          // console.log("库存明细", result)
          this.tableData = result || []
          this.setTableMaxHeight({ bottomOffset: 0 })
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    onSearch() {
      this.fetchTableData()
    },

    spanMethod({ row, column, rowIndex, columnIndex }) {
      const arr = ['brand', 'ncCode', 'codeBar', 'goodsName', 'goodsServiceType', 'stockType', 'total']
      if (arr.includes(column.property)) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    toStockTypeDetailPage(ncCode, stockType) {
      // 无路由页面权限
      if (!hasPermissionPage(STOCK_TYPE_DETAIL_NAME)) {
        this.$message.warning('无查看权限')
        return
      }
      this.$router.push({
        path: STOCK_TYPE_DETAIL_PATH,
        query: {
          ncCode,
          stockType
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
