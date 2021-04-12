<template>
  <div>
    <el-table
      :data="tableData"
      border
      row-class-name="del-hover-row-color"
      class="table-center statict-table">
      <el-table-column label="阶段" prop="title"></el-table-column>
      <el-table-column label="入库数量" prop="inBoundNum">
        <template slot-scope="scope">
          <span>{{ scope.row.inBoundNum | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" prop="outBoundNum">
        <template slot-scope="scope">
          <span>{{ scope.row.outBoundNum | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库金额" prop="inBoundPrice">
        <template slot-scope="scope">
          <span v-if="scope.row.inBoundPrice == null" class="fs20">*</span>
          <span v-else>{{ scope.row.inBoundPrice | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库金额" prop="outBoundPrice">
        <template slot-scope="scope">
          <span v-if="scope.row.outBoundPrice == null" class="fs20">*</span>
          <span v-else>{{ scope.row.outBoundPrice | formatThousand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采销差比" prop="purchaseSalesRatio">
        <template slot-scope="scope">
          <span>{{ scope.row.purchaseSalesRatio | formatPercent }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// let tableItem = {
//   title: 'WTD',
//   inBoundNum: 0, // 入库数量
//   outBoundNum: 0, // 出库数量
//   inBoundPrice: 0, // 入库金额
//   outBoundPrice: 0, // 出库金额
//   purchaseSalesRatio: '', // 采销差比
// }
export default {
  props: {
    statictTableData: {
      type: Array,
      default: []
    }
  },
  computed: {
    tableData() {
      return _.cloneDeep(this.statictTableData)
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/charts/variables.scss';
.statict-table {
  background-color: $chartBoxBg !important;
  /deep/ tr, 
  /deep/ th {
    background-color: $chartBoxBg !important;
  }
  /deep/ tr td {
    color: #ffffff !important;
  }
  /deep/ th {
    color: $axisLabelColor !important;
  }
  &.el-table--border,
  /deep/ th.is-leaf,
  /deep/ td {
    border-color: $splitLineColor !important;
  }
  &.el-table::before,
  &.el-table::after {
    background-color: $splitLineColor !important;
  }
}
/deep/ .del-hover-row-color:hover > td {
  background-color: transparent !important;
}
</style>
