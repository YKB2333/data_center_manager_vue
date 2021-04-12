<template>
  <!-- onkeyup="value=value.replace(/[^\d.]/g,'')" -->
  <el-input v-model="inputValue" @input="onInput">
  </el-input>
</template>

<script>
import Numbro from 'numbro'

export default {
  props: {
    value: {
      required: true
    }
  },

  data() {
    return {
      inputValue: ''
    }
  },

  watch: {
    value: {
      handler: function(val) {
        this.inputValue = this.inputValue.replace(/[^\d.]/g, '')
        this.inputValue = this.formatCurrency(val)
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    formatCurrency(n) {
      if (n === 0) return 0
      if (!n) return ''
      return Numbro(n).format({
        thousandSeparated: true
      })
    },

    onInput() {
      const realValue = Numbro.unformat(this.inputValue)
      this.$emit('input', realValue)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
