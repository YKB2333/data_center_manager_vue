<template>
    <el-button 
      type="primary" 
      :icon="icon ? 'el-icon-download' : ''" 
      @click="onExport"
      :loading="loading"
    >
      <slot />
      <el-dialog
        title="导出"
        :visible.sync="dialogVisible"
        width="400px"
        append-to-body
      >
        <el-radio v-model="radio" label="1">按当前查询条件导出</el-radio>
        <el-radio v-model="radio" label="2">导出全部</el-radio>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleExport">确 定</el-button>
        </span>
      </el-dialog>
    </el-button>
  
</template>

<script>
import FileSaver from 'file-saver'

export default {
  name: 'ExportFileButton',
  props: {
    // 导出接口api
    api: {
      type: Function,
      required: true
    },
    // 文件名称
    fileName: {
      type: String,
      required: true
    },
    // 是否有查询条件
    query: {
      type: Object,
      default: null
    },
    // 是否显示确认框，默认不显示，按全部导出
    showConfirm: {
      type: Boolean,
      default: false,
    },
    // 是否显示下载icon
    icon: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: "导出数据量较大，请耐心等候..."
    },
    // 是否全屏loading
    fullLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      radio: '1', // 1按当前筛选条件导出 2按全部导出
      loading: false
    }
  },
  methods: {
    onExport() {
      if (this.showConfirm) {
        this.dialogVisible = true
      } else {
        this.handleExport()
      }
    },

    async handleExport() {
      if (this.dialogVisible) {
        this.dialogVisible = false
      }
      let loading = null
      if (this.fullLoading) {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          text: this.loadingText
        })
      } else {
        this.loading = true
      }
      try {
        let result = null
        if (this.query !== null) {
          if (this.radio === '1') {
            result = await this.api(this.query)
          } else {
            result = await this.api()
          }
        } else {
          result = await this.api()
        }
        FileSaver.saveAs(result, this.fileName)
      } catch (error) {
        console.error(error)
      } finally {
        if (this.fullLoading) {
          loading.close()
        } else {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>