<template>
  <div>
    <el-dialog 
      :title="title"
      :width="width"
      @open="onOpen" 
      @close="onClose"
      :visible.sync="dialogVisible"
    >
      <el-upload
        v-bind="$attrs" 
        v-on="$listeners"
        action="#"
        :httpRequest="httpRequest"
        :on-change="onChange"
        :on-remove="onRemove"
        :file-list="fileList"
        :multiple="false"
        ref="upload"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onConfirm" :loading="loading">确定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    // 控制弹窗显示
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '600px'
    },
    // 文件上传api
    uploadApi: {
      type: Function,
      required: true
    },
    // 上次成功后是否自动关闭弹窗
    closeAfterSuccess: {
      type: Boolean,
      deafult: true
    }
  },

  data() {
    return {
      dialogVisible: false,
      loading: false,
      fileList: []
    }
  },

  watch: {
    visible(value) {
      // console.log('visible', value)
      this.dialogVisible = value
    }
  },

  methods: {
    onOpen() {

    },

    onClose() {
      this.close()
    },

    httpRequest(data) {
      // console.log('httpRequest', data)
    },

    onChange(file, fileList) {
      // console.log('onChange', file, fileList)
      if (fileList.length > 1) {
        // 覆盖之前选择的文件
        fileList.splice(0, 1)
      }
      this.fileList = fileList
    },

    onRemove(file, fileList) {
      // console.log('onRemove', file, fileList)
      this.fileList = fileList
    },

    close() {
      this.$emit('update:visible', false)
      this.clearFiles()
    },

    clearFiles() {
      this.$refs.upload.clearFiles()
    },

    onConfirm() {
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件')
        return
      }
      let formData = new FormData()
      const [first] = this.fileList
      const file = first.raw
      formData.append('file', file)
      this.loading = true
      this.uploadApi(formData).then((res) => {
        this.$message.success(res.message)
        this.$emit('success', res)
        this.close()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>