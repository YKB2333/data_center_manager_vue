<template>
  <div>
    <div class="row space-between mb10">
      <div class="row center-y">
        <span class="fs18 fw600 pr20">WMS库存报表</span>
      </div>
      <span>{{ currentDate | formatDate('Y-M-D') }}</span>
    </div>
    <search-table v-model="query" :searchForm="searchForm" @change="onSearch" :page-sizes="[50, 100, 150, 200]" @collapse="onCollapse">
      <export-file-button
        slot="btn"
        class="ml10"
        :file-name="exportFileName"
        :api="exportStockList"
        :query="exportQuery"
        :show-confirm="true"
        v-permission-button="'export'"
      >导出</export-file-button>
      <el-table
        :data="tableData"
        border
        ref="table"
        :max-height="tableMaxHeight"
        row-key="id"
        v-loading="tableLoading"
        @cell-click="onCellClick"
        class="table-center table-header-color">
        <el-table-column
          label="商品服务类型"
          prop="goodsServiceType"
          min-width="100"
          class-name="highlight-cell"
        ></el-table-column>
        <el-table-column
          label="品牌"
          prop="brand"
          min-width="140"
          class-name="highlight-cell"
        ></el-table-column>
        <el-table-column
          label="NC编码"
          prop="ncCode"
          min-width="120"
          class-name="highlight-cell"
        ></el-table-column>
        <el-table-column
          label="商品条码"
          prop="codeBar"
          min-width="120"
          class-name="highlight-cell"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goodsName"
          min-width="240"
          class-name="highlight-cell"
        ></el-table-column>
        <el-table-column label="合计" prop="total" min-width="100" class-name="highlight-cell">
          <template slot-scope="scope">
            <el-link @click="toStockTypeDetailPage(scope.row.ncCode)">{{ scope.row.total | formatThousand }}</el-link>
          </template>
        </el-table-column>
        <el-table-column 
          label="库存数量" 
          align="center" 
          class-name="th-header-color-light">
          <el-table-column
            prop="leOneThirdTotal"
            min-width="100"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="leOneThirdTooltip">
                <span>1/3效期内<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.leOneThirdTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="leOneTwoTotal"
            min-width="100"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="leOneTwoTooltip">
                <span>1/3-1/2效期<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.leOneTwoTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="leTwoThirdTotal"
            min-width="100"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="leTwoThirdTooltip">
                <span>1/2-2/3效期<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.leTwoThirdTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="gtTwoThirdTotal"
            min-width="100"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="gtTwoThirdTooltip">
                <span>大于2/3效期<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.gtTwoThirdTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="noManufactureDateTotal"
            min-width="110"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="noManufactureDateTooltip">
                <span>生产日期不全<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.noManufactureDateTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="noExpiryDateTotal"
            min-width="220"
            class-name="pointer th-header-color-light">
            <template slot="header">
              <el-tooltip effect="dark" placement="top" :content="noExpiryDateTooltip">
                <span>效期不敏感（基础资料无保质期）<i class="el-icon-info"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-link>{{ scope.row.noExpiryDateTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="过保质期"
            prop="pastShelfLifeTotal"
            min-width="100"
            class-name="pointer th-header-color-light">
            <template slot-scope="scope">
              <el-link>{{ scope.row.pastShelfLifeTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="不良品（不良品仓）"
            prop="inferiorGoodsTotal"
            min-width="140"
            class-name="pointer th-header-color-light">
            <template slot-scope="scope">
              <el-link>{{ scope.row.inferiorGoodsTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="破损过期（待报废仓库存）"
            prop="damagedAndExpiredTotal"
            min-width="180"
            class-name="pointer th-header-color-light">
            <template slot-scope="scope">
              <el-link>{{ scope.row.damagedAndExpiredTotal | formatThousand }}</el-link>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </search-table>
  </div>
</template>

<script>
import { getStockList, exportStockList } from '@/api/stock'
import SearchTable from '@/components/search-table'
import ExportFileButton from '@/components/export-file-button'
import { GoodsServiceType } from '@/const/goods'
import { 
  STOCK_DETAIL_PATH,
  STOCK_DETAIL_NAME,
  STOCK_TYPE_DETAIL_PATH,
  STOCK_TYPE_DETAIL_NAME
} from '@/const/router-path'
import TableHeight from '@/mixins/table-height'
import { 
  leOneThirdTooltip,
  leOneTwoTooltip,
  leTwoThirdTooltip,
  gtTwoThirdTooltip,
  noExpiryDateTooltip,
  noManufactureDateTooltip
} from '@/const/stock-tooltip'
import { hasPermissionPage } from '@/utils/permission'

export default {
  name: 'StockList',

  components: {
    SearchTable,
    ExportFileButton,
  },

  mixins: [TableHeight],

  data() {
    return {
      currentDate: new Date().getTime(),
      query: {
        pageIndex: 1,
        pageSize: 50,
        brand: null, // 品牌名称
        ncCode: null, // nc编码
        codeBar: null, // 商品条码
        goodsName: null, // 商品名称
        goodsServiceType: null, // 服务类型
        total: 0
      },
      searchForm: [
        {
          key: 'brand',
          label: '品牌名称',
          type: 'input'
        },
        {
          key: 'ncCode',
          label: 'nc编码',
          type: 'input'
        },
        {
          key: 'codeBar',
          label: '商品条码',
          type: 'input'
        },
        {
          key: 'goodsName',
          label: '商品名称',
          type: 'input'
        },
        {
          key: 'goodsServiceType',
          label: '服务类型',
          type: 'select',
          options: GoodsServiceType.options
        }
      ],
      tableData: [],
      tableLoading: false
    }
  },

  computed: {
    exportQuery() {
      let params = this.handleQueryKey()
      delete params.pageIndex
      delete params.pageSize
      return params
    },

    exportFileName() {
      const curDate = this.$options.filters['formatDate'](new Date().getTime(), 'Y-M-D-h-m')
      return `库存报表${curDate}.xlsx`
    }
  },

  created() {
    this.initTooltip()
    this.fetchTableData()
  },

  activated() {
    if (this.nextRouteName === STOCK_DETAIL_NAME) {
      this.fetchTableData()
    }
  },

  methods: {
    exportStockList,

    initTooltip() {
      this.leOneThirdTooltip = leOneThirdTooltip
      this.leOneTwoTooltip = leOneTwoTooltip
      this.leTwoThirdTooltip = leTwoThirdTooltip
      this.gtTwoThirdTooltip = gtTwoThirdTooltip
      this.noManufactureDateTooltip = noManufactureDateTooltip
      this.noExpiryDateTooltip = noExpiryDateTooltip
    },

    fetchTableData() {
      const params = this.handleQueryKey()
      this.tableLoading = true
      getStockList(params)
        .then(({ result }) => {
          // console.log("库存列表", result)
          this.query.total = Number(result.total)
          this.tableData = result.records || []
          this.setTableMaxHeight()
          setTimeout(() => {
            this.$refs.table.doLayout()
          }, 2000)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    onSearch() {
      this.fetchTableData()
    },

    // 点击单元格事件
    onCellClick(row, column, cell, event) {
      // console.log(row, column, cell, event)
      // console.log(column.property)
      const propertyArr = ['brand', 'ncCode', 'codeBar', 'goodsName', 'goodsServiceType', 'total']
      if (propertyArr.includes(column.property)) return

      // 无路由页面权限
      if (!hasPermissionPage(STOCK_DETAIL_NAME)) {
        this.$message.warning('无查看权限')
        return
      }
      this.nextRouteName = STOCK_DETAIL_NAME
      this.$router.push({
        path: STOCK_DETAIL_PATH, 
        query: {
          stockType: column.property,
          brand: row.brand,
          ncCode: row.ncCode,
          codeBar: row.codeBar,
          goodsName: row.goodsName,
          goodsServiceType: row.goodsServiceType,
        }
      })
    },

    handleQueryKey() {
      let params = _.cloneDeep(this.query)
      delete params.total // 需删除无关请求参数
      // 空字符串时需为null
      if (!params.brand) params.brand = null
      if (!params.codeBar) params.codeBar = null
      if (!params.ncCode) params.ncCode = null
      if (!params.goodsName) params.goodsName = null
      if (!params.goodsServiceType) params.goodsServiceType = null
      return params
    },

    onCollapse() {
      this.setTableMaxHeight({ resetScroll: false })
    },

    toStockTypeDetailPage(ncCode) {
      // 无路由页面权限
      if (!hasPermissionPage(STOCK_TYPE_DETAIL_NAME)) {
        this.$message.warning('无查看权限')
        return
      }
      this.nextRouteName = null
      this.$router.push({
        path: STOCK_TYPE_DETAIL_PATH,
        query: {
          ncCode: ncCode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
