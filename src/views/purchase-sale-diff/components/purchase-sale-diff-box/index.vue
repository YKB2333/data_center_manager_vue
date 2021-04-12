<template>
  <div class="form-data-container">
    <el-form :model="form" label-width="100px">
      <el-form-item label="期初库存" prop="monthStockNum">
        <span>{{ form.monthStockNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="当日可用量" prop="dayStockNum">
        <span>{{ form.dayStockNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="MTD入库数量" prop="mtdInBoundNum">
        <span>{{ form.mtdInBoundNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="昨日入库数量" prop="inBoundNum">
        <span>{{ form.inBoundNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="MTD出库数量" prop="mtdOutBoundNum">
        <span>{{ form.mtdOutBoundNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="昨日出库数量" prop="outBoundNum">
        <span>{{ form.outBoundNum | formatThousand }}</span>
      </el-form-item>
      <el-form-item label="MTD采销差比" prop="mtdPurchaseSalesRatio">
        <span class="fw600 fs18 red">{{ form.mtdPurchaseSalesRatio | formatPercent }}</span>
      </el-form-item>
      <el-form-item label="昨日采销差比" prop="purchaseSalesRatio">
        <span>{{ form.purchaseSalesRatio | formatPercent }}</span>
      </el-form-item>
      <el-form-item label="结存日期" prop="balanceTime">
        <span>{{ form.balanceTime | formatDate("Y/M/D") }}</span>
      </el-form-item>
      <el-form-item label="当月动销" prop="fluidSales">
        <span>{{ form.fluidSales | formatPercent }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/charts/variables.scss';
.form-data-container {
  // width: 22%;
  background-color: $chartBoxBg;
  flex: 0 0 230px;
  padding: 10px;
}
</style>
