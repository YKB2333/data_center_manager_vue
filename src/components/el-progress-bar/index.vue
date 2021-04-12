<template>
  <el-progress 
    v-bind="$attrs"
    v-on="$listeners"
    :percentage="percentage"
    :format="format"
  ></el-progress>
</template>

<script>
export default {
  inheritAttrs: false,

  name: 'ElProgressBar',

  props: {
    data: {
      required: true,
      type: Number
    }
  },

  computed: {
    percentage({ data }) {
      return data > 100 ? 100 : data
    }
  },

  methods: {
    format(percentage) {
      return `${this.data}%`
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-progress-bar__innerText {
  color: #090909;
}
</style>