<template>
  <div>
    <el-page-header @back="$router.go(-1)">
      <div class="row space-between" slot="content">
        <div class="row center-y">
          <span class="fs18 fw600 pr20">每日采销异常明细报表</span>
          <export-file-button
            :file-name="exportFileName"
            :api="exportDetail"
            :query="query"
            v-permissionButton="'export'"
            >导出</export-file-button>
        </div>
        <span>{{ query.balanceTime | formatDate('Y-M-D') }}</span>
      </div>
    </el-page-header>
    <search-table v-model="query" @change="fetchPurchaseSaleDiffDetail" :page-sizes="[50, 100, 150, 200]">
      <el-table :data="tableData" border ref="table" :max-height="tableMaxHeight" class="table-center">
        <el-table-column 
          type="index" label="序号" width="60"
          :index="(query.pageIndex - 1) * query.pageSize + 1"
        ></el-table-column>
        <el-table-column
          prop="goodsServiceType"
          label="商品服务类型"
          width="120"
        ></el-table-column>
        <el-table-column prop="brand" label="品牌" width="200">
        </el-table-column>
        <el-table-column prop="codeBar" label="条码" width="140">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="inBoundNum" label="入库数量">
          <template slot-scope="scope">
            <span>{{ scope.row.inBoundNum | formatThousand }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outBoundNum" label="出库数量">
          <template slot-scope="scope">
            <span>{{ scope.row.outBoundNum | formatThousand }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="difference" label="差异">
        </el-table-column>
      </el-table>
      <span slot="pagination-right">采销差异比：{{ purchaseSalesRatio }}</span>
    </search-table>
  </div>
</template>

<script>
import {
  getPurchaseSaleDiffCompanyDetail,
  getPurchaseSaleDiffCompanyExport,
  getPurchaseSaleDiffBrandDetail,
  getPurchaseSaleDiffBrandExport,
  getPurchaseSaleDiffGoodsServiceTypeDetail,
  getPurchaseSaleDiffGoodsServiceTypeExport
} from '@/api/purchase-sale-diff'
import ExportFileButton from '@/components/export-file-button'
import SearchTable from '@/components/search-table'
import TableHeight from '@/mixins/table-height'

export default {
  name: 'PurchaseSaleDiffDetail',

  components: {
    ExportFileButton,
    SearchTable
  },

  mixins: [TableHeight],

  data() {
    return {
      currentDate: new Date().getTime(),
      tableData: [],
      query: {
        balanceTime: '',
        name: '',
        pageIndex: 1,
        pageSize: 50,
        total: 0
      },
      purchaseSalesRatio: 0, // 总差异
      routeQuery: {} // 路由参数
    }
  },

  computed: {
    exportFileName({ query, routeQuery }) {
      const curDate = this.$options.filters['formatDate'](query.balanceTime, 'Y-M-D')
      const nameMap = {
        PurchaseSaleDiffCompany: '全集团',
        PurchaseSaleDiffBrand: '品牌-',
        PurchaseSaleDiffGoodsServiceType: '服务类型-'
      }
      const name = nameMap[routeQuery.page] + `${query.name}`
      return `采销明细-${name}-${curDate}.xlsx`
    },

    exportDetail({ routeQuery }) {
      const exportMap = {
        PurchaseSaleDiffCompany: getPurchaseSaleDiffCompanyExport,
        PurchaseSaleDiffBrand: getPurchaseSaleDiffBrandExport,
        PurchaseSaleDiffGoodsServiceType: getPurchaseSaleDiffGoodsServiceTypeExport
      }
      return exportMap[routeQuery.page]
    }
  },
  created() {
    this.routeQuery = this.$route.query
    if (this.routeQuery.name) {
      this.query.name = this.routeQuery.name
    }
    this.query.balanceTime = new Date(this.routeQuery.date).getTime()
    this.fetchPurchaseSaleDiffDetail()
  },
  
  methods: {
    fetchPurchaseSaleDiffDetail() {
      this.tableData = []
      const request = this.changeFetchMethod()
      request(this.query).then(({ result }) => {
        // console.log(result)
        const { list, count } = result.page
        this.query.total = Number(count)
        this.tableData = list
        this.purchaseSalesRatio = result.purchaseSalesRatio || 0
        this.setTableMaxHeight()
      })
    },

    changeFetchMethod() {
      const exportMap = {
        'PurchaseSaleDiffCompany': getPurchaseSaleDiffCompanyDetail,
        'PurchaseSaleDiffBrand': getPurchaseSaleDiffBrandDetail,
        'PurchaseSaleDiffGoodsServiceType': getPurchaseSaleDiffGoodsServiceTypeDetail,
      }
      return exportMap[this.routeQuery.page]
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ thead th {
  background-color: #f0f9eb !important;
}
</style>
