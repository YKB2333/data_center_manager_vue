<template>
  <div class="plr16 col exception-container">
    <div class="fs18 fw800 mtb20">{{exceptionTital}}</div>
    <div class="flex-1 fs14 col space-between pb20">
      <div class="exception-content mb20" :style="{color: exceptionContent ? '' : '#DCDFE6'}">
        {{ exceptionContent || "暂无概述" }}
      </div>
      <el-input
        v-permissionButton="'saveExceptionDesc'"
        type="textarea"
        class="exception-input"
        placeholder="请输入内容"
        v-model.trim="content">
      </el-input>
      <el-button type="primary" v-permissionButton="'saveExceptionDesc'" class="exception-btn" @click="onSave" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    exceptionContent: {
      type: "",
      default: ""
    },
    exceptionTital: {
      type: "",
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: ""
    }
  },
  methods: {
    onSave() {
      this.$emit("save", this.content)
    },

    clear() {
      this.content = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/charts/variables.scss';
.exception-container {
  background-color: $chartBoxBg;
  width: 340px;
}
.exception-content{
  height: 70%;
  max-height: 60%;
  overflow: auto;
  white-space: pre-line;
}
.exception-btn{
  height: 8%;
}
.exception-input{
  height: 20%;
}
/deep/ .el-textarea__inner{
  height: 100%;
  resize: none;
  background-color: $chartBoxBg;
  color: #ffffff;
}
</style>
