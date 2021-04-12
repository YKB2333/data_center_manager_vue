<template>
  <!-- <el-input v-bind="$attrs" v-on="$listeners" onkeyup="value=value.replace(/[^\d.]/g,'')"> -->
  <el-input v-bind="$attrs" v-on="$listeners" onkeyup="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" @blur="onBlur">
  </el-input>
</template>

<script>
export default {
  methods: {
    onBlur(e) {
      // console.log('onBlur', e.target.value)
      this.$emit('input', e.target.value)
    }
  }
}
</script>

