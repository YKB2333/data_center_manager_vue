export default {
  data() {
    return {
      tableMaxHeight: 300
    }
  },
  methods: {
    setTableMaxHeight({bottomOffset = 42, resetScroll = true} = {}) {
      // 分页42 + 页面外层容器padding-bottom: 10
      if (!this.$refs['table']) {
        console.error(`若需设置表格最大高度 el-table需添加ref="table" 同时 :max-height="tableMaxHeight"`)
        return
      }
      this.$nextTick(() => {
        // console.log('innerHeight', window.innerHeight)
        // console.log('top', this.$refs['table'].$el.getBoundingClientRect())
        const height = window.innerHeight - this.$refs['table'].$el.getBoundingClientRect().top - (10 + bottomOffset)
        this.tableMaxHeight = height
        // 重置滚动条到顶部
        if (resetScroll) {
          this.$refs['table'].bodyWrapper.scrollTop = 0
        }
        // this.$refs['table'].doLayout()
      })
    }
  }
}