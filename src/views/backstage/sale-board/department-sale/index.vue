<template>
  <div>
    <div class="mb10">
      <export-file-button
        file-name="事业部与销售部门.xlsx"
        :api="exportExcel"
        :icon="false"
        :full-loading="false"
        v-permission-button="'export'"
      >导出</export-file-button>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      v-loading="loading"
      class="table-center"
    >
      <el-table-column prop="id" label="事业部ID" width="90"></el-table-column>
      <el-table-column prop="name" label="事业部名称"></el-table-column>
      <el-table-column label="部门名称">
        <template slot-scope="scope">
          <div v-for="item in scope.row.depts.slice(0, maxNumShow)" :key="item.id">
            <span>{{ item.bmname }}</span>
            <span v-if="item.zzname">（{{ item.zzname }}）</span>
          </div>
          <el-button v-if="scope.row.depts.length > maxNumShow" type="text" @click="viewAllDepts(scope.row)">查看全部</el-button>
        </template>
      </el-table-column>
    </el-table>
    <all-depts-view 
      title="全部部门"
      :visible.sync="visible"
      :data="currentRow"
    />
  </div>
</template>

<script>

import { 
  getBusinessAndOrganization,
  exportExcel
} from '@/api/backstage/department-sale'
import FileSaver from 'file-saver'
import ExportFileButton from "@/components/export-file-button"
import AllDeptsView from './all-depts'

export default {
  name: 'DepartmentSale',

  components: {
    ExportFileButton,
    AllDeptsView
  },

  data() {
    return {
      loading: false,
      tableData: [],
      maxNumShow: 4, // 最多显示4条
      currentRow: {},
      visible: false
    }
  },

  computed: {},

  created() {
    this.init()
  },

  methods: {
    init() {
      this.loading = true
      getBusinessAndOrganization().then(({ result }) => {
        this.tableData = result || []
      }).finally(() => {
        this.loading = false
      })
    },

    exportExcel,

    viewAllDepts(row) {
      this.currentRow = row
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>