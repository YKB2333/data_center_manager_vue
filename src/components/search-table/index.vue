<template>
  <div class="table-component">
    <el-card class="form-card" v-if="searchForm.length">
      <div class="form-container" ref="box" v-if="searchForm.length" :class="{'show-arrow': arrowSwitch && showArrow, 'collapse': collapse}">
        <div class="form-wrapper">
          <el-form :model="query" ref="search" inline size="mini">
            <el-form-item v-for="(item, index) in searchForm" :key="index" :label="item.label" :prop="item.key">
              <!-- 输入框 -->
              <el-input 
                v-if="item.type === 'input'" v-model="query[item.key]" 
                :placeholder="item.placeholder || '请输入'" 
                @keyup.enter.native="enterInput" clearable>
              </el-input>
              <!-- 下拉单选 -->
              <el-select v-if="item.type === 'select'" v-model="query[item.key]" clearable @change="onSelect">
                <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
              <!-- 单选框 -->
              <el-radio-group v-if="item.type === 'radio'" v-model="query[item.key]">
                <el-radio v-for="option in item.options" :key="option.label" :label="option.label">{{ option.title }}</el-radio>
              </el-radio-group>
              <!-- 日期 -->
              <el-date-picker 
                v-if="item.type === 'date'" 
                v-model="query[item.key]" 
                type="date"
                :placeholder="item.placeholder"
                :value-format="item.valueFormat || 'timestamp'"
                :format="item.format || 'yyyy-MM-dd'">
              </el-date-picker>
              <!-- 日期范围 -->
              <el-date-picker 
                v-if="item.type === 'daterange'" 
                v-model="query[item.key]" 
                unlink-panels
                type="daterange"
                :value-format="item.valueFormat || 'timestamp'"
                :format="item.format || 'yyyy-MM-dd'"
                :start-placeholder="item.startPlaceholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-container">
          <div>
            <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
            <el-button type="danger" size="mini" @click="onReset">重置</el-button>
            <slot name="btn" />
          </div>
        </div>
      </div>
      <div v-if="arrowSwitch && showArrow" class="arrow-container">
        <i :class="collapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="onCollapse"></i>
      </div>
    </el-card>
    <div class="table-card">
      <slot name="before-table"></slot>
      <slot></slot>
    </div>
    <div class="pagination-bottom">
      <el-pagination 
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query[pageIndexKey]"
        :page-size="query[pageSizeKey]"
        :total="query.total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <slot name="pagination-right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchTable',
  props: {
    arrowSwitch:{
      type: Boolean,
      default: true
    },
    // 查询条件参数，key值要与searchForm的key对应
    value: {
      type: Object,
      required: true
    },
    // 查询表单配置项
    searchForm: {
      type: Array,
      default: () => []
    },
    // 页码key
    pageIndexKey: {
      type: String,
      default: 'pageIndex'
    },
    // 页数key
    pageSizeKey: {
      type: String,
      default: 'pageSize'
    },
    // 可选的页数
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    }
  },
  data() {
    return {
      query: this.value,
      temp: {},
      showArrow: false, // 是否显示折叠箭头
      collapse: true // 折叠状态
    }
  },
  mounted() {
    this.temp = JSON.parse(JSON.stringify(this.value))
    if (this.searchForm.length) {
      this.$nextTick(() => {
        // console.log(this.$refs['box'].offsetHeight)
        let h = this.$refs['box'].offsetHeight
        if (h > 47) {
          this.showArrow = true
        }
      })
    }
  },
  methods: {
    onReset() {
      this.query = JSON.parse(JSON.stringify(this.temp))
      this.$emit('reset')
      this.change()
    },

    onSearch() {
      this.query[this.pageIndexKey] = 1
      this.$emit('search')
      this.change()
    },

    handleSizeChange(val) {
      this.query[this.pageIndexKey] = 1
      this.query[this.pageSizeKey] = val
      this.change()
    },

    handleCurrentChange(val) {
      this.query[this.pageIndexKey] = val
      this.change()
    },

    enterInput(val) {
      this.change()
    },

    onSelect() {
      this.query.pageIndex = 1
      this.change()
    },

    change() {
      this.$emit('input', this.query)
      this.$emit('change', this.query)
    },
    
    onCollapse() {
      this.collapse = !this.collapse
      this.$emit('collapse')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-component{
  .form-container{
    display: flex;
    justify-content: space-between;
    .form-wrapper {
      flex: 1;
    }
    .btn-container{
      // min-width: 122px;
      display: flex;
      align-items: flex-end;
      padding-bottom: 10px;
      height: 100%;
    }
    &.show-arrow{
      max-height: 38px;
      overflow-y: hidden;
      &.collapse{
        max-height: none;
        overflow-y: auto !important;
        .btn-container {
          height: auto;
        }
      }
    }
    .el-form-item{
      margin-right: 20px;
      margin-bottom: 10px;
      .el-radio{
        margin-right: 10px;
      }
    }
  }
  .arrow-container{
    text-align: center;
    padding-bottom: 0;
    margin-top: -8px;
    i{
      cursor: pointer;
    }
  }
  .form-card{
    /deep/ .el-card__body{
      padding: 10px;
      padding-bottom: 0px;
    }
  }
  .table-card{
    margin-top: 10px;
  }
  .pagination-container{
    margin-top: 10px;
  }
  .pagination-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
}
// sb 需求 (对不住了，饿了么的设计师们，有些人眼睛不好，我必须加深一下颜色了)
/deep/ .el-pagination__sizes .el-select .el-input .el-select__caret {
  color: #030303;
}
</style>
